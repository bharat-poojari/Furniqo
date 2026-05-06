import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignupForm from '../components/auth/SignupForm';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    setTimeout(() => navigate('/', { replace: true }), 500);
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[1%] py-[1%] bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-primary-400/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/10 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
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
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-10" />
            </motion.div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
              Furniqo
            </span>
          </Link>

          <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Join Furniqo and start shopping
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-black/20 p-5"
        >
          <SignupForm
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </motion.div>

        {/* Login Link */}
        <p className="text-center text-xs text-neutral-500 mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            onClick={(e) => {
              e.preventDefault();
              handleSwitchToLogin();
            }}
          >
            Sign in
            <svg
              className="inline ml-0.5 h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;