import type { LearningPathData } from '../../types/curriculum';

export const LEARNING_PATHS: LearningPathData[] = [
  {
    id: 'quantum-foundations',
    title: 'Quantum Foundations',
    description: 'Begin your journey into quantum computing. Learn the core principles, understand qubits, and build your very first quantum circuit.',
    difficulty: 'beginner',
    icon: 'Atom',
    courseIds: ['quantum-foundations'],
    estimatedDuration: '3 hours',
    totalXP: 250,
    objectives: [
      'Understand what quantum computing is',
      'Learn about qubits and quantum states',
      'Explore superposition and measurement',
      'Discover quantum gates',
      'Build your first quantum circuit'
    ],
    lessonCount: 6
  },
  {
    id: 'quantum-circuit-mastery',
    title: 'Quantum Circuit Mastery',
    description: 'Dive deeper into quantum circuits. Master single and multi-qubit gates, understand entanglement, and learn quantum teleportation.',
    difficulty: 'intermediate',
    icon: 'Cpu',
    courseIds: ['quantum-circuit-mastery'],
    estimatedDuration: '5 hours',
    totalXP: 375,
    objectives: [
      'Master quantum circuit design',
      'Work with single and multi-qubit gates',
      'Understand quantum entanglement',
      'Create Bell states',
      'Learn quantum teleportation'
    ],
    lessonCount: 7
  },
  {
    id: 'quantum-algorithms',
    title: 'Quantum Algorithms',
    description: "Explore the algorithms that give quantum computers their power. Learn Grover's search, Shor's algorithm, and the Quantum Fourier Transform.",
    difficulty: 'advanced',
    icon: 'Brain',
    courseIds: ['quantum-algorithms'],
    estimatedDuration: '6 hours',
    totalXP: 350,
    objectives: [
      'Understand algorithm complexity',
      'Explore Deutsch and Deutsch-Jozsa algorithms',
      "Master Grover's search",
      'Learn Quantum Fourier Transform',
      "Understand Shor's algorithm"
    ],
    lessonCount: 6
  }
];
