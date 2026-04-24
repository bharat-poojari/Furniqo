import { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log to error reporting service
    if (import.meta.env.PROD) {
      console.error('ErrorBoundary caught:', error, errorInfo);
      // Send to Sentry or other error tracking
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center  mb-6">
              <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="text-left mb-6">
                <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs overflow-auto max-h-32">
                  {this.state.error?.stack}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="primary" onClick={this.handleReload}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;