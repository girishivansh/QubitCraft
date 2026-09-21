import { QuantumAlgorithm } from '../../data/algorithms';
import { ArrowRight, Zap, Cpu, Sparkles, ExternalLink } from 'lucide-react';

interface AlgorithmCardProps {
  algorithm: QuantumAlgorithm;
  isSelected: boolean;
  onSelect: () => void;
  onQuickOpenLab?: (e: React.MouseEvent) => void;
}

export default function AlgorithmCard({ algorithm, isSelected, onSelect, onQuickOpenLab }: AlgorithmCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Search & Optimization':
        return 'from-blue-500 to-cyan-500';
      case 'Oracular':
        return 'from-indigo-600 to-purple-600';
      case 'Transforms':
        return 'from-purple-600 to-pink-600';
      case 'Communication':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-indigo-500 to-blue-500';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-3xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden border ${
        isSelected
          ? 'bg-white dark:bg-[#0d0e24] border-indigo-500 ring-4 ring-indigo-500/10 dark:ring-indigo-500/20 shadow-xl scale-[1.01]'
          : 'bg-white dark:bg-[#0d0e24] border-slate-200/80 dark:border-slate-800/90 hover:border-indigo-200 dark:hover:border-indigo-700/80 hover:shadow-lg shadow-sm'
      }`}
    >
      {/* Category Accent Top Line */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getCategoryGradient(algorithm.category)}`} />

      <div className="p-6 md:p-7 flex flex-col flex-1">
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getDifficultyColor(algorithm.difficulty)}`}>
              {algorithm.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60 flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              {algorithm.speedup}
            </span>
          </div>

          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {algorithm.inventor.split(' ')[0]} ({algorithm.year})
          </span>
        </div>

        {/* Title & Summary */}
        <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {algorithm.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-1">
          {algorithm.summary}
        </p>

        {/* Complexity Comparison Pill */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 mb-6 flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Classical</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5">{algorithm.classicalComplexity}</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 mx-2 flex-shrink-0" />

          <div className="flex flex-col text-right">
            <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Quantum</span>
            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">{algorithm.quantumComplexity}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>{algorithm.numQubits} Qubits</span>
          </div>

          <div className="flex items-center gap-2">
            {onQuickOpenLab && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickOpenLab(e);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                title="Quick Open in Quantum Lab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}

            <span className={`text-xs font-bold inline-flex items-center gap-1 transition-colors ${
              isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
            }`}>
              {isSelected ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                  Viewing
                </>
              ) : (
                <>
                  Inspect
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
