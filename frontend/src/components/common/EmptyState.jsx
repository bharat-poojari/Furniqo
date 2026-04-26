import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';
import { cn } from '../../utils/cn';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className,
  size = 'md',
  variant = 'default',
  image,
  imageAlt = 'Empty state illustration',
  animated = true,
  border = false,
  compact = false,
}) => {
  const sizeClasses = {
    sm: compact ? 'py-8' : 'py-12',
    md: compact ? 'py-12' : 'py-16',
    lg: compact ? 'py-16' : 'py-24',
  };

  const variantClasses = {
    default: {
      iconBg: 'bg-neutral-100 dark:bg-neutral-800',
      iconColor: 'text-neutral-400 dark:text-neutral-500',
      titleColor: 'text-neutral-900 dark:text-white',
      descriptionColor: 'text-neutral-500 dark:text-neutral-400',
    },
    primary: {
      iconBg: 'bg-primary-50 dark:bg-primary-950/30',
      iconColor: 'text-primary-500 dark:text-primary-400',
      titleColor: 'text-primary-900 dark:text-primary-100',
      descriptionColor: 'text-primary-600 dark:text-primary-300/80',
    },
    warning: {
      iconBg: 'bg-amber-50 dark:bg-amber-950/30',
      iconColor: 'text-amber-500 dark:text-amber-400',
      titleColor: 'text-amber-900 dark:text-amber-100',
      descriptionColor: 'text-amber-600 dark:text-amber-300/80',
    },
    error: {
      iconBg: 'bg-red-50 dark:bg-red-950/30',
      iconColor: 'text-red-500 dark:text-red-400',
      titleColor: 'text-red-900 dark:text-red-100',
      descriptionColor: 'text-red-600 dark:text-red-300/80',
    },
    success: {
      iconBg: 'bg-green-50 dark:bg-green-950/30',
      iconColor: 'text-green-500 dark:text-green-400',
      titleColor: 'text-green-900 dark:text-green-100',
      descriptionColor: 'text-green-600 dark:text-green-300/80',
    },
  };

  const containerVariants = animated
    ? {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }
    : {};

  const iconVariants = animated
    ? {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
      }
    : {};

  const titleVariants = animated
    ? {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
      }
    : {};

  const descriptionVariants = animated
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4, delay: 0.3 } },
      }
    : {};

  const actionsVariants = animated
    ? {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.4 } },
      }
    : {};

  const currentVariant = variantClasses[variant] || variantClasses.default;

  return (
    <motion.div
      initial={animated ? 'hidden' : false}
      animate={animated ? 'visible' : false}
      variants={containerVariants}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size],
        border && 'border border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl',
        className
      )}
    >
      {image ? (
        <motion.img
          variants={iconVariants}
          src={image}
          alt={imageAlt}
          className="w-40 h-40 object-contain mb-6"
        />
      ) : Icon ? (
        <motion.div
          variants={iconVariants}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all',
            currentVariant.iconBg,
            compact ? 'w-16 h-16' : ''
          )}
        >
          <Icon className={cn(
            'w-10 h-10',
            currentVariant.iconColor,
            compact ? 'w-8 h-8' : ''
          )} />
        </motion.div>
      ) : null}
      
      {title && (
        <motion.h3
          variants={titleVariants}
          className={cn(
            'font-semibold mb-2',
            currentVariant.titleColor,
            compact ? 'text-lg' : 'text-xl',
            size === 'lg' && !compact ? 'text-2xl' : ''
          )}
        >
          {title}
        </motion.h3>
      )}
      
      {description && (
        <motion.p
          variants={descriptionVariants}
          className={cn(
            'max-w-md',
            currentVariant.descriptionColor,
            compact ? 'text-sm' : 'text-base'
          )}
        >
          {description}
        </motion.p>
      )}
      
      {(actionLabel || secondaryActionLabel) && (
        <motion.div
          variants={actionsVariants}
          className="flex flex-wrap items-center justify-center gap-3 mt-6"
        >
          {actionLabel && (actionHref || onAction) && (
            onAction ? (
              <Button
                variant={variant === 'default' ? 'primary' : variant}
                size={compact ? 'md' : 'lg'}
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            ) : (
              <Button
                variant={variant === 'default' ? 'primary' : variant}
                size={compact ? 'md' : 'lg'}
                to={actionHref}
              >
                {actionLabel}
              </Button>
            )
          )}
          
          {secondaryActionLabel && (secondaryActionHref || onSecondaryAction) && (
            onSecondaryAction ? (
              <Button
                variant="outline"
                size={compact ? 'md' : 'lg'}
                onClick={onSecondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            ) : (
              <Button
                variant="outline"
                size={compact ? 'md' : 'lg'}
                to={secondaryActionHref}
              >
                {secondaryActionLabel}
              </Button>
            )
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;