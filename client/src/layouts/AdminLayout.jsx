import { useState } from 'react';
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Remember the requested page (e.g. /admin/enquiries/<id> from an email link)
    // so login can redirect straight back to it.
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: '??' },
    { label: 'Events', path: '/admin/events', icon: '??' },
    { label: 'News', path: '/admin/news', icon: '??' },
    { label: 'Gallery', path: '/admin/gallery', icon: '??' },
    { label: 'Enquiries', path: '/admin/enquiries', icon: '??' },
    { label: 'Notifications', path: '/admin/notifications', icon: <Bell size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-charcoal hover:text-primary">?</button>
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/images/branding/logo.webp" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-heading text-lg font-bold text-primary hidden sm:inline">Admin Panel</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-warm-gray hover:text-primary transition-colors">View Site</Link>
          <span className="text-sm text-charcoal hidden sm:inline">{user.username}</span>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">Logout</button>
        </div>
      </header>
      <div className="flex">
        <aside className={`bg-charcoal text-white w-64 min-h-[calc(100vh-53px)] p-4 fixed lg:sticky top-[53px] z-30 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 min-h-[calc(100vh-53px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
