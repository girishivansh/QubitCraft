import type { ReactNode } from 'react';
import Button from './Button';

interface PageShellProps {
  title: string;
  description: string;
  icon: ReactNode;
  comingSoon?: boolean;
}

export default function PageShell({ title, description, icon, comingSoon }: PageShellProps) {
  return (
    <div className="scroll-trigger max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="stagger-child w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h1 className="stagger-child text-3xl md:text-4xl font-bold text-navy-900 mb-4">{title}</h1>
      <p className="stagger-child text-base text-slate-500 max-w-lg mb-8">{description}</p>
      {comingSoon && (
        <div className="stagger-child mb-8 bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">
          Coming in Phase 2
        </div>
      )}
      <div className="stagger-child">
        <Button variant="primary" href="/">Go to Home</Button>
      </div>
    </div>
  );
}
