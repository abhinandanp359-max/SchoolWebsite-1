const fs = require('fs');

const adminLayoutCode = `import { useState } from 'react';
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Bell, LayoutDashboard, CalendarDays, Images, MessageSquare, LogOut, Menu, X } from 'lucide-react';
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
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Events', path: '/admin/events', icon: <CalendarDays size={18} /> },
    { label: 'Gallery', path: '/admin/gallery', icon: <Images size={18} /> },
    { label: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={18} /> },
    { label: 'Notifications', path: '/admin/notifications', icon: <Bell size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-charcoal hover:text-primary">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/images/branding/logo.webp" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-heading text-lg font-bold text-primary hidden sm:inline">Admin Panel</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-warm-gray hover:text-primary transition-colors">View Site</Link>
          <span className="text-sm text-charcoal hidden sm:inline">{user.username}</span>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      <div className="flex">
        <aside className={\`bg-charcoal text-white w-64 min-h-[calc(100vh-53px)] p-4 fixed lg:sticky top-[53px] z-30 transition-transform \${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}\`}>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors \${location.pathname === item.path ? 'bg-primary text-white' : 'hover:bg-white/10'}\`}>
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
`;

const galleryCode = `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const categories = ['All', 'Campus', 'Students', 'Events', 'Sports', 'Cultural', 'Celebrations', 'Activities'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        setAllImages(res.data || []);
      } catch (err) {
        console.error('Failed to fetch gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? allImages 
    : allImages.filter((img) => img.category?.toLowerCase() === activeCategory.toLowerCase());

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <PageLayout>
      <section className="bg-ivory py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Our Gallery"
            title="School Life in Pictures"
            description="Explore our beautiful campus, exciting events, and the vibrant life of our students."
          />

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-8 md:mt-12 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-all \${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-charcoal hover:bg-primary/5 hover:text-primary border border-gray-100'
                }\`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-charcoal mb-2">No Images Found</h3>
              <p className="text-warm-gray">There are currently no images uploaded in this category.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {filteredImages.map((img, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    key={img._id || index}
                    className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 shadow-sm"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={img.image}
                      alt={img.title || 'Gallery image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <p className="text-white font-medium truncate">{img.title}</p>
                        <p className="text-white/80 text-xs capitalize">{img.category}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 transition-colors z-10"
            >
              <X size={32} />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white p-2 transition-colors z-10"
            >
              <ChevronLeft size={48} />
            </button>

            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[currentImage].image}
                alt={filteredImages[currentImage].title || 'Gallery image'}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              {filteredImages[currentImage].title && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                    {filteredImages[currentImage].title}
                  </span>
                </div>
              )}
            </motion.div>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white p-2 transition-colors z-10"
            >
              <ChevronRight size={48} />
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm">
              {currentImage + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Gallery;
`;

fs.writeFileSync('../client/src/layouts/AdminLayout.jsx', adminLayoutCode, 'utf8');
fs.writeFileSync('../client/src/pages/Gallery.jsx', galleryCode, 'utf8');
console.log('Update Complete');
