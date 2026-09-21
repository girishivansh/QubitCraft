import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUANTUM_ALGORITHMS, QuantumAlgorithm } from '../data/algorithms';
import AlgorithmVisualizer from '../components/algorithms/AlgorithmVisualizer';
import AlgorithmCard from '../components/algorithms/AlgorithmCard';
import { AITutorPanel } from '../components/quantum-tutor/AITutorPanel';
import { 
  Search, Play, Code2, BookOpen, Cpu, 
  Copy, Check, Lightbulb, X,
  CheckCircle2, AlertTriangle, Atom, Sparkles
} from 'lucide-react';

export default function Algorithms() {
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(QUANTUM_ALGORITHMS[0].id);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'circuit' | 'code' | 'theory'>('visualizer');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  // Categories list with counts
  const categories = [
    { label: 'All', count: QUANTUM_ALGORITHMS.length },
    { label: 'Search & Optimization', count: QUANTUM_ALGORITHMS.filter(a => a.category === 'Search & Optimization').length },
    { label: 'Oracular', count: QUANTUM_ALGORITHMS.filter(a => a.category === 'Oracular').length },
    { label: 'Transforms', count: QUANTUM_ALGORITHMS.filter(a => a.category === 'Transforms').length },
    { label: 'Communication', count: QUANTUM_ALGORITHMS.filter(a => a.category === 'Communication').length },
  ];

  // Filtered algorithms
  const filteredAlgorithms = useMemo(() => {
    return QUANTUM_ALGORITHMS.filter((algo) => {
      const matchesSearch = 
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.inventor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || algo.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const activeAlgorithm: QuantumAlgorithm = useMemo(() => {
    return QUANTUM_ALGORITHMS.find(a => a.id === selectedAlgoId) || QUANTUM_ALGORITHMS[0];
  }, [selectedAlgoId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeAlgorithm.qiskitCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOpenInLab = (templateId?: string) => {
    const id = templateId || activeAlgorithm.templateId;
    navigate(`/quantum-lab?template=${id}`);
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-4 shadow-xs">
            <Atom className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
            Interactive Algorithm Laboratory
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 dark:text-white tracking-tight mb-4">
            Quantum Algorithms Explorer
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Step inside foundational and breakthrough quantum algorithms. Walk through state transformations, simulate probability distributions, inspect circuits, and run code in real-time.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="Search algorithms, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-10 bg-white dark:bg-[#0d0e24] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-navy-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.label)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === cat.label
                ? 'bg-navy-900 text-white dark:bg-indigo-600 shadow-md'
                : 'bg-white dark:bg-[#0d0e24] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              selectedCategory === cat.label
                ? 'bg-slate-800 dark:bg-indigo-700 text-slate-300 dark:text-indigo-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Algorithms Cards Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredAlgorithms.map((algo) => (
          <AlgorithmCard
            key={algo.id}
            algorithm={algo}
            isSelected={algo.id === activeAlgorithm.id}
            onSelect={() => {
              setSelectedAlgoId(algo.id);
              const el = document.getElementById('algorithm-workspace');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            onQuickOpenLab={() => handleOpenInLab(algo.templateId)}
          />
        ))}
      </div>

      {/* Selected Algorithm Deep-Dive Workspace */}
      <div id="algorithm-workspace" className="scroll-mt-24">
        <div className="bg-white dark:bg-[#0d0e24] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 dark:from-[#0d0e24] dark:via-[#10122e] dark:to-indigo-950/20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {activeAlgorithm.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {activeAlgorithm.speedup} Speedup
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Developed by {activeAlgorithm.inventor} ({activeAlgorithm.year})
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-extrabold text-navy-900 dark:text-white mb-2">
                  {activeAlgorithm.name}
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  {activeAlgorithm.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsAITutorOpen(true)}
                  className="px-4 py-2.5 bg-[#131314] hover:bg-[#1e1f20] text-white border border-[#2e2f33] rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Ask Qubit AI</span>
                </button>
                <button
                  onClick={() => handleOpenInLab()}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-100 dark:shadow-none transition-all"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Open in Quantum Lab</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('visualizer')}
                className={`pb-3.5 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'visualizer'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Interactive Stepper</span>
              </button>
              <button
                onClick={() => setActiveTab('circuit')}
                className={`pb-3.5 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'circuit'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Circuit Architecture</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`pb-3.5 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'code'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Qiskit Code</span>
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={`pb-3.5 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'theory'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Theory & Math</span>
              </button>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 md:p-10">
            {/* TAB 1: VISUALIZER */}
            {activeTab === 'visualizer' && (
              <AlgorithmVisualizer
                key={activeAlgorithm.id}
                algorithm={activeAlgorithm}
                onOpenInLab={() => handleOpenInLab()}
              />
            )}

            {/* TAB 2: CIRCUIT ARCHITECTURE */}
            {activeTab === 'circuit' && (
              <div className="flex flex-col gap-8">
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white">Circuit Architecture</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Specifications of quantum gates, depth, and qubits needed for this algorithm.</p>
                    </div>
                    <button
                      onClick={() => handleOpenInLab()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      Load this Circuit into Lab
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#070813] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                      <span className="text-xs text-slate-400 font-bold uppercase">Total Qubits</span>
                      <p className="text-2xl font-bold text-navy-900 dark:text-white mt-1">{activeAlgorithm.numQubits}</p>
                    </div>
                    <div className="bg-white dark:bg-[#070813] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                      <span className="text-xs text-slate-400 font-bold uppercase">Gate Count</span>
                      <p className="text-2xl font-bold text-navy-900 dark:text-white mt-1">{activeAlgorithm.circuitOperations.length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#070813] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                      <span className="text-xs text-slate-400 font-bold uppercase">Circuit Depth</span>
                      <p className="text-2xl font-bold text-navy-900 dark:text-white mt-1">
                        {Math.max(...activeAlgorithm.circuitOperations.map(op => op.moment), 0) + 1}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-[#070813] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                      <span className="text-xs text-slate-400 font-bold uppercase">Measured Bits</span>
                      <p className="text-2xl font-bold text-navy-900 dark:text-white mt-1">
                        {activeAlgorithm.circuitOperations.filter(op => op.type === 'M').length || activeAlgorithm.numQubits} Bits
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gate Sequence Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-slate-50 dark:bg-slate-900/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Sequential Operation Pipeline
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto custom-scrollbar">
                    {activeAlgorithm.circuitOperations.map((op, index) => (
                      <div key={op.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
                            {op.type}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 font-medium">
                            Target Qubit: <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">q[{op.target}]</code>
                          </span>
                          {op.control !== undefined && (
                            <span className="text-slate-500 dark:text-slate-400">
                              (Controlled by: <code className="font-mono text-purple-600 dark:text-purple-400 font-bold">q[{op.control}]</code>)
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">
                          Moment {op.moment}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: QISKIT CODE */}
            {activeTab === 'code' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white">Production-Ready Python (Qiskit 1.0+) Code</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Copy and run this directly in a Jupyter Notebook, Google Colab, or VS Code.</p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Window */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-slate-100 font-mono text-xs shadow-xl">
                  <div className="bg-[#161b22] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="ml-2 text-xs font-sans text-slate-400">{activeAlgorithm.id}.py</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">IBM Qiskit 1.0+ Compatible</span>
                  </div>
                  <pre className="p-6 overflow-x-auto leading-relaxed text-slate-200 selection:bg-indigo-500 selection:text-white custom-scrollbar">
                    <code>{activeAlgorithm.qiskitCode}</code>
                  </pre>
                </div>

                {/* OpenQASM Section */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    OpenQASM 2.0 Circuit Representation
                  </h4>
                  <pre className="font-mono text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-[#070813] p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
                    <code>{activeAlgorithm.openqasmCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: THEORY & MATH */}
            {activeTab === 'theory' && (
              <div className="flex flex-col gap-8">
                {/* Problem Statement & Mechanics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Problem Statement
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeAlgorithm.theory.problemStatement}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white mb-2 flex items-center gap-2">
                      <Atom className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Physical Mechanism
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeAlgorithm.theory.howItWorks}
                    </p>
                  </div>
                </div>

                {/* Mathematical Principle */}
                <div className="bg-white dark:bg-[#0d0e24] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Mathematical Foundation & Dirac Notation
                  </h3>
                  <div className="bg-slate-900 text-white font-mono text-xs sm:text-sm p-4 rounded-xl overflow-x-auto my-2 custom-scrollbar">
                    {activeAlgorithm.theory.mathematicalPrinciple}
                  </div>
                </div>

                {/* Classical vs Quantum Complexity Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-slate-50 dark:bg-slate-900/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Performance Comparison: Classical vs. Quantum
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeAlgorithm.theory.classicalVsQuantum.map((row, i) => (
                      <div key={i} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{row.metric}</span>
                        <span className="text-slate-500 dark:text-slate-400">Classical: <strong className="text-slate-700 dark:text-slate-200">{row.classical}</strong></span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">Quantum: {row.quantum}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applications & Limitations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Real-World Applications
                    </h4>
                    <ul className="flex flex-col gap-2 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
                      {activeAlgorithm.theory.realWorldApplications.map((app, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Known Constraints & Practical Limitations
                    </h4>
                    <ul className="flex flex-col gap-2 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                      {activeAlgorithm.theory.limitations.map((lim, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gemini AI Side Panel */}
      <AITutorPanel
        context={{ activeAlgorithmName: activeAlgorithm.name }}
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
      />
    </div>
  );
}
