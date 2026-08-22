import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Heart, HandHeart, Award, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import schoolInfo from '../data/schoolInfo';
import principalData from '../data/principalMessage';
import values from '../data/values';
import api from '../utils/api';


const fallbackGallery = [
  { image: '/images/events/events04.webp', title: 'Annual Day Celebration', category: 'Events' },
  { image: '/images/events/dance01.webp', title: 'Dance Performance', category: 'Activities' },
  { image: '/images/yoga/yoga.webp', title: 'Yoga Session', category: 'Yoga' },
  { image: '/images/events/events07.webp', title: 'Prize Distribution', category: 'Events' },
  { image: '/images/independence/inde01.webp', title: 'Independence Day', category: 'Activities' }
];

const valueIcons = [Award, HandHeart, Heart, GraduationCap];

const milestones = [
  { year: '2004', title: 'Foundation', description: 'Established at Seemanagar with a vision for value-based education.' },
  { year: '2014', title: 'Decade of Growth', description: 'Ten years of nurturing students and building a strong community.' },
  { year: '2019', title: 'New Campus', description: 'Expanded and upgraded to the present campus at Seemanagar, 9th Mile, Krishnanagar.' },
  { year: 'Present', title: 'Continuing Legacy', description: 'Serving the community with faith, values, and academic excellence.' },
];

const Home = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState(fallbackGallery);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data && res.data.length >= 3) {
          const validImages = res.data.filter(img => img.image);
          if (validImages.length >= 3) {
            setGalleryImages(validImages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gallery for home carousel', error);
      }
    };
    fetchGallery();
  }, []);

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    const timer = setInterval(nextImage, 4000);
    return () => clearInterval(timer);
  }, [nextImage]);

  const handleCenterClick = () => {
    navigate('/gallery');
  };
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1a0f0f]">
        <div className="absolute inset-0 bg-[#1a0f0f]">
          {/* Background image (Mobile) - Uses exact image uploaded by user */}
          <img 
            src="/images/assembly/assembly.webp" 
            alt="School Assembly Background" 
            className="md:hidden w-full h-full object-cover object-[center_20%]" 
          />
          {/* Background image (Desktop) */}
          <img 
            src="/images/branding/hero-assembly-new.jpg" 
            alt="School Assembly Background" 
            className="hidden md:block w-full h-full object-cover object-center md:object-[center_20%]" 
          />
          {/* Semi-transparent warm red/burgundy overlay */}
          <div className="absolute inset-0 bg-[#5a1c1c]/25" />
          {/* Subtle dark/warm gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2a1313]/40 to-[#1a0f0f]/85" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 px-4 py-2 rounded-full bg-[#1a0f0f]/75 border border-secondary/50 backdrop-blur-md inline-block"
          >
            <span className="text-secondary text-xs sm:text-sm md:text-base font-medium whitespace-normal break-words">Est. 2004 · Christian Missionary School</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Mount Carmel <span className="text-secondary">School</span>
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-heading italic text-secondary text-xl md:text-2xl lg:text-3xl mb-6"
          >
            "Rooted in values, Reaching for Excellence"
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/90 text-sm md:text-base lg:text-lg mb-10 max-w-3xl mx-auto font-sans leading-relaxed"
          >
            A Christian missionary school dedicated to nurturing young minds with faith, values, academic excellence, and holistic development at our campus in Krishnanagar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button to="/about" variant="secondary" size="lg" icon>
              Explore Our School
            </Button>
            <Button to="/admissions" variant="outline-light" size="lg">
              Admissions
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Welcome"
            title="Welcome to Mount Carmel School"
            description="A Christian missionary school dedicated to nurturing young minds with values, knowledge, and compassion."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { title: 'Our Mission', text: 'To provide holistic education rooted in Christian values that empowers students to become compassionate, responsible, and excellent individuals.' },
              { title: 'Our Vision', text: 'To be a beacon of light in education, forming leaders who will transform society with integrity and service.' },
              { title: 'Our Promise', text: 'A nurturing environment where every child discovers their God-given potential and grows in confidence and character.' },
            ].map((item, i) => (
              <Card key={i} className="p-6 md:p-8 text-center">
                <h3 className="font-heading text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Principal Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-lg shrink-0"
            >
              <img src={principalData.image} alt={principalData.imageAlt} className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">From the Principal's Desk</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-2">{principalData.principalName}</h2>
              <p className="text-warm-gray text-sm mb-4">{principalData.designation}</p>
              <blockquote className="text-charcoal text-sm md:text-base leading-relaxed italic border-l-4 border-secondary pl-4 mb-6">
                "Rooted in values, Reaching for Excellence"
              </blockquote>
              <Button to="/about/principal-message" variant="outline" size="sm" icon>
                Read Full Message
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Our Values"
            title="What We Stand For"
            description="Our core values guide everything we do at Mount Carmel School."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
            {values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-xl p-6 md:p-8 text-center shadow-md"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary mb-2">{value.title}</h3>
                  <p className="text-warm-gray text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Timeline Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Our Journey"
            title="Milestones in Our History"
            description="From humble beginnings to a thriving institution of learning."
          />
          <div className="relative mt-12 max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary/20 -translate-x-1/2" />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-secondary border-4 border-white -translate-x-1/2 mt-1.5 z-10" />
                <div className="ml-10 md:ml-0 md:w-1/2">
                  <div className="bg-ivory/50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className="text-secondary" />
                      <span className="text-secondary font-semibold text-sm">{m.year}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-primary mb-1">{m.title}</h3>
                    <p className="text-warm-gray text-sm leading-relaxed">{m.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button to="/about/history" variant="outline" size="sm" icon>
              View Full History
            </Button>
          </div>
        </div>
      </section>

      {/* School Moments Section */}
      <section className="py-16 md:py-24 bg-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="School Moments"
            title="School Moments"
            description="Glimpses of life, learning, and celebration at Mount Carmel School."
          />
          
          <div className="relative mt-12 md:mt-16 mb-8">
            <div className="relative h-[250px] sm:h-[350px] md:h-[450px] w-full max-w-6xl mx-auto flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                {galleryImages.map((img, idx) => {
                  const total = galleryImages.length;
                  if (total === 0) return null;
                  
                  const isCenter = idx === currentIndex;
                  const isLeft = idx === (currentIndex - 1 + total) % total;
                  const isRight = idx === (currentIndex + 1) % total;

                  if (!isCenter && !isLeft && !isRight) return null;

                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                  const leftX = isMobile ? "-45%" : "-60%";
                  const rightX = isMobile ? "45%" : "60%";

                  const variants = {
                    enter: (dir) => ({
                      x: dir > 0 ? "100%" : "-100%",
                      scale: 0.85,
                      opacity: 0,
                      zIndex: 1
                    }),
                    center: {
                      x: "0%",
                      scale: 1.15,
                      opacity: 1,
                      zIndex: 10
                    },
                    left: {
                      x: leftX,
                      scale: 0.85,
                      opacity: 0.7,
                      zIndex: 5
                    },
                    right: {
                      x: rightX,
                      scale: 0.85,
                      opacity: 0.7,
                      zIndex: 5
                    },
                    exit: (dir) => ({
                      x: dir > 0 ? "-100%" : "100%",
                      scale: 0.85,
                      opacity: 0,
                      zIndex: 1
                    })
                  };

                  let animateState = "center";
                  if (isLeft) animateState = "left";
                  if (isRight) animateState = "right";

                  return (
                    <motion.div
                      key={img.image || idx}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate={animateState}
                      exit="exit"
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute w-[65%] sm:w-[55%] md:w-[45%] lg:w-[40%] h-[180px] sm:h-[250px] md:h-[350px] rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-white"
                      onClick={() => {
                        if (isLeft) prevImage();
                        else if (isRight) nextImage();
                        else handleCenterClick();
                      }}
                    >
                      <img src={img.image} alt={img.title || "School Moment"} className="w-full h-full object-cover" />
                      {!isCenter && <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-300" />}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8 md:mt-12 h-10"
            >
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary">
                {galleryImages[currentIndex]?.title || "Campus Life"}
              </h3>
            </motion.div>
          </div>

          <div className="text-center mt-6">
            <Button to="/gallery" variant="outline" size="md" icon>
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Begin Your Child's Journey
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
              Give your child the gift of value-based education at Mount Carmel School. Admissions are now open.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/admissions" variant="secondary" size="lg" icon>
                Apply Now
              </Button>
              <Button to="/contact" variant="outline-light" size="lg">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;


