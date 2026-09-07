import React from 'react';

export interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md';
  color?: 'indigo' | 'green' | 'blue';
  showLabel?: boolean;
}

const colorMap = {
  indigo: 'from-indigo-600 to-indigo-400',
  green: 'from-green-600 to-green-400',
  blue: 'from-blue-600 to-blue-400',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  color = 'indigo',
  showLabel = false,
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full flex items-center gap-3">
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${colorMap[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-600 w-10 text-right">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
