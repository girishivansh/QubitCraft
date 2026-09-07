import React from 'react';
import { CircleCheck } from 'lucide-react';

interface LearningPathCardProps {
  level: string;
  color: 'green' | 'blue' | 'purple';
  description: string;
  topics: string[];
  buttonLabel: string;
  lessonCount: number;
}

const colorMap = {
  green: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-600',
    button: 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
    icon: 'text-emerald-500',
  },
  blue: {
    dot: 'bg-blue-500',
    text: 'text-blue-600',
    button: 'border-blue-200 text-blue-600 hover:bg-blue-50',
    icon: 'text-blue-500',
  },
  purple: {
    dot: 'bg-indigo-500',
    text: 'text-indigo-600',
    button: 'border-indigo-200 text-indigo-600 hover:bg-indigo-50',
    icon: 'text-indigo-500',
  },
};

const getSvg = (color: string) => {
  if (color === 'green') {
    return (
      <svg className="w-[120px] h-[120px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
        <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(45 50 50)" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(-45 50 50)" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
      </svg>
    );
  } else if (color === 'blue') {
    return (
      <svg className="w-[120px] h-[120px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="5" fill="currentColor" />
        <circle cx="70" cy="30" r="5" fill="currentColor" />
        <circle cx="50" cy="70" r="5" fill="currentColor" />
        <path d="M30 30L70 30L50 70Z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  } else {
    return (
      <svg className="w-[120px] h-[120px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M50 10C72 10 90 28 90 50" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="8" fill="currentColor" />
        <circle cx="20" cy="50" r="4" fill="currentColor" />
        <circle cx="80" cy="50" r="4" fill="currentColor" />
      </svg>
    );
  }
};

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  level,
  color,
  description,
  topics,
  buttonLabel,
  lessonCount,
}) => {
  const styles = colorMap[color];

  return (
    <div className="bg-white rounded-card border border-gray-100 p-6 md:p-8 relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`}></div>
        <h3 className={`text-lg font-bold ${styles.text}`}>{level}</h3>
      </div>
      
      <p className="text-sm text-slate-500 mb-5 relative z-10">{description}</p>
      
      <ul className="flex-1 space-y-1 mb-6 relative z-10">
        {topics.map((topic, index) => (
          <li key={index} className="flex items-start gap-2 py-1.5">
            <CircleCheck className={`w-4 h-4 shrink-0 mt-0.5 ${styles.icon}`} />
            <span className="text-sm text-slate-600">{topic}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 mt-auto relative z-10 pt-2">
        <button className={`px-4 py-1.5 rounded-button text-sm font-medium border transition-colors bg-white ${styles.button}`}>
          {buttonLabel}
        </button>
        <span className="text-xs text-slate-400 font-medium">{lessonCount} lessons</span>
      </div>

      <div className={`absolute -bottom-4 -right-4 opacity-10 pointer-events-none ${styles.text}`}>
        {getSvg(color)}
      </div>
    </div>
  );
};
