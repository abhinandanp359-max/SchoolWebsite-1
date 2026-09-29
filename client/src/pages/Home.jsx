import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GraduationCap, Heart, HandHeart, Award, Clock, ArrowRight, ChevronLeft, ChevronRight, Play, Leaf, Users, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NotificationBell from '../components/ui/NotificationBell';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import schoolInfo from '../data/schoolInfo';
import principalData from '../data/principalMessage';
import values from '../data/values';
import api from '../utils/api';

const valueIcons = [Award, HandHeart, Heart, GraduationCap];

const milestones = [
  { year: '2004', title: 'Foundation', description: 'Established at Seemanagar with a vision for value-based education.' },
  { year: '2014', title: 'Decade of Growth', description: 'Ten years of nurturing students and building a strong community.' },
  { year: '2019', title: 'New Campus', description: 'Expanded and upgraded to the present campus at Seemanagar, 9th Mile, Krishnanagar.' },
  { year: 'Present', title: 'Continuing Legacy', description: 'Serving the community with faith, values, and academic excellence.' },
];

const getRelativePosition = (index, current, length, isMobile) => {
  if (length === 0) return null;
  const diff = (index - current + length) % length;
  
  if (diff === 0) return 0;
  if (diff === 1) return 1;
  if (diff === length - 1) return -1;
  
  if (!isMobile) {
    if (length > 3 && diff === 2) return 2;
    if (length > 4 && diff === length - 2) return -2;
  }
  
  return null;
};

const getCarouselStyles = (position, isMobile) => {
  const baseRadius = isMobile ? 20 : 24;
  
  if (position === 0) {
    return { x: "0%", scale: 1, zIndex: 30, opacity: 1, borderRadius: `${baseRadius}px` };
  } else if (position === 1) {
    return { x: isMobile ? "60%" : "75%", scale: 0.8, zIndex: 20, opacity: 0.7, borderRadius: `${baseRadius / 0.8}px` };
  } else if (position === -1) {
    return { x: isMobile ? "-60%" : "-75%", scale: 0.8, zIndex: 20, opacity: 0.7, borderRadius: `${baseRadius / 0.8}px` };
  } else if (position === 2) {
    return { x: "140%", scale: 0.65, zIndex: 10, opacity: 0.3, borderRadius: `${baseRadius / 0.65}px` };
  } else if (position === -2) {
    return { x: "-140%", scale: 0.65, zIndex: 10, opacity: 0.3, borderRadius: `${baseRadius / 0.65}px` };
  }
  return { x: "0%", scale: 0.5, zIndex: 0, opacity: 0, borderRadius: `${baseRadius / 0.5}px` };
};

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Fallback images so the carousel is NEVER empty or stuck loading while API wakes up
  const FALLBACK_GALLERY_IMAGES = [
    { image: '/images/events/events01.webp', title: 'Cultural Event' },
    { image: '/images/events/events02.webp', title: 'School Assembly' },
    { image: '/images/events/events03.webp', title: 'Annual Function' },
    { image: '/images/events/events04.webp', title: 'Student Activities' },
    { image: '/images/events/events05.webp', title: 'Campus Life' }
  ];

  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const galleryScrollRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bgRef = useRef(null);
  const midRef = useRef(null);
  const textRef = useRef(null);

  // Lock hero height on mobile to completely prevent address bar resize jumps
  useEffect(() => {
    const lockMobileHeight = () => {
      if (window.innerWidth < 768 && heroRef.current) {
        heroRef.current.style.height = `${window.innerHeight}px`;
        heroRef.current.style.minHeight = `${window.innerHeight}px`;
      } else if (heroRef.current) {
        heroRef.current.style.height = '';
        heroRef.current.style.minHeight = '100svh';
      }
    };
    
    // Initial lock
    lockMobileHeight();
    
    // Only recalculate on orientation change, not regular scrolling/resize
    const handleOrientationChange = () => {
      setTimeout(lockMobileHeight, 150);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Ensure ScrollTrigger refreshes after all images and fonts load
  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad, { passive: true });
    }
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useGSAP(() => {
    if (shouldReduceMotion) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop Parallax Layers
      gsap.to(bgRef.current, {
        yPercent: 15, // 0.15x
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });

      gsap.to(midRef.current, {
        yPercent: 25, // 0.25x midground
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });

      gsap.to(textRef.current, {
        yPercent: 35, // 0.35x foreground text
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile - simpler parallax (ONE layer only)
      gsap.to(bgRef.current, {
        yPercent: 10, // 0.1x
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.1
        }
      });
    });

    return () => mm.revert(); // cleanup
  }, { scope: heroRef, dependencies: [shouldReduceMotion] });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data && Array.isArray(res.data)) {
          const validImages = res.data.filter(img => img.image);
          if (validImages.length > 0) {
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
      <NotificationBell />
      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full min-h-[100svh] flex flex-col items-center max-md:bg-transparent bg-[#3D1418] overflow-hidden">
        
        <div className="absolute inset-0 flex flex-col items-center justify-start overflow-hidden">
          <div ref={bgRef} className="w-full h-full will-change-transform">
            <div 
              style={{ 
                backgroundColor: "#2c1e16",
                backgroundImage: "url(data:image/webp;base64,UklGRsgCAABXRUJQVlA4ILwCAADwDgCdASooAEgAPzWGr1OvKSOisR37aeAmiWYAvcggihZzGas4FjTDu0HdwW/iBeEa2KyHn+YAZUc+UIxOjqFkPgL5XUS9KGNZC1U72ZQi6h9Onvmv3WwR3w/glJP1/XbTV0owiHyGYfDnFWisiqY/pHqXa+1UY4bypbw29z1PIAD2dlnWnuHUKTIW2iMxDOP1DfPkNlh6HrNjOBm/ti6BD42QZGvKWazYKGt/eLE5W8BSPGWTBQGOmJK4D1lW9/7TAR2/mphADjX3CY4WqGAcHdwrM4hfgvhPTcJTVaAbmo/WAHiheANHLWhMG5U1FJFdiIDNtkfhI0WOxvIpstlC/RgH1B10+6atSmwUZfq+2KXpv4eTf92au3tJDXtcv1X9NT3fibTX/4Qw1zBQ60XtIdi+kLh6ofOcEpfJe3c09LmTZ1Aj1M5R4smi2tAZu7n2WscpgHe7ze4BT4eSb6dTVAnO+pGxwtZB5eqFSDl22xfM8EDCS6TQ9Xwn0CbL4MCytaE0fF/jkYEl2kc5F2Epwd1TXUeDyN/iVPV4+ZqE0wv9DCodRvkksMDwC0uhdPSJFVd71CvU3t3BaP8YRWk7EvfMjYtzIbbhGSjq/7aTmH83+EiQgjMqGXGNSnJjtVfyG3vewF016KiZlQsdfuBMlxuQde80AmFSxUZAcWPOU+b0S0a62jxNOTq3qRRF8Q0H8sXLkV9Kyo1gu/4PwzOmwD6a43e6TD+E/YgbkzbPGUKo3ABozh8Gz6iQ1Oq6W4hNJYFm8EDNn3YjGNXSUx2aEgbkrCUmVGBQVXUa2Slqh83fVBjsBhjxjdRmohYpY7Vq8hw1IV15IBkQ6T8Zogd3BIUvAjhL6ezGoXSSxUuLZhlOSp/sbbgUAy5uT01k+n7s1RINOxbtaqOGteo5yBzXa01AldAAW7xB8AAA)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }} 
              className="w-full h-full will-change-transform max-md:scale-100 md:scale-100 origin-bottom transition-none"
            >
              <div className="w-full h-full block relative">
                {/* Mobile Image */}
                <img 
                  src="/images/hero/home-hero-students-mobile-v5.jpg" 
                  alt="Mount Carmel School" 
                  className="w-full h-full object-cover object-center brightness-90 md:hidden"
                  style={{
                    imageRendering: 'high-quality',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                  fetchpriority="high"
                />
                {/* Desktop Image */}
                <img 
                  src="/images/hero/home-hero-students-v2.webp" 
                  alt="Mount Carmel School" 
                  className="w-full h-full object-cover object-center hidden md:block"
                  style={{
                    imageRendering: 'high-quality',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                  fetchpriority="high"
                />
                
                {/* Desktop Image (Blurred duplicate for left-side tree depth of field, optimized for scroll performance) */}
                <img 
                  src="/images/hero/home-hero-students-v2.webp" 
                  alt="" 
                  className="absolute top-0 left-0 w-full h-full object-cover object-center hidden md:block pointer-events-none"
                  style={{
                    filter: 'blur(6px)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 35%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 35%)',
                    imageRendering: 'high-quality',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                />
              </div>
            </div>
          </div>
          {/* Cinematic Gradient Overlay (Top to bottom on mobile, Left to right on desktop) */}
          <div ref={midRef} className="absolute inset-0 z-[5] w-full h-full will-change-transform">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/30 to-black/0" />
            
            {/* Diffused depth shadow behind typography */}
            <div className="absolute top-0 left-0 w-full h-1/2 md:h-full md:bottom-0 md:w-2/3 pointer-events-none bg-gradient-to-b md:bg-gradient-to-r from-black/50 to-transparent md:blur-3xl opacity-60 md:mix-blend-multiply" />
          </div>
          
          {/* Text Content absolutely positioned over the image bounds */}
          <div ref={textRef} className="absolute inset-0 z-10 w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto flex flex-col items-start justify-start pt-[20svh] md:justify-center md:pt-16 pb-32 md:pb-0 px-6 sm:px-12 md:px-16 lg:px-24 overflow-visible will-change-transform">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-4 md:mb-6"
            >
              <span className="text-white/90 text-xs md:text-sm tracking-[0.2em] uppercase font-semibold [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">Welcome to Mount Carmel School</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-medium text-white mb-4 md:mb-6 leading-[1.15] [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)]"
            >
              Growing in<br />Knowledge, Values<br />& <span className="text-[#F3D086]">Compassion</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-white/95 text-sm md:text-base lg:text-lg mb-8 md:mb-12 max-w-xl font-sans leading-relaxed hidden md:block [text-shadow:_0_2px_6px_rgba(0,0,0,0.8)] pr-4"
            >
              At Mount Carmel School, we nurture young minds to become compassionate, confident and responsible global citizens.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <Link to="/about" className="group flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3D086] text-slate-900 transition-transform group-hover:scale-105 shadow-lg">
                  <ArrowRight size={20} />
                </div>
                <span className="text-white font-semibold text-base transition-colors group-hover:text-[#F3D086] [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">Explore Our School</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legacy of Learning Section */}
      <section className="bg-white">
        <div className="w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto flex flex-col lg:flex-row">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-10 xl:px-16 xl:py-10 flex flex-col justify-center relative bg-white">
            <BotanicalAccent className="absolute top-0 left-0 w-24 sm:w-28 text-[#A26A38]/15 -translate-x-4 -translate-y-4 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#A26A38]"></div>
              <span className="text-[#A26A38] font-bold text-xs uppercase tracking-[0.15em]">About Us</span>
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-slate-900 font-medium mb-4 lg:mb-5 leading-[1.15]">
              A Legacy of <br />Learning and Love
            </h2>
            
            <p className="text-charcoal/80 text-sm md:text-base leading-relaxed max-w-lg mb-6 font-sans">
              Mount Carmel School has been a beacon of quality education, instilling knowledge, values and compassion for generations. We believe in nurturing every child to discover their unique potential and make a positive impact in the world.
            </p>
            
            <div>
              <Link to="/about" className="inline-flex items-center gap-3 bg-[#574737] hover:bg-[#3D1418] text-white px-6 py-3 rounded-full transition-colors font-medium text-sm group shadow-md">
                Know More About Us
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="w-full lg:w-1/2 px-4 pb-6 pt-2 sm:p-6 lg:p-8 xl:p-10 flex flex-col relative min-h-[260px] md:min-h-[400px] lg:min-h-[350px]">
            <div className="relative w-full h-full flex-grow">
              <img loading="lazy" decoding="async" src="/images/legacy-girl.webp" 
                alt="Student smiling in classroom" 
                className="absolute inset-0 w-full h-full object-cover"
                width="800"
                height="600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Mount Carmel */}
      <section className="bg-ivory py-8 md:py-10 lg:py-10 border-t border-b border-[#A26A38]/10">
        <div className="w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto px-4 text-center">
          <span className="text-[#A26A38] font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] block mb-2 md:mb-2">Why Choose Mount Carmel</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-4xl text-slate-900 font-medium mb-8 md:mb-10">More Than Just a School</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8">
            
            <div className="flex flex-col items-center px-4 border-b sm:border-b-0 sm:border-r border-[#A26A38]/20 pb-6 sm:pb-0 lg:border-r">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-slate-800">
                <GraduationCap size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-base font-medium text-slate-900 mb-1">Experienced Faculty</h3>
              <p className="text-charcoal/70 text-xs md:text-sm leading-relaxed">Dedicated educators who<br/>inspire and guide</p>
            </div>
            
            <div className="flex flex-col items-center px-4 border-b lg:border-b-0 border-[#A26A38]/20 pb-6 sm:pb-0 lg:border-r">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-slate-800">
                <Leaf size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-base font-medium text-slate-900 mb-1">Safe & Nurturing Environment</h3>
              <p className="text-charcoal/70 text-xs md:text-sm leading-relaxed">A home away from home</p>
            </div>
            
            <div className="flex flex-col items-center px-4 border-b sm:border-b-0 sm:border-r lg:border-b-0 border-[#A26A38]/20 pb-6 sm:pb-0">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-slate-800">
                <Users size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-base font-medium text-slate-900 mb-1">Vibrant Campus Life</h3>
              <p className="text-charcoal/70 text-xs md:text-sm leading-relaxed">Opportunities to explore,<br/>create and lead</p>
            </div>
            
            <div className="flex flex-col items-center px-4 pb-6 sm:pb-0">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-slate-800">
                <Star size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-base font-medium text-slate-900 mb-1">Focus on Values</h3>
              <p className="text-charcoal/70 text-xs md:text-sm leading-relaxed">Rooted in faith, compassion<br/>and service</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24 bg-white">
        {/* Subtle decorative botanical accent framing section margin */}
        <BotanicalAccent
          className="absolute -bottom-8 -left-8 w-44 sm:w-56 text-[#A26A38]/15 -rotate-12 pointer-events-none"
        />
        <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto px-4">
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
                <h3 className="font-heading text-xl font-medium text-slate-900 mb-3">{item.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Principal Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-lg shrink-0"
            >
              <img loading="lazy" decoding="async" src={principalData.image} alt={principalData.imageAlt} className="w-full h-full object-cover" width="400" height="400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">From the Principal's Desk</p>
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-slate-900 mb-2">{principalData.principalName}</h2>
              <p className="text-warm-gray text-sm mb-4">{principalData.designation}</p>
              <blockquote className="text-charcoal text-sm md:text-base leading-relaxed italic border-l-4 border-secondary pl-4 mb-6">
                "Rooted in values, Reaching for Excellence"
              </blockquote>
              <Button to="/about/principal-message" variant="outline-red-hover-brown" size="sm" icon>
                Read Full Message
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto px-4">
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
                  <h3 className="font-heading text-xl font-medium text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-warm-gray text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Timeline Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto px-4">
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
                    <h3 className="font-heading text-lg font-medium text-slate-900 mb-1">{m.title}</h3>
                    <p className="text-warm-gray text-sm leading-relaxed">{m.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button to="/about/history" variant="outline-red-hover-brown" size="sm" icon>
              View Full History
            </Button>
          </div>
        </div>
      </section>

      {/* School Moments Section */}
      <section className="py-16 md:py-24 bg-[#1f2924] overflow-hidden">
        <div className="w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/3 text-left">
            <span className="text-[#c9a84c] font-bold text-xs uppercase tracking-[0.15em] block mb-4">
              Life at Mount Carmel
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-white font-medium mb-6 leading-[1.15]">
              Moments <br />That Matter
            </h2>
            <div className="w-12 h-[1px] bg-[#c9a84c] mb-6"></div>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm">
              From classrooms to playgrounds, from celebrations to community service — every moment here shapes a brighter tomorrow.
            </p>
            <Link to="/gallery" className="inline-flex items-center gap-2 bg-[#F3D086] hover:bg-white text-slate-900 px-6 py-2.5 rounded-full transition-colors font-medium text-sm group shadow-md">
              View Gallery
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Images (Custom 5-Image Carousel) */}
          <div className="w-full lg:w-2/3 relative flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] py-8">
            {galleryImages.length > 0 ? (
              <div className="relative w-full max-w-[800px] flex flex-col items-center justify-center">
                
                {/* Images Container */}
                <div className="relative w-full h-[240px] sm:h-[300px] md:h-[350px] lg:h-[320px] xl:h-[380px] flex items-center justify-center mb-6">
                  {galleryImages.map((img, idx) => {
                    const position = getRelativePosition(idx, currentIndex, galleryImages.length, isMobile);
                    const isCenter = position === 0;
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={false}
                        animate={getCarouselStyles(position, isMobile)}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute w-[160px] sm:w-[220px] md:w-[260px] lg:w-[240px] xl:w-[280px] aspect-[3/4] overflow-hidden shadow-2xl bg-slate-900 cursor-pointer"
                        style={{ pointerEvents: position === null ? 'none' : 'auto' }}
                        onClick={() => {
                          if (position === 1) nextImage();
                          else if (position === -1) prevImage();
                          else if (isCenter) navigate('/gallery');
                        }}
                      >
                        <img loading="lazy" decoding="async" src={img.image} 
                          alt={img.title || "School moment"} 
                          className="w-full h-full object-cover" 
                          width="400"
                          height="533"
                        />
                        
                        {/* Overlay for inactive images to add depth */}
                        {!isCenter && (
                          <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-300" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Dynamic Event Title Below the Carousel */}
                <div className="text-center z-10 w-full px-4 mt-2">
                  <AnimatePresence mode="wait">
                    <motion.h3 
                      key={currentIndex}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
                      style={{ color: '#F5E6C8' }} 
                      className="font-heading text-lg sm:text-xl md:text-2xl font-medium tracking-wide drop-shadow-sm"
                    >
                      {galleryImages[currentIndex]?.title || "School Event"}
                    </motion.h3>
                  </AnimatePresence>
                </div>
                
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                Loading moments...
              </div>
            )}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-slate-900 mb-4">
              Begin Your Child's Journey
            </h2>
            <p className="text-warm-gray text-base md:text-lg max-w-2xl mx-auto">
              Give your child the gift of value-based education at Mount Carmel School. Admissions are now open.
            </p>
          </motion.div>
        </div>
      </section>

    </PageLayout>
  );
};

export default Home;


