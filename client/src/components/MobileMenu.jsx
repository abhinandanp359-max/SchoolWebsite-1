import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, ChevronRight } from 'lucide-react';
import { mainNav } from '../data/navigation';

const PANEL_EASE = [0.32, 0.72, 0, 1];

const MobileMenu = ({ isOpen, onClose }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setExpandedMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  const toggleSubmenu = (e, name) => {
    e.preventDefault();
    setExpandedMenu((current) => (current === name ? null : name));
  };

  return createPortal(
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="menu-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: PANEL_EASE }}
            className="fixed top-0 right-0 z-[70] flex max-h-[100dvh] w-[min(86vw,400px)] flex-col overflow-hidden bg-white shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            {/* Menu header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-5">
              <img src="/images/branding/logo.webp" alt="Mount Carmel School Logo" className="h-10 w-10 object-contain" />
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 rounded-full p-2 text-warm-gray transition-colors hover:bg-gray-50 hover:text-primary"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable content */}
            <nav className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 pt-2">
              <ul>
                {[
                  ...mainNav.filter((item) => item.name !== 'Admissions'),
                  ...mainNav.filter((item) => item.name === 'Admissions'),
                ].map((item) => (
                  <li key={item.name} className="border-b border-gray-100 last:border-b-0">
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => toggleSubmenu(e, item.name)}
                          className="flex w-full items-center justify-between gap-2 py-4 text-left text-base font-medium text-charcoal transition-colors hover:text-primary"
                          aria-expanded={expandedMenu === item.name}
                        >
                          {item.name}
                          <ChevronDown
                            size={18}
                            className={`shrink-0 text-secondary transition-transform duration-300 ${expandedMenu === item.name ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expandedMenu === item.name && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <li key={child.path}>
                                  <Link
                                    to={child.path}
                                    onClick={onClose}
                                    className="flex items-center gap-2.5 py-3 pl-4 text-sm font-medium text-warm-gray transition-colors hover:text-primary"
                                  >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/60" />
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center py-4 text-base font-medium transition-colors ${
                          location.pathname === item.path ? 'text-primary' : 'text-charcoal hover:text-primary'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Contained full-width CTA */}
              <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-5">
                <Link
                  to="/admissions"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark active:bg-primary-dark"
                >
                  Admissions
                  <ChevronRight size={16} />
                </Link>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};

export default MobileMenu;
