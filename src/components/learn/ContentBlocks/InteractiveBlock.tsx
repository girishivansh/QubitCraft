import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import type { InteractiveBlock as InteractiveBlockType } from '../../../types/curriculum';

interface InteractiveBlockProps {
  block: InteractiveBlockType;
}

export const InteractiveBlock: React.FC<InteractiveBlockProps> = ({ block }) => {
  return (
    <div className="my-8">
      <div className="rounded-[20px] bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute -right-10 -top-10 text-indigo-100/50 pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>
        
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/60 text-indigo-700 text-xs font-bold rounded-full mb-3 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Element
          </div>
          
          <h4 className="text-xl font-bold text-navy-900 mb-2">
            {block.title}
          </h4>
          
          <p className="text-slate-600 max-w-lg">
            {block.description}
          </p>
        </div>
        
        <div className="w-full md:w-auto relative z-10">
          <Link
            to={`/quantum-lab?template=${block.id}`}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>Open in Quantum Lab</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBlock;
