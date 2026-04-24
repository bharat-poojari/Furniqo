import { motion } from 'framer-motion';
import { FiPercent, FiPackage, FiHeadphones, FiStar, FiArrowRight, FiCheck } from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

const Trade = () => {
  const benefits = [
    { icon: FiPercent, title: 'Exclusive Discounts', description: 'Up to 20% off on all orders for trade professionals.' },
    { icon: FiPackage, title: 'Bulk Ordering', description: 'Streamlined process for large volume orders.' },
    { icon: FiHeadphones, title: 'Dedicated Manager', description: 'Personal account manager for all your needs.' },
    { icon: FiStar, title: 'Early Access', description: 'First look at new collections before public release.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-7xl  px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-primary-600/30 rounded-full text-sm font-medium mb-6">🏢 Trade Program</span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Furniqo for Professionals</h1>
            <p className="text-xl text-neutral-300 max-w-2xl  mb-8">
              Exclusive benefits for interior designers, architects, and property developers.
            </p>
            <Button variant="primary" size="lg" icon={FiArrowRight} to="/contact">
              Apply for Trade Account
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl  px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Trade Benefits</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center  mb-4">
                  <b.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">{b.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-3xl  px-6">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Who Can Apply?</h2>
          <div className="space-y-4">
            {['Licensed Interior Designers', 'Registered Architects', 'Property Developers', 'Real Estate Stagers', 'Hospitality Groups'].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm">
                <FiCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="dark:text-white">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-3xl  px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Join Our Trade Program</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">Apply today and start enjoying exclusive trade benefits.</p>
          <Button variant="primary" size="lg">Apply Now</Button>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Trade;