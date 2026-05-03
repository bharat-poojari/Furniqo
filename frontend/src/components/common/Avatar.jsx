// src/components/common/Avatar.jsx
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';

const Avatar = memo(({
  src = null,
  name = '',
  size = 'md',
  status = null,
  onClick,
  className = '',
  alt = '',
  ...restProps
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  // Reset loading state when src changes
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setImageError(false);
      setImageLoaded(false);
    } else {
      setIsLoading(false);
      setImageLoaded(false);
    }
  }, [src]);

  // Memoized initials calculation
  const getInitials = useCallback(() => {
    if (!name || name.trim() === '') {
      return '?';
    }

    const cleanName = name.trim().replace(/\s+/g, ' ');
    const nameParts = cleanName.split(' ');
    
    if (nameParts.length === 1) {
      const firstChar = nameParts[0].charAt(0).toUpperCase();
      const secondChar = nameParts[0].length > 1 ? nameParts[0].charAt(1).toUpperCase() : '';
      return secondChar ? `${firstChar}${secondChar}` : firstChar;
    }
    
    const firstName = nameParts[0].charAt(0).toUpperCase();
    const lastName = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstName}${lastName}`;
  }, [name]);

  // Memoized background color generation
  const getBackgroundColor = useCallback(() => {
    if (src && !imageError) return 'transparent';
    
    const colors = [
      '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA',
      '#F472B6', '#2DD4BF', '#FB923C', '#818CF8', '#C084FC',
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }, [name, src, imageError]);

  // Memoized size mappings
  const sizeMap = useMemo(() => ({
    xs: {
      container: 'w-6 h-6',
      text: 'text-xs',
      status: 'w-1.5 h-1.5',
      iconSize: 12,
    },
    sm: {
      container: 'w-8 h-8',
      text: 'text-sm',
      status: 'w-2 h-2',
      iconSize: 16,
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-base',
      status: 'w-2.5 h-2.5',
      iconSize: 20,
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-lg',
      status: 'w-3 h-3',
      iconSize: 24,
    },
    xl: {
      container: 'w-16 h-16',
      text: 'text-xl',
      status: 'w-3.5 h-3.5',
      iconSize: 32,
    },
  }), []);

  // Memoized status styles
  const statusStyles = useMemo(() => ({
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  }), []);

  // Optimized event handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
    setImageLoaded(false);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  }, [onClick]);

  // Memoized container classes
  const containerClasses = useMemo(() => `
    relative inline-flex
    ${sizeMap[size].container}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim(), [size, onClick, className, sizeMap]);

  // Memoized avatar classes
  const avatarClasses = useMemo(() => `
    flex items-center justify-center
    w-full h-full
    rounded-full
    overflow-hidden
    ${!src || imageError ? 'bg-gradient-to-br from-gray-100 to-gray-200' : ''}
    ${onClick ? 'hover:opacity-80 transition-opacity' : ''}
    ${!src || imageError ? 'shadow-inner' : ''}
  `.trim(), [src, imageError, onClick]);

  // Memoized initials
  const initials = useMemo(() => getInitials(), [getInitials]);
  
  // Memoized background color
  const backgroundColor = useMemo(() => getBackgroundColor(), [getBackgroundColor]);

  // Optimized avatar content rendering
  const getAvatarContent = useCallback(() => {
    // Loading skeleton
    if (isLoading && src && !imageError) {
      return (
        <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
      );
    }

    // Show image if available and no error
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`w-full h-full object-cover rounded-full transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      );
    }

    // Show initials as fallback
    return (
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-medium"
        style={{
          backgroundColor,
          color: '#ffffff',
          textShadow: '0 1px 1px rgba(0,0,0,0.1)',
        }}
      >
        <span className={`${sizeMap[size].text} font-semibold`}>
          {initials}
        </span>
      </div>
    );
  }, [isLoading, src, imageError, imageLoaded, alt, name, sizeMap, size, initials, backgroundColor, handleImageLoad, handleImageError]);

  return (
    <div 
      className={containerClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={handleKeyPress}
      {...restProps}
    >
      <div className={avatarClasses}>
        {getAvatarContent()}
      </div>
      
      {/* Status indicator */}
      {status && statusStyles[status] && (
        <span 
          className={`
            absolute bottom-0 right-0
            block rounded-full ring-2 ring-white
            ${sizeMap[size].status}
            ${statusStyles[status]}
            ${status === 'away' ? 'animate-pulse' : ''}
          `}
          aria-label={`Status: ${status}`}
          title={`Status: ${status}`}
        />
      )}

      {/* Loading overlay for image load */}
      {isLoading && src && !imageError && (
        <div className="absolute inset-0 rounded-full bg-gray-100 animate-pulse" />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

// AvatarGroup component - Optimized with memo
export const AvatarGroup = memo(({ 
  users = [], 
  max = 5, 
  size = 'md', 
  status = false,
  onUserClick,
  className = '',
  ...restProps 
}) => {
  const visibleUsers = useMemo(() => users.slice(0, max), [users, max]);
  const remainingCount = users.length - max;

  if (!users || users.length === 0) return null;

  return (
    <div className={`flex -space-x-2 ${className}`} {...restProps}>
      {visibleUsers.map((user, index) => (
        <div
          key={user.id || index}
          className="transform transition-transform duration-200 hover:translate-y-[-2px] hover:z-10"
          style={{ zIndex: users.length - index }}
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            size={size}
            status={status && user.status ? user.status : null}
            onClick={() => onUserClick && onUserClick(user)}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="relative">
          <div className={`
            flex items-center justify-center rounded-full
            bg-gray-200 text-gray-600 font-medium
            hover:bg-gray-300 transition-colors duration-150
            ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
            ${size === 'sm' ? 'w-8 h-8 text-sm' : ''}
            ${size === 'md' ? 'w-10 h-10 text-base' : ''}
            ${size === 'lg' ? 'w-12 h-12 text-lg' : ''}
            ${size === 'xl' ? 'w-16 h-16 text-xl' : ''}
          `}>
            <span>+{remainingCount}</span>
          </div>
        </div>
      )}
    </div>
  );
});

AvatarGroup.displayName = 'AvatarGroup';

// CSS styles (optimized version)
const styles = `
  /* Pulse animation - Optimized */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Status indicator animations */
  .avatar__status--away {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Optimized transitions */
  .avatar__image {
    transition: opacity 0.2s ease;
    will-change: opacity;
  }

  /* Group hover effects */
  .avatar-group .avatar:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .animate-pulse,
    .avatar__status--away {
      animation: none;
    }
    
    .avatar-group .avatar:hover {
      transform: none;
    }
    
    .avatar__image {
      transition: none;
    }
  }
`;

export default Avatar;