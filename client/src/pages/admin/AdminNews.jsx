import { useState, useEffect } from "react";
import { Plus, Trash2, PenLine, Eye, EyeOff, X, Upload, Loader2 } from "lucide-react";
import api from "../../utils/api";

const emptyForm = {
  title: "",
  date: "",
  image: "",
  document: "",
  description: "",
  isPublished: false,
};

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await api.get("/news");
      setNews(res.data);
    } catch (err) {
      console.error("Failed to fetch news", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, image: res.url }));
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/news/${editingId}`, form);
      } else {
        await api.post("/news", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchNews();
    } catch (err) {
      console.error("Failed to save news", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      date: item.date?.split("T")[0] || "",
      image: item.image || "",
      document: item.document || "",
      description: item.description || "",
      isPublished: item.isPublished,
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      console.error("Failed to delete news", err);
    }
  };

  const togglePublish = async (item) => {
    try {
      await api.put(`/news/${item._id}`, { isPublished: !item.isPublished });
      fetchNews();
    } catch (err) {
      console.error("Failed to toggle publish", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">News</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
        >
          <Plus size={18} /> Add News
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {editingId ? "Edit News" : "Add News"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                <div className="flex items-center gap-4">
                  {form.image && (
                    <img src={form.image} alt="Preview" className="h-16 w-16 rounded-lg object-cover bg-slate-100" />
                  )}
                  <label className="flex-1">
                    <div className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-slate-50 transition cursor-pointer">
                      {uploading ? (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 size={18} className="animate-spin" /> Uploading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Upload size={18} /> {form.image ? "Change Image" : "Choose Image"}
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document URL</label>
                <input
                  name="document"
                  value={form.document}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/document.pdf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Published</span>
              </label>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/5" />
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No news found.</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{item.title}</h3>
                <p className="text-sm text-slate-500">
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                  item.isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {item.isPublished ? "Published" : "Draft"}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish(item)}
                  title={item.isPublished ? "Unpublish" : "Publish"}
                  className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                >
                  {item.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                >
                  <PenLine size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
