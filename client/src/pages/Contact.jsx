import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, Phone, Mail, MapPin, CircleCheckBig, CircleAlert } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
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

  const fullAddress = `${schoolInfo.address.line1}, ${schoolInfo.address.city}, ${schoolInfo.address.state}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress + ', India')}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent('Mount Carmel School, Seemanagar, 9th Mile, Krishnanagar, West Bengal, India')}&z=15&output=embed`;

  return (
    <PageLayout title="Contact Us" description="Get in touch with Mount Carmel School. Find our address, phone number, email, and send us a message.">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto"
          >
            We'd love to hear from you. Reach out to us anytime.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div>
              <SectionTitle subtitle="Message" title="Send Us a Message" description="" center={false} />
              <Card className="p-6 md:p-8 mt-4">
                {status?.type === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-lg mb-5">
                    <CircleCheckBig size={20} />
                    <span className="text-sm font-medium">Message sent successfully. We will get back to you soon.</span>
                  </motion.div>
                )}
                {status?.type === 'error' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-lg mb-5">
                    <CircleAlert size={20} />
                    <span className="text-sm font-medium">{status.message || 'Something went wrong. Please try again later.'}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Your name" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Your email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Your phone" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" placeholder="Your message" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </Card>
            </div>

            {/* Contact Info */}
            <div>
              <SectionTitle subtitle="Info" title="Contact Information" description="" center={false} />
              <div className="space-y-4 mt-4">
                <Card className="p-5">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                    <MapPin size={20} className="text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Address</p>
                      <p className="text-warm-gray text-sm leading-relaxed">{fullAddress}</p>
                      <p className="text-secondary text-xs mt-1 flex items-center gap-1 group-hover:underline">View on Google Maps <ExternalLink size={12} /></p>
                    </div>
                  </a>
                </Card>
                <Card className="p-5">
                  <a href={`tel:${schoolInfo.contact.phone.replace(/\s+/g, '')}`} className="flex items-start gap-3 group">
                    <Phone size={20} className="text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Phone</p>
                      <p className="text-warm-gray text-sm">{schoolInfo.contact.phone}</p>
                      <p className="text-secondary text-xs mt-1 group-hover:underline">Call now</p>
                    </div>
                  </a>
                </Card>
                <Card className="p-5">
                  <a href={`mailto:${schoolInfo.contact.email}?subject=Enquiry%20from%20Mount%20Carmel%20School%20Website`} className="flex items-start gap-3 group">
                    <Mail size={20} className="text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Email</p>
                      <p className="text-warm-gray text-sm break-all">{schoolInfo.contact.email}</p>
                      <p className="text-secondary text-xs mt-1 group-hover:underline">Send email</p>
                    </div>
                  </a>
                </Card>
                <Card className="p-5">
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Office Hours</p>
                      <p className="text-warm-gray text-sm">{schoolInfo.timings.office}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <SectionTitle subtitle="Location" title="Find Us on the Map" description={`We are located at ${schoolInfo.address.line1}, ${schoolInfo.address.city}, ${schoolInfo.address.state}, India.`} />
          <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="400"
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
