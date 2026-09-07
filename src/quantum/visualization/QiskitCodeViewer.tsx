import { CircuitState } from '../../types/circuit';
import { simulationSerializer } from '../simulation/simulationSerializer';

interface QiskitCodeViewerProps {
  circuit: CircuitState;
}

export function QiskitCodeViewer({ circuit }: QiskitCodeViewerProps) {
  const code = simulationSerializer.toQiskit(circuit);
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">Qiskit Code Equivalent</h3>
      <div className="bg-slate-900 rounded-md p-3 overflow-x-auto shadow-inner">
        <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );
}
