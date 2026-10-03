import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, CheckCircle2, Download, Printer, ArrowLeft, Trash2 } from "lucide-react";
import api, { API_BASE_URL } from "../../utils/api";

// ── Excel download ──
async function downloadExcel() {
  try {
    const token = localStorage.getItem("token");
    const res   = await fetch(`${API_BASE_URL}/contact/export`, {
      method: "GET",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `Contact_Enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Excel export failed", err);
    alert("Failed to download Excel. Please try again.");
  }
}

// ── Print helper ──
function printContacts(data) {
  const rows = data
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#fafafa" : "#f0f4f8"}">
        <td>${new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
        <td>Contact Enquiry</td>
        <td>${item.name        || "-"}</td>
        <td>${item.phone       || "-"}</td>
        <td>${item.email       || "-"}</td>
        <td>${item.subject     || "-"}</td>
        <td>${item.message     || "-"}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Contact Enquiries – Mount Carmel School</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #222; padding: 20px; }
    h1  { font-size: 16px; color: #1e3a5f; margin-bottom: 4px; }
    p.sub { font-size: 10px; color: #666; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e3a5f; color: #fff; padding: 7px 8px; text-align: left; font-size: 10px; letter-spacing: .05em; }
    td { padding: 5px 8px; border-bottom: 1px solid #e0e0e0; vertical-align: top; word-break: break-word; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Mount Carmel School – Contact Enquiries</h1>
  <p class="sub">Exported on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} &nbsp;|&nbsp; Total records: ${data.length}</p>
  <table>
    <thead>
      <tr>
        <th>TIMESTAMP</th>
        <th>TYPE</th>
        <th>NAME</th>
        <th>PHONE</th>
        <th>EMAIL</th>
        <th>SUBJECT</th>
        <th>MESSAGE</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.print(); };
}

// ── Component ──
export default function AdminContacts() {
  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [exporting, setExporting]     = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact");
      setData(res.data ?? res);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadExcel = async () => {
    setExporting(true);
    await downloadExcel();
    setExporting(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm("Are you sure you want to permanently delete this enquiry? This action cannot be undone and it will be removed from the Excel export.")) {
      return;
    }
    
    try {
      await api.delete(`/contact/${selected._id}`);
      setData((prev) => prev.filter((item) => item._id !== selected._id));
      setSelectedIds((prev) => prev.filter((id) => id !== selected._id));
      setSelected(null);
    } catch (err) {
      console.error("Failed to delete enquiry", err);
      alert("Failed to delete enquiry. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected enquiries?`)) return;

    try {
      await api.delete('/contact', { data: { ids: selectedIds } });
      setData((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete enquiries", err);
      alert("Failed to delete enquiries. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/notifications" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Contact Enquiries</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-export-excel"
              onClick={handleDownloadExcel}
              disabled={exporting || loading || data.length === 0}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download size={15} />
              {exporting ? "Exporting…" : "Download Excel"}
            </button>

            <button
              id="btn-print-contacts"
              onClick={() => printContacts(data)}
              disabled={loading || data.length === 0}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer size={15} />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* ── Contact Records summary bar ── */}
      {!loading && (
        <div className="flex items-center gap-4 mb-4 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              checked={data.length > 0 && selectedIds.length === data.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(data.map(d => d._id));
                } else {
                  setSelectedIds([]);
                }
              }}
              disabled={data.length === 0}
            />
            <span className="text-sm font-semibold text-blue-800">Select All</span>
          </label>
          <span className="text-sm font-semibold text-blue-800 border-l border-blue-200 pl-4">
            Total Records: <span className="text-blue-600 text-base">{data.length}</span>
          </span>
          
          {selectedIds.length > 0 ? (
            <button
              onClick={handleBulkDelete}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold rounded transition cursor-pointer"
            >
              <Trash2 size={14} />
              Delete Selected ({selectedIds.length})
            </button>
          ) : (
            <span className="text-xs text-blue-600 ml-auto hidden sm:inline">
              Use "Download Excel" to export all records.
            </span>
          )}
        </div>
      )}

      {/* ── Records list ── */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      ) : data.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No enquiries found.</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item._id}
              className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
                checked={selectedIds.includes(item._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds([...selectedIds, item._id]);
                  } else {
                    setSelectedIds(selectedIds.filter(id => id !== item._id));
                  }
                }}
              />
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelected(item)}>
                <h3 className="font-semibold text-slate-800 truncate hover:text-primary transition-colors">
                  {item.name || "Untitled"}
                </h3>
                <p className="text-sm text-slate-500 truncate">
                  {item.email || item.phone || ""}
                </p>
              </div>
              <span
                onClick={() => setSelected(item)}
                className={`cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 capitalize ${
                  item.status === "replied"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.status === "replied" && <CheckCircle2 size={12} />}
                {item.status === "replied" ? "Replied" : "New"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Enquiry Details</h2>

            <div className="space-y-3 mb-6">
              {Object.entries(selected).map(([key, value]) => {
                if (["_id", "__v", "status"].includes(key)) return null;
                if (key === "createdAt" || key === "updatedAt") {
                  value = new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
                }
                if (typeof value === "boolean") value = value ? "Yes" : "No";
                return (
                  <div key={key}>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm text-slate-800">{value || "-"}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 flex gap-3">
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium rounded-lg transition cursor-pointer"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
              <a
                href={`/admin/notifications?tab=contact&id=${selected._id}`}
                className="inline-flex items-center justify-center flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition cursor-pointer"
              >
                Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
