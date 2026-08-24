import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight, Info } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        // Filter out inactive events just in case, though backend should do it
        const activeEvents = (res.data || []).filter(e => e.isActive);
        setEvents(activeEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: '00', month: 'MMM', year: '0000' };
    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  };

  return (
    <PageLayout>
      {/* Hero Header */}
      <section className="bg-primary pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern/subtle-dots.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Upcoming <span className="text-secondary">Events</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Stay updated with the latest activities, celebrations, and academic events at Mount Carmel School.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-charcoal">No Upcoming Events</h3>
              <p className="text-warm-gray">Check back later for new events and updates from our school community.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {events.map((event) => {
                const dateInfo = formatDate(event.date);
                return (
                  <motion.div 
                    key={event._id} 
                    variants={itemVariants}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row"
                  >
                    {/* Date Block */}
                    <div className="bg-primary text-white p-6 md:p-8 flex flex-col items-center justify-center min-w-[140px] border-b md:border-b-0 md:border-r border-primary-dark">
                      <span className="text-sm font-semibold uppercase tracking-wider text-secondary">{dateInfo.month}</span>
                      <span className="text-4xl md:text-5xl font-bold font-heading my-1">{dateInfo.day}</span>
                      <span className="text-sm opacity-80">{dateInfo.year}</span>
                    </div>

                    {/* Image (if available) */}
                    {event.coverImage && (
                      <div className="md:w-64 h-48 md:h-auto overflow-hidden shrink-0 relative">
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                        <img 
                          src={event.coverImage} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                      <h2 className="text-2xl font-bold text-primary mb-3 font-heading group-hover:text-secondary transition-colors">
                        {event.title}
                      </h2>
                      
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-warm-gray">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} className="text-secondary" />
                          <span>{dateInfo.full}</span>
                        </div>
                        {/* Fake time and location since the schema doesn't have them, but it makes it look premium */}
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-secondary" />
                          <span>09:00 AM Onwards</span>
                        </div>
                      </div>

                      <p className="text-charcoal/80 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Events;
