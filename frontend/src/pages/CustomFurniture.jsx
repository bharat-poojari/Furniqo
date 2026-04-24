import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiTool, FiEdit, FiDroplet, FiImage } from 'react-icons/fi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const furnitureTypes = [
  { value: 'sofa', label: 'Sofa / Sectional' },
  { value: 'bed', label: 'Bed' },
  { value: 'table', label: 'Table' },
  { value: 'chair', label: 'Chair' },
  { value: 'cabinet', label: 'Cabinet / Storage' },
  { value: 'shelving', label: 'Shelving Unit' },
  { value: 'custom', label: 'Other' },
];

const CustomFurniture = () => {
  const [formData, setFormData] = useState({
    furnitureType: 'sofa',
    dimensions: '',
    material: '',
    color: '',
    budget: '',
    timeline: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Custom order request submitted! Our design team will contact you within 24 hours.');
      setLoading(false);
      setFormData({
        furnitureType: 'sofa',
        dimensions: '',
        material: '',
        color: '',
        budget: '',
        timeline: '',
        description: '',
        name: '',
        email: '',
        phone: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiTool className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Custom Furniture Builder
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Design your dream furniture piece. Fill out the form below and our artisans 
                will bring your vision to life.
              </p>
            </motion.div>
          </div>

          {/* How It Works */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { icon: FiEdit, title: 'Specify', desc: 'Tell us your requirements' },
              { icon: FiDroplet, title: 'Design', desc: 'We create your design' },
              { icon: FiSend, title: 'Deliver', desc: 'Crafted & delivered' },
            ].map((step, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <step.icon className="h-6 w-6 text-primary-600" />
                </div>
                <p className="font-semibold text-sm text-neutral-900 dark:text-white">{step.title}</p>
                <p className="text-xs text-neutral-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-6 lg:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-white">Furniture Type *</label>
                <select
                  name="furnitureType"
                  value={formData.furnitureType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                >
                  {furnitureTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-white">Dimensions (L × W × H)</label>
                <input
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder='e.g., 72" × 36" × 30"'
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-white">Preferred Material</label>
                <input
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Oak, Walnut, Leather, etc."
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-white">Color / Finish</label>
                <input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Natural, Dark Walnut, White, etc."
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-white">Budget Range</label>
                <input
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="$1,000 - $3,000"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-white">Timeline</label>
                <input
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="4-6 weeks, ASAP, Flexible"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-white">Project Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none dark:text-white"
                placeholder="Describe your vision, including style preferences, special features, inspiration images, and any specific requirements..."
              />
            </div>

            <div className="border-t dark:border-neutral-800 pt-5">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-white">Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-white">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-white">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="secondary" size="lg">
                Save Draft
              </Button>
              <Button type="submit" loading={loading} size="lg">
                Submit Request
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default CustomFurniture;