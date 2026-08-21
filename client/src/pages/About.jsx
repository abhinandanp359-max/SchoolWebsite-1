import { motion } from 'framer-motion';
import { Cross } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import schoolInfo from '../data/schoolInfo';
import values from '../data/values';

const About = () => {
  return (
    <PageLayout title="About Us" description="Learn about Mount Carmel School - a Christian missionary school rooted in values and committed to excellence in education.">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl font-bold text-white mb-4"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto"
          >
            Discover who we are, what we believe in, and how we shape futures.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <img src="/images/campus/campus01.webp" alt="Mount Carmel School Campus" className="w-full rounded-xl shadow-lg object-cover h-72 md:h-96" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-1/2"
            >
              <SectionTitle
                subtitle="Our Story"
                title="A Legacy of Faith and Education"
                description=""
                center={false}
              />
              <div className="space-y-4 text-warm-gray text-sm md:text-base leading-relaxed">
                <p>
                  Mount Carmel School was founded in {schoolInfo.established} with a clear vision: to provide quality education rooted in Christian values to the children of our community.
                </p>
                <p>
                  What began as a small institution at {schoolInfo.previousLocation} has grown into a thriving school at our present campus in {schoolInfo.location}. Over the years, we have remained faithful to our founding mission of nurturing the whole child - mind, body, and spirit.
                </p>
                <p>
                  Our school is guided by the dedicated MPV Sisters, whose commitment to education and service continues to inspire our community. Every student who walks through our doors becomes part of a family built on faith, love, and the pursuit of excellence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mother Mary */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-2/5 flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-yellow-200/40 to-amber-100/30 blur-xl" />
                <img
                  src="/images/branding/mother-marry.webp"
                  alt="Mother Mary - Our Patroness"
                  className="relative w-64 md:w-80 rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </motion.div>

            {/* Right - Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-3/5"
            >
              <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2">Our Patroness</p>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-primary mb-6 leading-tight">
                Mother Mary{' '}
                <span className="text-secondary">- Model of Grace &amp; Love</span>
              </h2>
              <div className="space-y-4 text-warm-gray text-sm md:text-base leading-relaxed">
                <p>
                  Mount Carmel School is named in honour of Our Lady of Mount Carmel - the Blessed Virgin Mary - whose spirit of humility, compassion, and unwavering faith continues to guide our institution every single day.
                </p>
                <p>
                  Mary, the Mother of Jesus, stands as a timeless model of grace and service. Her "yes" to God's call reminds our students that true greatness lies not in power, but in love, sacrifice, and surrender to a higher purpose.
                </p>
                <p>
                  At Mount Carmel, we look to Mary as our heavenly mother and intercessor. Her virtues - purity, humility, courage, and charity - form the spiritual foundation on which our school is built. We strive to instil these values in every child who walks through our gates.
                </p>
                <p>
                  As our patroness, Mother Mary intercedes for our students, teachers, and families. Her loving presence is felt in our prayers, our service, and our daily commitment to nurturing minds and hearts for a better world.
                </p>
              </div>
              <div className="mt-6 italic text-primary/70 text-sm border-l-4 border-secondary pl-4">
                "Do whatever He tells you." - John 2:5
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Christian Identity */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                <Cross size={28} className="text-secondary" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">Our Christian Identity</h2>
              <p className="text-warm-gray text-sm md:text-base leading-relaxed mb-4">
                As a {schoolInfo.type}, our faith is at the heart of everything we do. We believe that every child is created in the image of God and deserves to be loved, respected, and nurtured.
              </p>
              <p className="text-warm-gray text-sm md:text-base leading-relaxed mb-4">
                Our school draws its inspiration from the teachings of Jesus Christ, emphasizing love, forgiveness, humility, and service. We create an inclusive environment where students of all backgrounds are welcomed and valued.
              </p>
              <p className="text-warm-gray text-sm md:text-base leading-relaxed">
                Prayer, moral instruction, and community service are integral parts of school life, helping students develop a strong moral compass and a heart for others.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            subtitle="What Guides Us"
            title="Our Core Values"
            description="These four pillars define the Mount Carmel experience."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-ivory/50 rounded-xl p-6 text-center"
              >
                <h3 className="font-heading text-xl font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">Want to Learn More?</h2>
          <p className="text-white/80 text-sm md:text-base mb-8">Explore our history, meet our principal, or get in touch with us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/about/history" variant="secondary" size="md" icon>Our History</Button>
            <Button to="/about/principal-message" variant="outline-light" size="md">Principal's Message</Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
