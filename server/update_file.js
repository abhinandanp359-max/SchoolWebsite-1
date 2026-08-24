const fs = require('fs');

const code = `import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import api from "../../utils/api";

const TABS = [
  { key: "admissions", label: "Admissions", endpoint: "/admissions" },
  { key: "contact", label: "Contact", endpoint: "/contact" },
];

export default function AdminEnquiries() {
  const [activeTab, setActiveTab] = useState("admissions");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tab = TABS.find((t) => t.key === activeTab);
      const res = await api.get(tab.endpoint);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Enquiries</h1>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={\`px-4 py-1.5 text-sm font-medium rounded-md transition cursor-pointer \${
                activeTab === tab.key ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:text-slate-700"
              }\`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

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
                className={\`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 capitalize \${
                  item.status === "replied" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                }\`}
              >
                {item.status === "replied" && <CheckCircle2 size={12} />}
                {item.status === "replied" ? "Replied" : "New"}
              </span>
            </button>
          ))}
        </div>
      )}

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
                if (key === "_id" || key === "__v" || key === "createdAt" || key === "updatedAt" || key === "status") return null;
                if (typeof value === "boolean") {
                  value = value ? "Yes" : "No";
                }
                if (typeof value === "string" && key.includes("date")) {
                  value = new Date(value).toLocaleDateString("en-IN");
                }
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
                href={\`/admin/notifications?tab=\${activeTab === "admissions" ? "admission" : "contact"}&id=\${selected._id}\`}
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
`;

fs.writeFileSync('../client/src/pages/admin/AdminEnquiries.jsx', code, 'utf8');
console.log('Done!');
