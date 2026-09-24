import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, Phone, Mail, MapPin, CircleCheckBig, CircleAlert } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import schoolInfo from '../data/schoolInfo';
import api from '../utils/api';

const initialForm = { name: '', email: '', phone: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.post('/enquiries', { ...form, type: 'Contact Enquiry' });
      setStatus({ type: 'success' });
      setForm(initialForm);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Something went wrong. Please try again later.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const fullAddress = schoolInfo.address.full;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent('Mount Carmel School, Chapra Village, Srinagar, Bangaljhi P.O., Nadia District, West Bengal 741123')}&z=15&output=embed`;

  return (
    <PageLayout 
      title="Contact Us" 
      description="Get in touch with Mount Carmel School. Find our address, phone number, email, and send us a message."
    >
      {/* Full-width Scenic Hero Section */}
      <section className="relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[440px] flex items-center bg-[#3D1418]">
        <div className="absolute inset-0">
          <img
            src="/images/hero/contact-hero.png"
            alt="Mount Carmel School Campus"
            className="w-full h-full object-cover object-[center_right] sm:object-center"
          />
          {/* Subtle mobile-friendly gradient to ensure crisp readability on narrow screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A151C]/80 via-[#4A151C]/35 to-transparent sm:hidden pointer-events-none" />
        </div>

        {/* Subtle corner botanical foliage accents */}
        <BotanicalAccent 
          className="absolute -top-3 -left-3 w-28 sm:w-36 text-amber-200/20 pointer-events-none" 
        />
        <BotanicalAccent 
          flip 
          className="absolute -top-3 -right-3 w-32 sm:w-40 text-amber-200/20 rotate-12 pointer-events-none" 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-left"
          >
            <span className="text-[#FDF0D5] font-bold text-xs sm:text-sm tracking-[0.25em] uppercase block mb-2 [text-shadow:_0_2px_10px_rgba(0,0,0,0.6)]">
              CONNECT WITH US
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight leading-[1.15] [text-shadow:_0_2px_14px_rgba(0,0,0,0.7)]">
              Mount Carmel School
            </h1>
            <p className="text-white/95 text-sm sm:text-base md:text-lg font-sans max-w-lg leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
              Your journey starts here. Explore our community, reach out to our administration, or plan a campus visit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="relative overflow-hidden py-14 md:py-20 bg-ivory">
        {/* Corner botanical accents matching admission page */}
        <BotanicalAccent
          className="absolute -bottom-8 -left-8 w-44 sm:w-56 text-[#A26A38]/15 -rotate-12 pointer-events-none"
        />
        <BotanicalAccent
          flip
          className="absolute -bottom-8 -right-8 w-44 sm:w-56 text-[#A26A38]/15 rotate-12 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-start">
            
            {/* Left Column: Send Us a Message */}
            <div>
              <div className="mb-6">
                <span className="text-[#A26A38] text-xs font-bold tracking-[0.2em] uppercase block mb-1.5">
                  MESSAGE
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
                  Send Us a Message
                </h2>
              </div>

              <div className="bg-white rounded-2xl border border-amber-200/70 p-6 sm:p-8 md:p-10 shadow-sm">
                {status?.type === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-6 shadow-sm"
                  >
                    <CircleCheckBig size={22} className="text-green-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-green-900">Message Sent Successfully!</h4>
                      <p className="text-xs text-green-700 mt-0.5">Thank you for reaching out. We will get back to you soon.</p>
                    </div>
                  </motion.div>
                )}

                {status?.type === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6"
                  >
                    <CircleAlert size={22} className="text-red-600 shrink-0" />
                    <span className="text-sm font-medium">{status.message || 'Something went wrong. Please try again later.'}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white placeholder-gray-400" 
                      placeholder="Your name" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Email *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white placeholder-gray-400" 
                        placeholder="Your email" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Phone</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={form.phone} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white placeholder-gray-400" 
                        placeholder="Your phone" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Message *</label>
                    <textarea 
                      name="message" 
                      value={form.message} 
                      onChange={handleChange} 
                      required 
                      rows={5} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none bg-white placeholder-gray-400" 
                      placeholder="Your message" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-[#8F2D3A] hover:bg-[#78232F] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-base tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Contact Information */}
            <div>
              <div className="mb-6">
                <span className="text-[#A26A38] text-xs font-bold tracking-[0.2em] uppercase block mb-1.5">
                  INFO
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="bg-white rounded-2xl border border-amber-200/70 p-5 sm:p-6 shadow-sm hover:border-amber-300/90 transition-colors">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-[#9A7320] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#8F2D3A] group-hover:text-white group-hover:border-[#8F2D3A] transition-all duration-300">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary mb-1">Address</p>
                      <p className="text-warm-gray text-sm leading-relaxed">{fullAddress}</p>
                      <p className="text-[#A26A38] text-xs font-semibold mt-2 flex items-center gap-1 group-hover:text-primary transition-colors">
                        View on Google Maps <ExternalLink size={12} />
                      </p>
                    </div>
                  </a>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-2xl border border-amber-200/70 p-5 sm:p-6 shadow-sm hover:border-amber-300/90 transition-colors">
                  <a href={`tel:${schoolInfo.contact.phone.replace(/\s+/g, '')}`} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-[#9A7320] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#8F2D3A] group-hover:text-white group-hover:border-[#8F2D3A] transition-all duration-300">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary mb-1">Phone</p>
                      <p className="text-warm-gray text-sm">{schoolInfo.contact.phone}</p>
                      <p className="text-[#A26A38] text-xs font-semibold mt-1 group-hover:text-primary transition-colors">Call now</p>
                    </div>
                  </a>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl border border-amber-200/70 p-5 sm:p-6 shadow-sm hover:border-amber-300/90 transition-colors">
                  <a href={`mailto:${schoolInfo.contact.email}?subject=Enquiry%20from%20Mount%20Carmel%20School%20Website`} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-[#9A7320] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#8F2D3A] group-hover:text-white group-hover:border-[#8F2D3A] transition-all duration-300">
                      <Mail size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary mb-1">Email</p>
                      <p className="text-warm-gray text-sm break-all">{schoolInfo.contact.email}</p>
                      <p className="text-[#A26A38] text-xs font-semibold mt-1 group-hover:text-primary transition-colors">Send email</p>
                    </div>
                  </a>
                </div>

                {/* Office Hours */}
                <div className="bg-white rounded-2xl border border-amber-200/70 p-5 sm:p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-[#9A7320] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary mb-1">Office Hours</p>
                      <p className="text-warm-gray text-sm">{schoolInfo.timings.office}</p>
                      <p className="text-xs text-warm-gray/80 mt-1">Monday to Saturday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white py-14 md:py-20 border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[#A26A38] text-xs font-bold tracking-[0.2em] uppercase block mb-1.5">
              LOCATION
            </span>
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">
              Find Us on the Map
            </h2>
            <p className="text-sm text-warm-gray">
              We are conveniently located at {fullAddress}.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-amber-200/70">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mount Carmel School Location"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
