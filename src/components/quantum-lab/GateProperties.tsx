
import { GateOperation } from '../../types/circuit';
import { GATE_INFO } from '../../data/circuit/gateInfo';
import { Trash2, X } from 'lucide-react';

interface GatePropertiesProps {
  operation: GateOperation | null;
  numQubits: number;
  onUpdate: (id: string, updates: Partial<Omit<GateOperation, 'id' | 'type'>>) => void;
  onRemove?: (id: string) => void;
  onClose: () => void;
  className?: string;
}

export function GateProperties({ operation, numQubits, onUpdate, onRemove, onClose, className = '' }: GatePropertiesProps) {
  if (!operation) return null;

  const info = GATE_INFO[operation.type];

  return (
    <div className={`border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] p-4 overflow-y-auto ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded border font-mono font-bold text-xs flex items-center justify-center ${info.color}`}>
            {operation.type}
          </span>
          <h2 className="text-base font-bold text-navy-900 dark:text-white">Gate Properties</h2>
        </div>
        <button 
          type="button"
          onClick={onClose} 
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Close properties"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm text-navy-900 dark:text-white">{info.name}</h3>
        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 leading-relaxed">{info.description}</p>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Target Qubit</label>
          <select 
            value={operation.target}
            onChange={(e) => onUpdate(operation.id, { target: parseInt(e.target.value) })}
            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-[#070813] text-gray-800 dark:text-slate-100 p-2"
          >
            {Array.from({ length: numQubits }).map((_, i) => (
              <option key={i} value={i} disabled={i === operation.control}>q[{i}]</option>
            ))}
          </select>
        </div>

        {info.category === 'multi' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Control Qubit</label>
            <select 
              value={operation.control ?? ''}
              onChange={(e) => onUpdate(operation.id, { control: parseInt(e.target.value) })}
              className="w-full border border-gray-300 dark:border-slate-700 rounded-lg shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-[#070813] text-gray-800 dark:text-slate-100 p-2"
            >
              {Array.from({ length: numQubits }).map((_, i) => (
                <option key={i} value={i} disabled={i === operation.target}>q[{i}]</option>
              ))}
            </select>
          </div>
        )}

        {onRemove && (
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onRemove(operation.id);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer border border-red-200 dark:border-red-900/40"
            >
              <Trash2 size={14} />
              Delete Gate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
