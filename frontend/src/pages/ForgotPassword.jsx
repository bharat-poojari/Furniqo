import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
  FiArrowLeft, 
  FiSend, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLock, 
  FiClock,
  FiShield,
  FiRefreshCw,
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import { validateEmail } from '../utils/validators';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success('Reset link sent to your email!');
      setResendTimer(60);
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Reset link resent!');
      setResendTimer(60);
    } catch (error) {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setEmail('');
    setErrors({});
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-900/10 flex items-center justify-center px-[1%] py-[1%]">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-primary-400/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo */}
              <div className="text-center mb-5">
                <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <img 
                      src="/logo.svg" 
                      alt="Furniqo" 
                      className="h-9 w-9 object-contain transition-all duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"></div>
                  </motion.div>
                  <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                    Furniqo
                  </span>
                </Link>
                
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight"
                >
                  Forgot Password?
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-neutral-500 dark:text-neutral-400"
                >
                  Enter your email and we'll send you a reset link
                </motion.p>
              </div>

              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-black/20 p-5"
              >
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        autoFocus
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${
                          errors.email 
                            ? 'border-red-400 dark:border-red-500 bg-red-50/30 dark:bg-red-900/10' 
                            : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 focus:border-primary-500'
                        } focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:text-white placeholder-neutral-400`}
                      />
                    </div>
                    {errors.email ? (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <FiAlertCircle className="h-3 w-3" /> {errors.email}
                      </p>
                    ) : (
                      <p className="text-[10px] text-neutral-400 mt-1.5">
                        We'll send a password reset link to this email
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                  >
                    {loading ? (
                      <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </motion.svg>
                    ) : (
                      <>
                        <FiSend className="h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full px-4 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                  >
                    <FiArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </form>

                {/* Security Badges */}
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-center gap-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                      <FiLock className="h-3 w-3" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                      <FiClock className="h-3 w-3" />
                      <span>24hr Link</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                      <FiShield className="h-3 w-3" />
                      <span>Encrypted</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Footer Link */}
              <p className="text-center text-xs text-neutral-500 mt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
                <img 
                  src="/logo.svg" 
                  alt="Furniqo" 
                  className="h-9 w-9 object-contain transition-all duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                  Furniqo
                </span>
              </Link>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative w-16 h-16 mx-auto mb-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-full"
                />
                <div className="relative w-full h-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                  Check Your Email
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                  We've sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-4 break-all bg-primary-50 dark:bg-primary-900/20 rounded-lg py-2 px-3 inline-block">
                  {email}
                </p>
              </motion.div>

              {/* Tips Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4 text-left border border-blue-100 dark:border-blue-800/30"
              >
                <div className="flex items-start gap-2.5">
                  <FiAlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1.5">
                      Didn't receive the email?
                    </p>
                    <ul className="text-[11px] text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• Check your spam or junk folder</li>
                      <li>• Make sure you entered the correct email</li>
                      <li>• The link expires after 24 hours</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="w-full px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                >
                  {loading ? (
                    <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </motion.svg>
                  ) : (
                    <>
                      <FiRefreshCw className="h-4 w-4" />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Email'}
                    </>
                  )}
                </motion.button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="px-4 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <FiArrowLeft className="h-4 w-4" />
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <FiRefreshCw className="h-4 w-4" />
                    Change Email
                  </button>
                </div>
              </div>

              {/* Contact Link */}
              <p className="text-xs text-neutral-400 mt-4">
                Still need help?{' '}
                <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                  Contact Support
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPassword;