import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const Breadcrumb = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('py-3', className)}>
      <ol className="flex items-center flex-wrap gap-1.5 text-sm">
        <li>
          <Link
            to="/"
            className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
          >
            <FiHome className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <FiChevronRight className="h-4 w-4 text-neutral-400" />
            {item.href ? (
              <Link
                to={item.href}
                className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;