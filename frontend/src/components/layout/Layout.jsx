import { Suspense, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from '../common/ErrorBoundary';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import { LoadingScreen } from '../common/Spinner';

const Layout = () => {
  const location = useLocation();
  const progressBarRef = useRef(null);
  const tickingRef = useRef(false);

  // Optimized scroll progress without framer-motion
  useEffect(() => {
    const updateProgress = () => {
      if (!progressBarRef.current) return;
      
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      progressBarRef.current.style.transform = `scaleX(${scrolled / 100})`;
    };

    const handleScroll = () => {
      // Use requestAnimationFrame for smooth performance
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          updateProgress();
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (tickingRef.current) {
        cancelAnimationFrame(tickingRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 relative">
      {/* Reading Progress Bar - Optimized with CSS transform */}
      <div 
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 origin-left z-[60] transition-transform duration-75"
        style={{ transform: 'scaleX(0)' }}
      />
      
      <TopBar />
      <Header />
      
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            {/* Removed motion.div, using direct rendering for better performance */}
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;