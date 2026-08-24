import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Newspaper, Images, ClipboardList, Mail } from "lucide-react";
import api from "../../utils/api";

const stats = [
  { key: "events", label: "Total Events", icon: Calendar, color: "bg-blue-500", link: "/admin/events" },
  { key: "gallery", label: "Gallery Images", icon: Images, color: "bg-purple-500", link: "/admin/gallery" },
  { key: "admissions", label: "Admission Enquiries", icon: ClipboardList, color: "bg-amber-500", link: "/admin/enquiries" },
  { key: "contact", label: "Contact Enquiries", icon: Mail, color: "bg-rose-500", link: "/admin/enquiries" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [eventsRes, newsRes, galleryRes, admissionsRes, contactRes] = await Promise.all([
          api.get("/events"),
          api.get("/news"),
          api.get("/gallery"),
          api.get("/admissions"),
          api.get("/contact"),
        ]);
        setCounts({
          events: eventsRes.data.length ?? eventsRes.data.total ?? 0,
          news: newsRes.data.length ?? newsRes.data.total ?? 0,
          gallery: galleryRes.data.length ?? galleryRes.data.total ?? 0,
          admissions: admissionsRes.data.length ?? admissionsRes.data.total ?? 0,
          contact: contactRes.data.length ?? contactRes.data.total ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard counts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map((s) => (
            <div key={s.key} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-10 w-10 bg-slate-200 rounded-lg mb-4" />
              <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.key}
              to={s.link}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 group"
            >
              <div className={`${s.color} text-white p-3 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <p className="text-sm text-slate-500 mb-1">{s.label}</p>
              <p className="text-3xl font-bold text-slate-800">{counts[s.key] ?? 0}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
