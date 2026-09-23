import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ArrowRight from '../icons/ArrowRight';

// Shared burgundy colour — used by ADMISSIONS header button and all APPLY NOW buttons
const BURGUNDY = '#8F2D3A';

const Button = ({ children, to, href, variant = 'primary', size = 'md', icon = false, className = '', style: styleProp = {}, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300';

  const variants = {
    primary:         'bg-primary hover:bg-primary-dark text-white hover:shadow-lg rounded-lg',
    secondary:       'bg-secondary hover:bg-secondary-dark text-white hover:shadow-lg rounded-lg',
    // dark = shared burgundy pill — same colour and pill shape as the top ADMISSIONS button
    dark:            'border-2 border-transparent hover:opacity-90 active:opacity-80 text-white rounded-full uppercase tracking-wider shadow-sm font-bold',
    outline:         'border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg',
    'outline-light': 'border-2 border-white text-white hover:bg-white hover:text-primary rounded-lg',
    'outline-light-pill': 'border-2 border-white text-white hover:bg-white hover:text-primary rounded-full uppercase tracking-wider font-bold',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  // Apply burgundy via inline style so the colour is guaranteed regardless of Tailwind JIT
  const darkStyle = variant === 'dark' ? { backgroundColor: BURGUNDY, ...styleProp } : styleProp;

  const content = (
    <>
      {children}
      {icon && <ArrowRight size={16} />}
    </>
  );

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link to={to} className={classes} style={darkStyle} {...props}>{content}</Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <a href={href} className={classes} style={darkStyle} {...props}>{content}</a>
      </motion.div>
    );
  }

  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={classes} style={darkStyle} {...props}>
      {content}
    </motion.button>
  );
};

export default Button;
