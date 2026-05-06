import { useState, useEffect } from 'react';
import { FiRefreshCw, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AppUpdateBanner = () => {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setShowUpdateBanner(true);
    };

    window.addEventListener('swUpdateAvailable', handleUpdate);

    // Also check for skipWaiting message from SW
    const swListener = (event) => {
      if (event.data && event.data.type === 'SW_UPDATE') {
        setShowUpdateBanner(true);
      }
    };

    navigator.serviceWorker?.addEventListener('message', swListener);

    return () => {
      window.removeEventListener('swUpdateAvailable', handleUpdate);
      navigator.serviceWorker?.removeEventListener('message', swListener);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateBanner(false);
  };

  const handleSkipWaiting = async () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!showUpdateBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] animate-slide-up">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <FiRefreshCw className="h-4 w-4 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Update Available
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              A new version of Furniqo is ready. Refresh to get the latest features.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FiX className="h-4 w-4 text-neutral-500" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleRefresh}
            className="flex-1 px-3 py-1.5 text-xs font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh Now
          </button>
          <button
            onClick={handleSkipWaiting}
            className="flex-1 px-3 py-1.5 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppUpdateBanner;
