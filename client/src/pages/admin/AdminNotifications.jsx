import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Bell, Mail, Paperclip, Save, Send, FlaskConical, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../utils/api";
import EmailPreview from "./notifications/EmailPreview";

const TABS = [
  { key: "admission", label: "Admission Enquiry", type: "Admission Enquiry", endpoint: "/admissions" },
  { key: "contact", label: "Contact Enquiry", type: "Contact Enquiry", endpoint: "/contact" },
];

const STORAGE_KEY = "mcs_notification_template";

const displayName = (record) => record?.studentName || record?.parentName || record?.name || "Untitled";

const buildTokenValues = (record) => {
  if (!record) return {};
  const isAdmission =
    record.studentName !== undefined || record.parentName !== undefined || record.className !== undefined;
  if (isAdmission) {
    return {
      type: "Admission Enquiry",
      studentName: record.studentName || "",
      parentName: record.parentName || "",
      className: record.className || "",
      phone: record.phone || "",
      email: record.email || "",
      message: record.message || "",
      name: record.studentName || "",
    };
  }
  return {
    type: "Contact Enquiry",
    name: record.name || "",
    phone: record.phone || "",
    email: record.email || "",
    subject: record.subject || "",
    message: record.message || "",
  };
};

const defaultSubject = (tab, record) => {
  const label = tab === "admission" ? "Re: Admission Enquiry" : "Re: Contact Enquiry";
  return `${label} — Mount Carmel School`;
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminNotifications() {
  const [searchParams] = useSearchParams();
  
  /* data */
  const [tab, setTab] = useState(searchParams.get("tab") || "admission");
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(searchParams.get("id") || "");
  const [config, setConfig] = useState({ notifyEmail: "", fields: [] });

  /* composer fields */
  const defaultAdmissionMessage = `Dear {{name}},\n\nThank you for your interest in Mount Carmel School. We have received your admission enquiry.\n\nYou can download the admission form directly from our website. For further information, please feel free to contact us or visit the school campus.\n\nBest regards,\nMount Carmel School`;
  
  const defaultContactMessage = `Dear {{name}},\n\nThank you for contacting Mount Carmel School. We have received your message regarding "{{subject}}".\n\nOur team is reviewing your query and will get back to you shortly.\n\nBest regards,\nMount Carmel School`;

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectDirty, setSubjectDirty] = useState(false);
  const [message, setMessage] = useState(defaultAdmissionMessage);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(null);
  const [status, setStatus] = useState(null);

  /* preview */
  const [device, setDevice] = useState("desktop");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const lastFocused = useRef("message");
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  const activeTab = TABS.find((t) => t.key === tab);
  const selectedRecord = records.find((r) => r._id === selectedId) || records[0] || null;

  /* config + saved template */
  useEffect(() => {
    api
      .get("/notifications/config")
      .then((res) => {
        setConfig(res.data || { notifyEmail: "", fields: [] });
      })
      .catch(() => {});
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        if (saved.subject) {
          setSubject(saved.subject);
          setSubjectDirty(true);
        }
        if (saved.message) setMessage(saved.message);
      }
    } catch {
      /* ignore */
    }
  }, []);

  /* auto-fill the "to" field with the user's email */
  useEffect(() => {
    if (selectedRecord && selectedRecord.email) {
      setTo(selectedRecord.email);
    } else {
      setTo("");
    }
  }, [selectedRecord]);

  /* real enquiry records for the active tab */
  useEffect(() => {
    let cancelled = false;
    setRecordsLoading(true);
    api
      .get(activeTab.endpoint)
      .then((res) => {
        if (cancelled) return;
        setRecords(res.data || []);
        setSelectedId((prev) => {
          if (prev && (res.data || []).some((r) => r._id === prev)) return prev;
          return res.data?.[0]?._id || "";
        });
      })
      .catch(() => !cancelled && setRecords([]))
      .finally(() => !cancelled && setRecordsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  /* subject follows the selection until edited manually */
  useEffect(() => {
    if (!subjectDirty) setSubject(defaultSubject(tab, selectedRecord));
  }, [selectedRecord, tab, subjectDirty]);

  /* live preview — debounced render of the actual final email HTML */
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setPreviewLoading(true);
      api
        .post("/notifications/preview", {
          type: activeTab.type,
          enquiry: selectedRecord || {},
          subject,
          message,
        })
        .then((res) => !cancelled && setPreviewHtml(res.data?.html || ""))
        .catch(() => !cancelled && setPreviewHtml(""))
        .finally(() => !cancelled && setPreviewLoading(false));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedRecord?._id, tab, subject, message, JSON.stringify(selectedRecord)]); // eslint-disable-line react-hooks/exhaustive-deps

  const flash = (kind, text) => {
    setStatus({ kind, text });
    setTimeout(() => setStatus(null), 3500);
  };

  const insertToken = (token) => {
    const text = `{{${token}}}`;
    const isSubject = lastFocused.current === "subject";
    const el = isSubject ? subjectRef.current : messageRef.current;
    const value = isSubject ? subject : message;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? start;
    const next = value.slice(0, start) + text + value.slice(end);
    if (isSubject) {
      setSubject(next);
      setSubjectDirty(true);
    } else {
      setMessage(next);
    }
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const saveTemplate = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ to, subject, message }));
    flash("success", "Template saved on this device.");
  };

  const sendNotification = async () => {
    if (!to.trim()) return flash("error", "Enter a recipient email.");
    if (!subject.trim() && !message.trim()) return flash("error", "Add a subject or a message first.");
    setBusy("send");
    try {
      const attachments = await Promise.all(
        files.map(async (f) => ({ filename: f.name, contentType: f.type, content: await fileToBase64(f) }))
      );
      const res = await api.post("/notifications/send", {
        to: to.trim(),
        subject,
        message,
        tokenValues: buildTokenValues(selectedRecord),
        attachments,
        enquiryId: selectedRecord?._id,
        type: activeTab.type,
      });
      flash("success", res.message || "Notification sent.");
    } catch (err) {
      flash("error", err.message || "Failed to send notification.");
    } finally {
      setBusy(null);
    }
  };

  const sendTestEmail = async () => {
    setBusy("test");
    try {
      const res = await api.post("/notifications/test", {
        type: activeTab.type,
        enquiry: selectedRecord || {},
        to: to.trim() || undefined,
      });
      flash("success", res.message || "Test email sent.");
    } catch (err) {
      flash("error", err.message || "Failed to send test email.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Bell size={18} />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Notification Composer</h1>
          <p className="text-sm text-warm-gray">Compose and preview official enquiry notifications before sending.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* ============ COMPOSER ============ */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-4 flex items-center gap-2">
            <Mail size={14} /> Email Composer
          </h2>

          <div className="rounded-xl bg-ivory border border-[#eee3cd] p-4 mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary/70 mb-2">Enquiry Source</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setMessage(t.key === "admission" ? defaultAdmissionMessage : defaultContactMessage);
                    setSubjectDirty(false);
                  }}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                    tab === t.key
                      ? "bg-primary text-white"
                      : "bg-white text-warm-gray hover:text-primary border border-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={recordsLoading || records.length === 0}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-charcoal focus:outline-none focus:border-primary disabled:bg-gray-50"
            >
              {records.length === 0 && <option value="">No enquiries found</option>}
              {records.map((r) => (
                <option key={r._id} value={r._id}>
                  {displayName(r)} — {(r.email || r.phone || "").slice(0, 34)}
                  {r.createdAt ? ` · ${new Date(r.createdAt).toLocaleDateString("en-IN")}` : ""}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[11px] text-gray-400">
              Data comes live from the existing enquiries store — nothing is hard-coded.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-warm-gray">To</span>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-warm-gray">Subject</span>
              <input
                ref={subjectRef}
                type="text"
                value={subject}
                onFocus={() => (lastFocused.current = "subject")}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setSubjectDirty(true);
                }}
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal focus:outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-warm-gray">
                Message <span className="normal-case font-normal text-gray-400">(optional note)</span>
              </span>
              <textarea
                ref={messageRef}
                rows={5}
                value={message}
                onFocus={() => (lastFocused.current = "message")}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write an additional note… use Insert Field to personalise."
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-primary resize-y"
              />
            </label>




          </div>

          {status && (
            <div
              role="status"
              className={`mt-4 flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm ${
                status.kind === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}
            >
              {status.kind === "success" ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
              <span className="min-w-0">{status.text}</span>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
            
            <label className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm font-semibold text-warm-gray hover:border-primary hover:text-primary transition cursor-pointer">
                <Paperclip size={16} />
                {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Attach files"}
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
                />
              </span>
              {files.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-warm-gray">
                  {files.map((f, i) => (
                    <span key={i} className="truncate max-w-[120px] bg-gray-100 px-2 py-1 rounded">
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </label>

            <button
              onClick={sendNotification}
              disabled={busy !== null}
              className="ml-auto shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary-dark transition shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={16} /> {busy === "send" ? "Sending…" : "Send Notification"}
            </button>
          </div>
        </section>

        {/* ============ LIVE PREVIEW ============ */}
        <EmailPreview html={previewHtml} loading={previewLoading} device={device} onDeviceChange={setDevice} />
      </div>
    </div>
  );
}
