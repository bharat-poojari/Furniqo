// src/components/common/Avatar.jsx
import React, { useState, useEffect } from 'react';

const Avatar = ({
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

  // Generate initials from name
  const getInitials = () => {
    if (!name || name.trim() === '') {
      return '?';
    }

    // Handle special characters and multiple spaces
    const cleanName = name.trim().replace(/\s+/g, ' ');
    const nameParts = cleanName.split(' ');
    
    if (nameParts.length === 1) {
      // Single name - take first two characters or first character
      const firstChar = nameParts[0].charAt(0).toUpperCase();
      const secondChar = nameParts[0].length > 1 ? nameParts[0].charAt(1).toUpperCase() : '';
      return secondChar ? `${firstChar}${secondChar}` : firstChar;
    }
    
    // Multiple names - take first character of first and last name
    const firstName = nameParts[0].charAt(0).toUpperCase();
    const lastName = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstName}${lastName}`;
  };

  // Generate background color based on name (consistent for same name)
  const getBackgroundColor = () => {
    if (src && !imageError) return 'transparent';
    
    const colors = [
      '#F87171', // red
      '#FBBF24', // amber
      '#34D399', // emerald
      '#60A5FA', // blue
      '#A78BFA', // violet
      '#F472B6', // pink
      '#2DD4BF', // teal
      '#FB923C', // orange
      '#818CF8', // indigo
      '#C084FC', // purple
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Size mappings
  const sizeMap = {
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
  };

  // Status indicator styles
  const statusStyles = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    setImageLoaded(false);
  };

  const containerClasses = `
    relative inline-flex
    ${sizeMap[size].container}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const avatarClasses = `
    flex items-center justify-center
    w-full h-full
    rounded-full
    overflow-hidden
    ${!src || imageError ? 'bg-gradient-to-br from-gray-100 to-gray-200' : ''}
    ${onClick ? 'hover:opacity-80 transition-opacity' : ''}
    ${!src || imageError ? 'shadow-inner' : ''}
  `;

  const getAvatarContent = () => {
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
          className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${
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
        className="w-full h-full rounded-full flex items-center justify-center font-medium transition-all duration-300"
        style={{
          backgroundColor: getBackgroundColor(),
          color: '#ffffff',
          textShadow: '0 1px 1px rgba(0,0,0,0.1)',
        }}
      >
        <span className={`${sizeMap[size].text} font-semibold`}>
          {getInitials()}
        </span>
      </div>
    );
  };

  return (
    <div 
      className={containerClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(e);
        }
      } : undefined}
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
};

// AvatarGroup component for displaying multiple avatars together
export const AvatarGroup = ({ 
  users = [], 
  max = 5, 
  size = 'md', 
  status = false,
  onUserClick,
  className = '',
  ...restProps 
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  if (!users || users.length === 0) return null;

  return (
    <div className={`flex -space-x-2 ${className}`} {...restProps}>
      {visibleUsers.map((user, index) => (
        <div
          key={user.id || index}
          className="transform transition-transform hover:translate-y-[-2px] hover:z-10"
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
            hover:bg-gray-300 transition-colors
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
};

// CSS styles (alternative to Tailwind if not using Tailwind CSS)
const styles = `
  /* Alternative CSS styles if not using Tailwind */
  .avatar {
    position: relative;
    display: inline-flex;
    border-radius: 9999px;
    overflow: hidden;
  }

  .avatar--clickable {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .avatar--clickable:hover {
    opacity: 0.8;
  }

  .avatar__container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    overflow: hidden;
  }

  .avatar__container--fallback {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 9999px;
    transition: opacity 0.3s ease;
  }

  .avatar__initials {
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }

  .avatar__status {
    position: absolute;
    bottom: 0;
    right: 0;
    display: block;
    border-radius: 9999px;
    background-color: white;
    box-shadow: 0 0 0 2px white;
  }

  .avatar__status--online {
    background-color: #10b981;
  }

  .avatar__status--offline {
    background-color: #9ca3af;
  }

  .avatar__status--away {
    background-color: #f59e0b;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .avatar__loading {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background-color: #f3f4f6;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Size variations */
  .avatar--xs {
    width: 1.5rem;
    height: 1.5rem;
  }

  .avatar--sm {
    width: 2rem;
    height: 2rem;
  }

  .avatar--md {
    width: 2.5rem;
    height: 2.5rem;
  }

  .avatar--lg {
    width: 3rem;
    height: 3rem;
  }

  .avatar--xl {
    width: 4rem;
    height: 4rem;
  }

  /* Group styles */
  .avatar-group {
    display: flex;
  }

  .avatar-group > * {
    margin-left: -0.5rem;
  }

  .avatar-group > *:first-child {
    margin-left: 0;
  }

  .avatar-group .avatar:hover {
    transform: translateY(-2px);
    z-index: 10;
  }

  .avatar-group__count {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e5e7eb;
    color: #4b5563;
    font-weight: 500;
    border-radius: 9999px;
  }
`;

export default Avatar;