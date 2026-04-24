import { Link } from 'react-router-dom';
import { FiTruck, FiPhone, FiPercent, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const announcements = [
  { icon: FiTruck, text: 'Free shipping on orders over $200' },
  { icon: FiPercent, text: 'Up to 40% off on selected items' },
  { icon: FiPhone, text: 'Call us: +1 (555) 987-6543' },
];

const TopBar = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const CurrentIcon = announcements[currentAnnouncement].icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="bg-primary-600 text-white overflow-hidden"
        >
          <div className="w-full px-[1%] sm:px-[1.5%] py-2 flex items-center justify-between">
            <div className="flex-1 flex items-center justify-center gap-2 text-sm">
              <CurrentIcon className="h-4 w-4 flex-shrink-0" />
              <span>{announcements[currentAnnouncement].text}</span>
              
              <div className="flex gap-1.5 ml-3">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAnnouncement(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentAnnouncement
                        ? 'bg-white w-4'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Announcement ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-primary-700 rounded transition-colors flex-shrink-0"
              aria-label="Close announcement"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopBar;