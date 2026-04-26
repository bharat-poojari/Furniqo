import { Link, useLocation } from 'react-router-dom';
import { 
  FiChevronRight, 
  FiChevronLeft, 
  FiHome, 
  FiMoreHorizontal,
  FiSlash 
} from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { useState, useEffect, useMemo } from 'react';

const Breadcrumb = ({ 
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
    
    // Generate breadcrumbs from current pathname
    const pathnames = location.pathname.split('/').filter(x => x);
    const generatedItems = pathnames.map((pathname, index) => {
      const href = '/' + pathnames.slice(0, index + 1).join('/');
      // Format label: convert kebab-case to Title Case
      let label = pathname.replace(/-/g, ' ');
      label = label.charAt(0).toUpperCase() + label.slice(1);
      return { href, label };
    });
    
    return generatedItems;
  }, [location.pathname, autoGenerate]);

  const breadcrumbItems = autoGenerate ? autoItems : (items || []);
  
  // Handle max items with collapse
  const getDisplayedItems = () => {
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
  };

  const displayedItems = getDisplayedItems();

  const sizeClasses = {
    sm: 'text-xs py-1.5',
    md: 'text-sm py-3',
    lg: 'text-base py-4',
  };

  const variantClasses = {
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
  };

  const getSeparator = () => {
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
  };

  const truncateLabel = (label) => {
    if (!truncateLength || label.length <= truncateLength) return label;
    return `${label.slice(0, truncateLength)}...`;
  };

  const currentVariant = variantClasses[variant] || variantClasses.default;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(
        'w-full',
        sizeClasses[size],
        variant === 'light' && 'bg-neutral-50 dark:bg-neutral-900/50',
        variant === 'dark' && 'bg-neutral-800 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Back Button */}
        {backButton && (
          <button
            onClick={onBack || (() => window.history.back())}
            className={cn(
              'inline-flex items-center gap-1.5 transition-colors',
              currentVariant.link,
              'hover:-translate-x-0.5 transition-transform'
            )}
            aria-label={backLabel}
          >
            <FiChevronLeft className="h-4 w-4" />
            <span className="text-sm">{backLabel}</span>
          </button>
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
            <li className="flex items-center">
              <Link
                to={homePath}
                className={cn(
                  'transition-colors flex items-center gap-1',
                  currentVariant.link,
                  'hover:scale-105 transition-transform'
                )}
                aria-label="Home"
              >
                <FiHome className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Home</span>
              </Link>
              {breadcrumbItems.length > 0 && (
                <span className="ml-1.5">{getSeparator()}</span>
              )}
            </li>
          )}

          {/* Breadcrumb Items */}
          {displayedItems.map((item, index) => {
            const isLast = index === displayedItems.length - 1;
            const isCollapsed = item.collapsed;
            
            return (
              <li key={index} className="flex items-center gap-1.5">
                {!isCollapsed ? (
                  <>
                    {item.href && !isLast ? (
                      <Link
                        to={item.href}
                        className={cn(
                          'transition-colors hover:underline decoration-dotted underline-offset-4',
                          currentVariant.link
                        )}
                      >
                        {capitalize 
                          ? truncateLabel(item.label.charAt(0).toUpperCase() + item.label.slice(1))
                          : truncateLabel(item.label)
                        }
                      </Link>
                    ) : (
                      <span 
                        className={cn(
                          currentVariant.current,
                          'cursor-default'
                        )}
                        aria-current={isLast ? 'page' : undefined}
                      >
                        {capitalize 
                          ? truncateLabel(item.label.charAt(0).toUpperCase() + item.label.slice(1))
                          : truncateLabel(item.label)
                        }
                      </span>
                    )}
                    
                    {!isLast && (
                      <span className={currentVariant.separator}>
                        {getSeparator()}
                      </span>
                    )}
                  </>
                ) : (
                  // Collapsed indicator
                  <span className={cn(
                    'flex items-center gap-1',
                    currentVariant.link
                  )}>
                    <FiMoreHorizontal className="h-4 w-4" />
                    <span className={currentVariant.separator}>
                      {getSeparator()}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* Optional: Page title for mobile */}
        {breadcrumbItems.length > 0 && (
          <div className="block sm:hidden text-sm font-medium text-neutral-900 dark:text-white">
            {breadcrumbItems[breadcrumbItems.length - 1].label}
          </div>
        )}
      </div>
    </nav>
  );
};

// Helper component for structured data (JSON-LD)
export const BreadcrumbStructuredData = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${window.location.origin}${item.href}` : undefined,
    })),
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

// Predefined breadcrumb presets
export const BreadcrumbPresets = {
  shop: [
    { label: 'Shop', href: '/shop' },
  ],
  cart: [
    { label: 'Cart', href: '/cart' },
  ],
  checkout: [
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
  ],
  account: [
    { label: 'My Account', href: '/account' },
  ],
  orders: [
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/orders' },
  ],
  wishlist: [
    { label: 'Wishlist', href: '/wishlist' },
  ],
};

export default Breadcrumb;