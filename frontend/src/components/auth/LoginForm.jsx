import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiShield,
  FiSmartphone,
  FiCheckCircle,
  FiUser,
  FiFacebook,
  FiTwitter,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Button from '../common/Button';
import { validateEmail } from '../../utils/validators';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';

// Social Icons
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const LoginForm = ({
  onSuccess,
  onForgotPassword,
  onSwitchToSignup,
  showSocialLogin = true
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const { login, socialLogin } = useAuth();

  useEffect(() => {
    let timer;
    if (isLocked && lockTimer > 0) {
      timer = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.error(`Too many attempts. Wait ${lockTimer}s.`);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password, rememberMe);

      if (result.success) {
        setLoginAttempts(0);
        if (onSuccess) onSuccess();
        else window.location.href = '/';
      } else {
        setLoginAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5) {
            setIsLocked(true);
            setLockTimer(60);
            toast.error('Account locked for 60 seconds.');
          }
          return newAttempts;
        });
        toast.error(result.error || 'Invalid email or password.');
      }
    } catch (error) {
      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(60);
          toast.error('Account locked for 60 seconds.');
        }
        return newAttempts;
      });
      toast.error(error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (socialLoading) return;
    setSocialLoading(provider);
    try {
      const result = await socialLogin(provider);
      if (result.success) {
        if (onSuccess) onSuccess();
        else window.location.href = '/';
      } else {
        toast.error(result.error || `${provider} login failed`);
      }
    } catch (error) {
      toast.error(`Unable to connect to ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border-2 transition-all duration-200 ${
      errors[field]
        ? 'border-red-400 dark:border-red-500 bg-red-50/30 dark:bg-red-900/10'
        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 focus:border-primary-500'
    } focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:text-white placeholder-neutral-400`;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoFocus
              className={inputClass('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <FiAlertCircle className="h-3 w-3" /> {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <FiAlertCircle className="h-3 w-3" /> {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer"
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 transition-colors">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Attempts Warning */}
        <AnimatePresence>
          {loginAttempts > 0 && loginAttempts < 5 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg"
            >
              <FiAlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{5 - loginAttempts} attempt(s) remaining</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          icon={FiArrowRight}
          iconPosition="right"
          className="w-full"
          size="md"
        >
          Sign In
        </Button>
      </form>

      {/* Social Login Divider */}
      {showSocialLogin && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-neutral-900 text-[11px] text-neutral-400 uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { provider: 'google', icon: GoogleIcon, label: 'Google' },
              { provider: 'facebook', icon: FacebookIcon, label: 'Facebook' },
              { provider: 'apple', icon: AppleIcon, label: 'Apple' },
            ].map((social) => (
              <motion.button
                key={social.provider}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSocialLogin(social.provider)}
                disabled={socialLoading !== null}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-xs font-medium dark:text-white"
              >
                {socialLoading === social.provider ? (
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <social.icon />
                )}
                <span className="hidden sm:inline">{social.label}</span>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {/* Security Note */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
        <FiShield className="h-3 w-3 text-emerald-500" />
        <span>256-bit SSL encrypted</span>
      </div>
    </div>
  );
};

export default LoginForm;
