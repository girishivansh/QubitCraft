import { useState, useEffect } from 'react';
import { QuantumAlgorithm, AlgorithmStep } from '../../data/algorithms';
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, 
  Sparkles, CheckCircle2, Sliders, Activity, Zap, Cpu
} from 'lucide-react';

interface AlgorithmVisualizerProps {
  algorithm: QuantumAlgorithm;
  onOpenInLab?: () => void;
}

export default function AlgorithmVisualizer({ algorithm, onOpenInLab }: AlgorithmVisualizerProps) {
  // Handle parameters
  const [selectedParamKey, setSelectedParamKey] = useState<string>(() => {
    return algorithm.parameters?.options[0]?.key || '';
  });

  // Current steps based on selected parameter
  const currentSteps: AlgorithmStep[] = (() => {
    if (algorithm.parameters) {
      const option = algorithm.parameters.options.find(opt => opt.key === selectedParamKey);
      if (option) return option.steps;
    }
    return algorithm.defaultSteps.length > 0
      ? algorithm.defaultSteps
      : (algorithm.parameters?.options[0]?.steps || []);
  })();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectParam = (key: string) => {
    setSelectedParamKey(key);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Autoplay interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= currentSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSteps.length]);

  const activeStep = currentSteps[currentStepIndex] || currentSteps[0];
  const basisStates = Object.keys(activeStep.probabilities);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(currentSteps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="bg-white dark:bg-[#0d0e24] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card p-6 md:p-8 flex flex-col gap-8">
      {/* Parameter Selection (if available) */}
      {algorithm.parameters && (
        <div className="bg-gradient-to-r from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-900/60 dark:via-indigo-950/30 dark:to-purple-950/20 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {algorithm.parameters.label}
              </span>
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                Switch input or oracle parameters to inspect real-time state changes:
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {algorithm.parameters.options.map((option) => {
              const isSelected = selectedParamKey === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => handleSelectParam(option.key)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none scale-102'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stepper Header & Controls */}
      <div className="flex flex-col gap-5 bg-slate-50/60 dark:bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
              {activeStep.stepNumber}
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Stage {activeStep.stepNumber} of {currentSteps.length}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-navy-900 dark:text-white leading-tight">
                {activeStep.title}
              </h3>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleReset}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              title="Reset to Stage 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white disabled:text-slate-300 dark:disabled:text-slate-600 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 disabled:hover:border-transparent transition-all"
              title="Previous stage"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                isPlaying
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none'
              }`}
              title={isPlaying ? 'Pause playback' : 'Auto-play sequence'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'Pause' : 'Auto-Step'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === currentSteps.length - 1}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white disabled:text-slate-300 dark:disabled:text-slate-600 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 disabled:hover:border-transparent transition-all"
              title="Next stage"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Track Bar */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {currentSteps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={step.stepNumber}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className="group flex flex-col gap-1.5 text-left transition-all"
              >
                <div
                  className={`h-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950'
                      : isCompleted
                      ? 'bg-indigo-300 dark:bg-indigo-700'
                      : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'
                  }`}
                />
                <span className={`text-[10px] truncate hidden md:block font-medium ${
                  isActive ? 'text-indigo-700 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Step Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: State Explanations & Physical Gates */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Active Transformation
              </span>
              <h4 className="text-lg font-bold text-navy-900 dark:text-white">
                {activeStep.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                {activeStep.description}
              </p>
            </div>

            {/* Quantum State Dirac Equation Card */}
            <div className="bg-white dark:bg-[#070813] border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                Hilbert Space State Vector |ψ⟩
              </span>
              <code className="text-xs sm:text-sm font-mono text-indigo-950 dark:text-indigo-200 font-bold break-all bg-indigo-50/50 dark:bg-indigo-950/60 px-2 py-1 rounded block">
                {activeStep.mathNotation}
              </code>
            </div>
          </div>

          {/* Active Operations at this stage */}
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
              Active Gates In This Step
            </span>
            <div className="flex flex-wrap gap-2">
              {activeStep.activeGates.length > 0 ? (
                activeStep.activeGates.map((gate, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    {gate}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic">No gates applied (Register initialized to |0...0⟩)</span>
              )}
            </div>
          </div>

          {/* Physical Principle / Intuition */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              Physical Principle & Intuition
            </div>
            <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
              {activeStep.explanation}
            </p>
          </div>
        </div>

        {/* Right Column: Live Measurement Probabilities Spectrum */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 bg-gradient-to-b from-white to-slate-50/60 dark:from-[#0d0e24] dark:to-slate-900/40 flex flex-col justify-between h-full shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    State Probability Spectrum |ψ|²
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/60">
                  Σ = 1.00
                </span>
              </div>

              {/* Probability Bars */}
              <div className="flex flex-col gap-3.5">
                {basisStates.map((state) => {
                  const prob = activeStep.probabilities[state] || 0;
                  const percent = Math.round(prob * 100);
                  const isHighProb = prob >= 0.7;
                  const isSuperposition = prob > 0 && prob < 0.7;

                  return (
                    <div key={state} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-navy-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                            |{state}⟩
                          </span>
                          {isHighProb && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.2 rounded-full">
                              <Zap className="w-2.5 h-2.5" />
                              Amplified State
                            </span>
                          )}
                        </div>

                        <span className={`font-mono font-bold ${
                          isHighProb ? 'text-emerald-600 dark:text-emerald-400 text-sm' : isSuperposition ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {percent}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden flex shadow-inner">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isHighProb
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : isSuperposition
                              ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                              : 'bg-transparent'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer summary & Launch */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
              <span className="font-mono text-[11px]">
                Basis States: [{basisStates.map(s => `|${s}⟩`).join(', ')}]
              </span>

              {onOpenInLab && (
                <button
                  onClick={onOpenInLab}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Load into Circuit Canvas →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
