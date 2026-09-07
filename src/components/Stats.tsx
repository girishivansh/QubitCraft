import React from 'react';
import { Users, Monitor, Zap, Star, MessageCircle } from 'lucide-react';
import { stats } from '../data/stats';

const iconMap: Record<string, any> = {
  Users,
  Monitor,
  Zap,
  Star,
  MessageCircle,
};

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-amber-50 text-amber-600',
  pink: 'bg-rose-50 text-rose-600',
};

export const Stats: React.FC = () => {
  return (
    <section className="scroll-trigger max-w-container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-12 stagger-child">
        Why Learn with QubitCraft?
      </h2>
      
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon];
          const badgeColor = colorMap[stat.color as string] || colorMap['indigo'];
          
          return (
            <div key={index} className="flex flex-col items-center text-center stagger-child">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${badgeColor}`}>
                {Icon && <Icon className="w-6 h-6" />}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-navy-900">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
