import { motion } from 'framer-motion';

const SectionTitle = ({ subtitle, title, description, center = true, light = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-8 md:mb-12 ${center ? 'text-center' : ''}`}
    >
      {subtitle && (
        <span className="text-secondary font-semibold text-xs md:text-sm tracking-widest uppercase">
          {subtitle}
        </span>
      )}
      <h2 className={`font-heading text-2xl md:text-3xl lg:text-4xl font-medium mt-2 ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-3 md:mt-4 max-w-2xl text-sm md:text-base leading-relaxed ${center ? 'mx-auto' : ''} ${light ? 'text-gray-300' : 'text-warm-gray'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
