import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ChevronRight, ArrowUpRight } from 'lucide-react';
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
      } else if (y > lastY + 25) {
        setIsNavbarHidden(true);
      } else if (y < lastY - 25) {
        setIsNavbarHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', handleScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [isMobileMenuOpen]);

  return (
    <header className={`absolute w-full left-0 top-0 z-50 bg-transparent transition-all duration-300 ${isNavbarHidden ? 'max-lg:-translate-y-full' : ''}`}>
      <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1920px] px-4">
        <div className={`flex h-20 items-center justify-between transition-[height] duration-300 md:h-28 ${isScrolled ? 'h-16 md:h-24' : ''}`}>
          <Link to="/" className="group flex min-w-0 items-center gap-3 md:gap-4 py-1">
            <img src="/images/branding/logo-transparent.webp" alt="Mount Carmel School Logo" className="h-16 w-16 shrink-0 object-contain md:h-20 md:w-20 transition-all duration-300" fetchpriority="high" />
            <span className="hidden md:block font-heading text-lg lg:text-xl font-bold text-white tracking-wide leading-tight [text-shadow:_0_2px_8px_rgba(0,0,0,0.6)]">
              Mount Carmel<br />School
            </span>
          </Link>


          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <div key={item.name} className="relative" onMouseEnter={() => item.children && setHoveredItem(item.name)} onMouseLeave={() => setHoveredItem(null)}>
                <Link 
                  to={item.path} 
                  className={`relative flex items-center gap-1 px-4 py-2 text-sm transition-all duration-300 text-white
                    after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-[60%] after:-translate-x-1/2 after:bg-[#F3D086] after:transition-transform after:duration-300
                    ${location.pathname === item.path 
                      ? 'font-bold after:scale-x-100' 
                      : 'font-medium opacity-90 hover:opacity-100 after:scale-x-0 hover:after:scale-x-100'
                    }`}
                >
                  {item.name}
                  {item.children && <ChevronDown size={14} className={`transition-transform ${hoveredItem === item.name ? 'rotate-180' : ''}`} />}
                </Link>
                <AnimatePresence>
                  {item.children && hoveredItem === item.name && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full mt-1 min-w-[200px] rounded-lg border border-gray-100 bg-white py-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link key={child.path} to={child.path} className="block px-4 py-2 text-sm text-charcoal transition-colors hover:bg-primary/5 hover:text-slate-900">{child.name}</Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4 max-lg:mr-3">
            {/* Unified Admissions Button — same colour (#574737) as APPLY NOW buttons */}
            <Link
              to="/admissions"
              className={`flex items-center gap-1 text-white px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wider shadow-sm transition-all whitespace-nowrap uppercase ${
                location.pathname === '/admissions'
                  ? 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700'
                  : 'bg-primary hover:bg-primary-dark active:opacity-80'
              }`}
            >
              ADMISSIONS <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>

            {/* Mobile Dropdown Menu using the new AnimatedDropdown component */}
            <div className="lg:hidden">
              <AnimatedDropdown
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="-mr-2 rounded-lg p-2 text-white transition-colors hover:bg-white/10"
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
                            location.pathname === item.path ? 'bg-primary/5 text-slate-900' : 'text-charcoal hover:bg-gray-50'
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
                                  className="block rounded-lg py-2 text-sm text-warm-gray transition-colors hover:text-slate-900"
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
