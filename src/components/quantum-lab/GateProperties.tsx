
import { GateOperation } from '../../types/circuit';
import { GATE_INFO } from '../../data/circuit/gateInfo';

interface GatePropertiesProps {
  operation: GateOperation | null;
  numQubits: number;
  onUpdate: (id: string, updates: Partial<Omit<GateOperation, 'id' | 'type'>>) => void;
  onClose: () => void;
}

export function GateProperties({ operation, numQubits, onUpdate, onClose }: GatePropertiesProps) {
  if (!operation) return null;

  const info = GATE_INFO[operation.type];

  return (
    <div className="w-64 border-l border-gray-200 bg-white p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Properties</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">{info.name} Gate ({operation.type})</h3>
        <p className="text-sm text-gray-600 mt-1">{info.description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Qubit</label>
          <select 
            value={operation.target}
            onChange={(e) => onUpdate(operation.id, { target: parseInt(e.target.value) })}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Array.from({ length: numQubits }).map((_, i) => (
              <option key={i} value={i} disabled={i === operation.control}>Qubit {i}</option>
            ))}
          </select>
        </div>

        {info.category === 'multi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Control Qubit</label>
            <select 
              value={operation.control ?? ''}
              onChange={(e) => onUpdate(operation.id, { control: parseInt(e.target.value) })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Array.from({ length: numQubits }).map((_, i) => (
                <option key={i} value={i} disabled={i === operation.target}>Qubit {i}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
