import type { Course } from '../../types/curriculum';

export const COURSES: Course[] = [
  {
    id: 'quantum-foundations',
    pathId: 'quantum-foundations',
    title: 'Quantum Foundations',
    description: 'A comprehensive introduction to the foundational concepts of quantum computing.',
    difficulty: 'beginner',
    prerequisites: [],
    objectives: [
      'Understand what quantum computing is',
      'Learn about qubits and quantum states',
      'Explore superposition and measurement',
      'Discover quantum gates',
      'Build your first quantum circuit'
    ],
    lessonIds: [
      'qf-what-is-quantum-computing',
      'qf-understanding-qubits',
      'qf-superposition',
      'qf-quantum-measurement',
      'qf-quantum-gates',
      'qf-build-first-circuit'
    ],
    estimatedDuration: '3 hours',
    totalXP: 250
  },
  {
    id: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'Quantum Circuit Mastery',
    description: 'Advanced techniques for building and understanding complex quantum circuits.',
    difficulty: 'intermediate',
    prerequisites: ['quantum-foundations'],
    objectives: [
      'Master quantum circuit design',
      'Work with single and multi-qubit gates',
      'Understand quantum entanglement',
      'Create Bell states',
      'Learn quantum teleportation'
    ],
    lessonIds: [
      'qcm-circuit-fundamentals',
      'qcm-single-qubit-gates',
      'qcm-multi-qubit-gates',
      'qcm-cnot-gate',
      'qcm-quantum-entanglement',
      'qcm-bell-states',
      'qcm-quantum-teleportation'
    ],
    estimatedDuration: '5 hours',
    totalXP: 375
  },
  {
    id: 'quantum-algorithms',
    pathId: 'quantum-algorithms',
    title: 'Quantum Algorithms',
    description: 'In-depth study of the most influential quantum algorithms and their real-world implications.',
    difficulty: 'advanced',
    prerequisites: ['quantum-circuit-mastery'],
    objectives: [
      'Understand algorithm complexity',
      'Explore Deutsch and Deutsch-Jozsa algorithms',
      "Master Grover's search",
      'Learn Quantum Fourier Transform',
      "Understand Shor's algorithm"
    ],
    lessonIds: [
      'qa-intro-quantum-algorithms',
      'qa-deutsch-algorithm',
      'qa-deutsch-jozsa-algorithm',
      'qa-grovers-algorithm',
      'qa-quantum-fourier-transform',
      'qa-shors-algorithm'
    ],
    estimatedDuration: '6 hours',
    totalXP: 350
  }
];
