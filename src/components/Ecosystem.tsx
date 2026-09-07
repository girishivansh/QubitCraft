import { GraduationCap, Code2, Laptop, Search, Braces } from 'lucide-react';
import { ECOSYSTEM_LABELS } from '../lib/constants';

export function Ecosystem() {
  const getIcon = (label: string) => {
    switch (label) {
      case 'Quantum Education':
        return <GraduationCap className="w-5 h-5" />;
      case 'Open Quantum Software':
        return <Code2 className="w-5 h-5" />;
      case 'Simulation':
        return <Laptop className="w-5 h-5" />;
      case 'Research':
        return <Search className="w-5 h-5" />;
      case 'Algorithm Practice':
      default:
        return <Braces className="w-5 h-5" />;
    }
  };

  return (
    <section className="scroll-trigger max-w-container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 border-t border-gray-100 mt-12">
      <h2 className="text-xl md:text-2xl font-bold text-navy-900 text-center mb-10 stagger-child">
        Built for the Quantum Learning Ecosystem
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {ECOSYSTEM_LABELS.map((label, idx) => (
          <div key={idx} className="flex items-center gap-3 stagger-child">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-600">
              {getIcon(label)}
            </div>
            <span className="text-sm font-medium text-slate-600">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
