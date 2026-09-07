import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-slate-500 font-medium">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-slate-400 flex-shrink-0" />
            )}
            {isLast || !item.href ? (
              <span className="text-slate-800">{item.label}</span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
