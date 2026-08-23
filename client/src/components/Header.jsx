import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ChevronRight } from 'lucide-react';
import useScrollPosition from '../hooks/useScrollPosition';
import AnimatedDropdown from './ui/AnimatedDropdown';
import { mainNav } from '../data/navigation';

const Header = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const location = useLocation();

  useEffect(() => {
    setHoveredItem(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScrollDirection = () => {
      const y = window.scrollY;
      if (y <= 80 || isMobileMenuOpen) {
        setIsNavbarHidden(false);
      } else if (y > lastY + 6) {
        setIsNavbarHidden(true);
      } else if (y < lastY - 6) {
        setIsNavbarHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', handleScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 bg-white shadow-sm transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : ''} ${isNavbarHidden ? 'max-lg:-translate-y-full max-lg:shadow-none' : ''}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`flex h-16 items-center justify-between transition-[height] duration-300 md:h-20 ${isScrolled ? 'max-lg:h-14' : ''}`}>
          <Link to="/" className="group flex min-w-0 items-center gap-2 md:gap-3">
            <img src="/images/branding/logo.webp" alt="Mount Carmel School Logo" className="h-10 w-10 shrink-0 object-contain md:h-14 md:w-14" />
            <div className="min-w-0">
              <h1 className="truncate font-heading text-base font-bold leading-tight text-primary transition-colors group-hover:text-primary-dark md:text-xl">Mount Carmel</h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary md:text-xs">School</p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <div key={item.name} className="relative" onMouseEnter={() => item.children && setHoveredItem(item.name)} onMouseLeave={() => setHoveredItem(null)}>
                <Link to={item.path} className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-primary/5 text-primary' : 'text-charcoal hover:bg-primary/5 hover:text-primary'}`}>
                  {item.name}
                  {item.children && <ChevronDown size={14} className={`transition-transform ${hoveredItem === item.name ? 'rotate-180' : ''}`} />}
                </Link>
                <AnimatePresence>
                  {item.children && hoveredItem === item.name && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full mt-1 min-w-[200px] rounded-lg border border-gray-100 bg-white py-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link key={child.path} to={child.path} className="block px-4 py-2 text-sm text-charcoal transition-colors hover:bg-primary/5 hover:text-primary">{child.name}</Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/admissions" className="hidden bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-secondary-dark hover:shadow-lg md:inline-flex">Admissions</Link>
            
            {/* Mobile Dropdown Menu using the new AnimatedDropdown component */}
            <div className="lg:hidden">
              <AnimatedDropdown
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="-mr-2 rounded-lg p-2 text-charcoal transition-colors hover:text-primary"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={isMobileMenuOpen ? 'close' : 'open'}
                        initial={{ rotate: isMobileMenuOpen ? -90 : 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: isMobileMenuOpen ? 90 : -90, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="flex items-center justify-center"
                      >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                }
                triggerMode="click"
                distance={-40}
                ease="back.out(1.1)"
                dropdownClassName="w-[90vw] max-w-sm mt-4 -right-2 left-auto rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden flex flex-col max-h-[80vh]"
              >
                <nav className="flex-1 overflow-y-auto p-4 no-scrollbar">
                  <ul className="flex flex-col gap-1">
                    {mainNav.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                            location.pathname === item.path ? 'bg-primary/5 text-primary' : 'text-charcoal hover:bg-gray-50'
                          }`}
                        >
                          {item.name}
                        </Link>
                        {item.children && (
                          <ul className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-100 pl-4">
                            {item.children.map(child => (
                              <li key={child.path}>
                                <Link
                                  to={child.path}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block rounded-lg py-2 text-sm text-warm-gray transition-colors hover:text-primary"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to="/admissions"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
                    >
                      Admissions <ChevronRight size={16} />
                    </Link>
                  </div>
                </nav>
              </AnimatedDropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
