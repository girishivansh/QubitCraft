import { Undo2, Redo2, Trash2, Play, Save, Bot } from 'lucide-react';

interface LabToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSimulate: () => void;
  onSave: () => void;
  onToggleTutor: () => void;
  canUndo: boolean;
  canRedo: boolean;
  numQubits: number;
  setNumQubits: (n: number) => void;
  isSimulating: boolean;
}

export function LabToolbar({ 
  onUndo, onRedo, onClear, onSimulate, onSave, onToggleTutor,
  canUndo, canRedo, numQubits, setNumQubits, isSimulating
}: LabToolbarProps) {
  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Qubits:</label>
          <select 
            value={numQubits} 
            onChange={(e) => setNumQubits(Number(e.target.value))}
            className="border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        
        <div className="flex items-center space-x-1">
          <button onClick={onUndo} disabled={!canUndo} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50" title="Undo">
            <Undo2 size={18} />
          </button>
          <button onClick={onRedo} disabled={!canRedo} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50" title="Redo">
            <Redo2 size={18} />
          </button>
          <button onClick={onClear} className="p-1.5 rounded text-red-600 hover:bg-red-50 ml-2" title="Clear Circuit">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleTutor} 
          className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 font-medium text-sm transition-colors border border-indigo-200"
        >
          <Bot size={16} className="mr-2" />
          AI Tutor
        </button>
        <button onClick={onSave} className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium text-sm transition-colors">
          <Save size={16} className="mr-2" />
          Save
        </button>
        <button 
          onClick={onSimulate} 
          disabled={isSimulating}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm transition-colors disabled:opacity-75"
        >
          {isSimulating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Play size={16} className="mr-2" />
          )}
          {isSimulating ? 'Simulating...' : 'Simulate'}
        </button>
      </div>
    </div>
  );
}
