import React from 'react';
import { GateOperation } from '../../types/circuit';
import { GATE_INFO } from '../../data/circuit/gateInfo';

interface CircuitCellProps {
  qubit: number;
  moment: number;
  operation?: GateOperation;
  isControl: boolean;
  isTarget: boolean;
  isSelected?: boolean;
  canPlace?: boolean;
  controlTargetDelta?: number; // Distance and direction to control/target for drawing lines
  onDrop: (qubit: number, moment: number) => void;
  onPlace?: (qubit: number, moment: number) => void;
  onRemove: () => void;
  onClick: () => void;
}

export function CircuitCell({ 
  qubit, moment, operation, isControl, isTarget, isSelected, canPlace,
  controlTargetDelta, onDrop, onPlace, onRemove, onClick 
}: CircuitCellProps) {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(qubit, moment);
  };

  const handleCellClick = () => {
    if (operation) {
      onClick();
    } else if (canPlace && onPlace) {
      onPlace(qubit, moment);
    }
  };

  const info = operation ? GATE_INFO[operation.type] : undefined;

  return (
    <div 
      className={`w-14 sm:w-16 h-12 border border-gray-100 dark:border-slate-800/60 flex items-center justify-center relative group transition-colors ${
        !operation && canPlace ? 'cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30' : ''
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCellClick}
    >
      {/* Quantum Wire */}
      <div className="absolute w-full h-px bg-gray-400 dark:bg-slate-600 top-1/2 -translate-y-1/2 z-0" />
      
      {/* Empty slot tap preview indicator */}
      {!operation && canPlace && (
        <div className="absolute inset-1 rounded border border-dashed border-indigo-400/40 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
      )}

      {/* Control Line (Vertical) */}
      {controlTargetDelta !== undefined && (
        <div 
          className="absolute w-px bg-blue-500 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
          style={{ 
            height: `${Math.abs(controlTargetDelta) * 3 + 1.5}rem`,
            top: controlTargetDelta > 0 ? '50%' : 'auto',
            bottom: controlTargetDelta < 0 ? '50%' : 'auto'
          }}
        />
      )}

      {operation && isTarget && info && (
        <div 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 border rounded flex items-center justify-center font-mono font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-transform active:scale-95 ${info.color} ${
            isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-[#0d0e24] scale-105' : 'hover:ring-2 hover:ring-indigo-400'
          }`}
          title={info.name}
        >
          {operation.type}
          <button 
            type="button"
            className={`absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow-xs transition-opacity cursor-pointer ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Delete Gate"
            aria-label="Delete gate"
          >
            ×
          </button>
        </div>
      )}

      {operation && isControl && (
        <div 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`relative z-10 w-4 h-4 bg-blue-500 rounded-full cursor-pointer transition-transform active:scale-95 ${
            isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : 'hover:ring-2 hover:ring-blue-400'
          }`}
        />
      )}
    </div>
  );
}
