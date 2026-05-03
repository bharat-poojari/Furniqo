import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';
import { cn } from '../../utils/cn';
import { memo, useMemo, useCallback } from 'react';

// Simplified animation variants - optimized for performance
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

const iconVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.15, delay: 0.08 } }
};

const titleVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.12 } }
};

const descriptionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, delay: 0.18 } }
};

const actionsVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.24 } }
};

// Memoized Icon wrapper component
const EmptyStateIcon = memo(({ Icon, variant, compact, currentVariant }) => {
  const iconSize = useMemo(() => compact ? 'w-8 h-8' : 'w-10 h-10', [compact]);
  const containerSize = useMemo(() => compact ? 'w-16 h-16' : 'w-20 h-20', [compact]);

  return (
    <motion.div
      variants={iconVariants}
      className={cn(
        `${containerSize} rounded-full flex items-center justify-center mb-6 transition-colors duration-150`,
        currentVariant.iconBg
      )}
    >
      <Icon className={cn(iconSize, currentVariant.iconColor)} />
    </motion.div>
  );
});

EmptyStateIcon.displayName = 'EmptyStateIcon';

// Memoized Image wrapper component
const EmptyStateImage = memo(({ image, imageAlt, compact }) => {
  const imageSize = useMemo(() => compact ? 'w-32 h-32' : 'w-40 h-40', [compact]);

  return (
    <motion.img
      variants={iconVariants}
      src={image}
      alt={imageAlt}
      className={`${imageSize} object-contain mb-6`}
      loading="lazy"
    />
  );
});

EmptyStateImage.displayName = 'EmptyStateImage';

// Memoized Action Buttons component
const ActionButtons = memo(({ 
  actionLabel, 
  actionHref, 
  onAction, 
  secondaryActionLabel, 
  secondaryActionHref, 
  onSecondaryAction, 
  variant, 
  compact,
  actionsVariants,
  animated
}) => {
  const buttonSize = useMemo(() => compact ? 'md' : 'lg', [compact]);
  const buttonVariant = useMemo(() => variant === 'default' ? 'primary' : variant, [variant]);

  const handlePrimaryAction = useCallback(() => {
    if (onAction) onAction();
  }, [onAction]);

  const handleSecondaryAction = useCallback(() => {
    if (onSecondaryAction) onSecondaryAction();
  }, [onSecondaryAction]);

  const ActionWrapper = animated ? motion.div : 'div';
  const wrapperProps = animated ? { variants: actionsVariants } : {};

  return (
    <ActionWrapper {...wrapperProps} className="flex flex-wrap items-center justify-center gap-3 mt-6">
      {actionLabel && (actionHref || onAction) && (
        onAction ? (
          <Button
            variant={buttonVariant}
            size={buttonSize}
            onClick={handlePrimaryAction}
          >
            {actionLabel}
          </Button>
        ) : (
          <Button
            variant={buttonVariant}
            size={buttonSize}
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
            size={buttonSize}
            onClick={handleSecondaryAction}
          >
            {secondaryActionLabel}
          </Button>
        ) : (
          <Button
            variant="outline"
            size={buttonSize}
            to={secondaryActionHref}
          >
            {secondaryActionLabel}
          </Button>
        )
      )}
    </ActionWrapper>
  );
});

ActionButtons.displayName = 'ActionButtons';

// Main EmptyState Component
const EmptyState = memo(({
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
  // Memoize size classes
  const sizeClasses = useMemo(() => ({
    sm: compact ? 'py-8' : 'py-12',
    md: compact ? 'py-12' : 'py-16',
    lg: compact ? 'py-16' : 'py-24',
  }), [compact]);

  // Memoize variant classes
  const variantClasses = useMemo(() => ({
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
  }), []);

  const currentVariant = useMemo(() => 
    variantClasses[variant] || variantClasses.default,
  [variant, variantClasses]);

  const currentSize = useMemo(() => 
    sizeClasses[size] || sizeClasses.md,
  [size, sizeClasses]);

  const containerClassName = useMemo(() => cn(
    'flex flex-col items-center justify-center text-center',
    currentSize,
    border && 'border border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl',
    className
  ), [currentSize, border, className]);

  const titleClassName = useMemo(() => cn(
    'font-semibold mb-2',
    currentVariant.titleColor,
    compact ? 'text-lg' : 'text-xl',
    size === 'lg' && !compact ? 'text-2xl' : ''
  ), [currentVariant.titleColor, compact, size]);

  const descriptionClassName = useMemo(() => cn(
    'max-w-md',
    currentVariant.descriptionColor,
    compact ? 'text-sm' : 'text-base'
  ), [currentVariant.descriptionColor, compact]);

  const Container = animated ? motion.div : 'div';
  const containerAnimationProps = animated ? {
    initial: 'hidden',
    animate: 'visible',
    variants: containerVariants
  } : {};

  const TitleWrapper = animated ? motion.h3 : 'h3';
  const titleAnimationProps = animated ? { variants: titleVariants } : {};

  const DescriptionWrapper = animated ? motion.p : 'p';
  const descriptionAnimationProps = animated ? { variants: descriptionVariants } : {};

  return (
    <Container
      {...containerAnimationProps}
      className={containerClassName}
    >
      {image ? (
        <EmptyStateImage image={image} imageAlt={imageAlt} compact={compact} />
      ) : Icon ? (
        <EmptyStateIcon Icon={Icon} variant={variant} compact={compact} currentVariant={currentVariant} />
      ) : null}
      
      {title && (
        <TitleWrapper
          {...titleAnimationProps}
          className={titleClassName}
        >
          {title}
        </TitleWrapper>
      )}
      
      {description && (
        <DescriptionWrapper
          {...descriptionAnimationProps}
          className={descriptionClassName}
        >
          {description}
        </DescriptionWrapper>
      )}
      
      {(actionLabel || secondaryActionLabel) && (
        <ActionButtons
          actionLabel={actionLabel}
          actionHref={actionHref}
          onAction={onAction}
          secondaryActionLabel={secondaryActionLabel}
          secondaryActionHref={secondaryActionHref}
          onSecondaryAction={onSecondaryAction}
          variant={variant}
          compact={compact}
          actionsVariants={actionsVariants}
          animated={animated}
        />
      )}
    </Container>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;