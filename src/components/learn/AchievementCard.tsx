import React from 'react';
import { Lock, Award } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  isEarned: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  isEarned,
}) => {
  return (
    <div className={`relative flex items-start gap-4 p-4 rounded-[16px] border-2 transition-all duration-300 ${
      isEarned 
        ? 'bg-indigo-50 border-indigo-200 opacity-100' 
        : 'bg-gray-50 border-gray-100 opacity-50 grayscale-[0.5]'
    }`}>
      {!isEarned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center border-2 border-white z-10 shadow-sm">
          <Lock className="w-3 h-3" />
        </div>
      )}
      
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${
        isEarned ? 'bg-white shadow-indigo-100' : 'bg-slate-200/50'
      }`}>
        {icon || <Award className={`w-6 h-6 ${isEarned ? 'text-indigo-500' : 'text-slate-400'}`} />}
      </div>
      
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className={`text-sm font-bold truncate mb-1 ${
          isEarned ? 'text-indigo-900' : 'text-slate-600'
        }`}>
          {title}
        </h4>
        <p className={`text-xs leading-relaxed line-clamp-2 ${
          isEarned ? 'text-indigo-600/80' : 'text-slate-500'
        }`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;
