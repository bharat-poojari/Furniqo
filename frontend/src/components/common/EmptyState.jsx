import { motion } from 'framer-motion';
import Button from './Button';
import { cn } from '../../utils/cn';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-24',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        sizeClasses[size],
        className
      )}
    >
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mb-6">
          {description}
        </p>
      )}
      
      {actionLabel && (actionHref || onAction) && (
        <Button
          variant="primary"
          size="lg"
          onClick={onAction}
          to={actionHref}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;