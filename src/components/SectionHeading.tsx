import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  subtitle,
  action,
  centered = false,
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 ${centered ? 'text-center md:items-center' : ''}`}>
      <div className={`flex-1 ${centered ? 'flex flex-col items-center' : ''}`}>
        {label && (
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-3">
            {label}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-slate-500 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      
      {action && (
        <div className={`mt-6 md:mt-0 ${centered ? 'mt-8' : ''}`}>
          <Link 
            to={action.href}
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            {action.label}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default SectionHeading;
