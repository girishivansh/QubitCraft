import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variants = {
  primary: 'btn-gradient text-white hover:shadow-card-hover',
  secondary: 'bg-white border border-gray-200 text-navy-900 hover:border-indigo-300',
  ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  href,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-[12px] transition-all duration-200 active:scale-[0.98]';
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2 flex items-center">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={combinedClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
