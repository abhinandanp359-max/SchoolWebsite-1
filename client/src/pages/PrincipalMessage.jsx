import { motion } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import BotanicalAccent from '../components/ui/BotanicalAccent';
import principalData from '../data/principalMessage';

const PrincipalMessage = () => {
  return (
    <PageLayout title="Principal's Message" description={`Read the message from ${principalData.principalName}, Principal of Mount Carmel School.`}>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-primary to-secondary">
        <BotanicalAccent 
          className="absolute -top-3 -left-3 w-28 sm:w-36 text-amber-200/20 pointer-events-none" 
        />
        <BotanicalAccent 
          flip 
          className="absolute -top-3 -right-3 w-32 sm:w-40 text-amber-200/20 rotate-12 pointer-events-none" 
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl font-bold text-white mb-4"
          >
            {principalData.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto italic"
          >
            "{principalData.motto}"
          </motion.p>
        </div>
      </section>

      {/* Principal Content */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-ivory">
        <BotanicalAccent
          className="absolute -bottom-8 -left-8 w-44 sm:w-56 text-[#A26A38]/15 -rotate-12 pointer-events-none"
        />
        <BotanicalAccent
          flip
          className="absolute -bottom-8 -right-8 w-44 sm:w-56 text-[#A26A38]/15 rotate-12 pointer-events-none"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/3 shrink-0"
            >
              <div className="sticky top-28">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src={principalData.image} alt={principalData.imageAlt} className="w-full h-auto object-cover" />
                </div>
                <div className="text-center mt-4">
                  <h2 className="font-heading text-xl font-bold text-primary">{principalData.principalName}</h2>
                  <p className="text-secondary text-sm font-semibold">{principalData.designation}</p>
                </div>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-2/3"
            >
              <div className="bg-white rounded-2xl p-6 md:p-10 shadow-md">
                {principalData.paragraphs.map((para, i) => {
                  let styleClass = "text-charcoal/90 font-serif text-base md:text-lg leading-loose mb-6";
                  
                  // Styling the greeting (first paragraph)
                  if (i === 0) {
                    styleClass = "font-heading text-xl md:text-2xl font-bold text-primary mb-8 italic";
                  }
                  // Styling the blessing (last paragraph)
                  else if (i === principalData.paragraphs.length - 1) {
                    styleClass = "font-heading italic text-secondary text-lg md:text-xl leading-relaxed mb-8 border-l-4 border-secondary/30 pl-6 py-2";
                  }

                  return (
                    <p key={i} className={styleClass}>
                      {para}
                    </p>
                  );
                })}
                <p className="text-primary font-heading italic text-lg md:text-xl font-medium mt-6">{principalData.closing}</p>
                <p className="text-primary font-heading text-xl font-bold mt-1">{principalData.principalName}</p>
                <p className="text-secondary text-sm">{principalData.designation}</p>
                <p className="text-warm-gray text-sm">Mount Carmel School</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PrincipalMessage;
