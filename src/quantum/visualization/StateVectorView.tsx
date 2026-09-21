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
      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 flex items-center mb-2">
          <Info className="w-4 h-4 mr-2" />
          What am I seeing?
        </h3>
        <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
          The State Vector represents the complete mathematical description of the quantum state. 
          Each possible basis state |x⟩ has a complex amplitude (α + βi). 
          The probability of measuring a state is the magnitude squared of its amplitude. 
          Unlike probabilities, amplitudes can have negative or imaginary components, which leads to quantum interference!
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Complex Amplitudes</h3>
        
        {shouldTruncate && (
          <div className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">
            Showing the top 16 most probable states out of {entries.length} total states.
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          {displayEntries.map(([state, amp]) => {
            const realStr = amp.real >= 0 ? ` ${amp.real.toFixed(3)}` : amp.real.toFixed(3);
            const imagStr = amp.imag >= 0 ? `+ ${amp.imag.toFixed(3)}i` : `- ${Math.abs(amp.imag).toFixed(3)}i`;
            const probStr = (amp.probability * 100).toFixed(2);
            
            return (
              <div key={state} className="bg-white dark:bg-[#0d0e24] p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50">
                <div className="flex justify-between items-center font-mono">
                  <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">|{state}⟩</span>
                  <span className="text-slate-600 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                    {realStr} {imagStr}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  <div className="bg-slate-50 dark:bg-[#131533]/80 p-1.5 rounded text-center border border-slate-100 dark:border-slate-800/60">
                    <span className="block text-slate-400 dark:text-slate-400 mb-0.5">Magnitude</span>
                    <span className="font-medium text-slate-600 dark:text-slate-200">{amp.magnitude.toFixed(4)}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#131533]/80 p-1.5 rounded text-center border border-slate-100 dark:border-slate-800/60">
                    <span className="block text-slate-400 dark:text-slate-400 mb-0.5">Phase</span>
                    <span className="font-medium text-slate-600 dark:text-slate-200">{amp.phase.toFixed(3)} rad</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#131533]/80 p-1.5 rounded text-center border border-slate-100 dark:border-slate-800/60">
                    <span className="block text-slate-400 dark:text-slate-400 mb-0.5">Probability</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{probStr}%</span>
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
