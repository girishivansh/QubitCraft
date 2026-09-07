import { SimulationResult } from '../simulation/simulationTypes';
import { Info } from 'lucide-react';

interface ProbabilityChartProps {
  result: SimulationResult;
}

export function ProbabilityChart({ result }: ProbabilityChartProps) {
  const { probabilities, counts, shots } = result;

  if (!probabilities || Object.keys(probabilities).length === 0) {
    return <div className="text-sm text-slate-500 text-center py-8">No probability data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-900 flex items-center mb-2">
          <Info className="w-4 h-4 mr-2" />
          What am I seeing?
        </h3>
        <p className="text-xs text-indigo-800 leading-relaxed">
          This chart shows the probability of measuring each quantum state. 
          When a quantum circuit is measured, its superposition collapses into a single classical state (like |00⟩ or |11⟩). 
          By running the circuit many times ({shots} shots), we can estimate the true probability distribution of the quantum state.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Measurement Outcomes</h3>
        <div className="space-y-4">
          {Object.entries(probabilities).map(([state, prob]) => {
            const percentage = (prob * 100).toFixed(1);
            const count = counts?.[state] || 0;
            return (
              <div key={state} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm font-semibold border border-slate-200">
                      |{state}⟩
                    </span>
                    <span className="text-xs text-slate-500">
                      {count} / {shots} shots
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
                    <span className="text-[10px] text-slate-400">prob: {prob.toFixed(4)}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full border border-slate-200">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.max(0, prob * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
