import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { validateEmail, validateName, validatePassword } from '../utils/validators';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const success = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🪑</span>
            <span className="text-2xl font-display font-bold text-primary-600">Furniqo</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Join Furniqo and start shopping
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              icon={FiUser}
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              icon={FiMail}
              placeholder="your@email.com"
            />

            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              icon={FiLock}
              placeholder="Create a strong password"
              rightIcon={showPassword ? FiEyeOff : FiEye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              helperText="Min. 8 characters with uppercase, lowercase, number, and special character"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              icon={FiLock}
              placeholder="Confirm your password"
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                I agree to the{' '}
                <Link to="/policies/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/policies/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms}</p>
            )}

            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="w-full"
              icon={FiArrowRight}
              iconPosition="right"
            >
              Create Account
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;