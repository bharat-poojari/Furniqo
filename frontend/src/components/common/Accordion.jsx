// src/components/common/Accordion.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';

// Optimized AccordionItem component with memo
const AccordionItem = memo(({ 
  title, 
  content, 
  isExpanded, 
  onToggle, 
  index,
  variant,
  isLast,
  onKeyDown
}) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Optimized height calculation with RAF
  useEffect(() => {
    let rafId;
    const updateHeight = () => {
      if (contentRef.current) {
        const scrollHeight = contentRef.current.scrollHeight;
        setHeight(isExpanded ? scrollHeight : 0);
        if (isExpanded) {
          rafId = requestAnimationFrame(() => {
            setTimeout(() => setIsAnimating(false), 300);
          });
        } else {
          setIsAnimating(true);
          rafId = requestAnimationFrame(() => {
            setTimeout(() => setIsAnimating(false), 300);
          });
        }
      }
    };
    
    updateHeight();
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isExpanded, content]);

  // Handle content changes without reflow thrashing
  useEffect(() => {
    if (isExpanded && contentRef.current && !isAnimating) {
      const rafId = requestAnimationFrame(() => {
        if (contentRef.current) {
          setHeight(contentRef.current.scrollHeight);
        }
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [content, isExpanded, isAnimating]);

  const handleToggle = useCallback(() => {
    onToggle(index);
  }, [onToggle, index]);

  const handleKeyDownEvent = useCallback((e) => {
    onKeyDown(e, index);
  }, [onKeyDown, index]);

  const variantClasses = useMemo(() => ({
    default: 'accordion-item--default',
    bordered: 'accordion-item--bordered',
    minimal: 'accordion-item--minimal'
  }), []);

  const itemClassName = useMemo(() => {
    const classes = [variantClasses[variant] || variantClasses.default];
    if (!isLast) classes.push('accordion-item--not-last');
    return classes.join(' ');
  }, [variant, variantClasses, isLast]);

  const buttonClassName = useMemo(() => {
    const classes = ['accordion-button'];
    if (isExpanded) classes.push('accordion-button--expanded');
    return classes.join(' ');
  }, [isExpanded]);

  return (
    <div 
      className={itemClassName}
      data-accordion-item
    >
      <button
        className={buttonClassName}
        onClick={handleToggle}
        onKeyDown={handleKeyDownEvent}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${index}`}
        id={`accordion-button-${index}`}
        data-accordion-button={index}
      >
        <span className="accordion-title">{title}</span>
        <span className="accordion-icon" aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      
      <div
        id={`accordion-content-${index}`}
        role="region"
        aria-labelledby={`accordion-button-${index}`}
        className="accordion-content"
        style={{
          height: `${height}px`,
          transition: 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        <div ref={contentRef} className="accordion-content-inner">
          {content}
        </div>
      </div>
    </div>
  );
});

AccordionItem.displayName = 'AccordionItem';

// Main Accordion component
const Accordion = ({ 
  items = [], 
  defaultOpen = null, 
  allowMultiple = false, 
  variant = 'default' 
}) => {
  // Memoized initial expanded state
  const [expandedItems, setExpandedItems] = useState(() => {
    if (!items.length) return {};
    
    if (defaultOpen !== null && !allowMultiple) {
      return { [defaultOpen]: true };
    }
    if (defaultOpen !== null && allowMultiple) {
      const initial = {};
      const defaultArray = Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
      defaultArray.forEach(index => {
        if (items[index]) initial[index] = true;
      });
      return initial;
    }
    return {};
  });

  // Memoized toggle function
  const toggleItem = useCallback((index) => {
    setExpandedItems(prev => {
      if (allowMultiple) {
        return {
          ...prev,
          [index]: !prev[index]
        };
      } else {
        // Single mode - close others, open only this one if not already open
        const isOpen = prev[index];
        return isOpen ? {} : { [index]: true };
      }
    });
  }, [allowMultiple]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e, index) => {
    // Toggle on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(index);
    }
    
    // Keyboard navigation between items
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = index + direction;
      
      if (nextIndex >= 0 && nextIndex < items.length) {
        const nextButton = document.querySelector(`[data-accordion-button="${nextIndex}"]`);
        nextButton?.focus();
      }
    }
    
    // Home/End keys
    if (e.key === 'Home') {
      e.preventDefault();
      const firstButton = document.querySelector('[data-accordion-button="0"]');
      firstButton?.focus();
    }
    
    if (e.key === 'End') {
      e.preventDefault();
      const lastButton = document.querySelector(`[data-accordion-button="${items.length - 1}"]`);
      lastButton?.focus();
    }
  }, [items.length, toggleItem]);

  // Memoized empty state
  const emptyState = useMemo(() => (
    <div className="accordion-empty">
      <p>No content available</p>
    </div>
  ), []);

  // Handle empty items array
  if (!items || items.length === 0) {
    return emptyState;
  }

  const accordionClassName = useMemo(() => `accordion accordion--${variant}`, [variant]);

  return (
    <div 
      className={accordionClassName}
      role="region"
      aria-label="Accordion content"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isExpanded={!!expandedItems[index]}
          onToggle={toggleItem}
          onKeyDown={handleKeyDown}
          index={index}
          variant={variant}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};

// CSS styles to be included with the component
const styles = `
  /* Base Accordion Styles */
  .accordion {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }

  /* Variant: Default */
  .accordion--default .accordion-item--default {
    margin-bottom: 0;
  }

  .accordion--default .accordion-button {
    width: 100%;
    padding: 1rem;
    background: #f9fafb;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    transition: all 0.15s ease;
  }

  .accordion--default .accordion-button:hover {
    background: #f3f4f6;
  }

  .accordion--default .accordion-button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Variant: Bordered */
  .accordion--bordered .accordion-item--bordered {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }

  .accordion--bordered .accordion-item--bordered:last-child {
    margin-bottom: 0;
  }

  .accordion--bordered .accordion-button {
    width: 100%;
    padding: 1rem 1.25rem;
    background: #ffffff;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    transition: all 0.15s ease;
  }

  .accordion--bordered .accordion-button:hover {
    background: #f9fafb;
  }

  .accordion--bordered .accordion-button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
    border-radius: 4px;
  }

  .accordion--bordered .accordion-button--expanded {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  /* Variant: Minimal */
  .accordion--minimal .accordion-item--minimal {
    border-bottom: 1px solid #f3f4f6;
  }

  .accordion--minimal .accordion-item--minimal:last-child {
    border-bottom: none;
  }

  .accordion--minimal .accordion-button {
    width: 100%;
    padding: 1rem 0.5rem;
    background: transparent;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 400;
    color: #4b5563;
    transition: all 0.15s ease;
  }

  .accordion--minimal .accordion-button:hover {
    color: #111827;
  }

  .accordion--minimal .accordion-button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .accordion--minimal .accordion-title {
    font-weight: 500;
  }

  /* Common styles for all variants */
  .accordion-icon {
    font-size: 1.25rem;
    font-weight: 600;
    margin-left: 1rem;
    transition: transform 0.15s ease;
    flex-shrink: 0;
  }

  .accordion-button--expanded .accordion-icon {
    transform: rotate(180deg);
  }

  .accordion-content-inner {
    padding: 1rem;
    background: #ffffff;
    color: #4b5563;
    line-height: 1.6;
    will-change: transform;
  }

  .accordion--bordered .accordion-content-inner {
    padding: 1rem 1.25rem;
  }

  .accordion--minimal .accordion-content-inner {
    padding: 0.5rem 0.5rem 1rem 0.5rem;
  }

  /* Empty state */
  .accordion-empty {
    padding: 2rem;
    text-align: center;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  /* Prevent layout shift during animation */
  .accordion-content {
    contain: layout;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .accordion-content-inner {
      font-size: 0.875rem;
    }
    
    .accordion-button {
      font-size: 0.875rem;
    }
    
    .accordion-button {
      padding: 0.875rem;
    }
    
    .accordion--bordered .accordion-button {
      padding: 0.875rem 1rem;
    }
    
    .accordion--minimal .accordion-button {
      padding: 0.875rem 0.5rem;
    }
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .accordion-button,
    .accordion-icon,
    .accordion-content {
      transition: none !important;
    }
    
    .accordion-button--expanded .accordion-icon {
      transform: none;
    }
  }

  /* High contrast mode support */
  @media (forced-colors: active) {
    .accordion-button {
      border: 1px solid CanvasText;
    }
    
    .accordion-button:focus-visible {
      outline: 2px solid CanvasText;
    }
  }
`;

// Export styles to be included in your main CSS or inject them
export { styles };

export default memo(Accordion);