import React from 'react';
import { GateType } from '../../types/circuit';
import { GATE_INFO } from '../../data/circuit/gateInfo';

interface GateLibraryProps {
  onDragStart: (e: React.DragEvent, type: GateType) => void;
}

export function GateLibrary({ onDragStart }: GateLibraryProps) {
  const categories: ('single' | 'multi' | 'measurement')[] = ['single', 'multi', 'measurement'];

  return (
    <div className="w-64 border-r border-gray-200 bg-white p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Gate Library</h2>
      
      {categories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 capitalize">{category} Qubit Gates</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(GATE_INFO)
              .filter(([_, info]) => info.category === category)
              .map(([type, info]) => (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => onDragStart(e, type as GateType)}
                  className={`p-2 border rounded cursor-grab flex items-center justify-center font-mono font-bold text-sm ${info.color}`}
                  title={info.description}
                >
                  {type}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
