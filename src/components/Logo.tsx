import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="quantum-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      
      <circle cx="16" cy="16" r="5" fill="url(#quantum-gradient)" />
      
      <ellipse cx="16" cy="16" rx="14" ry="4" transform="rotate(-30 16 16)" stroke="url(#quantum-gradient)" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="14" ry="4" transform="rotate(30 16 16)" stroke="url(#quantum-gradient)" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="14" ry="4" transform="rotate(90 16 16)" stroke="url(#quantum-gradient)" strokeWidth="1.5" />
    </svg>
  );
};

export default Logo;
