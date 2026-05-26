import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import './index.css';

// Initialize API wrapper
import apiWrapper from './services/apiWrapper';
apiWrapper.init().catch(console.error);
// Apply stored auth token (if any) so axios has Authorization header set
const savedToken = localStorage.getItem('furniqo_token');
if (savedToken) apiWrapper.setAuthToken(savedToken);

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered: ', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available - notify user
                const event = new CustomEvent('swUpdateAvailable');
                window.dispatchEvent(event);
              }
            });
          }
        });
      },
      (error) => {
        console.log('SW registration failed: ', error);
      }
    );
  });
    // Show a toast to prompt user to reload when new SW is available
    window.addEventListener('swUpdateAvailable', () => {
      toast(
        'A new version is available. Refresh to update.',
        {
          duration: 10000,
          action: {
            text: 'Refresh',
            onClick: () => window.location.reload()
          }
        }
      );
    });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);