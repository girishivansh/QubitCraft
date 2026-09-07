import React from 'react';
import { BookOpen, Cpu, Bot, TrendingUp, Activity, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: 'indigo' | 'blue' | 'green' | 'orange' | 'pink';
}

const colorMap: Record<FeatureCardProps['color'], string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-amber-50 text-amber-600',
  pink: 'bg-rose-50 text-rose-600',
};

const iconMap: Record<string, any> = {
  BookOpen,
  Cpu,
  Bot,
  TrendingUp,
  Activity,
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const Icon = iconMap[icon];
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-navy-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">{description}</p>
      <div className="mt-auto">
        <ArrowRight className={`w-5 h-5 opacity-60 hover:opacity-100 transition-opacity ${colorMap[color].split(' ')[1]}`} />
      </div>
    </div>
  );
};
