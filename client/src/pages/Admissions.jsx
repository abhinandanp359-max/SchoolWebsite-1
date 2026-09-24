import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Heart, 
  Sparkles, 
  Users, 
  BookOpen, 
  Download, 
  CheckCircle2, 
  CircleAlert, 
  Home,
  Check
} from 'lucide-react';
import PageLayout from '../components/PageLayout';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import principalData from '../data/principalMessage';
import api from '../utils/api';

const classOptions = [
  'Nursery', 'LKG', 'UKG', 
  'Class I', 'Class II', 'Class III', 'Class IV', 
  'Class V', 'Class VI', 'Class VII', 'Class VIII', 
  'Class IX', 'Class X'
];

const features = [
  {
    icon: Award,
    title: 'Quality Education',
    description: 'Academic excellence with strong values.'
  },
  {
    icon: Heart,
    title: 'Caring Environment',
    description: 'A safe and supportive campus for every child.'
  },
  {
    icon: Sparkles,
    title: 'Holistic Development',
    description: 'Building confidence, creativity and character.'
  },
  {
    icon: Users,
    title: 'Competition & Mentorship',
    description: 'Dedicated teachers, personal attention, and encouragement.'
  },
  {
    icon: BookOpen,
    title: 'Empower All Students',
    description: "We are committed to nurturing every child's unique potential."
  }
];

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
    <PageLayout 
      title="Admissions" 
      description="Begin your child's journey with us at Mount Carmel School. Fill out the online admission enquiry or download our registration form."
      hideBackButton={status?.type === 'success'}
    >
      {/* Hero Section with Bright Natural Campus Background */}
      <section className="relative overflow-hidden min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center">
        {/* School Building and Students Photo - Natural & Bright */}
        <div className="absolute inset-0">
          <img
            src="/images/hero/admissions-hero.jpg"
            alt="Mount Carmel School Campus and Students"
            className="w-full h-full object-cover object-[center_35%]"
          />
          {/* Soft translucent warm burgundy gradient on the left; right side remains bright and natural */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6E202A]/55 via-[#822C36]/25 via-45% to-transparent to-75% pointer-events-none" />
        </div>



        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.15] [text-shadow:_0_2px_14px_rgba(0,0,0,0.85)]">
              Begin Your Journey <br />
              <span className="font-serif italic font-normal text-[#FDF0D5] [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)]">With Us</span>
            </h1>
            <p className="mt-4 text-white text-sm sm:text-base md:text-lg font-sans leading-relaxed max-w-xl [text-shadow:_0_2px_8px_rgba(0,0,0,0.85)]">
              At Mount Carmel School, we believe in nurturing every child's unique potential. Our admissions process is the first step towards a brighter future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative overflow-hidden py-12 md:py-16 bg-[#FAF7F2]">
        {/* Subtle botanical corner framing inspired by reference */}
        <BotanicalAccent
          variant="corner"
          className="absolute -bottom-8 -left-8 w-44 sm:w-56 text-[#A26A38]/15 -rotate-12 pointer-events-none"
        />
        <BotanicalAccent
          variant="corner"
          flip
          className="absolute -bottom-8 -right-8 w-44 sm:w-56 text-[#A26A38]/15 rotate-12 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Forms (approx 7 or 8 cols out of 12) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6 md:space-y-8">
              
              {/* Online Admission Enquiry Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl border border-amber-200/70 shadow-sm p-6 sm:p-8 md:p-10"
              >
                {status?.type === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-12 sm:py-16 px-4 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#FEF6E4] border border-[#F3DEAB] text-[#9A7320] flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Check size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
                      Application Submitted!
                    </h3>
                    <p className="text-sm text-warm-gray leading-relaxed max-w-md mx-auto mb-6">
                      Thank you for your interest in Mount Carmel School. Your enquiry has been received. We will get back to you soon.
                    </p>
                    <div className="flex flex-col items-center gap-3">
                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8F2D3A] hover:bg-[#78232F] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95"
                      >
                        <Home size={15} />
                        <span>BACK TO HOME</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setStatus(null)}
                        className="text-xs font-medium text-warm-gray hover:text-primary transition-colors underline pt-2"
                      >
                        Submit another enquiry
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-6">
                      Online Admission Enquiry
                    </h2>

                    {status?.type === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6"
                      >
                        <CircleAlert size={22} className="text-red-600 shrink-0" />
                        <span className="text-sm font-medium">{status.message}</span>
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Parent's Name *</label>
                          <input
                            type="text"
                            name="parentName"
                            value={form.parentName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8F2D3A]/20 focus:border-[#8F2D3A] transition-all bg-white"
                            placeholder="Enter parent's name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Student's Name *</label>
                          <input
                            type="text"
                            name="studentName"
                            value={form.studentName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8F2D3A]/20 focus:border-[#8F2D3A] transition-all bg-white"
                            placeholder="Enter student's name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Class *</label>
                          <select
                            name="className"
                            value={form.className}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8F2D3A]/20 focus:border-[#8F2D3A] transition-all bg-white"
                          >
                            <option value="">Select class</option>
                            {classOptions.map((cls) => (
                              <option key={cls} value={cls}>{cls}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8F2D3A]/20 focus:border-[#8F2D3A] transition-all bg-white"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8F2D3A]/20 focus:border-[#8F2D3A] transition-all bg-white"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal/90 mb-1.5">Message</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8F2D3A]/20 focus:border-[#8F2D3A] transition-all resize-none bg-white"
                          placeholder="Any specific questions or requirements?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8F2D3A] hover:bg-[#78232F] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-base tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                      >
                        {loading ? 'Submitting...' : 'Submit Enquiry'}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>

              {/* Admission Registration Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl border border-amber-200/70 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-1.5">
                    Admission Registration Form
                  </h3>
                  <p className="text-xs sm:text-sm text-warm-gray leading-relaxed max-w-lg">
                    Download the physical admission registration form in PDF format to submit at the school office.
                  </p>
                </div>
                <a
                  href="/docs/Mount-Carmel-School-Admission-Form.pdf"
                  download="Mount-Carmel-School-Admission-Form.pdf"
                  className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#D4A346] hover:bg-[#C29339] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md uppercase tracking-wider text-xs sm:text-sm active:scale-[0.98]"
                >
                  <Download size={18} strokeWidth={2.5} />
                  <span>Download Form</span>
                </a>
              </motion.div>

            </div>

            {/* Right Column: Sidebar (approx 4 or 5 cols out of 12) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-[#FDFBF7] rounded-2xl border border-amber-200/70 p-6 sm:p-8 shadow-sm sticky top-28"
              >
                {/* Header */}
                <div className="mb-6">
                  <span className="text-[11px] font-bold tracking-widest text-[#A26A38] uppercase block mb-1">
                    PRESERVED FEATURES
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">
                    Apply for Admission
                  </h3>
                  <p className="text-xs sm:text-sm text-warm-gray leading-relaxed">
                    Join a community that nurtures values, builds character and shapes a better tomorrow.
                  </p>
                </div>

                {/* Feature Items */}
                <div className="space-y-4">
                  {features.map((feat, idx) => {
                    const IconComp = feat.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#8F2D3A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <IconComp size={18} strokeWidth={2.2} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1A1A1A] leading-snug">
                            {feat.title}
                          </h4>
                          <p className="text-xs text-warm-gray leading-relaxed mt-0.5">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-amber-200/60 my-6" />

                {/* Principal Quote Block */}
                <div className="flex items-center gap-4 bg-white/70 p-4 rounded-xl border border-amber-200/50 shadow-xs">
                  <img
                    src={principalData.image}
                    alt={principalData.imageAlt}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D4A346] shadow-sm shrink-0"
                  />
                  <div>
                    <p className="text-xs italic text-charcoal leading-relaxed mb-1.5 font-serif">
                      "At Mount Carmel School, we believe in nurturing young minds with love, discipline and values."
                    </p>
                    <h5 className="text-xs font-bold text-[#1A1A1A]">
                      {principalData.principalName}
                    </h5>
                    <span className="text-[11px] text-warm-gray block">
                      {principalData.designation}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Admissions;
