import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import ErrorBoundary from '../common/ErrorBoundary';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import { LoadingScreen } from '../common/Spinner';

const Layout = () => {
  const location = useLocation();
  // Reading progress bar for page scroll
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 relative">
      {/* Reading Progress Bar - Smooth like Home page */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 origin-left z-[60]"
        style={{ scaleX }}
      />
      
      <TopBar />
      <Header />
      
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;