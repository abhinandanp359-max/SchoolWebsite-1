import { motion } from 'framer-motion';
import { Building2, TreePine, BookOpen, Users } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import schoolInfo from '../data/schoolInfo';

const facilities = [
  { icon: Building2, title: 'Modern Classrooms', description: 'Spacious, well-ventilated classrooms equipped with modern teaching aids.' },
  { icon: BookOpen, title: 'Library', description: 'A well-stocked library encouraging reading habits and research skills.' },
  { icon: TreePine, title: 'Playground', description: 'Expansive grounds for sports, physical education, and outdoor activities.' },
  { icon: Users, title: 'Assembly Hall', description: 'A hall for school assemblies, cultural programs, and community gatherings.' },
];

const campusImages = [
  { src: '/images/campus/campus01.webp', alt: 'Mount Carmel School Campus View 1' },
  { src: '/images/campus/campus02.webp', alt: 'Mount Carmel School Campus View 2' },
  { src: '/images/campus/campus03.webp', alt: 'Mount Carmel School Campus View 3' },
];

const Facilities = () => {
  return (
    <PageLayout title="Campus & Facilities" description="Explore the campus and facilities at Mount Carmel School, Krishnanagar - modern classrooms, playground, library, and more.">
      {/* Full-width Scenic Facilities Hero Section */}
      <section className="relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[440px] flex items-center bg-[#3D1418]">
        <div className="absolute inset-0">
          <img
            src="/images/hero/campus-facilities-hero.jpg"
            alt="Mount Carmel School Campus"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-left"
          >
            <span className="text-[#FDF0D5] font-bold text-xs sm:text-sm tracking-[0.25em] uppercase block mb-2 [text-shadow:_0_2px_10px_rgba(0,0,0,0.6)]">
              INFRASTRUCTURE
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight leading-[1.15] [text-shadow:_0_2px_14px_rgba(0,0,0,0.7)]">
              Campus & Facilities
            </h1>
            <p className="text-white/95 text-sm sm:text-base md:text-lg font-sans max-w-lg leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
              A modern campus designed to inspire learning, growth, and community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Campus Images */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-ivory">
        <BotanicalAccent
          className="absolute -bottom-8 -left-8 w-44 sm:w-56 text-[#A26A38]/15 -rotate-12 pointer-events-none"
        />
        <BotanicalAccent
          flip
          className="absolute -bottom-8 -right-8 w-44 sm:w-56 text-[#A26A38]/15 rotate-12 pointer-events-none"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Our Campus"
            title="Welcome to Our Campus"
            description={`Located at ${schoolInfo.address.line1}, ${schoolInfo.address.city}, our campus provides a safe and inspiring environment for learning.`}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {campusImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="rounded-xl overflow-hidden shadow-lg"
              >
                <img src={img.src} alt={img.alt} className="w-full h-64 md:h-72 object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Facilities"
            title="What Our Campus Offers"
            description="Modern infrastructure to support holistic education."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {facilities.map((facility, i) => {
              const Icon = facility.icon;
              return (
                <Card key={i} className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-secondary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-2">{facility.title}</h3>
                  <p className="text-warm-gray text-sm leading-relaxed">{facility.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Description */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">Our Krishnanagar Campus</h2>
            <div className="space-y-4 text-warm-gray text-sm md:text-base leading-relaxed">
              <p>
                Our present campus at {schoolInfo.address.line1}, {schoolInfo.address.city} is a modern facility designed to provide an ideal learning environment. The campus features well-designed classrooms, a library, a playground, and spaces for cultural and spiritual activities.
              </p>
              <p>
                Surrounded by greenery and located in a peaceful area, our campus offers students a serene atmosphere conducive to focused learning and personal growth. We continually invest in improving our facilities to meet the evolving needs of our students.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">Visit Our Campus</h2>
          <p className="text-white/80 text-sm md:text-base mb-8">Schedule a visit to see our campus and meet our team.</p>
          <Button to="/contact" variant="dark" size="lg" icon>Contact Us</Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Facilities;
