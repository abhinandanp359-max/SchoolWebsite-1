import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, ArrowUp } from 'lucide-react';
import schoolInfo from '../data/schoolInfo';
import { footerLinks } from '../data/navigation';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/branding/logo.webp" alt="Mount Carmel School Logo" className="h-11 w-11 md:h-12 md:w-12 object-contain" />
              <div>
                <h3 className="font-heading text-lg md:text-xl font-bold text-white">Mount Carmel</h3>
                <p className="text-secondary text-[10px] md:text-xs font-semibold tracking-widest">SCHOOL</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              A Christian missionary school committed to education, values, character, service, compassion, and excellence. Established in {schoolInfo.established}.
            </p>
            <div className="flex gap-3">
              {[{ icon: Facebook, href: schoolInfo.social.facebook }].map(({ icon: Icon, href }, idx) => (
                <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-base md:text-lg font-semibold mb-4 md:mb-5 text-secondary">Quick Links</h4>
            <ul className="space-y-2.5 md:space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base md:text-lg font-semibold mb-4 md:mb-5 text-secondary">About</h4>
            <ul className="space-y-2.5 md:space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base md:text-lg font-semibold mb-4 md:mb-5 text-secondary">Contact Us</h4>
            <ul className="space-y-3.5 md:space-y-4">
              <li>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Mount Carmel School, Seemanagar, 9th Mile, Krishnanagar, West Bengal, India")}`} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-gray-400 text-sm hover:text-white transition-colors">
                  <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span className="break-words">{schoolInfo.address.line1}, {schoolInfo.address.city}, {schoolInfo.address.state}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${schoolInfo.contact.phone.replace(/\s+/g, '')}`} className="flex gap-3 text-gray-400 text-sm hover:text-white transition-colors">
                  <Phone size={18} className="text-secondary shrink-0" />
                  <span>{schoolInfo.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${schoolInfo.contact.email}?subject=Enquiry%20from%20Mount%20Carmel%20School%20Website`} className="flex gap-3 text-gray-400 text-sm hover:text-white transition-colors">
                  <Mail size={18} className="text-secondary shrink-0" />
                  <span className="break-all">{schoolInfo.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-4 py-4 md:py-5 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-gray-500 text-xs md:text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.
          </p>
          <button onClick={scrollToTop} className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Scroll to top">
            <ArrowUp size={18} className="text-secondary" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
