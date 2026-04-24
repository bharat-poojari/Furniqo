import { motion } from 'framer-motion';
import { FiDollarSign, FiUsers, FiTrendingUp, FiGift, FiArrowRight, FiCheck } from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

const Affiliate = () => {
  const benefits = [
    {
      icon: FiDollarSign,
      title: '10% Commission',
      description: 'Earn 10% on every sale you refer. No cap on earnings.',
    },
    {
      icon: FiTrendingUp,
      title: '30-Day Cookies',
      description: 'Long cookie duration means more time to earn commissions.',
    },
    {
      icon: FiGift,
      title: 'Performance Bonuses',
      description: 'Hit targets and earn extra bonuses on top of commissions.',
    },
    {
      icon: FiUsers,
      title: 'Dedicated Support',
      description: 'Get personalized support from our affiliate team.',
    },
  ];

  const steps = [
    { step: '01', title: 'Apply', description: 'Fill out our simple application form' },
    { step: '02', title: 'Get Approved', description: 'We review within 24 hours' },
    { step: '03', title: 'Share', description: 'Start sharing your unique link' },
    { step: '04', title: 'Earn', description: 'Get paid monthly via PayPal' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-7xl  px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">💰 Affiliate Program</span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Earn With Furniqo</h1>
            <p className="text-xl text-primary-100 max-w-2xl  mb-8">
              Join our affiliate program and earn 10% commission on every sale you refer.
            </p>
            <Button variant="white" size="lg" icon={FiArrowRight} to="/contact">
              Apply Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl  px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Join?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center  mb-4">
                  <benefit.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">{benefit.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl  px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center relative">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold  mb-4">
                  {s.step}
                </div>
                <h4 className="font-semibold mb-1 dark:text-white">{s.title}</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{s.description}</p>
                {i < steps.length - 1 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-neutral-300 dark:bg-neutral-700" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-3xl  px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Ready to Start Earning?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">Join thousands of affiliates already earning with Furniqo.</p>
          <Button variant="primary" size="lg">Apply Now</Button>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Affiliate;