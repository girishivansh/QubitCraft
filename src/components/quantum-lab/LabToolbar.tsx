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
    <div className="h-14 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] flex items-center justify-between px-2.5 sm:px-4 gap-2 overflow-x-auto select-none">
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        <div className="flex items-center space-x-1.5">
          <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300">
            <span className="hidden sm:inline">Qubits:</span>
            <span className="sm:hidden font-bold">Q:</span>
          </label>
          <select 
            value={numQubits} 
            onChange={(e) => setNumQubits(Number(e.target.value))}
            className="border-gray-300 dark:border-slate-700 bg-white dark:bg-[#070813] text-gray-800 dark:text-slate-200 rounded-md text-xs sm:text-sm py-1 px-1.5 sm:px-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        
        <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
        
        <div className="flex items-center space-x-0.5 sm:space-x-1">
          <button 
            type="button"
            onClick={onUndo} 
            disabled={!canUndo} 
            className="p-1.5 rounded text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer transition-colors" 
            title="Undo"
            aria-label="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button 
            type="button"
            onClick={onRedo} 
            disabled={!canRedo} 
            className="p-1.5 rounded text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer transition-colors" 
            title="Redo"
            aria-label="Redo"
          >
            <Redo2 size={16} />
          </button>
          <button 
            type="button"
            onClick={onClear} 
            className="p-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors" 
            title="Clear Circuit"
            aria-label="Clear circuit"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
        <button 
          type="button"
          onClick={onToggleTutor} 
          className="flex items-center px-2.5 sm:px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-medium text-xs sm:text-sm transition-colors border border-indigo-200 dark:border-indigo-800/60 cursor-pointer"
          title="AI Tutor"
        >
          <Bot size={15} className="sm:mr-1.5" />
          <span className="hidden sm:inline">AI Tutor</span>
        </button>
        <button 
          type="button"
          onClick={onSave} 
          className="flex items-center px-2.5 sm:px-3 py-1.5 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          title="Save Experiment"
        >
          <Save size={15} className="sm:mr-1.5" />
          <span className="hidden sm:inline">Save</span>
        </button>
        <button 
          type="button"
          onClick={onSimulate} 
          disabled={isSimulating}
          className="flex items-center px-3 sm:px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-xs sm:text-sm transition-colors disabled:opacity-75 cursor-pointer shadow-xs active:scale-95"
          title="Run Simulation"
        >
          {isSimulating ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
          ) : (
            <Play size={14} className="mr-1.5 fill-current" />
          )}
          <span>{isSimulating ? 'Simulating...' : 'Simulate'}</span>
        </button>
      </div>
    </div>
  );
}
