import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiTruck, FiRotateCcw, FiLock } from 'react-icons/fi';
import { policies } from '../data/data';

const policyIcons = {
  privacy: FiLock,
  terms: FiShield,
  shipping: FiTruck,
  returns: FiRotateCcw,
};

const Policies = () => {
  const { type } = useParams();
  const policy = policies[type];
  const Icon = policyIcons[type] || FiShield;

  if (!policy) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Policy Not Found
        </h1>
        <Link to="/" className="text-primary-600 hover:text-primary-700">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <div className="max-w-3xl ">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                <Icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white">
                  {policy.title}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">Last updated: {policy.lastUpdated}</p>
              </div>
            </div>
          </motion.div>

          {/* Policy Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {Object.entries(policies).map(([key, p]) => (
              <Link
                key={key}
                to={`/policies/${key}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  type === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/20'
                }`}
              >
                {p.title}
              </Link>
            ))}
          </div>

          {/* Policy Content */}
          <div className="space-y-6">
            {policy.sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6"
              >
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                  {section.heading}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {section.content}
                </p>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;