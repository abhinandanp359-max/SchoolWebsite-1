import { useState, useEffect } from "react";
import { Plus, Trash2, PenLine, X, Upload, Loader2 } from "lucide-react";
import api from "../../utils/api";

const emptyForm = { title: "", date: "", coverImage: "", description: "" };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      setForm(prev => ({ ...prev, coverImage: res.url }));
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
        await api.put(`/events/${editingId}`, form);
      } else {
        await api.post("/events", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      console.error("Failed to save event", err);
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      date: event.date?.split("T")[0] || "",
      coverImage: event.coverImage || "",
      description: event.description || "",
    });
    setEditingId(event._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Events</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
        >
          <Plus size={18} /> Add Event
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
              {editingId ? "Edit Event" : "Add Event"}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
                <div className="flex items-center gap-4">
                  {form.coverImage && (
                    <img src={form.coverImage} alt="Preview" className="h-16 w-16 rounded-lg object-cover bg-slate-100" />
                  )}
                  <label className="flex-1">
                    <div className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-slate-50 transition cursor-pointer">
                      {uploading ? (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 size={18} className="animate-spin" /> Uploading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Upload size={18} /> {form.coverImage ? "Change Image" : "Choose Image"}
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
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
              <div className="h-16 w-16 bg-slate-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/5" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No events found.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {event.coverImage && (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="h-16 w-16 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{event.title}</h3>
                <p className="text-sm text-slate-500">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                >
                  <PenLine size={18} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
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
