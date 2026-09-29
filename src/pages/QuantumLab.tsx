import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GateLibrary } from '../components/quantum-lab/GateLibrary';
import { CircuitCanvas } from '../components/quantum-lab/CircuitCanvas';
import { GateProperties } from '../components/quantum-lab/GateProperties';
import { LabToolbar } from '../components/quantum-lab/LabToolbar';
import { useCircuitEditor } from '../hooks/useCircuitEditor';
import { GateOperation, GateType } from '../types/circuit';
import { GATE_INFO } from '../data/circuit/gateInfo';
import { CIRCUIT_TEMPLATES } from '../data/circuit/templates';
import { experimentService } from '../services/experimentService';
import { simulationService } from '../quantum/simulation/simulationService';
import { SimulationResult } from '../quantum/simulation/simulationTypes';
import { SimulationResults } from '../quantum/visualization/SimulationResults';
import { AITutorPanel } from '../components/quantum-tutor/AITutorPanel';

export function QuantumLab() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  
  const template = templateId ? CIRCUIT_TEMPLATES.find(t => t.id === templateId) : undefined;
  
  const { 
    numQubits, setNumQubits, 
    operations, addOperation, removeOperation, updateOperation,
    undo, redo, canUndo, canRedo, clear, circuitState
  } = useCircuitEditor(template?.initialState);

  const [draggedGate, setDraggedGate] = useState<GateType | null>(null);
  const [activeGateToPlace, setActiveGateToPlace] = useState<GateType | null>(null);
  const [selectedOp, setSelectedOp] = useState<GateOperation | null>(null);
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false);
  
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showTutor, setShowTutor] = useState(false);

  const handleDragStart = (e: React.DragEvent, type: GateType) => {
    setDraggedGate(type);
    setActiveGateToPlace(type);
    e.dataTransfer.setData('gateType', type);
  };

  const handleDragEnd = () => {
    setDraggedGate(null);
  };

  const handleSelectGate = (type: GateType) => {
    if (activeGateToPlace === type) {
      setActiveGateToPlace(null);
    } else {
      setActiveGateToPlace(type);
      setSelectedOp(null); // Deselect any active circuit gate
    }
  };

  const handlePlaceGate = (qubit: number, moment: number) => {
    const gate = activeGateToPlace || draggedGate;
    if (!gate) return;
    const info = GATE_INFO[gate];
    if (info.category === 'multi') {
      const control = qubit === 0 ? 1 : qubit - 1;
      addOperation(gate, qubit, moment, control);
    } else {
      addOperation(gate, qubit, moment);
    }
  };

  const handleSave = () => {
    const name = prompt('Experiment Name:');
    if (name) {
      experimentService.saveExperiment(name, 'Saved from Quantum Lab', circuitState);
      alert('Experiment saved successfully!');
    }
  };

  const handleSimulate = async () => {
    try {
      setIsSimulating(true);
      const result = await simulationService.runSimulation({
        circuit: circuitState,
        shots: 1024
      });
      setSimulationResult(result);
      setShowResults(true);
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // Build context for AI Tutor
  const tutorContext = {
    circuit: circuitState,
    selectedGate: selectedOp || undefined,
    simulation: simulationResult || undefined,
  };

  return (
    <div 
      className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-72px)] bg-white dark:bg-[#070813] text-slate-900 dark:text-slate-100 overflow-hidden" 
      onDragEnd={handleDragEnd}
    >
      <LabToolbar 
        onUndo={undo} 
        onRedo={redo} 
        onClear={clear} 
        onSimulate={handleSimulate} 
        onSave={handleSave}
        onToggleTutor={() => setShowTutor(!showTutor)}
        canUndo={canUndo} 
        canRedo={canRedo}
        numQubits={numQubits}
        setNumQubits={setNumQubits}
        isSimulating={isSimulating}
      />

      {/* Active gate placement hint */}
      {activeGateToPlace && (
        <div className="bg-indigo-600 text-white px-3 py-1.5 text-xs font-medium flex items-center justify-between shadow-xs flex-shrink-0 z-20 animate-fade-in select-none">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="truncate">
              Selected <strong>{activeGateToPlace}</strong> ({GATE_INFO[activeGateToPlace].name}) — Tap any circuit wire to place
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveGateToPlace(null)}
            className="ml-2 px-2 py-0.5 rounded bg-indigo-700 hover:bg-indigo-800 text-[11px] font-bold flex-shrink-0 cursor-pointer"
          >
            ✕ Cancel
          </button>
        </div>
      )}

      {/* Main Studio Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Gate Library Sidebar */}
        <div className="hidden lg:block h-full flex-shrink-0">
          <GateLibrary 
            onDragStart={handleDragStart} 
            selectedGate={activeGateToPlace}
            onSelectGate={handleSelectGate}
          />
        </div>

        {/* Circuit Canvas (full width on mobile) */}
        <CircuitCanvas 
          numQubits={numQubits} 
          operations={operations} 
          onAddOperation={addOperation}
          onRemoveOperation={(id) => {
             removeOperation(id);
             if (selectedOp?.id === id) setSelectedOp(null);
          }}
          onSelectOperation={(op) => {
            setSelectedOp(op);
            if (op) setActiveGateToPlace(null);
          }}
          selectedOpId={selectedOp?.id}
          draggedGate={draggedGate}
          activeGateToPlace={activeGateToPlace}
          onPlaceGate={handlePlaceGate}
        />

        {/* Desktop Gate Properties Sidebar */}
        {selectedOp && !showResults && (
          <div className="hidden lg:block w-72 h-full flex-shrink-0">
            <GateProperties 
              operation={selectedOp} 
              numQubits={numQubits} 
              onUpdate={(id, updates) => {
                  updateOperation(id, updates);
                  setSelectedOp(prev => prev ? { ...prev, ...updates } : null);
              }}
              onRemove={(id) => {
                removeOperation(id);
                setSelectedOp(null);
              }}
              onClose={() => setSelectedOp(null)}
              className="w-72 border-l h-full"
            />
          </div>
        )}

        {/* Mobile Gate Properties Bottom Sheet */}
        {selectedOp && !showResults && (
          <div className="lg:hidden">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
              onClick={() => setSelectedOp(null)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0d0e24] rounded-t-2xl border-t border-gray-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <GateProperties 
                operation={selectedOp} 
                numQubits={numQubits} 
                onUpdate={(id, updates) => {
                  updateOperation(id, updates);
                  setSelectedOp(prev => prev ? { ...prev, ...updates } : null);
                }}
                onRemove={(id) => {
                  removeOperation(id);
                  setSelectedOp(null);
                }}
                onClose={() => setSelectedOp(null)}
                className="w-full rounded-t-2xl"
              />
            </div>
          </div>
        )}

        {/* Mobile Full Gate Library Bottom Sheet */}
        {mobileLibraryOpen && (
          <div className="lg:hidden">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
              onClick={() => setMobileLibraryOpen(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0d0e24] rounded-t-2xl border-t border-gray-200 dark:border-slate-800 shadow-2xl max-h-[75vh] flex flex-col animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-navy-900 dark:text-white">Quantum Gate Library</h3>
                <button
                  type="button"
                  onClick={() => setMobileLibraryOpen(false)}
                  className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <GateLibrary 
                  onDragStart={handleDragStart}
                  selectedGate={activeGateToPlace}
                  onSelectGate={(gate) => {
                    handleSelectGate(gate);
                    setMobileLibraryOpen(false);
                  }}
                  className="w-full border-none p-0"
                />
              </div>
            </div>
          </div>
        )}

        {showResults && simulationResult && (
          <SimulationResults 
            result={simulationResult} 
            circuit={circuitState} 
            onClose={() => setShowResults(false)}
            onAskTutor={() => setShowTutor(true)}
          />
        )}

        <AITutorPanel 
          context={tutorContext}
          isOpen={showTutor}
          onClose={() => setShowTutor(false)}
        />
      </div>

      {/* Mobile Quick Gate Palette Docked at Bottom */}
      <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] px-3 py-2 flex items-center gap-2 overflow-x-auto select-none flex-shrink-0 z-30">
        <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">
          Gates:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {Object.entries(GATE_INFO).map(([type, info]) => {
            const isSelected = activeGateToPlace === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectGate(type as GateType)}
                className={`px-2.5 py-1.5 rounded-lg border font-mono font-bold text-xs flex-shrink-0 transition-all active:scale-95 cursor-pointer ${info.color} ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-[#0d0e24] scale-105 shadow-xs'
                    : 'hover:brightness-95'
                }`}
                title={info.name}
              >
                {type}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setMobileLibraryOpen(true)}
          className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap flex-shrink-0 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
        >
          All Gates ▾
        </button>
      </div>
    </div>
  );
}
