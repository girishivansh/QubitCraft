
import { GateOperation, GateType } from '../../types/circuit';
import { CircuitCell } from './CircuitCell';
import { GATE_INFO } from '../../data/circuit/gateInfo';

interface CircuitCanvasProps {
  numQubits: number;
  operations: GateOperation[];
  onAddOperation: (type: GateType, target: number, moment: number, control?: number) => void;
  onRemoveOperation: (id: string) => void;
  onSelectOperation: (op: GateOperation | null) => void;
  draggedGate: GateType | null;
}

export function CircuitCanvas({ numQubits, operations, onAddOperation, onRemoveOperation, onSelectOperation, draggedGate }: CircuitCanvasProps) {
  const numMoments = Math.max(20, Math.max(...operations.map(o => o.moment)) + 5);

  const handleDrop = (qubit: number, moment: number) => {
    if (!draggedGate) return;
    const info = GATE_INFO[draggedGate];
    if (info.category === 'multi') {
      // Default control to adjacent qubit if possible, else wrap
      const control = qubit === 0 ? 1 : qubit - 1;
      onAddOperation(draggedGate, qubit, moment, control);
    } else {
      onAddOperation(draggedGate, qubit, moment);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="inline-block min-w-full bg-white rounded-lg shadow p-6">
        <div className="flex">
          {/* Qubit Labels */}
          <div className="flex flex-col mr-4">
            {Array.from({ length: numQubits }).map((_, i) => (
              <div key={i} className="h-12 flex items-center justify-end font-mono text-gray-600 font-medium">
                q[{i}] |0⟩
              </div>
            ))}
          </div>

          {/* Circuit Grid */}
          <div className="flex-1 relative">
            {Array.from({ length: numQubits }).map((_, qubitIndex) => (
              <div key={qubitIndex} className="flex">
                {Array.from({ length: numMoments }).map((_, momentIndex) => {
                  const operation = operations.find(o => o.moment === momentIndex && (o.target === qubitIndex || o.control === qubitIndex));
                  const isTarget = operation?.target === qubitIndex;
                  const isControl = operation?.control === qubitIndex;
                  
                  let delta = undefined;
                  if (operation && operation.control !== undefined) {
                      if (isControl) delta = operation.target - operation.control;
                      else if (isTarget) delta = operation.control - operation.target;
                  }

                  return (
                    <CircuitCell
                      key={`${qubitIndex}-${momentIndex}`}
                      qubit={qubitIndex}
                      moment={momentIndex}
                      operation={operation}
                      isTarget={isTarget}
                      isControl={isControl}
                      controlTargetDelta={isControl ? delta : undefined} // Only pass down delta for control to draw the line to target
                      onDrop={handleDrop}
                      onRemove={() => operation && onRemoveOperation(operation.id)}
                      onClick={() => onSelectOperation(operation || null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
