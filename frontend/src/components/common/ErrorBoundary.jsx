import { Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiCopy, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    if (import.meta.env.PROD) {
      console.error('ErrorBoundary caught:', error, errorInfo);
      // Send to error tracking service
      // sendToSentry(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  handleReload = () => {
    window.location.reload();
  };

  handleCopyError = () => {
    const errorDetails = `Error: ${this.state.error?.message}\n\nStack:\n${this.state.error?.stack}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-[70vh] flex items-center justify-center px-[1%] py-[1%] bg-neutral-50 dark:bg-neutral-950">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg"
          >
            {/* Error Icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative w-20 h-20 mx-auto mb-5"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-red-500/20 rounded-full"
                />
                <div className="relative w-full h-full bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                  <FiAlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight"
              >
                Something went wrong
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto"
              >
                We encountered an unexpected error. Please try again or reload the page.
              </motion.p>
            </div>

            {/* Error Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden mb-5"
            >
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <h3 className="text-sm font-semibold dark:text-white">Error Details</h3>
                </div>
                {isDev && (
                  <button
                    onClick={this.handleCopyError}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-600 transition-colors"
                  >
                    {this.state.copied ? (
                      <>
                        <FiCheck className="h-3 w-3 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy className="h-3 w-3" />
                        Copy error
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="p-4">
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-lg p-3 mb-3">
                  <p className="text-sm font-mono text-red-700 dark:text-red-400 break-words">
                    {errorMessage}
                  </p>
                </div>
                
                {isDev && this.state.errorInfo && (
                  <details className="group">
                    <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex items-center gap-1.5">
                      <span className="group-open:rotate-90 transition-transform">▶</span>
                      Technical Details
                    </summary>
                    <pre className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-[11px] text-neutral-600 dark:text-neutral-400 overflow-auto max-h-40 font-mono leading-relaxed">
                      {this.state.error?.stack}
                      {'\n\n--- Component Stack ---\n'}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                {!isDev && (
                  <p className="text-xs text-neutral-400">
                    Error ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-2.5 justify-center"
            >
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FiRefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700 shadow-sm"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700 shadow-sm"
              >
                <FiHome className="h-4 w-4" />
                Go Home
              </Link>
            </motion.div>

            {/* Help Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-neutral-400 mt-6"
            >
              If the problem persists,{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">
                contact our support team
              </Link>
            </motion.p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;