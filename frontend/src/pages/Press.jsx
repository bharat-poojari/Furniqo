import { motion } from 'framer-motion';
import { FiDownload, FiMail, FiExternalLink } from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

const Press = () => {
  const pressReleases = [
    { date: 'March 2024', title: 'Furniqo Launches Sustainable Furniture Line', outlet: 'Business Wire' },
    { date: 'February 2024', title: 'Furniqo Named Top 10 Furniture Retailer', outlet: 'Forbes' },
    { date: 'January 2024', title: 'Furniqo Expands to International Markets', outlet: 'Reuters' },
    { date: 'December 2023', title: 'Furniqo Raises $50M in Series B Funding', outlet: 'TechCrunch' },
    { date: 'November 2023', title: 'Furniqo Partners with Top Designers', outlet: 'Architectural Digest' },
  ];

  const mediaAssets = [
    { title: 'Brand Guidelines', desc: 'Logo files, colors, and typography', icon: FiDownload },
    { title: 'Press Kit', desc: 'High-res images and fact sheet', icon: FiDownload },
    { title: 'Executive Photos', desc: 'CEO and leadership team photos', icon: FiDownload },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-neutral-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative container-fluid[1%] sm:px-[1.5%] text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">📰 Press Room</span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Furniqo Press Room</h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-8">
              Latest news, media resources, and press contact information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%] max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 dark:text-white">Latest Press Releases</h2>
          <div className="space-y-3">
            {pressReleases.map((pr, i) => (
              <motion.a
                key={i}
                href="#"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
              >
                <div>
                  <span className="text-xs text-neutral-500">{pr.date} • {pr.outlet}</span>
                  <h3 className="font-medium dark:text-white group-hover:text-primary-600 transition-colors mt-1">{pr.title}</h3>
                </div>
                <FiExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 flex-shrink-0 ml-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%] max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 dark:text-white">Media Assets</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {mediaAssets.map((asset, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 bg-white dark:bg-neutral-800 rounded-xl text-center hover:shadow-md transition-all cursor-pointer">
                <asset.icon className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold dark:text-white">{asset.title}</h4>
                <p className="text-sm text-neutral-500 mt-1">{asset.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%] max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Media Inquiries</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">For press inquiries, please contact our communications team.</p>
          <Button variant="primary" icon={FiMail} to="/contact">Contact Press Team</Button>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Press;