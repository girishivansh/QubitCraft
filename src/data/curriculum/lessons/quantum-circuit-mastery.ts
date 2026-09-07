import type { Lesson } from '../../../types/curriculum';

export const QUANTUM_CIRCUIT_MASTERY_LESSONS: Lesson[] = [
  {
    id: 'qcm-circuit-fundamentals',
    courseId: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'Circuit Fundamentals',
    description: 'Learn the advanced basics of quantum circuits, wiring, and measurement mapping.',
    objectives: [
      'Understand circuit diagrams deeply',
      'Map qubits to classical bits',
      'Analyze circuit depth'
    ],
    duration: '25 min',
    xp: 25,
    difficulty: 'intermediate',
    order: 1,
    topic: 'circuits',
    prerequisites: [],
    contentBlocks: [
      {
        id: 'qcm-cf-heading-1',
        type: 'heading',
        level: 2,
        text: 'Beyond the Basics'
      },
      {
        id: 'qcm-cf-text-1',
        type: 'text',
        content: 'Quantum circuits are read from left to right. The number of operations on the longest path determines the circuit depth. Deep circuits are more susceptible to noise.'
      },
      {
        id: 'qcm-cf-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure([0,1], [0,1])',
        explanation: 'Mapping multiple qubits to multiple classical bits.'
      },
      {
        id: 'qcm-cf-check-1',
        type: 'knowledge-check',
        question: 'What is circuit depth?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'The number of qubits' },
          { id: 'opt2', text: 'The length of the longest path of sequential gates' },
          { id: 'opt3', text: 'The total number of gates' }
        ],
        correctOptionId: 'opt2',
        explanation: 'Circuit depth represents the time complexity, measured by the longest sequence of dependent gates.',
        xp: 5
      }
    ]
  },
  {
    id: 'qcm-single-qubit-gates',
    courseId: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'Single-Qubit Gates',
    description: 'Master rotations and phase shifts on a single qubit.',
    objectives: [
      'Understand Pauli Y gate',
      'Learn phase gates (S, T)',
      'Master arbitrary rotations (Rx, Ry, Rz)'
    ],
    duration: '30 min',
    xp: 25,
    difficulty: 'intermediate',
    order: 2,
    topic: 'gates',
    prerequisites: ['qcm-circuit-fundamentals'],
    contentBlocks: [
      {
        id: 'qcm-sqg-heading-1',
        type: 'heading',
        level: 2,
        text: 'Phase and Rotations'
      },
      {
        id: 'qcm-sqg-text-1',
        type: 'text',
        content: 'While X, Y, and Z represent 180-degree rotations around the Bloch sphere axes, we can also perform arbitrary rotations using Rx, Ry, and Rz gates.'
      },
      {
        id: 'qcm-sqg-formula-1',
        type: 'formula',
        expression: 'R_z(\\\\theta) = \\\\begin{pmatrix} e^{-i\\\\theta/2} & 0 \\\\ 0 & e^{i\\\\theta/2} \\\\end{pmatrix}',
        label: 'Z-Rotation Matrix'
      },
      {
        id: 'qcm-sqg-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\nimport math\n\nqc = QuantumCircuit(1)\nqc.rx(math.pi/2, 0) # 90 degree rotation around X',
        explanation: 'Using parameterized rotation gates.'
      },
      {
        id: 'qcm-sqg-check-1',
        type: 'knowledge-check',
        question: 'Which gate applies a 90-degree (pi/2) phase shift?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Z gate' },
          { id: 'opt2', text: 'S gate' },
          { id: 'opt3', text: 'T gate' }
        ],
        correctOptionId: 'opt2',
        explanation: 'The S gate is the square root of the Z gate and applies a 90-degree phase shift.',
        xp: 5
      }
    ]
  },
  {
    id: 'qcm-multi-qubit-gates',
    courseId: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'Multi-Qubit Gates',
    description: 'Learn how to perform operations on multiple qubits simultaneously.',
    objectives: [
      'Understand tensor products',
      'Learn controlled operations',
      'Explore the multi-qubit state space'
    ],
    duration: '30 min',
    xp: 25,
    difficulty: 'intermediate',
    order: 3,
    topic: 'gates',
    prerequisites: ['qcm-single-qubit-gates'],
    contentBlocks: [
      {
        id: 'qcm-mqg-heading-1',
        type: 'heading',
        level: 2,
        text: 'Expanding the State Space'
      },
      {
        id: 'qcm-mqg-text-1',
        type: 'text',
        content: 'With n qubits, the state space grows to 2^n amplitudes. We use the tensor product to combine single-qubit states into multi-qubit states.'
      },
      {
        id: 'qcm-mqg-callout-1',
        type: 'callout',
        calloutType: 'important',
        title: 'Exponential Growth',
        content: 'A 300-qubit system has more states than there are atoms in the observable universe!'
      },
      {
        id: 'qcm-mqg-check-1',
        type: 'knowledge-check',
        question: 'How many complex amplitudes are required to describe a 4-qubit system?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: '4' },
          { id: 'opt2', text: '8' },
          { id: 'opt3', text: '16' }
        ],
        correctOptionId: 'opt3',
        explanation: 'The state space is 2^n. For 4 qubits, 2^4 = 16.',
        xp: 5
      }
    ]
  },
  {
    id: 'qcm-cnot-gate',
    courseId: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'The CNOT Gate',
    description: 'Understand the fundamental two-qubit gate used for entanglement.',
    objectives: [
      'Understand controlled-NOT operations',
      'Analyze the CNOT truth table',
      'Learn about entangling power'
    ],
    duration: '25 min',
    xp: 25,
    difficulty: 'intermediate',
    order: 4,
    topic: 'gates',
    prerequisites: ['qcm-multi-qubit-gates'],
    contentBlocks: [
      {
        id: 'qcm-cnot-heading-1',
        type: 'heading',
        level: 2,
        text: 'Conditional Quantum Logic'
      },
      {
        id: 'qcm-cnot-text-1',
        type: 'text',
        content: 'The Controlled-NOT (CNOT or CX) gate flips the target qubit ONLY if the control qubit is in the |1⟩ state.'
      },
      {
        id: 'qcm-cnot-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.cx(0, 1) # Control is qubit 0, target is qubit 1',
        explanation: 'Applying the CNOT gate.'
      },
      {
        id: 'qcm-cnot-check-1',
        type: 'knowledge-check',
        question: 'If the control qubit is |0⟩ and the target qubit is |1⟩, what is the output of a CNOT gate?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: '|00⟩' },
          { id: 'opt2', text: '|01⟩' },
          { id: 'opt3', text: '|11⟩' }
        ],
        correctOptionId: 'opt2',
        explanation: 'Since the control is |0⟩, the target remains unchanged. State is |01⟩.',
        xp: 5
      }
    ]
  },
  {
    id: 'qcm-quantum-entanglement',
    courseId: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'Quantum Entanglement',
    description: 'Discover the mysterious quantum connection between particles.',
    objectives: [
      'Understand what entanglement is',
      'Learn about EPR pairs',
      'Explore non-locality'
    ],
    duration: '35 min',
    xp: 25,
    difficulty: 'intermediate',
    order: 5,
    topic: 'entanglement',
    prerequisites: ['qcm-cnot-gate'],
    contentBlocks: [
      {
        id: 'qcm-qe-heading-1',
        type: 'heading',
        level: 2,
        text: 'Spooky Action at a Distance'
      },
      {
        id: 'qcm-qe-text-1',
        type: 'text',
        content: 'Entanglement occurs when multiple qubits are linked such that the state of one cannot be described independently of the state of the others, regardless of the distance separating them.'
      },
      {
        id: 'qcm-qe-callout-1',
        type: 'callout',
        calloutType: 'note',
        title: "Einstein's Skepticism",
        content: 'Albert Einstein famously referred to entanglement as "spooky action at a distance."'
      },
      {
        id: 'qcm-qe-check-1',
        type: 'knowledge-check',
        question: 'Can entangled particles be used to transmit information faster than light?',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' }
        ],
        correctOptionId: 'false',
        explanation: 'According to the no-communication theorem, entanglement cannot be used to transmit classical information faster than light.',
        xp: 5
      }
    ]
  },
  {
    id: 'qcm-bell-states',
    courseId: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'Bell States',
    description: 'Learn how to create the four maximally entangled two-qubit states.',
    objectives: [
      'Identify all four Bell states',
      'Create Bell states using circuits',
      'Understand their properties'
    ],
    duration: '30 min',
    xp: 25,
    difficulty: 'intermediate',
    order: 6,
    topic: 'entanglement',
    prerequisites: ['qcm-quantum-entanglement'],
    contentBlocks: [
      {
        id: 'qcm-bs-heading-1',
        type: 'heading',
        level: 2,
        text: 'The Maximally Entangled States'
      },
      {
        id: 'qcm-bs-text-1',
        type: 'text',
        content: 'The four Bell states are specific two-qubit states that represent the simplest examples of quantum entanglement. The most common is the Φ+ state.'
      },
      {
        id: 'qcm-bs-formula-1',
        type: 'formula',
        expression: '|\\\\Phi^+\\\\rangle = \\\\frac{1}{\\\\sqrt{2}}(|00\\\\rangle + |11\\\\rangle)',
        label: 'Bell State Phi+'
      },
      {
        id: 'qcm-bs-code-1',
        type: 'code',
        language: 'python',
        code: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)',
        explanation: 'This standard circuit creates the Φ+ Bell state from the |00⟩ basis.'
      },
      {
        id: 'qcm-bs-check-1',
        type: 'knowledge-check',
        question: 'If you measure the first qubit of the Φ+ state and get 0, what will you get if you measure the second qubit?',
        questionType: 'multiple-choice',
        options: [
          { id: 'opt1', text: '0' },
          { id: 'opt2', text: '1' },
          { id: 'opt3', text: 'It is random (50/50)' }
        ],
        correctOptionId: 'opt1',
        explanation: 'The state |00⟩ + |11⟩ guarantees that the measurement results will always perfectly correlate.',
        xp: 5
      }
    ]
  },
  {
    id: 'qcm-quantum-teleportation',
    courseId: 'quantum-circuit-mastery',
    pathId: 'quantum-circuit-mastery',
    title: 'Quantum Teleportation',
    description: 'Discover how to transfer quantum information without physically moving it.',
    objectives: [
      'Understand the teleportation protocol',
      'Build the teleportation circuit',
      'Learn about classical communication requirements'
    ],
    duration: '35 min',
    xp: 25,
    difficulty: 'intermediate',
    order: 7,
    topic: 'algorithms',
    prerequisites: ['qcm-bell-states'],
    contentBlocks: [
      {
        id: 'qcm-qt-heading-1',
        type: 'heading',
        level: 2,
        text: 'Teleporting Information'
      },
      {
        id: 'qcm-qt-text-1',
        type: 'text',
        content: 'Quantum teleportation is a process by which quantum information (e.g. the exact state of an atom or photon) can be transmitted from one location to another, with the help of classical communication and previously shared quantum entanglement between the sending and receiving location.'
      },
      {
        id: 'qcm-qt-callout-1',
        type: 'callout',
        calloutType: 'warning',
        title: 'No Cloning',
        content: 'Due to the no-cloning theorem, the original quantum state is destroyed during the teleportation process.'
      },
      {
        id: 'qcm-qt-check-1',
        type: 'knowledge-check',
        question: 'Does quantum teleportation allow for faster-than-light communication?',
        questionType: 'true-false',
        options: [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' }
        ],
        correctOptionId: 'false',
        explanation: 'It requires classical communication to send the measurement results, which limits it to the speed of light.',
        xp: 5
      }
    ]
  }
];
