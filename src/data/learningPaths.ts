export interface LearningPath {
  level: string;
  color: 'green' | 'blue' | 'purple';
  description: string;
  topics: string[];
  buttonLabel: string;
  lessonCount: number;
}

export const learningPaths: LearningPath[] = [
  {
    level: 'Beginner',
    color: 'green',
    description:
      'Start with the fundamentals of quantum computing and qubits.',
    topics: [
      'What is Quantum Computing?',
      'Qubits and Superposition',
      'Quantum Gates',
      'Measurement & Collapse',
    ],
    buttonLabel: 'Start Learning',
    lessonCount: 6,
  },
  {
    level: 'Algorithms',
    color: 'blue',
    description:
      'Explore famous quantum algorithms through interactive examples.',
    topics: [
      'Deutsch Algorithm',
      "Grover's Search",
      'Quantum Fourier Transform',
      "Shor's Algorithm",
    ],
    buttonLabel: 'Explore Path',
    lessonCount: 8,
  },
  {
    level: 'Advanced',
    color: 'purple',
    description:
      'Dive deeper into quantum mechanics and advanced algorithms.',
    topics: [
      'Quantum Entanglement',
      'Quantum Error Correction',
      'Variational Algorithms',
      'Quantum Complexity',
    ],
    buttonLabel: 'Start Learning',
    lessonCount: 7,
  },
];
