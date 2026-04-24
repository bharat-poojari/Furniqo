import { motion } from 'framer-motion';
import { FiGift, FiSend, FiCreditCard, FiMail, FiArrowRight, FiCheck } from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

const GiftCards = () => {
  const cards = [
    { amount: 50, popular: false },
    { amount: 100, popular: true },
    { amount: 250, popular: false },
    { amount: 500, popular: false },
  ];

  const features = [
    { icon: FiSend, title: 'Instant Delivery', desc: 'Sent via email within minutes' },
    { icon: FiCreditCard, title: 'No Fees', desc: 'No activation or processing fees' },
    { icon: FiMail, title: 'Personal Message', desc: 'Add a custom message' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative container-fluid[1%] sm:px-[1.5%] text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">🎁 Gift Cards</span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Give the Gift of Great Design</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              The perfect present for housewarmings, weddings, or any special occasion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gift Card Options */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">Choose Your Amount</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border-2 text-center cursor-pointer transition-all hover:shadow-lg ${
                  card.popular
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                }`}
              >
                {card.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-3xl font-bold dark:text-white mt-2">${card.amount}</h3>
                <p className="text-sm text-neutral-500 mt-1">Gift Card</p>
                <button className="mt-4 w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Select
                </button>
              </motion.div>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="max-w-md mx-auto mt-8 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">Or enter a custom amount</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter amount"
                className="input flex-grow"
                min="25"
                max="2000"
              />
              <Button variant="primary" size="sm">Add to Cart</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <f.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="font-semibold dark:text-white">{f.title}</h4>
                <p className="text-sm text-neutral-500 mt-1">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default GiftCards;