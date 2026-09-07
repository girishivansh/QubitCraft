import React from 'react';
import Logo from '../Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex-col items-center justify-center p-12 scroll-trigger is-visible">
        <div className="flex flex-col items-center stagger-child">
          <Logo size={48} />
          <span className="text-xl font-bold text-navy-900 mt-2">QubitCraft</span>
        </div>
        <h1 className="text-3xl xl:text-4xl font-bold text-navy-900 text-center mt-8 stagger-child">
          {title}
        </h1>
        <p className="text-base text-slate-500 text-center mt-3 max-w-md stagger-child">
          {subtitle}
        </p>
        
        {/* Subtle quantum visual */}
        <div className="mt-12 opacity-30 stagger-child relative">
          <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
            <g transform="translate(100 100)">
              <ellipse rx="80" ry="25" fill="none" stroke="url(#blueGrad)" strokeWidth="2" transform="rotate(0)" />
              <ellipse rx="80" ry="25" fill="none" stroke="url(#indigoGrad)" strokeWidth="2" transform="rotate(60)" />
              <ellipse rx="80" ry="25" fill="none" stroke="url(#blueGrad)" strokeWidth="2" transform="rotate(120)" />
              <circle r="12" fill="url(#indigoGrad)" className="animate-pulse" />
            </g>
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 to-transparent pointer-events-none rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="flex flex-col items-center lg:hidden mb-8">
            <Logo size={40} />
            <span className="text-lg font-bold text-navy-900 mt-2">QubitCraft</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
