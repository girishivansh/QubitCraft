import React from 'react';
import { Eye, FlaskConical } from 'lucide-react';
import type { VisualBlock as VisualBlockType } from '../../../types/curriculum';

interface VisualBlockProps {
  block: VisualBlockType;
}

export const VisualBlock: React.FC<VisualBlockProps> = ({ block }) => {
  return (
    <div className="my-8">
      <div className="rounded-[20px] bg-indigo-50/50 border-2 border-dashed border-indigo-200 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-indigo-300 transition-colors">
        <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5" />
          Coming soon in Quantum Lab
        </div>
        
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-400 shadow-sm mb-4 group-hover:scale-110 transition-transform">
          <Eye className="w-8 h-8" />
        </div>
        
        <h4 className="text-lg font-bold text-navy-900 mb-2">
          {block.title}
        </h4>
        
        <p className="text-slate-600 max-w-md text-sm">
          {block.description}
        </p>
        
        <div className="mt-6 text-xs text-slate-400 italic">
          [Interactive visualization placeholder for: {block.visualType}]
        </div>
      </div>
    </div>
  );
};

export default VisualBlock;
