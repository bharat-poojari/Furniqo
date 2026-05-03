import { Link, useLocation } from 'react-router-dom';
import { 
  FiChevronRight, 
  FiChevronLeft, 
  FiHome, 
  FiMoreHorizontal,
  FiSlash 
} from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { useState, useEffect, useMemo, memo, useCallback } from 'react';

// Memoized Separator component
const Separator = memo(({ separator, CustomSeparator, variantClasses }) => {
  const getSeparator = useCallback(() => {
    if (CustomSeparator) return <CustomSeparator className="h-4 w-4" />;
    
    switch (separator) {
      case 'chevron':
        return <FiChevronRight className="h-4 w-4" />;
      case 'arrow':
        return <span className="text-neutral-400 dark:text-neutral-500">→</span>;
      case 'slash':
        return <FiSlash className="h-4 w-4" />;
      case 'dot':
        return <span className="text-neutral-400 dark:text-neutral-500">•</span>;
      case 'dash':
        return <span className="text-neutral-400 dark:text-neutral-500">-</span>;
      default:
        return <FiChevronRight className="h-4 w-4" />;
    }
  }, [separator, CustomSeparator]);

  return (
    <span className={variantClasses.separator}>
      {getSeparator()}
    </span>
  );
});

Separator.displayName = 'Separator';

// Memoized Breadcrumb Item component
const BreadcrumbItem = memo(({ 
  item, 
  index, 
  isLast, 
  isCollapsed,
  currentVariant,
  separator,
  CustomSeparator,
  capitalize,
  truncateLength,
  showHome,
  hasHome
}) => {
  const truncateLabel = useCallback((label) => {
    if (!truncateLength || label.length <= truncateLength) return label;
    return `${label.slice(0, truncateLength)}...`;
  }, [truncateLength]);

  const displayLabel = useMemo(() => {
    let label = item.label;
    if (capitalize) {
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }
    return truncateLabel(label);
  }, [item.label, capitalize, truncateLabel]);

  if (isCollapsed) {
    return (
      <li className="flex items-center gap-1.5">
        <span className={cn('flex items-center gap-1', currentVariant.link)}>
          <FiMoreHorizontal className="h-4 w-4" />
          <Separator 
            separator={separator}
            CustomSeparator={CustomSeparator}
            variantClasses={currentVariant}
          />
        </span>
      </li>
    );
  }

  // Don't show separator for first item if home is shown
  const showSeparator = !(index === 0 && showHome && hasHome);

  return (
    <li className="flex items-center gap-1.5">
      {item.href && !isLast ? (
        <Link
          to={item.href}
          className={cn(
            'transition-colors duration-150 hover:underline decoration-dotted underline-offset-4',
            currentVariant.link
          )}
        >
          {displayLabel}
        </Link>
      ) : (
        <span 
          className={cn(currentVariant.current, 'cursor-default')}
          aria-current={isLast ? 'page' : undefined}
        >
          {displayLabel}
        </span>
      )}
      
      {!isLast && showSeparator && (
        <Separator 
          separator={separator}
          CustomSeparator={CustomSeparator}
          variantClasses={currentVariant}
        />
      )}
    </li>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

// Memoized Home Link component
const HomeLink = memo(({ homePath, currentVariant, showLabel = true }) => (
  <li className="flex items-center">
    <Link
      to={homePath}
      className={cn(
        'transition-colors duration-150 flex items-center gap-1',
        currentVariant.link,
        'hover:scale-105 transition-transform'
      )}
      aria-label="Home"
    >
      <FiHome className="h-4 w-4" />
      {showLabel && <span className="hidden sm:inline text-sm">Home</span>}
    </Link>
  </li>
));

HomeLink.displayName = 'HomeLink';

// Memoized Back Button component
const BackButton = memo(({ onBack, backLabel, currentVariant }) => {
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  }, [onBack]);

  return (
    <button
      onClick={handleBack}
      className={cn(
        'inline-flex items-center gap-1.5 transition-all duration-150',
        currentVariant.link,
        'hover:-translate-x-0.5'
      )}
      aria-label={backLabel}
    >
      <FiChevronLeft className="h-4 w-4" />
      <span className="text-sm">{backLabel}</span>
    </button>
  );
});

BackButton.displayName = 'BackButton';

// Main Breadcrumb Component
const Breadcrumb = memo(({ 
  items, 
  className,
  separator = 'chevron',
  separatorIcon: CustomSeparator,
  showHome = true,
  homePath = '/',
  maxItems = 0,
  collapsedLabel = '...',
  variant = 'default',
  size = 'md',
  backButton = false,
  onBack,
  backLabel = 'Back',
  autoGenerate = false,
  capitalize = false,
  truncateLength = 20,
}) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from current route if enabled
  const autoItems = useMemo(() => {
    if (!autoGenerate) return [];
    
    const pathnames = location.pathname.split('/').filter(x => x);
    return pathnames.map((pathname, index) => {
      const href = '/' + pathnames.slice(0, index + 1).join('/');
      let label = pathname.replace(/-/g, ' ');
      label = label.charAt(0).toUpperCase() + label.slice(1);
      return { href, label };
    });
  }, [location.pathname, autoGenerate]);

  const breadcrumbItems = useMemo(() => 
    autoGenerate ? autoItems : (items || []),
  [autoGenerate, autoItems, items]);

  // Handle max items with collapse
  const displayedItems = useMemo(() => {
    if (!maxItems || breadcrumbItems.length <= maxItems) {
      return breadcrumbItems;
    }
    
    const startItems = breadcrumbItems.slice(0, Math.floor(maxItems / 2));
    const endItems = breadcrumbItems.slice(-Math.floor(maxItems / 2));
    
    return [
      ...startItems,
      { label: collapsedLabel, href: null, collapsed: true },
      ...endItems,
    ];
  }, [breadcrumbItems, maxItems, collapsedLabel]);

  const sizeClasses = useMemo(() => ({
    sm: 'text-xs py-1.5',
    md: 'text-sm py-3',
    lg: 'text-base py-4',
  }), []);

  const variantClasses = useMemo(() => ({
    default: {
      link: 'text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400',
      current: 'text-neutral-900 dark:text-white font-medium',
      separator: 'text-neutral-400',
    },
    light: {
      link: 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300',
      current: 'text-neutral-700 dark:text-neutral-200',
      separator: 'text-neutral-500',
    },
    primary: {
      link: 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300',
      current: 'text-primary-800 dark:text-primary-200 font-semibold',
      separator: 'text-primary-400',
    },
    dark: {
      link: 'text-neutral-300 hover:text-white dark:text-neutral-400 dark:hover:text-neutral-200',
      current: 'text-white dark:text-neutral-100 font-medium',
      separator: 'text-neutral-500',
    },
  }), []);

  const currentVariant = useMemo(() => 
    variantClasses[variant] || variantClasses.default,
  [variant, variantClasses]);

  const currentSize = useMemo(() => 
    sizeClasses[size] || sizeClasses.md,
  [size, sizeClasses]);

  const lastItem = useMemo(() => 
    breadcrumbItems.length > 0 ? breadcrumbItems[breadcrumbItems.length - 1] : null,
  [breadcrumbItems]);

  const hasHome = useMemo(() => breadcrumbItems.length > 0, [breadcrumbItems.length]);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(
        'w-full',
        currentSize,
        variant === 'light' && 'bg-neutral-50 dark:bg-neutral-900/50',
        variant === 'dark' && 'bg-neutral-800 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Back Button */}
        {backButton && (
          <BackButton
            onBack={onBack}
            backLabel={backLabel}
            currentVariant={currentVariant}
          />
        )}

        {/* Breadcrumb Items */}
        <ol 
          className={cn(
            'flex items-center flex-wrap gap-1.5',
            backButton ? 'ml-auto' : ''
          )}
        >
          {/* Home Link */}
          {showHome && (
            <>
              <HomeLink
                homePath={homePath}
                currentVariant={currentVariant}
                showLabel={true}
              />
              {hasHome && (
                <Separator 
                  separator={separator}
                  CustomSeparator={CustomSeparator}
                  variantClasses={currentVariant}
                />
              )}
            </>
          )}

          {/* Breadcrumb Items */}
          {displayedItems.map((item, index) => {
            const isLast = index === displayedItems.length - 1;
            const isCollapsed = item.collapsed;
            
            return (
              <BreadcrumbItem
                key={index}
                item={item}
                index={index}
                isLast={isLast}
                isCollapsed={isCollapsed}
                currentVariant={currentVariant}
                separator={separator}
                CustomSeparator={CustomSeparator}
                capitalize={capitalize}
                truncateLength={truncateLength}
                showHome={showHome}
                hasHome={hasHome}
              />
            );
          })}
        </ol>

        {/* Optional: Page title for mobile */}
        {lastItem && (
          <div className="block sm:hidden text-sm font-medium text-neutral-900 dark:text-white">
            {lastItem.label}
          </div>
        )}
      </div>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

// Helper component for structured data (JSON-LD)
export const BreadcrumbStructuredData = memo(({ items }) => {
  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${window.location.origin}${item.href}` : undefined,
    })),
  }), [items]);

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
});

BreadcrumbStructuredData.displayName = 'BreadcrumbStructuredData';

export const BreadcrumbPresets = {
  shop: [{ label: 'Shop', href: '/shop' }],
  cart: [{ label: 'Cart', href: '/cart' }],
  checkout: [
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
  ],
  account: [{ label: 'My Account', href: '/account' }],
  orders: [
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/orders' },
  ],
  wishlist: [{ label: 'Wishlist', href: '/wishlist' }],
};

export default Breadcrumb;