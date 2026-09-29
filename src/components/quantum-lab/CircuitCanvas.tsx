
import { GateOperation, GateType } from '../../types/circuit';
import { CircuitCell } from './CircuitCell';
import { GATE_INFO } from '../../data/circuit/gateInfo';

interface CircuitCanvasProps {
  numQubits: number;
  operations: GateOperation[];
  onAddOperation: (type: GateType, target: number, moment: number, control?: number) => void;
  onRemoveOperation: (id: string) => void;
  onSelectOperation: (op: GateOperation | null) => void;
  selectedOpId?: string;
  draggedGate: GateType | null;
  activeGateToPlace?: GateType | null;
  onPlaceGate?: (qubit: number, moment: number) => void;
}

export function CircuitCanvas({ 
  numQubits, operations, onAddOperation, onRemoveOperation, onSelectOperation,
  selectedOpId, draggedGate, activeGateToPlace, onPlaceGate 
}: CircuitCanvasProps) {
  const numMoments = Math.max(16, Math.max(0, ...operations.map(o => o.moment)) + 5);

  const handleDrop = (qubit: number, moment: number) => {
    const gate = draggedGate || activeGateToPlace;
    if (!gate) return;
    const info = GATE_INFO[gate];
    if (info.category === 'multi') {
      // Default control to adjacent qubit if possible, else wrap
      const control = qubit === 0 ? 1 : qubit - 1;
      onAddOperation(gate, qubit, moment, control);
    } else {
      onAddOperation(gate, qubit, moment);
    }
  };

  const handleCellPlace = (qubit: number, moment: number) => {
    if (onPlaceGate) {
      onPlaceGate(qubit, moment);
    } else {
      handleDrop(qubit, moment);
    }
  };

  return (
    <div 
      className="flex-1 overflow-auto bg-gray-50 dark:bg-[#070813] p-2 sm:p-5"
      data-lenis-prevent="true"
    >
      <div className="inline-block min-w-full bg-white dark:bg-[#0d0e24] rounded-lg shadow-xs border border-gray-200 dark:border-slate-800 p-3 sm:p-5">
        <div className="flex">
          {/* Qubit Labels */}
          <div className="flex flex-col mr-2 sm:mr-4 flex-shrink-0 select-none">
            {Array.from({ length: numQubits }).map((_, i) => (
              <div key={i} className="h-12 flex items-center justify-end font-mono text-xs sm:text-sm text-gray-600 dark:text-slate-300 font-medium">
                q[{i}] |0⟩
              </div>
            ))}
          </div>

          {/* Circuit Grid */}
          <div className="flex-1 relative overflow-visible">
            {Array.from({ length: numQubits }).map((_, qubitIndex) => (
              <div key={qubitIndex} className="flex">
                {Array.from({ length: numMoments }).map((_, momentIndex) => {
                  const operation = operations.find(o => o.moment === momentIndex && (o.target === qubitIndex || o.control === qubitIndex));
                  const isTarget = operation?.target === qubitIndex;
                  const isControl = operation?.control === qubitIndex;
                  const isSelected = !!operation && operation.id === selectedOpId;
                  
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
                      isSelected={isSelected}
                      canPlace={!!activeGateToPlace || !!draggedGate}
                      controlTargetDelta={isControl ? delta : undefined} // Only pass down delta for control to draw the line to target
                      onDrop={handleDrop}
                      onPlace={handleCellPlace}
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
