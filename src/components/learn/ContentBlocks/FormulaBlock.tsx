import React from 'react';
import type { FormulaBlock as FormulaBlockType } from '../../../types/curriculum';

interface FormulaBlockProps {
  block: FormulaBlockType;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({ block }) => {
  return (
    <div className="my-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-50 dark:bg-[#0d0e24] rounded-[12px] p-6 text-center border border-gray-100 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="font-mono text-lg md:text-xl text-navy-900 dark:text-white whitespace-nowrap">
          {block.expression}
        </div>
      </div>
      {block.label && (
        <span className="mt-3 text-sm text-slate-500 dark:text-slate-400 italic">
          {block.label}
        </span>
      )}
    </div>
  );
};

export default FormulaBlock;
