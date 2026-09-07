import { useState, useEffect } from 'react';
import { SimulationResult } from '../simulation/simulationTypes';
import { ProbabilityChart } from './ProbabilityChart';
import { StateVectorView } from './StateVectorView';
import { BlochSphere } from './BlochSphere';
import { ExecutionTimeline } from './ExecutionTimeline';
import { QiskitCodeViewer } from './QiskitCodeViewer';
import { CircuitState } from '../../types/circuit';
import { X, Activity, BarChart2, Globe, Code, Play, Clock, Cpu, CheckCircle2, Bot } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900/40 backdrop-blur-sm"
      onWheel={(e) => e.stopPropagation()}
      data-lenis-prevent="true"
    >
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header - Fixed */}
        <div className="p-6 border-b border-slate-200 bg-white flex flex-col gap-5 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold flex items-center text-slate-800">
                <Activity className="w-6 h-6 mr-2 text-indigo-600" />
                Simulation Results
              </h2>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Completed successfully at {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onAskTutor && (
                <button 
                  onClick={() => {
                    onClose();
                    onAskTutor("Can you explain these simulation results?");
                  }}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors text-sm"
                >
                  <Bot size={16} />
                  <span>Explain Results</span>
                </button>
              )}
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sleek Metadata Badges */}
          <div className="flex flex-wrap gap-2.5 text-sm">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
              <Cpu className="w-4 h-4 text-slate-400" />
              Backend: <span className="text-indigo-600">{result.backend || 'simulator'}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
              Qubits: <span className="text-indigo-600">{circuit.numQubits}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
              Shots: <span className="text-indigo-600">{result.shots}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
              Depth: <span className="text-indigo-600">{result.metadata?.depth || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              {Number(result.executionTimeMs || 0).toFixed(2)}ms
            </div>
          </div>
        </div>
        
        {/* Tabs - Fixed */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto custom-scrollbar px-4 flex-shrink-0">
          <button 
            className={`flex-none px-5 py-4 text-sm font-semibold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'measurement' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('measurement')}
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Measurement
            {activeTab === 'measurement' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-5 py-4 text-sm font-semibold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'quantum_state' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('quantum_state')}
          >
            <Activity className="w-4 h-4 mr-2" />
            Quantum State
            {activeTab === 'quantum_state' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-5 py-4 text-sm font-semibold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'visualization' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('visualization')}
          >
            <Globe className="w-4 h-4 mr-2" />
            3D View
            {activeTab === 'visualization' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-5 py-4 text-sm font-semibold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'execution' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('execution')}
          >
            <Play className="w-4 h-4 mr-2" />
            Timeline
            {activeTab === 'execution' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            className={`flex-none px-5 py-4 text-sm font-semibold flex items-center whitespace-nowrap transition-colors relative ${activeTab === 'code' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('code')}
          >
            <Code className="w-4 h-4 mr-2" />
            Qiskit
            {activeTab === 'code' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
        </div>

        {/* Content - Scrollable */}
        <div 
          className="flex-1 overflow-y-auto p-6 bg-slate-50/50 overscroll-contain flex flex-col"
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
            <div className="flex-1 w-full flex flex-col h-full">
              {activeTab === 'measurement' && <ProbabilityChart result={result} />}
              {activeTab === 'quantum_state' && <StateVectorView statevector={result.statevector} numQubits={circuit.numQubits} />}
              {activeTab === 'visualization' && <BlochSphere blochVectors={result.blochVectors} numQubits={circuit.numQubits} />}
              {activeTab === 'execution' && <ExecutionTimeline result={result} circuit={circuit} />}
              {activeTab === 'code' && <QiskitCodeViewer circuit={circuit} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
