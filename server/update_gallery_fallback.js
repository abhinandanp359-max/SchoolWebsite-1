const fs = require('fs');

const galleryCode = `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const initialImages = [
  { _id: 'static-1', image: '/images/campus/campus01.webp', title: 'School Campus', category: 'Campus' },
  { _id: 'static-2', image: '/images/campus/campus02.webp', title: 'Campus Building', category: 'Campus' },
  { _id: 'static-3', image: '/images/campus/campus03.webp', title: 'Campus Grounds', category: 'Campus' },
  { _id: 'static-4', image: '/images/events/events01.webp', title: 'School Event', category: 'Events' },
  { _id: 'static-5', image: '/images/events/events02.webp', title: 'Celebration', category: 'Events' },
  { _id: 'static-6', image: '/images/events/events03.webp', title: 'Cultural Program', category: 'Events' },
  { _id: 'static-7', image: '/images/events/events04.webp', title: 'Annual Day', category: 'Events' },
  { _id: 'static-8', image: '/images/events/events05.webp', title: 'Sports Day', category: 'Events' },
  { _id: 'static-9', image: '/images/events/events06.webp', title: 'Festival Celebration', category: 'Events' },
  { _id: 'static-10', image: '/images/events/events07.webp', title: 'Prize Distribution', category: 'Events' },
  { _id: 'static-11', image: '/images/events/events08.webp', title: 'School Function', category: 'Events' },
  { _id: 'static-12', image: '/images/yoga/yoga.webp', title: 'Yoga Session', category: 'Yoga' },
  { _id: 'static-13', image: '/images/yoga/yoga01.webp', title: 'Yoga Practice', category: 'Yoga' },
  { _id: 'static-14', image: '/images/yoga/yoga02.webp', title: 'Yoga Exercise', category: 'Yoga' },
  { _id: 'static-15', image: '/images/yoga/yoga03.webp', title: 'Yoga Day', category: 'Yoga' },
  { _id: 'static-16', image: '/images/yoga/yoga04.webp', title: 'Yoga Activity', category: 'Yoga' },
  { _id: 'static-17', image: '/images/yoga/yoga05.webp', title: 'Yoga Training', category: 'Yoga' },
  { _id: 'static-18', image: '/images/yoga/yoga06.webp', title: 'Meditation', category: 'Yoga' },
  { _id: 'static-19', image: '/images/yoga/yoga07.webp', title: 'Yoga Class', category: 'Yoga' },
  { _id: 'static-20', image: '/images/yoga/yoga08.webp', title: 'Mindfulness', category: 'Yoga' },
  { _id: 'static-21', image: '/images/yoga/yoga09.webp', title: 'Yoga Workshop', category: 'Yoga' },
  { _id: 'static-22', image: '/images/yoga/yoga10.webp', title: 'Student Yoga', category: 'Yoga' },
  { _id: 'static-23', image: '/images/yoga/yoga11.webp', title: 'Group Yoga', category: 'Yoga' },
  { _id: 'static-24', image: '/images/yoga/yoga12.webp', title: 'Yoga Camp', category: 'Yoga' },
  { _id: 'static-25', image: '/images/yoga/yoga13.webp', title: 'Wellness Program', category: 'Yoga' },
  { _id: 'static-26', image: '/images/independence/inde01.webp', title: 'Independence Day', category: 'Activities' },
  { _id: 'static-27', image: '/images/events/dance01.webp', title: 'Dance Performance', category: 'Activities' },
  { _id: 'static-28', image: '/images/students/students01.webp', title: 'Students', category: 'Activities' },
  { _id: 'static-29', image: '/images/students/students02.webp', title: 'Students Group', category: 'Activities' },
  { _id: 'static-30', image: '/images/events/events03.webp', title: 'Student Activity', category: 'Activities' },
];

const categories = ['All', 'Campus', 'Events', 'Yoga', 'Activities'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [allImages, setAllImages] = useState(initialImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        const dbImages = res.data || [];
        // Combine DB images (newer) with initial static images
        setAllImages([...dbImages, ...initialImages]);
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
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer \${
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
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 transition-colors z-10 cursor-pointer"
            >
              <X size={32} />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white p-2 transition-colors z-10 cursor-pointer"
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
              className="absolute right-4 md:right-8 text-white/50 hover:text-white p-2 transition-colors z-10 cursor-pointer"
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

fs.writeFileSync('../client/src/pages/Gallery.jsx', galleryCode, 'utf8');
console.log('Restored default images and kept dynamic fetching!');
