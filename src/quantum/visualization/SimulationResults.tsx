import { useState, useEffect } from 'react';
import { SimulationResult } from '../simulation/simulationTypes';
import { ProbabilityChart } from './ProbabilityChart';
import { StateVectorView } from './StateVectorView';
import { BlochSphere } from './BlochSphere';
import { ExecutionTimeline } from './ExecutionTimeline';
import { QiskitCodeViewer } from './QiskitCodeViewer';
import { CircuitState } from '../../types/circuit';
import { X, Activity, BarChart2, Globe, Code, Play, Cpu, CheckCircle2, Bot } from 'lucide-react';

interface SimulationResultsProps {
  result: SimulationResult;
  circuit: CircuitState;
  onClose: () => void;
  onAskTutor?: (question: string) => void;
}

type Tab = 'measurement' | 'quantum_state' | 'visualization' | 'execution' | 'code';

export function SimulationResults({ result, circuit, onClose, onAskTutor }: SimulationResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('visualization');

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-slate-900/40 backdrop-blur-xs"
      onWheel={(e) => e.stopPropagation()}
      data-lenis-prevent="true"
    >
      <div className="w-full max-w-6xl h-full max-h-[92vh] bg-white dark:bg-[#0d0e24] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Compact Header - Fixed */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                  Simulation Results
                </h2>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Completed ({Number(result.executionTimeMs || 0).toFixed(1)}ms)
                </span>
              </div>
            </div>

            {/* Inline Metadata Badges */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 ml-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-mono">
                <Cpu className="w-3 h-3 text-indigo-500" />
                {circuit.numQubits} Qubit{circuit.numQubits > 1 ? 's' : ''}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono">
                {result.shots} Shots
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono">
                Depth: {result.metadata?.depth || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onAskTutor && (
              <button 
                onClick={() => {
                  onClose();
                  onAskTutor("Can you explain these simulation results?");
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold rounded-lg transition-colors text-xs border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs"
              >
                <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>Ask Qubit AI</span>
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Close results"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tabs - 3D View is FIRST */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#070813]/80 overflow-x-auto custom-scrollbar px-4 flex-shrink-0">
          <button 
            className={`flex-none px-4 py-3 text-xs sm:text-sm font-bold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'visualization' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            onClick={() => setActiveTab('visualization')}
          >
            <Globe className="w-4 h-4 mr-2" />
            3D Bloch Sphere
            {activeTab === 'visualization' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-4 py-3 text-xs sm:text-sm font-bold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'measurement' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            onClick={() => setActiveTab('measurement')}
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Measurement
            {activeTab === 'measurement' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-4 py-3 text-xs sm:text-sm font-bold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'quantum_state' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            onClick={() => setActiveTab('quantum_state')}
          >
            <Activity className="w-4 h-4 mr-2" />
            Quantum State
            {activeTab === 'quantum_state' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-4 py-3 text-xs sm:text-sm font-bold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'execution' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            onClick={() => setActiveTab('execution')}
          >
            <Play className="w-4 h-4 mr-2" />
            Timeline
            {activeTab === 'execution' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-4 py-3 text-xs sm:text-sm font-bold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'code' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            onClick={() => setActiveTab('code')}
          >
            <Code className="w-4 h-4 mr-2" />
            Qiskit Code
            {activeTab === 'code' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
        </div>

        {/* Content Area */}
        <div 
          className={`flex-1 min-h-0 ${activeTab === 'visualization' ? 'p-3 sm:p-4 overflow-hidden' : 'p-6 overflow-y-auto'} bg-slate-50/50 dark:bg-[#070813] overscroll-contain flex flex-col`}
          data-lenis-prevent="true"
        >
          {result.error ? (
            <div className="text-red-600 p-5 bg-red-50 rounded-xl border border-red-200 text-sm flex items-start gap-3 shadow-sm max-w-3xl mx-auto mt-4">
              <X className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-2 font-bold text-lg">Simulation Error</strong>
                <p className="whitespace-pre-wrap">{result.error}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 w-full h-full min-h-0 flex flex-col">
              {activeTab === 'visualization' && <BlochSphere blochVectors={result.blochVectors} numQubits={circuit.numQubits} />}
              {activeTab === 'measurement' && <ProbabilityChart result={result} />}
              {activeTab === 'quantum_state' && <StateVectorView statevector={result.statevector} numQubits={circuit.numQubits} />}
              {activeTab === 'execution' && <ExecutionTimeline result={result} circuit={circuit} />}
              {activeTab === 'code' && <QiskitCodeViewer circuit={circuit} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
