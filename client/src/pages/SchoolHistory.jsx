import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Building2, Star } from 'lucide-react';
import PageLayout from '../components/PageLayout';
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
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Our History
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto"
          >
            A journey of faith, growth, and unwavering commitment to education since {schoolInfo.established}.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-4xl mx-auto px-4">
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
                      <h3 className="font-heading text-xl font-bold text-primary mt-1 mb-3">{item.title}</h3>
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
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">Be Part of Our Story</h2>
          <p className="text-white/80 text-sm md:text-base mb-8">Join the Mount Carmel family and write the next chapter with us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/admissions" variant="secondary" size="md" icon>Apply Now</Button>
            <Button to="/contact" variant="outline-light" size="md">Contact Us</Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SchoolHistory;
