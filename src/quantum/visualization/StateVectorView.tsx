import { ComplexAmplitude } from '../simulation/simulationTypes';
import { Info } from 'lucide-react';

interface StateVectorViewProps {
  statevector?: Record<string, ComplexAmplitude>;
  numQubits: number;
}

export function StateVectorView({ statevector, numQubits }: StateVectorViewProps) {
  if (!statevector || Object.keys(statevector).length === 0) {
    return <div className="text-sm text-slate-500 text-center py-8">No statevector data available</div>;
  }

  const entries = Object.entries(statevector);
  // Sort by probability descending
  entries.sort((a, b) => b[1].probability - a[1].probability);

  const shouldTruncate = numQubits > 4 && entries.length > 16;
  const displayEntries = shouldTruncate ? entries.slice(0, 16) : entries;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-900 flex items-center mb-2">
          <Info className="w-4 h-4 mr-2" />
          What am I seeing?
        </h3>
        <p className="text-xs text-indigo-800 leading-relaxed">
          The State Vector represents the complete mathematical description of the quantum state. 
          Each possible basis state |x⟩ has a complex amplitude (α + βi). 
          The probability of measuring a state is the magnitude squared of its amplitude. 
          Unlike probabilities, amplitudes can have negative or imaginary components, which leads to quantum interference!
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Complex Amplitudes</h3>
        
        {shouldTruncate && (
          <div className="text-xs text-slate-500 italic mb-2">
            Showing the top 16 most probable states out of {entries.length} total states.
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          {displayEntries.map(([state, amp]) => {
            const realStr = amp.real >= 0 ? ` ${amp.real.toFixed(3)}` : amp.real.toFixed(3);
            const imagStr = amp.imag >= 0 ? `+ ${amp.imag.toFixed(3)}i` : `- ${Math.abs(amp.imag).toFixed(3)}i`;
            const probStr = (amp.probability * 100).toFixed(2);
            
            return (
              <div key={state} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2 transition-all hover:border-indigo-300">
                <div className="flex justify-between items-center font-mono">
                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">|{state}⟩</span>
                  <span className="text-slate-600 text-sm bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    {realStr} {imagStr}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 mt-1">
                  <div className="bg-slate-50 p-1 rounded text-center">
                    <span className="block text-slate-400 mb-0.5">Magnitude</span>
                    <span className="font-medium text-slate-600">{amp.magnitude.toFixed(4)}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded text-center">
                    <span className="block text-slate-400 mb-0.5">Phase</span>
                    <span className="font-medium text-slate-600">{amp.phase.toFixed(3)} rad</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded text-center">
                    <span className="block text-slate-400 mb-0.5">Probability</span>
                    <span className="font-medium text-indigo-600">{probStr}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
