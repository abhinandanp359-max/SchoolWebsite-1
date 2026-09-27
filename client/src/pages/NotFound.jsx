import { motion } from 'framer-motion';
import { House } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ivory px-4">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-[120px] md:text-[160px] font-medium text-slate-900/10 leading-none"
        >
          404
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-heading text-2xl md:text-3xl font-medium text-slate-900 -mt-6 md:-mt-8 mb-4"
        >
          Page Not Found
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-warm-gray text-sm md:text-base mb-8 max-w-md mx-auto"
        >
          The page you are looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Button to="/" variant="primary" size="lg">
            <House size={18} />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
