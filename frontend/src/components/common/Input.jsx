import { forwardRef, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  helperText,
  success,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  required = false,
  disabled = false,
  className,
  containerClassName,
  showPasswordToggle = true,
  showCharCount = false,
  maxLength,
  value = '',
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const inputId = name || generatedId;
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasError = !!error;
  const hasSuccess = !!success;
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={inputId}
            className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {showCharCount && maxLength && (
            <span className={cn(
              'text-[10px] transition-colors',
              charCount > maxLength * 0.9 ? 'text-red-500' : 'text-neutral-400'
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      
      {/* Input Container */}
      <motion.div 
        className={cn(
          'relative rounded-xl transition-all duration-200',
          isFocused && 'ring-2 ring-offset-0',
          hasError 
            ? 'ring-2 ring-red-400 dark:ring-red-500' 
            : hasSuccess 
              ? 'ring-2 ring-emerald-400 dark:ring-emerald-500'
              : isFocused 
                ? 'ring-primary-500/30'
                : 'ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-neutral-300 dark:hover:ring-neutral-600'
        )}
      >
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={cn(
              'h-4 w-4 transition-colors duration-200',
              isFocused ? 'text-primary-500' : 'text-neutral-400',
              hasError && 'text-red-400'
            )} />
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          name={name}
          id={inputId}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            'w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
            'placeholder-neutral-400 dark:placeholder-neutral-500',
            'transition-all duration-200 outline-none',
            'rounded-xl',
            Icon && 'pl-10',
            (isPassword || RightIcon || hasError || hasSuccess) && 'pr-10',
            disabled && 'opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-800/50',
            'px-4 py-2.5 text-sm',
            className
          )}
          {...props}
        />
        
        {/* Password Toggle */}
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
          </button>
        )}
        
        {/* Right Icon */}
        {RightIcon && !isPassword && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            tabIndex={-1}
          >
            <RightIcon className="h-4 w-4" />
          </button>
        )}

        {/* Error Icon */}
        {hasError && !isPassword && !RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiAlertCircle className="h-4 w-4 text-red-400" />
          </div>
        )}

        {/* Success Icon */}
        {hasSuccess && !hasError && !isPassword && !RightIcon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <FiCheck className="h-4 w-4 text-emerald-500" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="flex items-center gap-1.5 text-red-500 text-xs"
          >
            <FiAlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {hasSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs"
          >
            <FiCheck className="h-3 w-3 flex-shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Helper Text */}
      {helperText && !hasError && !hasSuccess && (
        <p className="text-xs text-neutral-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;