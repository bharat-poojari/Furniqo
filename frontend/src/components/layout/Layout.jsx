import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../common/ErrorBoundary';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import { LoadingScreen } from '../common/Spinner';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <TopBar />
      <Header />
      
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
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