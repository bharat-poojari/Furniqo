// src/components/common/Accordion.jsx
import React, { useState, useRef, useEffect } from 'react';

const Accordion = ({ 
  items = [], 
  defaultOpen = null, 
  allowMultiple = false, 
  variant = 'default' 
}) => {
  // Initialize expanded state based on props
  const [expandedItems, setExpandedItems] = useState(() => {
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

  // Handle empty items array
  if (!items || items.length === 0) {
    return (
      <div className="accordion-empty">
        <p>No content available</p>
      </div>
    );
  }

  const toggleItem = (index) => {
    if (allowMultiple) {
      setExpandedItems(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    } else {
      setExpandedItems({
        [index]: !expandedItems[index]
      });
    }
  };

  const handleKeyDown = (e, index) => {
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
  };

  return (
    <div 
      className={`accordion accordion--${variant}`}
      role="region"
      aria-label="Accordion content"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isExpanded={!!expandedItems[index]}
          onToggle={() => toggleItem(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          index={index}
          variant={variant}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};

// Sub-component for individual accordion items
const AccordionItem = ({ 
  title, 
  content, 
  isExpanded, 
  onToggle, 
  onKeyDown, 
  index,
  variant,
  isLast
}) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded, content]);

  // Handle content changes
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [content, isExpanded]);

  const variantClasses = {
    default: 'accordion-item--default',
    bordered: 'accordion-item--bordered',
    minimal: 'accordion-item--minimal'
  };

  return (
    <div 
      className={`accordion-item ${variantClasses[variant]} ${!isLast ? 'accordion-item--not-last' : ''}`}
      data-accordion-item
    >
      <button
        className={`accordion-button ${isExpanded ? 'accordion-button--expanded' : ''}`}
        onClick={onToggle}
        onKeyDown={onKeyDown}
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
          height: height,
          transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        <div ref={contentRef} className="accordion-content-inner">
          {content}
        </div>
      </div>
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
    transition: all 0.2s ease;
  }

  .accordion--default .accordion-button:hover {
    background: #f3f4f6;
  }

  .accordion--default .accordion-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
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
    transition: all 0.2s ease;
  }

  .accordion--bordered .accordion-button:hover {
    background: #f9fafb;
  }

  .accordion--bordered .accordion-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
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
    transition: all 0.2s ease;
  }

  .accordion--minimal .accordion-button:hover {
    color: #111827;
  }

  .accordion--minimal .accordion-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .accordion--minimal .accordion-title {
    font-weight: 500;
  }

  /* Common styles for all variants */
  .accordion-icon {
    font-size: 1.25rem;
    font-weight: 600;
    margin-left: 1rem;
    transition: transform 0.2s ease;
  }

  .accordion-button--expanded .accordion-icon {
    transform: rotate(180deg);
  }

  .accordion-content-inner {
    padding: 1rem;
    background: #ffffff;
    color: #4b5563;
    line-height: 1.6;
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

  /* Responsive */
  @media (max-width: 640px) {
    .accordion-content-inner {
      font-size: 0.875rem;
    }
    
    .accordion-button {
      font-size: 0.875rem;
    }
  }
`;

// Export styles to be included in your main CSS or inject them
// For proper usage, you can either:
// 1. Include these styles in your main CSS file
// 2. Use CSS-in-JS solution
// 3. Import this as a CSS module

export default Accordion;