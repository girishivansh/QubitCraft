import type { Lesson } from '../../../types/curriculum';

export const QUANTUM_ALGORITHMS_LESSONS: Lesson[] = [
  {
    id: 'qa-intro-quantum-algorithms',
    courseId: 'quantum-algorithms',
    pathId: 'quantum-algorithms',
    title: 'Introduction to Quantum Algorithms',
    description: 'Understand how quantum algorithms offer computational advantages over classical ones.',
    objectives: [
      'Understand algorithm complexity',
      'Learn about quantum speedup',
      'Explore the quantum oracle model'
    ],
    duration: '30 min',
    xp: 25,
    difficulty: 'advanced',
    order: 1,
    topic: 'algorithms',
    prerequisites: [],
    contentBlocks: [
      {
        id: 'qa-iqa-heading-1',
        type: 'heading',
        level: 2,
        text: 'The Quantum Advantage'
      },
      {
        id: 'qa-iqa-text-1',
        type: 'text',
        content: 'Quantum algorithms leverage superposition, interference, and entanglement to solve certain problems fundamentally faster than any known classical algorithm.'
      },
      {
        id: 'qa-iqa-callout-1',
        type: 'callout',
        calloutType: 'note',
        title: 'Computational Complexity',
        content: 'We often look for exponential speedups (like in factoring) or quadratic speedups (like in unstructured search).'
      },
      {
        id: 'qa-iqa-check-1',
        type: 'knowledge-check',
        question: 'Do quantum computers provide a speedup for EVERY computational problem?',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' }
        ],
        correctOptionId: 'false',
        explanation: 'Quantum computers only provide speedups for specific classes of problems. For many everyday tasks, classical computers are better.',
        xp: 5
      }
    ]
  },
  {
    id: 'qa-deutsch-algorithm',
    courseId: 'quantum-algorithms',
    pathId: 'quantum-algorithms',
    title: 'Deutsch Algorithm',
    description: 'Study the simplest algorithm that proves quantum computers can be faster than classical ones.',
    objectives: [
      'Understand constant vs balanced functions',
      'Implement the Deutsch oracle',
      'Analyze the deterministic result'
    ],
    duration: '30 min',
    xp: 25,
    difficulty: 'advanced',
    order: 2,
    topic: 'algorithms',
    prerequisites: ['qa-intro-quantum-algorithms'],
    contentBlocks: [
      {
        id: 'qa-da-heading-1',
        type: 'heading',
        level: 2,
        text: 'The First Quantum Algorithm'
      },
      {
        id: 'qa-da-text-1',
        type: 'text',
        content: 'David Deutsch proposed a problem: determine if a one-bit function is constant or balanced. Classically, this takes two evaluations. Quantumly, it takes just one.'
      },
      {
        id: 'qa-da-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 1)\nqc.x(1)\nqc.h([0,1])\n# Oracle goes here\nqc.h(0)\nqc.measure(0, 0)',
        explanation: 'The standard setup for the Deutsch algorithm.'
      },
      {
        id: 'qa-da-check-1',
        type: 'knowledge-check',
        question: 'What is a balanced function?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'A function that returns 0 for all inputs' },
          { id: 'opt2', text: 'A function that returns 1 for half the inputs and 0 for the other half' },
          { id: 'opt3', text: 'A function that returns random outputs' }
        ],
        correctOptionId: 'opt2',
        explanation: 'Balanced functions output 0s for exactly half the inputs and 1s for the other half.',
        xp: 5
      }
    ]
  },
  {
    id: 'qa-deutsch-jozsa-algorithm',
    courseId: 'quantum-algorithms',
    pathId: 'quantum-algorithms',
    title: 'Deutsch-Jozsa Algorithm',
    description: 'Learn the multi-qubit generalization of the Deutsch algorithm.',
    objectives: [
      'Generalize constant/balanced problem',
      'Understand exponential speedup',
      'Build the n-qubit circuit'
    ],
    duration: '35 min',
    xp: 25,
    difficulty: 'advanced',
    order: 3,
    topic: 'algorithms',
    prerequisites: ['qa-deutsch-algorithm'],
    contentBlocks: [
      {
        id: 'qa-dja-heading-1',
        type: 'heading',
        level: 2,
        text: 'Scaling the Speedup'
      },
      {
        id: 'qa-dja-text-1',
        type: 'text',
        content: 'The Deutsch-Jozsa algorithm generalizes the problem to an n-bit input. While a classical computer might need 2^(n-1) + 1 evaluations in the worst case, the quantum algorithm still requires only one evaluation.'
      },
      {
        id: 'qa-dja-callout-1',
        type: 'callout',
        calloutType: 'important',
        title: 'Phase Kickback',
        content: "Phase kickback is the mechanism that allows the oracle to embed the function's properties into the phase of the control qubits."
      },
      {
        id: 'qa-dja-check-1',
        type: 'knowledge-check',
        question: 'How many oracle queries does Deutsch-Jozsa require?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: '1' },
          { id: 'opt2', text: 'O(N)' },
          { id: 'opt3', text: '2^N' }
        ],
        correctOptionId: 'opt1',
        explanation: 'Regardless of input size, Deutsch-Jozsa only needs a single query to the oracle.',
        xp: 5
      }
    ]
  },
  {
    id: 'qa-grovers-algorithm',
    courseId: 'quantum-algorithms',
    pathId: 'quantum-algorithms',
    title: "Grover's Algorithm",
    description: 'Master the premier quantum search algorithm.',
    objectives: [
      'Understand unstructured search',
      'Learn about amplitude amplification',
      'Build the diffusion operator'
    ],
    duration: '40 min',
    xp: 25,
    difficulty: 'advanced',
    order: 4,
    topic: 'algorithms',
    prerequisites: ['qa-intro-quantum-algorithms'],
    contentBlocks: [
      {
        id: 'qa-ga-heading-1',
        type: 'heading',
        level: 2,
        text: 'Searching the Unsearchable'
      },
      {
        id: 'qa-ga-text-1',
        type: 'text',
        content: "Finding an item in an unsorted list of N items classically takes O(N) time. Grover's algorithm can find the item in O(√N) time using amplitude amplification."
      },
      {
        id: 'qa-ga-formula-1',
        type: 'formula',
        expression: 'O(\\\\sqrt{N})',
        label: "Grover's Complexity"
      },
      {
        id: 'qa-ga-check-1',
        type: 'knowledge-check',
        question: "What kind of speedup does Grover's algorithm provide over classical search?",
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Exponential' },
          { id: 'opt2', text: 'Quadratic' },
          { id: 'opt3', text: 'Logarithmic' }
        ],
        correctOptionId: 'opt2',
        explanation: 'Grover provides a quadratic speedup. N steps become roughly √N steps.',
        xp: 5
      }
    ]
  },
  {
    id: 'qa-quantum-fourier-transform',
    courseId: 'quantum-algorithms',
    pathId: 'quantum-algorithms',
    title: 'Quantum Fourier Transform',
    description: 'Understand the quantum analogue of the discrete Fourier transform.',
    objectives: [
      'Compare classical DFT to QFT',
      'Understand phase encoding',
      'Build the QFT circuit'
    ],
    duration: '40 min',
    xp: 25,
    difficulty: 'advanced',
    order: 5,
    topic: 'algorithms',
    prerequisites: ['qa-intro-quantum-algorithms'],
    contentBlocks: [
      {
        id: 'qa-qft-heading-1',
        type: 'heading',
        level: 2,
        text: 'Fourier Analysis in the Quantum Realm'
      },
      {
        id: 'qa-qft-text-1',
        type: 'text',
        content: 'The Quantum Fourier Transform (QFT) is a critical subroutine in many complex quantum algorithms. Instead of computing the transform on classical data, it transforms the amplitudes of a quantum state.'
      },
      {
        id: 'qa-qft-check-1',
        type: 'knowledge-check',
        question: 'What gates are primarily used to construct the QFT circuit?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Pauli X and Y' },
          { id: 'opt2', text: 'Hadamard and Controlled-Phase rotations' },
          { id: 'opt3', text: 'CNOT and Toffoli' }
        ],
        correctOptionId: 'opt2',
        explanation: 'The QFT uses Hadamard gates and a series of controlled-phase rotation gates.',
        xp: 5
      }
    ]
  },
  {
    id: 'qa-shors-algorithm',
    courseId: 'quantum-algorithms',
    pathId: 'quantum-algorithms',
    title: "Shor's Algorithm",
    description: 'Explore the algorithm that threatens modern cryptography.',
    objectives: [
      'Understand integer factorization',
      'Learn period finding',
      'Understand implications for RSA cryptography'
    ],
    duration: '40 min',
    xp: 25,
    difficulty: 'advanced',
    order: 6,
    topic: 'algorithms',
    prerequisites: ['qa-quantum-fourier-transform'],
    contentBlocks: [
      {
        id: 'qa-sa-heading-1',
        type: 'heading',
        level: 2,
        text: 'Breaking the Unbreakable'
      },
      {
        id: 'qa-sa-text-1',
        type: 'text',
        content: "Peter Shor discovered that a quantum computer can factor large integers exponentially faster than the best-known classical algorithms. This has massive implications for RSA encryption."
      },
      {
        id: 'qa-sa-callout-1',
        type: 'callout',
        calloutType: 'warning',
        title: 'Cryptographic Threat',
        content: "A sufficiently large and fault-tolerant quantum computer could use Shor's algorithm to break much of the public-key cryptography used on the internet today."
      },
      {
        id: 'qa-sa-check-1',
        type: 'knowledge-check',
        question: "Shor's algorithm reduces the factoring problem to which other mathematical problem?",
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Graph coloring' },
          { id: 'opt2', text: 'Period finding' },
          { id: 'opt3', text: 'Matrix multiplication' }
        ],
        correctOptionId: 'opt2',
        explanation: "Shor's algorithm uses the QFT to efficiently find the period of a modular exponential function, which leads directly to factors.",
        xp: 5
      }
    ]
  }
];
