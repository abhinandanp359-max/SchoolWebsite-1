import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Brain, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const programs = [
  {
    title: 'Primary',
    subtitle: 'Class I - IV',
    icon: BookOpen,
    description: 'Building strong foundations in literacy, numeracy, and creative expression. Our primary program nurtures curiosity and a love for learning through interactive and activity-based methods.',
  },
  {
    title: 'Middle',
    subtitle: 'Class V - VIII',
    icon: Brain,
    description: 'Developing critical thinking, academic depth, and personal responsibility. Students explore diverse subjects while building the skills and character needed for secondary education.',
  },
  {
    title: 'Secondary',
    subtitle: 'Class IX - X',
    icon: GraduationCap,
    description: 'Preparing students for board examinations and beyond with rigorous academics, moral guidance, and leadership opportunities. We equip students for success in higher education and life.',
  },
];

const whyChooseUs = [
  'Value-based education rooted in Christian principles',
  'Qualified and dedicated teaching staff',
  'Holistic development: academics, sports, arts, and character',
  'Safe and nurturing campus environment',
  'Activity-based and interactive teaching methods',
  'Moral and spiritual formation alongside academics',
  'Affordable quality education for all families',
];

const Academics = () => {
  return (
    <PageLayout title="Academics" description="Explore the academic programs at Mount Carmel School - Primary, Middle, and Secondary education with a focus on holistic development.">
      {/* Full-width Scenic Academics Hero Section */}
      <section className="relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[440px] flex items-center bg-primary">
        <div className="absolute inset-0">
          <img
            src="/images/hero/academics-hero.jpg"
            alt="Students learning in classroom"
            className="w-full h-full object-cover object-center"
          />
          {/* Soft warm burgundy/golden overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A151C]/90 via-[#722F37]/70 to-[#B8860B]/40 pointer-events-none" />
        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <span className="text-[#FDF0D5] font-bold text-xs sm:text-sm tracking-[0.25em] uppercase block mb-3 [text-shadow:_0_2px_10px_rgba(0,0,0,0.6)]">
              EDUCATION & LEARNING
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-[1.15] [text-shadow:_0_2px_14px_rgba(0,0,0,0.7)]">
              Academics
            </h1>
            <p className="text-white/95 text-base md:text-lg font-sans max-w-xl mx-auto leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
              Nurturing minds, building character, and empowering students for a brighter future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="Programs"
            title="Our Academic Programs"
            description="Comprehensive education across three key stages of development."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {programs.map((program, i) => {
              const Icon = program.icon;
              return (
                <Card key={i} className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary mb-1">{program.title}</h3>
                  <p className="text-secondary font-semibold text-sm mb-3">{program.subtitle}</p>
                  <p className="text-warm-gray text-sm leading-relaxed">{program.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <SectionTitle
                subtitle="Why Us"
                title="Why Choose Mount Carmel?"
                description=""
                center={false}
              />
              <ul className="space-y-3 mt-6">
                {whyChooseUs.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 size={18} className="text-secondary shrink-0 mt-0.5" />
                    <span className="text-warm-gray text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-1/2"
            >
              <Card className="p-8 md:p-10">
                <h3 className="font-heading text-xl font-bold text-primary mb-4">Our Teaching Approach</h3>
                <div className="space-y-4 text-warm-gray text-sm leading-relaxed">
                  <p>
                    At Mount Carmel School, we believe that every child learns differently. Our teachers employ a blend of traditional and modern pedagogical methods to ensure that every student is engaged, challenged, and supported.
                  </p>
                  <p>
                    We emphasize activity-based learning, collaborative projects, and experiential education. Our classrooms are spaces of curiosity, creativity, and respect, where students are encouraged to ask questions, think critically, and develop a genuine love for learning.
                  </p>
                  <p>
                    Beyond academics, we integrate moral instruction, prayer, and community service into the curriculum, forming students who are not only knowledgeable but also compassionate and responsible citizens.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">Explore admissions and give your child the gift of quality, value-based education.</p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Academics;
