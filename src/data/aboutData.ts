export interface TeamMember {
  name: string;
  role: string;
  avatarInitials: string;
  avatarBg: string;
  bio: string;
  specialty: string;
  github?: string;
  linkedin?: string;
}

export interface RoadmapItem {
  phase: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  title: string;
  description: string;
  deliverables: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const ABOUT_HERO = {
  badge: 'Smart India Hackathon 2026 • Problem Statement SIH26140',
  title: 'Democratizing Quantum Education Through Interactive Intelligence',
  subtitle:
    'QubitCraft was created to solve one of the greatest educational bottlenecks of the 21st century: making quantum computing visual, intuitive, and accessible to every aspiring engineer, researcher, and curious learner.',
  metrics: [
    { label: 'Platform Access', value: '100% Free', sub: 'Open to learners worldwide' },
    { label: 'Interactive Algorithms', value: '6+ Curated', sub: 'With step-by-step state tracking' },
    { label: 'Simulation Engine', value: 'Qiskit Aer', sub: 'Statevector & Shots simulation' },
    { label: 'National Alignment', value: 'NQM & NEP', sub: 'Aligned with India’s Quantum Mission' },
  ],
};

export const COMPARISONS = [
  {
    title: 'Abstract Linear Algebra',
    traditional: 'Intimidating complex matrices, tensor products, and high-dimensional Hilbert spaces written statically on blackboards.',
    qubitcraft: 'Dynamic 3D Bloch sphere projections, real-time probability amplitudes, and interactive statevector evolution charts.',
  },
  {
    title: 'Steep Command-Line Barriers',
    traditional: 'Requires configuring complex Python virtual environments, package conflicts, and writing boilerplate code without instant visual feedback.',
    qubitcraft: 'Intuitive drag-and-drop circuit canvas with instantaneous simulation, moment tracking, and automatic Qiskit code generation.',
  },
  {
    title: 'Algorithmic Black Boxes',
    traditional: 'Algorithms like Grover or Shor are taught as mathematical formulas where the intermediate physical phenomena remain invisible.',
    qubitcraft: 'Step-by-step visualizer breaking down phase kickback, amplitude amplification, and interference at each discrete gate moment.',
  },
  {
    title: 'Isolated Self-Study Without Guidance',
    traditional: 'Students get stuck on quantum counter-intuitiveness (e.g. entanglement or measurement collapse) with nowhere to turn for instant clarification.',
    qubitcraft: 'Context-aware AI Quantum Tutor that inspects the active circuit, explains physical phenomena, and answers questions in plain English.',
  },
];

export const FOUR_PILLARS = [
  {
    id: 'composer',
    title: 'Interactive Circuit Composer',
    description: 'Design multi-qubit quantum circuits via intuitive drag-and-drop. Place Hadamard, Pauli, CNOT, and Phase gates with real-time moment alignment.',
    highlight: 'Instant multi-qubit statevector calculation with zero latency.',
  },
  {
    id: 'algorithms',
    title: 'Algorithm Visualizer',
    description: 'Deconstruct breakthrough algorithms including Grover, Deutsch-Jozsa, Bernstein-Vazirani, and QFT into physical step-by-step transformations.',
    highlight: 'Live amplitude amplification & phase inversion graphs.',
  },
  {
    id: 'tutor',
    title: 'Context-Aware AI Tutor',
    description: 'An intelligent quantum pedagogy assistant powered by high-speed LLMs that understands your exact circuit topology and simulation results.',
    highlight: 'Real-time quantum mechanics guidance and debugging.',
  },
  {
    id: 'curriculum',
    title: 'Gamified Structured Curriculum',
    description: 'From quantum foundations to cryptographic implications. Earn XP, maintain learning streaks, and test intuition with interactive knowledge checks.',
    highlight: 'Comprehensive progression aligned with University curricula.',
  },
];

export const TECH_STACK = [
  {
    category: 'Frontend & Visuals',
    techs: ['React 19', 'TypeScript', 'Tailwind CSS', 'Three.js / React Three Fiber', 'KaTeX Math Engine', 'Lucide Icons'],
    description: 'High-performance interactive web application with zero-jank 60FPS 3D Bloch sphere rendering and KaTeX LaTeX typesetting.',
  },
  {
    category: 'Quantum Computing Engine',
    techs: ['IBM Qiskit 1.0+', 'Qiskit Aer Simulator', 'NumPy', 'Statevector & Density Matrices'],
    description: 'Industry-standard Python backend running true quantum statevector simulation, shots-based probabilistic execution, and QASM compilation.',
  },
  {
    category: 'AI Reasoning Pipeline',
    techs: ['FastAPI Backend', 'Groq LPU Inference', 'Pedagogical Prompt Steering', 'Context Injection'],
    description: 'Sub-second AI tutor responses grounded strictly in quantum principles, circuit topology, and educational pedagogy.',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Shivansh Giri',
    role: 'Lead Architect & Quantum Engineering',
    avatarInitials: 'SG',
    avatarBg: 'bg-indigo-600',
    bio: 'Passionate about quantum computing architectures, interactive simulation pipelines, and educational technology.',
    specialty: 'Qiskit Backend, React Architecture & State Simulation',
  },
  {
    name: 'Quantum Algorithm Specialist',
    role: 'Quantum Physics & Theory Lead',
    avatarInitials: 'QA',
    avatarBg: 'bg-purple-600',
    bio: 'Specializing in quantum algorithms, gate optimizations, and translating complex mathematical proofs into visual stepping models.',
    specialty: 'Algorithm Deconstructions & Mathematical Integrity',
  },
  {
    name: 'AI Systems Engineer',
    role: 'AI Tutor & Backend Integration',
    avatarInitials: 'AI',
    avatarBg: 'bg-emerald-600',
    bio: 'Designing domain-specific quantum pedagogy prompt pipelines and low-latency LLM inference architectures.',
    specialty: 'FastAPI, Context Injection & AI Steerability',
  },
  {
    name: 'UI/UX & Frontend Specialist',
    role: 'Product Designer & Visualizer',
    avatarInitials: 'UX',
    avatarBg: 'bg-blue-600',
    bio: 'Crafting frictionless user interfaces, accessible design systems, and responsive scientific visualizations.',
    specialty: 'Design Systems, Micro-Interactions & Responsive Layouts',
  },
];

export const ROADMAP: RoadmapItem[] = [
  {
    phase: 'Phase 1: Foundation',
    status: 'Completed',
    title: 'Core Interactive Composer & Quantum Simulator',
    description: 'Built the foundational drag-and-drop circuit canvas, 3D Bloch sphere projections, and statevector engine.',
    deliverables: [
      'Multi-qubit circuit grid with moment scheduling',
      'Single & two-qubit gate library (H, X, Y, Z, S, T, CX, CZ, SWAP)',
      'IBM Qiskit Aer simulation backend integration',
      'Beginner Quantum Foundations curriculum',
    ],
  },
  {
    phase: 'Phase 2: Intelligence & Algorithms',
    status: 'In Progress',
    title: 'Algorithm Explorer & AI Quantum Tutor',
    description: 'Empowering students with deep algorithm walkthroughs and personalized conversational AI instruction.',
    deliverables: [
      'Interactive Quantum Algorithms Explorer (Grover, Deutsch-Jozsa, BV, QFT, Teleportation)',
      'Step-by-step statevector & amplitude animation',
      'Context-aware Global & Lab AI Quantum Tutor',
      'One-click algorithm-to-lab circuit cloning',
    ],
  },
  {
    phase: 'Phase 3: Hardware & Ecosystem',
    status: 'Upcoming',
    title: 'Hardware Cloud Execution & Collaborative Labs',
    description: 'Direct integration with real quantum processors and institutional collaboration features.',
    deliverables: [
      'IBM Quantum Experience Cloud API bridge to real QPUs',
      'Real-time classroom collaboration for university professors',
      'Quantum Error Correction (Surface Codes) visualizer',
      'Open-source student algorithm contribution hub',
    ],
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'What makes QubitCraft different from IBM Quantum Composer or Quirk?',
    answer:
      'While IBM Quantum Composer focuses primarily on cloud execution and Quirk is a sandbox, QubitCraft is built specifically as a guided educational companion. It blends an interactive circuit editor with a step-by-step algorithm deconstructor, gamified curriculum paths, and a context-aware AI tutor that explains the physics behind your circuits in plain language.',
  },
  {
    question: 'Do I need a background in quantum physics or advanced calculus to use QubitCraft?',
    answer:
      'No! QubitCraft is designed with zero-prerequisite entry in mind. Our "Quantum Foundations" path starts from the very basics of probability and binary bits before introducing superposition and qubits using intuitive visual metaphors.',
  },
  {
    question: 'How is QubitCraft aligned with the National Quantum Mission (NQM)?',
    answer:
      'India’s National Quantum Mission emphasizes building an indigenous workforce of quantum-literate engineers and scientists. QubitCraft directly tackles the educational talent pipeline by providing high schools and universities with a free, browser-based quantum laboratory without requiring expensive hardware setups.',
  },
  {
    question: 'Can I export circuits designed in QubitCraft to real Python code?',
    answer:
      'Yes! Every circuit created in the Quantum Lab or inspected in the Algorithms Explorer can be exported directly as production-ready Python Qiskit code or OpenQASM 2.0 with a single click.',
  },
];
