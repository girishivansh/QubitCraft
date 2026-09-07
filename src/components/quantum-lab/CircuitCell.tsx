import React from 'react';
import { GateOperation } from '../../types/circuit';
import { GATE_INFO } from '../../data/circuit/gateInfo';

interface CircuitCellProps {
  qubit: number;
  moment: number;
  operation?: GateOperation;
  isControl: boolean;
  isTarget: boolean;
  controlTargetDelta?: number; // Distance and direction to control/target for drawing lines
  onDrop: (qubit: number, moment: number) => void;
  onRemove: () => void;
  onClick: () => void;
}

export function CircuitCell({ qubit, moment, operation, isControl, isTarget, controlTargetDelta, onDrop, onRemove, onClick }: CircuitCellProps) {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(qubit, moment);
  };

  const info = operation ? GATE_INFO[operation.type] : undefined;

  return (
    <div 
      className="w-16 h-12 border border-gray-100 flex items-center justify-center relative group"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Quantum Wire */}
      <div className="absolute w-full h-px bg-gray-400 top-1/2 -translate-y-1/2 z-0" />
      
      {/* Control Line (Vertical) */}
      {controlTargetDelta !== undefined && (
        <div 
          className="absolute w-px bg-blue-500 left-1/2 -translate-x-1/2 z-0"
          style={{ 
            height: `${Math.abs(controlTargetDelta) * 3 + 1.5}rem`,
            top: controlTargetDelta > 0 ? '50%' : 'auto',
            bottom: controlTargetDelta < 0 ? '50%' : 'auto'
          }}
        />
      )}

      {operation && isTarget && info && (
        <div 
          onClick={onClick}
          className={`relative z-10 w-10 h-10 border rounded flex items-center justify-center font-mono font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-400 ${info.color}`}
          title={info.name}
        >
          {operation.type}
          <button 
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            ×
          </button>
        </div>
      )}

      {operation && isControl && (
        <div 
          onClick={onClick}
          className="relative z-10 w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-400"
        />
      )}
    </div>
  );
}
