import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CircleAlert, Mail, Phone, GraduationCap, MessageSquareText } from "lucide-react";
import api from "../../utils/api";

/*
 * Enquiry type registry (mirrors server ENQUIRY_TYPES).
 * A future enquiry type only needs a new entry here — rendering is fully dynamic.
 */
const TYPE_CONFIG = {
  admission: {
    label: "Admission Enquiry",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    icon: GraduationCap,
    // Fields shown in the info grid, in order; empty fields are hidden automatically
    fields: [
      { key: "studentName", label: "Student Name" },
      { key: "parentName", label: "Parent Name" },
      { key: "className", label: "Class" },
      { key: "phone", label: "Phone", icon: Phone },
      { key: "email", label: "Email", icon: Mail },
    ],
  },
  contact: {
    label: "Contact Enquiry",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: MessageSquareText,
    fields: [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone", icon: Phone },
      { key: "email", label: "Email", icon: Mail },
      { key: "subject", label: "Subject" },
    ],
  },
};

const STATUS_STYLES = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  resolved: "bg-green-600 text-white",
};

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "—";

export default function AdminEnquiryDetail() {
  const { id } = useParams();
  const [payload, setPayload] = useState(null); // { type, typeKey, updateEndpoint, enquiry }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchEnquiry = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/enquiries/${id}/view`);
      setPayload(res.data);
    } catch (err) {
      setError(err.message || "Failed to load enquiry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeStatus = async (status) => {
    if (!payload?.updateEndpoint) return;
    setSavingStatus(true);
    try {
      await api.put(`${payload.updateEndpoint}/${id}`, { status });
      setPayload((prev) => ({ ...prev, enquiry: { ...prev.enquiry, status } }));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center gap-3 text-center">
          <CircleAlert size={28} className="text-red-500" />
          <h1 className="text-lg font-semibold text-slate-800">Could not open this enquiry</h1>
          <p className="text-sm text-warm-gray">{error}</p>
          <Link to="/admin/enquiries" className="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition">
            Back to Enquiries
          </Link>
        </div>
      </div>
    );
  }

  const { type, typeKey, updateEndpoint, enquiry } = payload;
  const cfg = TYPE_CONFIG[typeKey];
  const TypeIcon = cfg?.icon || MessageSquareText;
  const visibleFields = (cfg?.fields || [])
    .map((f) => ({ ...f, value: enquiry[f.key] }))
    .filter((f) => f.value !== undefined && f.value !== null && String(f.value).trim() !== "");
  const status = enquiry.status || "new";

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Link
          to="/admin/enquiries"
          className="inline-flex items-center gap-1.5 text-sm text-warm-gray hover:text-primary transition"
        >
          <ArrowLeft size={15} /> Back to Enquiries
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${cfg?.badgeClass || "bg-gray-100 text-gray-600 border-gray-200"}`}>
          <TypeIcon size={13} /> {cfg?.label || type}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${status === "replied" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
          {status === "replied" && <MessageSquareText size={12} />}
          {status === "replied" ? "Replied" : "New"}
        </span>
        <span className="ml-auto text-xs text-gray-400 font-mono truncate max-w-[180px]">#{enquiry._id}</span>
        <Link
          to={`/admin/notifications?tab=${typeKey}&id=${enquiry._id}`}
          className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition shadow-sm cursor-pointer"
        >
          <Mail size={14} /> Reply
        </Link>
      </div>

      {/* info card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-[#eee3cd] bg-ivory">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Enquiry Information</h2>
        </div>
        <div className="px-5 sm:px-6 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div className="py-4 border-b border-gray-100">
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary-dark mb-1">Type</p>
              <p className="text-sm font-semibold text-charcoal break-words">{cfg?.label || type}</p>
            </div>
            <div className="py-4 border-b border-gray-100">
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary-dark mb-1">Submitted At</p>
              <p className="text-sm font-semibold text-charcoal break-words">{formatDateTime(enquiry.createdAt)}</p>
            </div>
            {visibleFields.map((f) => (
              <div key={f.key} className="py-4 border-b border-gray-100 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary-dark mb-1">{f.label}</p>
                <p className="text-sm font-semibold text-charcoal break-words flex items-center gap-1.5">
                  {f.icon && <f.icon size={13} className="text-warm-gray shrink-0" />}
                  <span className="min-w-0 break-words">{f.value}</span>
                </p>
              </div>
            ))}
          </div>

          {enquiry.message && (
            <div className="py-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">Message</p>
              <div className="rounded-lg border border-[#eee3cd] border-l-4 border-l-secondary bg-[#fffdf7] px-4 py-3 text-sm leading-6 text-charcoal whitespace-pre-wrap break-words">
                {enquiry.message}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
