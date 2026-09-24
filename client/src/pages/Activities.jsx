import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, HandHeart, Palette, Music, Users, Leaf, Heart } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';

const activities = [
  { 
    icon: HandHeart, 
    title: 'Prayer & Worship', 
    image: '/images/activities/prayer.jpg',
    description: 'Daily prayers, weekly assemblies, and spiritual formation that nurture faith and community.' 
  },
  { 
    icon: Users, 
    title: 'Sports & Games', 
    image: '/images/activities/sports.jpg',
    description: 'Physical education, outdoor sports, and inter-school competitions promoting health and teamwork.' 
  },
  { 
    icon: Palette, 
    title: 'Arts & Crafts', 
    image: '/images/activities/arts.jpg',
    description: 'Creative expression through drawing, painting, and craft activities that develop imagination.' 
  },
  { 
    icon: Music, 
    title: 'Cultural Programs', 
    image: '/images/events/dance01.webp',
    description: 'Festivals, cultural days, and annual celebrations that showcase talent and heritage.' 
  },
  { 
    icon: Heart, 
    title: 'Community Service', 
    image: '/images/activities/community.jpg',
    description: 'Service projects and outreach programs that teach empathy and social responsibility.' 
  },
  { 
    icon: Leaf, 
    title: 'Environmental Awareness', 
    image: '/images/campus/campus02.webp',
    description: 'Tree planting, clean-up drives, and eco-clubs fostering care for creation.' 
  },
  { 
    icon: HandHeart, 
    title: 'Yoga & Wellness', 
    image: '/images/yoga/yoga.webp',
    description: 'Yoga sessions and wellness activities promoting physical and mental well-being.' 
  },
];

const yogaImages = [
  { src: '/images/yoga/yoga.webp', alt: 'Yoga Day Celebration 1' },
  { src: '/images/yoga/yoga01.webp', alt: 'Yoga Day Celebration 2' },
  { src: '/images/yoga/yoga02.webp', alt: 'Yoga Day Celebration 3' },
  { src: '/images/yoga/yoga03.webp', alt: 'Yoga Day Celebration 4' },
  { src: '/images/yoga/yoga04.webp', alt: 'Yoga Day Celebration 5' },
  { src: '/images/yoga/yoga05.webp', alt: 'Yoga Day Celebration 6' },
  { src: '/images/yoga/yoga06.webp', alt: 'Yoga Day Celebration 7' },
  { src: '/images/yoga/yoga07.webp', alt: 'Yoga Day Celebration 8' },
  { src: '/images/yoga/yoga08.webp', alt: 'Yoga Day Celebration 9' },
  { src: '/images/yoga/yoga09.webp', alt: 'Yoga Day Celebration 10' },
  { src: '/images/yoga/yoga10.webp', alt: 'Yoga Day Celebration 11' },
  { src: '/images/yoga/yoga11.webp', alt: 'Yoga Day Celebration 12' },
  { src: '/images/yoga/yoga12.webp', alt: 'Yoga Day Celebration 13' },
  { src: '/images/yoga/yoga13.webp', alt: 'Yoga Day Celebration 14' },
];

const Activities = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? yogaImages.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage((prev) => (prev === yogaImages.length - 1 ? 0 : prev + 1));

  return (
    <PageLayout title="Activities" description="Explore co-curricular activities at Mount Carmel School - sports, arts, yoga, cultural programs, and more.">
      {/* Full-width Scenic Activities Hero Section */}
      <section className="relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[440px] flex items-center bg-[#3D1418]">
        <div className="absolute inset-0">
          <img
            src="/images/hero/activities-hero.png"
            alt="Mount Carmel School Student Activities"
            className="w-full h-full object-cover object-[center_right] sm:object-center"
          />
          {/* Subtle mobile-friendly gradient for narrow screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A151C]/80 via-[#4A151C]/35 to-transparent sm:hidden pointer-events-none" />
        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-left"
          >
            <span className="text-[#FDF0D5] font-bold text-xs sm:text-sm tracking-[0.25em] uppercase block mb-2 [text-shadow:_0_2px_10px_rgba(0,0,0,0.6)]">
              CO-CURRICULAR &amp; CAMPUS LIFE
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight leading-[1.15] [text-shadow:_0_2px_14px_rgba(0,0,0,0.7)]">
              Student Activities
            </h1>
            <p className="text-white/95 text-sm sm:text-base md:text-lg font-sans max-w-lg leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
              Beyond academics — nurturing talents, building character, sportsmanship, and fostering lifelong joy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-ivory">
        <BotanicalAccent
          className="absolute -bottom-8 -left-8 w-44 sm:w-56 text-[#A26A38]/15 -rotate-12 pointer-events-none"
        />
        <BotanicalAccent
          flip
          className="absolute -bottom-8 -right-8 w-44 sm:w-56 text-[#A26A38]/15 rotate-12 pointer-events-none"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Co-Curricular"
            title="Our Activities"
            description="A wide range of activities that complement academic learning and develop the whole child."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
            {activities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <Card key={i} className="group flex flex-col h-full border border-amber-200/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Activity Photo Header */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-secondary flex items-center justify-center shadow-md backdrop-blur-xs border border-white/60">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-primary mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-warm-gray text-xs sm:text-sm leading-relaxed flex-1">
                      {activity.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Yoga Day Gallery */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Photo Gallery"
            title="Yoga Day Celebrations"
            description="Our students embracing wellness and mindfulness through yoga."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-12">
            {yogaImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg overflow-hidden cursor-pointer shadow-md"
                onClick={() => openLightbox(i)}
              >
                <img src={img.src} alt={img.alt} className="w-full h-40 md:h-48 object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2" aria-label="Close">
              <X size={28} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 md:left-6 text-white/80 hover:text-white z-10 p-2" aria-label="Previous">
              <ChevronLeft size={36} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 md:right-6 text-white/80 hover:text-white z-10 p-2" aria-label="Next">
              <ChevronRight size={36} />
            </button>
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={yogaImages[currentImage].src}
              alt={yogaImages[currentImage].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 text-white/60 text-sm">
              {currentImage + 1} / {yogaImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Activities;
