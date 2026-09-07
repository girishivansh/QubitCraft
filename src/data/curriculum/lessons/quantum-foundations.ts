import type { Lesson } from '../../../types/curriculum';

export const QUANTUM_FOUNDATIONS_LESSONS: Lesson[] = [
  {
    id: 'qf-what-is-quantum-computing',
    courseId: 'quantum-foundations',
    pathId: 'quantum-foundations',
    title: 'What is Quantum Computing?',
    description: 'Learn the fundamental difference between classical and quantum computing.',
    objectives: [
      'Understand bits vs qubits',
      'Learn why quantum computing matters',
      'Explore real-world applications'
    ],
    duration: '20 min',
    xp: 25,
    difficulty: 'beginner',
    order: 1,
    topic: 'introduction',
    prerequisites: [],
    contentBlocks: [
      {
        id: 'qf-wiqc-heading-1',
        type: 'heading',
        level: 2,
        text: 'A New Paradigm of Computation'
      },
      {
        id: 'qf-wiqc-text-1',
        type: 'text',
        content: 'Classical computers process information using bits, which can be either 0 or 1. Quantum computers use quantum bits, or qubits, which leverage the principles of quantum mechanics.'
      },
      {
        id: 'qf-wiqc-callout-1',
        type: 'callout',
        calloutType: 'tip',
        title: 'Key Difference',
        content: 'While a classical bit is like a coin sitting on a table (either heads or tails), a qubit is like a spinning coin in the air—it exists in a complex state of both heads and tails simultaneously.'
      },
      {
        id: 'qf-wiqc-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\n# Creating a simple quantum circuit\nqc = QuantumCircuit(1)\nprint("Ready for quantum computing!")',
        explanation: 'This simple Python code imports Qiskit, a popular quantum framework.'
      },
      {
        id: 'qf-wiqc-check-1',
        type: 'knowledge-check',
        question: 'What is the fundamental unit of information in a quantum computer?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Bit' },
          { id: 'opt2', text: 'Qubit' },
          { id: 'opt3', text: 'Byte' }
        ],
        correctOptionId: 'opt2',
        explanation: 'Quantum computers use qubits (quantum bits) as their fundamental unit of information.',
        xp: 5
      },
      {
        id: 'qf-wiqc-check-2',
        type: 'knowledge-check',
        question: 'A classical bit can represent multiple states at once.',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' }
        ],
        correctOptionId: 'false',
        explanation: 'Classical bits can only be 0 or 1. It is qubits that can exist in superposition.',
        xp: 5
      }
    ]
  },
  {
    id: 'qf-understanding-qubits',
    courseId: 'quantum-foundations',
    pathId: 'quantum-foundations',
    title: 'Understanding Qubits',
    description: 'Dive deep into the mathematics and physics of qubits.',
    objectives: [
      'Understand |0⟩ and |1⟩ states',
      'Learn Dirac notation',
      'Explore quantum states'
    ],
    duration: '25 min',
    xp: 25,
    difficulty: 'beginner',
    order: 2,
    topic: 'qubits',
    prerequisites: ['qf-what-is-quantum-computing'],
    contentBlocks: [
      {
        id: 'qf-uq-heading-1',
        type: 'heading',
        level: 2,
        text: 'The Language of Quantum States'
      },
      {
        id: 'qf-uq-text-1',
        type: 'text',
        content: 'In quantum mechanics, we use Dirac notation (or bra-ket notation) to describe quantum states. The standard computational basis states are |0⟩ and |1⟩.'
      },
      {
        id: 'qf-uq-formula-1',
        type: 'formula',
        expression: '|\\\\psi\\\\rangle = \\\\alpha|0\\\\rangle + \\\\beta|1\\\\rangle',
        label: 'General Qubit State'
      },
      {
        id: 'qf-uq-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\n# By default, the qubit is initialized in the |0> state',
        explanation: 'In Qiskit, all qubits begin in the |0⟩ state.'
      },
      {
        id: 'qf-uq-visual-1',
        type: 'visual',
        visualType: 'bloch-sphere',
        title: 'The Bloch Sphere',
        description: 'A visual representation of a qubit state.',
        altText: 'Bloch sphere diagram'
      },
      {
        id: 'qf-uq-check-1',
        type: 'knowledge-check',
        question: 'What notation is commonly used to write quantum states?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Einstein notation' },
          { id: 'opt2', text: 'Dirac notation' },
          { id: 'opt3', text: 'Newton notation' }
        ],
        correctOptionId: 'opt2',
        explanation: 'Dirac notation (bra-ket) is the standard for quantum states.',
        xp: 5
      },
      {
        id: 'qf-uq-check-2',
        type: 'knowledge-check',
        question: 'By default, what state is a qubit initialized to in most quantum frameworks?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: '|0⟩' },
          { id: 'opt2', text: '|1⟩' },
          { id: 'opt3', text: '|+⟩' }
        ],
        correctOptionId: 'opt1',
        explanation: 'Qubits usually start in the ground state |0⟩.',
        xp: 5
      }
    ]
  },
  {
    id: 'qf-superposition',
    courseId: 'quantum-foundations',
    pathId: 'quantum-foundations',
    title: 'Superposition',
    description: 'Explore the quantum phenomenon of superposition.',
    objectives: [
      'Understand superposition',
      'Learn about probability amplitudes',
      'Create a superposition state'
    ],
    duration: '25 min',
    xp: 25,
    difficulty: 'beginner',
    order: 3,
    topic: 'superposition',
    prerequisites: ['qf-understanding-qubits'],
    contentBlocks: [
      {
        id: 'qf-sp-heading-1',
        type: 'heading',
        level: 2,
        text: 'Being in Multiple States at Once'
      },
      {
        id: 'qf-sp-text-1',
        type: 'text',
        content: 'Superposition allows a qubit to be in a linear combination of |0⟩ and |1⟩. This is not just a statistical lack of knowledge, but a fundamental property of nature.'
      },
      {
        id: 'qf-sp-callout-1',
        type: 'callout',
        calloutType: 'note',
        title: 'The Hadamard Gate',
        content: 'The Hadamard (H) gate is used to put a qubit into an equal superposition state.'
      },
      {
        id: 'qf-sp-formula-1',
        type: 'formula',
        expression: 'H|0\\\\rangle = |+\\\\rangle = \\\\frac{1}{\\\\sqrt{2}}(|0\\\\rangle + |1\\\\rangle)',
        label: 'Hadamard on |0⟩'
      },
      {
        id: 'qf-sp-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\nqc.h(0) # Apply Hadamard gate to qubit 0',
        explanation: 'Applying the H gate puts the qubit into superposition.'
      },
      {
        id: 'qf-sp-check-1',
        type: 'knowledge-check',
        question: 'Which gate is most commonly used to create superposition from a computational basis state?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'X Gate' },
          { id: 'opt2', text: 'Z Gate' },
          { id: 'opt3', text: 'Hadamard Gate' }
        ],
        correctOptionId: 'opt3',
        explanation: 'The Hadamard gate creates an equal superposition.',
        xp: 5
      },
      {
        id: 'qf-sp-check-2',
        type: 'knowledge-check',
        question: 'In an equal superposition state |+⟩, what is the probability of measuring 0?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: '100%' },
          { id: 'opt2', text: '50%' },
          { id: 'opt3', text: '0%' }
        ],
        correctOptionId: 'opt2',
        explanation: 'The state |+⟩ yields 0 or 1 with 50% probability each upon measurement.',
        xp: 5
      }
    ]
  },
  {
    id: 'qf-quantum-measurement',
    courseId: 'quantum-foundations',
    pathId: 'quantum-foundations',
    title: 'Quantum Measurement',
    description: 'Learn what happens when we observe a quantum state.',
    objectives: [
      'Understand measurement outcomes',
      'Learn the Born rule',
      'Explore wavefunction collapse'
    ],
    duration: '20 min',
    xp: 25,
    difficulty: 'beginner',
    order: 4,
    topic: 'measurement',
    prerequisites: ['qf-superposition'],
    contentBlocks: [
      {
        id: 'qf-qm-heading-1',
        type: 'heading',
        level: 2,
        text: 'Observing the Quantum World'
      },
      {
        id: 'qf-qm-text-1',
        type: 'text',
        content: 'When we measure a qubit in superposition, it "collapses" into one of the basis states. The probability of each outcome is given by the square of the magnitude of its amplitude.'
      },
      {
        id: 'qf-qm-callout-1',
        type: 'callout',
        calloutType: 'warning',
        title: 'Irreversible Process',
        content: 'Measurement is irreversible. Once you measure a qubit in superposition, its original quantum state is destroyed.'
      },
      {
        id: 'qf-qm-formula-1',
        type: 'formula',
        expression: 'P(0) = |\\\\alpha|^2, P(1) = |\\\\beta|^2',
        label: 'Born Rule'
      },
      {
        id: 'qf-qm-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit, ClassicalRegister, QuantumRegister\n\nqr = QuantumRegister(1)\ncr = ClassicalRegister(1)\nqc = QuantumCircuit(qr, cr)\n\nqc.h(0)\nqc.measure(0, 0)',
        explanation: 'We measure qubit 0 and store the result in classical bit 0.'
      },
      {
        id: 'qf-qm-check-1',
        type: 'knowledge-check',
        question: 'Measurement in quantum mechanics is a reversible process.',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' }
        ],
        correctOptionId: 'false',
        explanation: 'Measurement causes wavefunction collapse, which is irreversible.',
        xp: 5
      },
      {
        id: 'qf-qm-check-2',
        type: 'knowledge-check',
        question: 'What rule dictates the probability of measurement outcomes based on amplitudes?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Born Rule' },
          { id: 'opt2', text: 'Golden Rule' },
          { id: 'opt3', text: 'Feynman Rule' }
        ],
        correctOptionId: 'opt1',
        explanation: 'The Born rule gives the probability as the absolute square of the amplitude.',
        xp: 5
      }
    ]
  },
  {
    id: 'qf-quantum-gates',
    courseId: 'quantum-foundations',
    pathId: 'quantum-foundations',
    title: 'Quantum Gates',
    description: 'Learn how to manipulate qubits using quantum gates.',
    objectives: [
      'Understand what gates do',
      'Learn Pauli X, Y, Z gates',
      'Understand gate matrices'
    ],
    duration: '30 min',
    xp: 25,
    difficulty: 'beginner',
    order: 5,
    topic: 'gates',
    prerequisites: ['qf-quantum-measurement'],
    contentBlocks: [
      {
        id: 'qf-qg-heading-1',
        type: 'heading',
        level: 2,
        text: 'Manipulating Qubits'
      },
      {
        id: 'qf-qg-text-1',
        type: 'text',
        content: 'Quantum gates alter the state of a qubit. They are represented by unitary matrices. The X gate acts like a classical NOT gate, flipping |0⟩ to |1⟩.'
      },
      {
        id: 'qf-qg-formula-1',
        type: 'formula',
        expression: 'X = \\\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\\\end{pmatrix}',
        label: 'Pauli-X Matrix'
      },
      {
        id: 'qf-qg-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\nqc.x(0) # Applies X gate (NOT)\nqc.z(0) # Applies Z gate (Phase flip)',
        explanation: 'Applying different single-qubit gates.'
      },
      {
        id: 'qf-qg-check-1',
        type: 'knowledge-check',
        question: 'Which quantum gate is equivalent to the classical NOT gate?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Hadamard Gate' },
          { id: 'opt2', text: 'Pauli-X Gate' },
          { id: 'opt3', text: 'Pauli-Z Gate' }
        ],
        correctOptionId: 'opt2',
        explanation: 'The Pauli-X gate flips |0⟩ to |1⟩ and vice versa.',
        xp: 5
      },
      {
        id: 'qf-qg-check-2',
        type: 'knowledge-check',
        question: 'Quantum gates are represented mathematically by...',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Unitary matrices' },
          { id: 'opt2', text: 'Scalar values' },
          { id: 'opt3', text: 'Differential equations' }
        ],
        correctOptionId: 'opt1',
        explanation: 'Unitary matrices preserve the total probability of the quantum state (which must sum to 1).',
        xp: 5
      }
    ]
  },
  {
    id: 'qf-build-first-circuit',
    courseId: 'quantum-foundations',
    pathId: 'quantum-foundations',
    title: 'Build Your First Circuit',
    description: 'Put it all together and build a complete quantum circuit.',
    objectives: [
      'Initialize qubits',
      'Apply sequential gates',
      'Measure and interpret results'
    ],
    duration: '30 min',
    xp: 25,
    difficulty: 'beginner',
    order: 6,
    topic: 'circuits',
    prerequisites: ['qf-quantum-gates'],
    contentBlocks: [
      {
        id: 'qf-bfc-heading-1',
        type: 'heading',
        level: 2,
        text: 'The Quantum Circuit Model'
      },
      {
        id: 'qf-bfc-text-1',
        type: 'text',
        content: 'A quantum circuit is a computational routine consisting of coherent quantum operations on quantum data, such as qubits, and concurrent real-time classical computation.'
      },
      {
        id: 'qf-bfc-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\n# Create a circuit with 1 qubit and 1 classical bit\nqc = QuantumCircuit(1, 1)\n\n# Apply gates\nqc.h(0)\nqc.x(0)\n\n# Measure\nqc.measure(0, 0)\n\nprint(qc.draw())',
        explanation: 'This complete script creates a superposition, flips the state, and then measures it.'
      },
      {
        id: 'qf-bfc-interactive-1',
        type: 'interactive',
        interactiveType: 'circuit-builder',
        title: 'Circuit Builder',
        description: 'Drag and drop gates to build your circuit.'
      },
      {
        id: 'qf-bfc-check-1',
        type: 'knowledge-check',
        question: 'In a quantum circuit diagram, what do the horizontal lines represent?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Time evolution of qubits' },
          { id: 'opt2', text: 'Physical wires' },
          { id: 'opt3', text: 'Energy levels' }
        ],
        correctOptionId: 'opt1',
        explanation: 'Horizontal lines represent qubits evolving over time, from left to right.',
        xp: 5
      },
      {
        id: 'qf-bfc-check-2',
        type: 'knowledge-check',
        question: 'Classical bits are used in quantum circuits primarily for...',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Speeding up computation' },
          { id: 'opt2', text: 'Storing measurement results' },
          { id: 'opt3', text: 'Cooling the qubits' }
        ],
        correctOptionId: 'opt2',
        explanation: 'Classical bits store the final 0 or 1 outcome obtained after measurement.',
        xp: 5
      }
    ]
  }
];
