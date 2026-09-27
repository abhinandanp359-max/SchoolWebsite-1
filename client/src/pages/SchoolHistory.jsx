import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Building2, Star } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import schoolInfo from '../data/schoolInfo';

const timeline = [
  {
    year: '2004',
    title: 'Foundation at Seemanagar',
    description: 'Mount Carmel School was established at Seemanagar with a small batch of students, guided by a vision to provide quality education rooted in Christian values. The school began its journey with dedicated teachers and a commitment to nurturing young minds.',
    icon: Building2,
  },
  {
    year: '2004 - 2014',
    title: 'Growing Years at Seemanagar',
    description: 'Over the first decade, the school grew steadily, building a reputation for academic excellence and value-based education. The Seemanagar campus became a place of learning and community, serving families in the region with dedication and care.',
    icon: Users,
  },
  {
    year: 'Transition',
    title: 'MPV Sisters Take Charge',
    description: 'The MPV Sisters assumed leadership of the school, bringing renewed energy and a deeper commitment to the founding mission. Their guidance strengthened the school\'s spiritual and academic foundation, preparing it for the next chapter of growth.',
    icon: Star,
  },
  {
    year: 'New Era',
    title: `New Campus at ${schoolInfo.location}`,
    description: `The school expanded to a new, modern campus at ${schoolInfo.address.line1}, ${schoolInfo.location}. The new campus features improved infrastructure, spacious classrooms, and facilities designed to support holistic development.`,
    icon: MapPin,
  },
  {
    year: 'Present',
    title: 'Continuing the Legacy',
    description: 'Today, Mount Carmel School stands as a beacon of quality education and values in the Krishnanagar community. With growing student strength, dedicated staff, and a vibrant campus life, the school continues to fulfill its mission of forming confident, compassionate, and responsible individuals.',
    icon: Calendar,
  },
];

const SchoolHistory = () => {
  return (
    <PageLayout title="School History" description="Learn about the journey of Mount Carmel School from its foundation in 2004 to the present day.">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[40vh] md:min-h-[50vh] lg:min-h-[60vh] max-h-[800px] flex items-center bg-[#1f2924]">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/hero/history-hero-new.webp" />
            <img
              src="/images/hero/history-hero-mobile.webp"
              className="w-full h-full object-cover object-[center_35%] md:object-center"
              alt="Church Interior with Mother Mary"
            />
          </picture>
        </div>

        {/* Subtle Darkening for text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-8 flex justify-center md:justify-end pt-28 pb-12 md:pt-40 md:pb-16 h-full items-center">
          
          {/* Text positioned to the right to balance Mother Mary on the left */}
          <div className="text-center md:text-left z-10 max-w-xl px-6 py-6 sm:py-10 md:mr-[5%] lg:mr-[10%] relative w-full">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-medium text-white mb-4 drop-shadow-lg"
            >
              Our History
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-white/95 text-sm md:text-base lg:text-lg font-sans leading-relaxed drop-shadow-md mx-auto md:mx-0 max-w-[90%]"
            >
              A journey of faith, growth, and unwavering commitment to education since {schoolInfo.established}.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-ivory">
        <BotanicalAccent
          className="absolute -bottom-8 -left-8 w-44 sm:w-56 text-[#A26A38]/15 -rotate-12 pointer-events-none"
        />
        <BotanicalAccent
          flip
          className="absolute -bottom-8 -right-8 w-44 sm:w-56 text-[#A26A38]/15 rotate-12 pointer-events-none"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <SectionTitle
            subtitle="Milestones"
            title="Our Journey Through the Years"
            description="From a humble beginning to a thriving institution."
          />
          <div className="relative mt-12">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary/20 -translate-x-1/2" />
            {timeline.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex' : 'md:flex md:flex-row-reverse'}`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-6 md:left-1/2 w-12 h-12 rounded-full bg-secondary flex items-center justify-center -translate-x-1/2 z-10 shadow-lg">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="ml-16 md:ml-0 md:w-1/2 md:px-8">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <span className="text-secondary font-semibold text-sm">{item.year}</span>
                      <h3 className="font-heading text-xl font-medium text-slate-900 mt-1 mb-3">{item.title}</h3>
                      <p className="text-warm-gray text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-4 pb-16 md:pt-6 md:pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-slate-900 mb-4">Be Part of Our Story</h2>
          <p className="text-warm-gray text-sm md:text-base mb-8">Join the Mount Carmel family and write the next chapter with us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button to="/admissions" variant="primary" size="md" icon className="w-full sm:w-48">Apply Now</Button>
            <Button to="/contact" variant="outline-red-hover-brown" size="md" icon className="w-full sm:w-48">Contact Us</Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SchoolHistory;
