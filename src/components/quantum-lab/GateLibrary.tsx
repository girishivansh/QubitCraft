import React from 'react';
import { GateType } from '../../types/circuit';
import { GATE_INFO } from '../../data/circuit/gateInfo';

interface GateLibraryProps {
  onDragStart: (e: React.DragEvent, type: GateType) => void;
  selectedGate?: GateType | null;
  onSelectGate?: (type: GateType) => void;
  className?: string;
}

export function GateLibrary({ onDragStart, selectedGate, onSelectGate, className = '' }: GateLibraryProps) {
  const categories: ('single' | 'multi' | 'measurement')[] = ['single', 'multi', 'measurement'];

  return (
    <div className={`w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] p-4 h-full overflow-y-auto ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white">Gate Library</h2>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          Drag or tap to place
        </span>
      </div>
      
      {categories.map(category => (
        <div key={category} className="mb-5">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-2.5 tracking-wider">{category} Qubit Gates</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(GATE_INFO)
              .filter(([, info]) => info.category === category)
              .map(([type, info]) => {
                const isSelected = selectedGate === type;
                return (
                  <button
                    key={type}
                    type="button"
                    draggable
                    onDragStart={(e) => onDragStart(e, type as GateType)}
                    onClick={() => onSelectGate?.(type as GateType)}
                    className={`p-2 border rounded cursor-grab flex items-center justify-center font-mono font-bold text-sm transition-all active:scale-95 ${info.color} ${
                      isSelected 
                        ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#0d0e24] scale-[1.03] shadow-sm' 
                        : 'hover:brightness-95 dark:hover:brightness-110'
                    }`}
                    title={info.description}
                  >
                    {type}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
