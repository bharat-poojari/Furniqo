import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  helperText,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  required = false,
  disabled = false,
  className,
  containerClassName,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-neutral-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          name={name}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
            'placeholder-neutral-400 dark:placeholder-neutral-500',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            Icon && 'pl-10',
            (isPassword || RightIcon) && 'pr-10',
            error
              ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
              : 'border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500',
            disabled && 'opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-900',
            'px-4 py-2.5 text-sm',
            className
          )}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        )}
        
        {RightIcon && !isPassword && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            tabIndex={-1}
          >
            <RightIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-1.5 text-red-500 text-sm">
          <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;