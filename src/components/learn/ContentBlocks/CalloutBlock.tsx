import React from 'react';
import { Lightbulb, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import type { CalloutBlock as CalloutBlockType } from '../../../types/curriculum';

interface CalloutBlockProps {
  block: CalloutBlockType;
}

const calloutStyles = {
  tip: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-500 dark:border-emerald-500',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleColor: 'text-emerald-800 dark:text-emerald-300',
    textColor: 'text-emerald-900 dark:text-emerald-200',
    Icon: Lightbulb,
  },
  note: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-500 dark:border-blue-500',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-300',
    textColor: 'text-blue-900 dark:text-blue-200',
    Icon: Info,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-500 dark:border-amber-500',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-800 dark:text-amber-300',
    textColor: 'text-amber-900 dark:text-amber-200',
    Icon: AlertTriangle,
  },
  important: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-500 dark:border-indigo-500',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    titleColor: 'text-indigo-800 dark:text-indigo-300',
    textColor: 'text-indigo-900 dark:text-indigo-200',
    Icon: AlertCircle,
  },
};

export const CalloutBlock: React.FC<CalloutBlockProps> = ({ block }) => {
  const { calloutType, title, content } = block;
  const style = calloutStyles[calloutType] || calloutStyles.note;
  const Icon = style.Icon;

  return (
    <div className={`rounded-[12px] border-l-4 p-4 my-6 flex gap-3 ${style.bg} ${style.border}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${style.iconColor}`} />
      </div>
      <div>
        {title && (
          <h5 className={`font-semibold text-sm mb-1 uppercase tracking-wider ${style.titleColor}`}>
            {title}
          </h5>
        )}
        <div className={`text-sm leading-relaxed ${style.textColor}`}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default CalloutBlock;
