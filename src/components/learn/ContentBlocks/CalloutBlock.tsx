import React from 'react';
import { Lightbulb, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import type { CalloutBlock as CalloutBlockType } from '../../../types/curriculum';

interface CalloutBlockProps {
  block: CalloutBlockType;
}

const calloutStyles = {
  tip: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    textColor: 'text-green-900',
    Icon: Lightbulb,
  },
  note: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-900',
    Icon: Info,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-800',
    textColor: 'text-amber-900',
    Icon: AlertTriangle,
  },
  important: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    iconColor: 'text-indigo-600',
    titleColor: 'text-indigo-800',
    textColor: 'text-indigo-900',
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
