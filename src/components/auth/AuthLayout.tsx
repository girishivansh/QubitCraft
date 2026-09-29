import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import { useTheme } from '../../context/ThemeContext';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#070813] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/70 dark:from-[#0d0e24] dark:via-[#070813] dark:to-[#11132d] border-r border-gray-100 dark:border-slate-800/80 flex-col items-center justify-center p-8 xl:p-10 relative overflow-hidden transition-colors duration-200">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center z-10">
          <Link to="/" className="flex flex-col items-center group">
            <Logo size={42} />
            <span className="text-lg font-bold text-navy-900 dark:text-white mt-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              QubitCraft
            </span>
          </Link>
        </div>

        <h1 className="text-2xl xl:text-3xl font-bold text-navy-900 dark:text-white text-center mt-5 z-10 leading-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 max-w-sm z-10 leading-relaxed">
          {subtitle}
        </p>
        
        {/* Subtle quantum visual */}
        <div className="mt-8 opacity-40 dark:opacity-60 z-10 relative">
          <svg width="170" height="170" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
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
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 dark:from-indigo-950/40 to-transparent pointer-events-none rounded-full blur-xl animate-pulse" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:px-8 lg:py-5 relative min-h-screen lg:h-screen lg:overflow-y-auto">
        {/* Top bar with back to home & theme toggle */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between pb-2 sm:pb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Center content */}
        <div className="w-full max-w-md mx-auto my-auto py-1">
          {/* Mobile Header */}
          <div className="flex flex-col items-center lg:hidden mb-4">
            <Link to="/" className="flex flex-col items-center">
              <Logo size={36} />
              <span className="text-base font-bold text-navy-900 dark:text-white mt-1">QubitCraft</span>
            </Link>
          </div>
          {children}
        </div>

        {/* Bottom subtle copyright / branding note */}
        <div className="w-full max-w-md mx-auto pt-2 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            &copy; 2026 QubitCraft. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
