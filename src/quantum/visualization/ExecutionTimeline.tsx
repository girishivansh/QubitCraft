import { useState } from 'react';
import { SimulationResult } from '../simulation/simulationTypes';
import { CircuitState } from '../../types/circuit';
import { BlochSphere } from './BlochSphere';
import { StateVectorView } from './StateVectorView';
import { Info, SkipBack, SkipForward, StepBack, StepForward } from 'lucide-react';

interface ExecutionTimelineProps {
  result: SimulationResult;
  circuit: CircuitState;
}

export function ExecutionTimeline({ result, circuit }: ExecutionTimelineProps) {
  const steps = result.steps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(steps.length > 0 ? steps.length - 1 : 0);

  if (steps.length === 0) {
    return (
      <div className="text-sm text-slate-500 text-center py-8">
        No step-by-step execution data available. Make sure the backend supports timeline tracking.
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  
  // Find the operation corresponding to the current step (except for the initial state step which might have index -1)
  const operation = currentStep.operationIndex >= 0 && currentStep.operationIndex < circuit.operations.length
    ? circuit.operations[currentStep.operationIndex]
    : null;

  const getExplanation = () => {
    if (!operation) return "Initial quantum state. All qubits are initialized to |0⟩.";
    
    switch (operation.type) {
      case 'H':
        return `Applying Hadamard (H) gate to Qubit ${operation.target}. This creates a superposition, moving the state vector to the equator of the Bloch sphere (creating |+⟩ or |-⟩ depending on the initial state).`;
      case 'X':
        return `Applying Pauli-X (NOT) gate to Qubit ${operation.target}. This flips the amplitude between |0⟩ and |1⟩, rotating the state vector by 180° around the X-axis.`;
      case 'Y':
        return `Applying Pauli-Y gate to Qubit ${operation.target}. This rotates the state vector by 180° around the Y-axis.`;
      case 'Z':
        return `Applying Pauli-Z (Phase flip) gate to Qubit ${operation.target}. This applies a phase of -1 to the |1⟩ component, rotating the state vector by 180° around the Z-axis.`;
      case 'CX':
        return `Applying CNOT gate with Control Qubit ${operation.control} and Target Qubit ${operation.target}. This flips the target qubit if and only if the control qubit is |1⟩, creating entanglement between them.`;
      case 'M':
        return `Measuring Qubit ${operation.target}. This forces the quantum state to collapse to either |0⟩ or |1⟩ for this qubit.`;
      default:
        return `Applying ${operation.type} gate to Qubit ${operation.target}.`;
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      
      {/* Timeline Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Execution Timeline</h3>
            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentStepIndex(0)} 
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))} 
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <StepBack className="w-4 h-4" />
            </button>
            
            <div className="flex-1 px-4">
              <input 
                type="range" 
                min={0} 
                max={steps.length - 1} 
                value={currentStepIndex}
                onChange={(e) => setCurrentStepIndex(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <button 
              onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))} 
              disabled={currentStepIndex === steps.length - 1}
              className="p-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <StepForward className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentStepIndex(steps.length - 1)} 
              disabled={currentStepIndex === steps.length - 1}
              className="p-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-900 flex items-center mb-2">
          <Info className="w-4 h-4 mr-2" />
          Why did this happen?
        </h3>
        <p className="text-xs text-indigo-800 leading-relaxed">
          {getExplanation()}
        </p>
      </div>

      {/* Visualizations at current step */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-10">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b pb-2">State at this step</h3>
          <div className="h-[400px]">
            <BlochSphere blochVectors={currentStep.blochVectors} numQubits={circuit.numQubits} />
          </div>
        </div>
        
        {currentStep.statevector && (
          <div className="pt-4 border-t border-slate-200">
            <StateVectorView statevector={currentStep.statevector} numQubits={circuit.numQubits} />
          </div>
        )}
      </div>

    </div>
  );
}
