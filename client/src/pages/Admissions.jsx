import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleCheckBig, CircleAlert } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import api from '../utils/api';

const classOptions = ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];

const initialForm = {
  parentName: '',
  studentName: '',
  className: '',
  phone: '',
  email: '',
  message: '',
};

const Admissions = () => {
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
      await api.post('/enquiries', { ...form, type: 'Admission Enquiry' });
      setStatus({ type: 'success' });
      setForm(initialForm);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Something went wrong. Please try again later.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Admissions" description="Apply for admission at Mount Carmel School. Fill out the enquiry form and our team will get in touch with you.">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Admissions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto"
          >
            Begin your child's journey at Mount Carmel School.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-3xl mx-auto px-4">
          <SectionTitle
            subtitle="Get Started"
            title="Admission Process"
            description="Download our physical admission form or fill out the online enquiry form to get started."
          />

          <Card className="p-6 md:p-10 mt-8">
            <h3 className="text-lg font-bold text-charcoal mb-6 border-b border-gray-100 pb-3">Online Admission Enquiry</h3>
            {status?.type === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-lg mb-6"
              >
                <CircleCheckBig size={20} />
                <span className="text-sm font-medium">Your enquiry has been submitted successfully. We will get back to you soon.</span>
              </motion.div>
            )}
            {status?.type === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-lg mb-6"
              >
                <CircleAlert size={20} className="shrink-0" />
                <span className="text-sm font-medium">{status.message}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Parent's Name *</label>
                  <input type="text" name="parentName" value={form.parentName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Enter parent's name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Student's Name *</label>
                  <input type="text" name="studentName" value={form.studentName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Enter student's name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Class *</label>
                  <select name="className" value={form.className} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white">
                    <option value="">Select class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Enter phone number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Enter email address" />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" placeholder="Any specific questions or requirements?" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </Card>

          {/* Download Form Card */}
          <Card className="p-6 md:p-8 mt-8 border-l-4 border-l-secondary bg-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">Admission Registration Form</h3>
                <p className="text-sm text-warm-gray">Download the physical admission registration form in PDF format to submit at the school office.</p>
              </div>
              <a
                href="/docs/Mount-Carmel-School-Admission-Form.pdf"
                download="Mount-Carmel-School-Admission-Form.pdf"
                className="shrink-0 inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg uppercase tracking-wide text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Form
              </a>
            </div>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
};

export default Admissions;
