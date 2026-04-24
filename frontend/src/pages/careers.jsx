import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiClock, FiUsers, FiHeart, FiCoffee, FiGlobe, FiArrowRight } from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

const Careers = () => {
  const jobs = [
    { title: 'Senior Frontend Developer', department: 'Engineering', location: 'New York, NY', type: 'Full-time' },
    { title: 'UX/UI Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
    { title: 'Product Manager', department: 'Product', location: 'San Francisco, CA', type: 'Full-time' },
    { title: 'Customer Success Manager', department: 'Support', location: 'New York, NY', type: 'Full-time' },
    { title: 'Supply Chain Analyst', department: 'Operations', location: 'Chicago, IL', type: 'Full-time' },
    { title: 'Content Marketing Specialist', department: 'Marketing', location: 'Remote', type: 'Full-time' },
  ];

  const perks = [
    { icon: FiHeart, title: 'Health & Wellness', desc: 'Comprehensive health, dental, and vision plans' },
    { icon: FiCoffee, title: 'Flexible Work', desc: 'Remote-friendly with flexible hours' },
    { icon: FiGlobe, title: 'Growth', desc: 'Learning budget and career development' },
    { icon: FiUsers, title: 'Team Events', desc: 'Regular team outings and activities' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative container-fluid[1%] sm:px-[1.5%] text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">💼 Careers</span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Join the Furniqo Team</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Help us shape the future of furniture shopping.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%] max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 dark:text-white">Open Positions</h2>
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors gap-3 cursor-pointer group"
              >
                <div>
                  <h3 className="font-semibold dark:text-white group-hover:text-primary-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><FiBriefcase className="h-3 w-3" /> {job.department}</span>
                    <span className="flex items-center gap-1"><FiMapPin className="h-3 w-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><FiClock className="h-3 w-3" /> {job.type}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0 self-start sm:self-center">
                  Apply <FiArrowRight className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <h2 className="text-2xl font-bold text-center mb-10 dark:text-white">Why Work at Furniqo?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {perks.map((perk, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-5 bg-white dark:bg-neutral-800 rounded-xl">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <perk.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="font-semibold text-sm dark:text-white">{perk.title}</h4>
                <p className="text-xs text-neutral-500 mt-1">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%] max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Don't See Your Role?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">Send us your resume and we'll keep you in mind for future opportunities.</p>
          <Button variant="primary" to="/contact">Get in Touch</Button>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Careers;