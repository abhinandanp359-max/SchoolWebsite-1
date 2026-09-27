import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import api from '../../utils/api';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        const activeEvents = (res.data || []).filter(e => e.isActive);
        
        let readIds = [];
        try {
          readIds = JSON.parse(localStorage.getItem('readEventIds') || '[]');
        } catch (e) {
          readIds = [];
        }

        const unreadEvents = activeEvents.filter(e => !readIds.includes(e._id));
        setUnreadCount(unreadEvents.length);
      } catch (error) {
        console.error('Failed to fetch events for notifications:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <AnimatePresence>
      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link to="/events" className="relative group block">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 5 }}
              className="w-14 h-14 bg-[#574737] hover:bg-[#3D1418] rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white/20"
            >
              <Bell className="text-white" size={24} />
            </motion.div>
            
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-white text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
            
            {/* Ping animation effect behind the dot */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBell;
