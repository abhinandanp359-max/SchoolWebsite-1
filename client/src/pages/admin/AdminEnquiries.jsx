import { useState, useEffect } from "react";
import { X, CheckCircle2, Download, Printer } from "lucide-react";
import api, { API_BASE_URL } from "../../utils/api";

const TABS = [
  { key: "admissions", label: "Admissions", endpoint: "/admissions" },
  { key: "contact",    label: "Contact",    endpoint: "/contact"    },
];

// ── Excel download — uses native fetch so blob is not mangled by axios interceptors ──
async function downloadExcel() {
  try {
    const token = localStorage.getItem("token");
    const res   = await fetch(`${API_BASE_URL}/admissions/export`, {
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
    a.download = `Admission_Enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Excel export failed", err);
    alert("Failed to download Excel. Please try again.");
  }
}

// ── Print helper ────────────────────────────────────────────────────────────
function printAdmissions(data) {
  const rows = data
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#fafafa" : "#f0f4f8"}">
        <td>${new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
        <td>Admission Enquiry</td>
        <td>${item.studentName || "-"}</td>
        <td>${item.parentName  || "-"}</td>
        <td>${item.className   || "-"}</td>
        <td>${item.phone       || "-"}</td>
        <td>${item.email       || "-"}</td>
        <td>${item.message     || "-"}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Admission Enquiries – Mount Carmel School</title>
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
  <h1>Mount Carmel School – Admission Enquiries</h1>
  <p class="sub">Exported on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} &nbsp;|&nbsp; Total records: ${data.length}</p>
  <table>
    <thead>
      <tr>
        <th>TIMESTAMP</th>
        <th>TYPE</th>
        <th>STUDENT NAME</th>
        <th>PARENT NAME</th>
        <th>CLASS</th>
        <th>PHONE</th>
        <th>EMAIL</th>
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

// ── Component ────────────────────────────────────────────────────────────────
export default function AdminEnquiries() {
  const [activeTab, setActiveTab] = useState("admissions");
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tab = TABS.find((t) => t.key === activeTab);
      const res = await api.get(tab.endpoint);
      setData(res.data ?? res);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDownloadExcel = async () => {
    setExporting(true);
    await downloadExcel();
    setExporting(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Enquiries</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export & Print buttons — only shown in Admissions tab */}
          {activeTab === "admissions" && (
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
                id="btn-print-admissions"
                onClick={() => printAdmissions(data)}
                disabled={loading || data.length === 0}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Printer size={15} />
                Print
              </button>
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-100">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Admission Records summary bar ── */}
      {activeTab === "admissions" && !loading && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm font-semibold text-amber-800">
            Total Admission Records:&nbsp;
            <span className="text-amber-600 text-base">{data.length}</span>
          </span>
          <span className="text-xs text-amber-600 ml-auto">
            Use "Download Excel" to export all records to a spreadsheet.
          </span>
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
            <button
              key={item._id}
              onClick={() => setSelected(item)}
              className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-left cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">
                  {item.name || item.studentName || "Untitled"}
                </h3>
                <p className="text-sm text-slate-500 truncate">
                  {item.email || item.phone || ""}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 capitalize ${
                  item.status === "replied"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.status === "replied" && <CheckCircle2 size={12} />}
                {item.status === "replied" ? "Replied" : "New"}
              </span>
            </button>
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

            <h2 className="text-lg font-semibold text-slate-800 mb-4">Enquiry Details</h2>

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

            <div className="border-t pt-4">
              <a
                href={`/admin/notifications?tab=${
                  activeTab === "admissions" ? "admission" : "contact"
                }&id=${selected._id}`}
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition cursor-pointer"
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
