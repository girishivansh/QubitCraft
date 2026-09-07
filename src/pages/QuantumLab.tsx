import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GateLibrary } from '../components/quantum-lab/GateLibrary';
import { CircuitCanvas } from '../components/quantum-lab/CircuitCanvas';
import { GateProperties } from '../components/quantum-lab/GateProperties';
import { LabToolbar } from '../components/quantum-lab/LabToolbar';
import { useCircuitEditor } from '../hooks/useCircuitEditor';
import { GateOperation, GateType } from '../types/circuit';
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
  const [selectedOp, setSelectedOp] = useState<GateOperation | null>(null);
  
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showTutor, setShowTutor] = useState(false);

  const handleDragStart = (e: React.DragEvent, type: GateType) => {
    setDraggedGate(type);
    e.dataTransfer.setData('gateType', type);
  };

  const handleDragEnd = () => {
    setDraggedGate(null);
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
    <div className="flex flex-col h-full bg-white" onDragEnd={handleDragEnd}>
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
      <div className="flex flex-1 overflow-hidden">
        <GateLibrary onDragStart={handleDragStart} />
        <CircuitCanvas 
          numQubits={numQubits} 
          operations={operations} 
          onAddOperation={addOperation}
          onRemoveOperation={(id) => {
             removeOperation(id);
             if (selectedOp?.id === id) setSelectedOp(null);
          }}
          onSelectOperation={setSelectedOp}
          draggedGate={draggedGate}
        />
        {selectedOp && !showResults && (
          <GateProperties 
            operation={selectedOp} 
            numQubits={numQubits}
            onUpdate={(id, updates) => {
                updateOperation(id, updates);
                setSelectedOp(prev => prev ? { ...prev, ...updates } : null);
            }}
            onClose={() => setSelectedOp(null)}
          />
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
    </div>
  );
}
