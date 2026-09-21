import { CircuitTemplate } from '../../types/circuit';

export const CIRCUIT_TEMPLATES: CircuitTemplate[] = [
  {
    id: 'bell-state',
    name: 'Bell State',
    description: 'Creates a maximally entangled state between two qubits.',
    initialState: {
      numQubits: 2,
      operations: [
        { id: '1', type: 'H', target: 0, moment: 0 },
        { id: '2', type: 'CX', control: 0, target: 1, moment: 1 }
      ]
    }
  },
  {
    id: 'ghz-state',
    name: 'GHZ State',
    description: 'Creates a 3-qubit entangled state.',
    initialState: {
      numQubits: 3,
      operations: [
        { id: '1', type: 'H', target: 0, moment: 0 },
        { id: '2', type: 'CX', control: 0, target: 1, moment: 1 },
        { id: '3', type: 'CX', control: 1, target: 2, moment: 2 }
      ]
    }
  },
  {
    id: 'grover-2qubit',
    name: "Grover's Search (2 Qubits)",
    description: "Searches for the target item |11⟩ in an unsorted 4-element database using amplitude amplification.",
    initialState: {
      numQubits: 2,
      operations: [
        { id: 'g-h0', type: 'H', target: 0, moment: 0 },
        { id: 'g-h1', type: 'H', target: 1, moment: 0 },
        { id: 'g-cz', type: 'CZ', control: 0, target: 1, moment: 1 },
        { id: 'g-dh0', type: 'H', target: 0, moment: 2 },
        { id: 'g-dh1', type: 'H', target: 1, moment: 2 },
        { id: 'g-dx0', type: 'X', target: 0, moment: 3 },
        { id: 'g-dx1', type: 'X', target: 1, moment: 3 },
        { id: 'g-dcz', type: 'CZ', control: 0, target: 1, moment: 4 },
        { id: 'g-dx0b', type: 'X', target: 0, moment: 5 },
        { id: 'g-dx1b', type: 'X', target: 1, moment: 5 },
        { id: 'g-dh0b', type: 'H', target: 0, moment: 6 },
        { id: 'g-dh1b', type: 'H', target: 1, moment: 6 },
        { id: 'g-m0', type: 'M', target: 0, moment: 7 },
        { id: 'g-m1', type: 'M', target: 1, moment: 7 },
      ]
    }
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    description: 'Determines whether an oracle function is constant or balanced in a single evaluation.',
    initialState: {
      numQubits: 2,
      operations: [
        { id: 'dj-x1', type: 'X', target: 1, moment: 0 },
        { id: 'dj-h0', type: 'H', target: 0, moment: 1 },
        { id: 'dj-h1', type: 'H', target: 1, moment: 1 },
        { id: 'dj-cx', type: 'CX', control: 0, target: 1, moment: 2 },
        { id: 'dj-h0b', type: 'H', target: 0, moment: 3 },
        { id: 'dj-m0', type: 'M', target: 0, moment: 4 },
      ]
    }
  },
  {
    id: 'bernstein-vazirani',
    name: 'Bernstein-Vazirani Algorithm',
    description: 'Recovers a hidden n-bit secret string with 100% confidence using only 1 query.',
    initialState: {
      numQubits: 3,
      operations: [
        { id: 'bv-x2', type: 'X', target: 2, moment: 0 },
        { id: 'bv-h0', type: 'H', target: 0, moment: 1 },
        { id: 'bv-h1', type: 'H', target: 1, moment: 1 },
        { id: 'bv-h2', type: 'H', target: 2, moment: 1 },
        { id: 'bv-cx0', type: 'CX', control: 0, target: 2, moment: 2 },
        { id: 'bv-cx1', type: 'CX', control: 1, target: 2, moment: 3 },
        { id: 'bv-h0b', type: 'H', target: 0, moment: 4 },
        { id: 'bv-h1b', type: 'H', target: 1, moment: 4 },
        { id: 'bv-m0', type: 'M', target: 0, moment: 5 },
        { id: 'bv-m1', type: 'M', target: 1, moment: 5 },
      ]
    }
  },
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    description: 'Teleports an arbitrary quantum state using an EPR Bell pair and 2 classical bits.',
    initialState: {
      numQubits: 3,
      operations: [
        { id: 'qt-prep', type: 'H', target: 0, moment: 0 },
        { id: 'qt-t', type: 'T', target: 0, moment: 1 },
        { id: 'qt-bell-h', type: 'H', target: 1, moment: 2 },
        { id: 'qt-bell-cx', type: 'CX', control: 1, target: 2, moment: 3 },
        { id: 'qt-alice-cx', type: 'CX', control: 0, target: 1, moment: 4 },
        { id: 'qt-alice-h', type: 'H', target: 0, moment: 5 },
        { id: 'qt-m0', type: 'M', target: 0, moment: 6 },
        { id: 'qt-m1', type: 'M', target: 1, moment: 6 },
      ]
    }
  },
  {
    id: 'superdense-coding',
    name: 'Superdense Coding',
    description: 'Transmits 2 classical bits by sending 1 physical qubit using shared entanglement.',
    initialState: {
      numQubits: 2,
      operations: [
        { id: 'sd-bell-h', type: 'H', target: 0, moment: 0 },
        { id: 'sd-bell-cx', type: 'CX', control: 0, target: 1, moment: 1 },
        { id: 'sd-encode-z', type: 'Z', target: 0, moment: 2 },
        { id: 'sd-encode-x', type: 'X', target: 0, moment: 3 },
        { id: 'sd-decode-cx', type: 'CX', control: 0, target: 1, moment: 4 },
        { id: 'sd-decode-h', type: 'H', target: 0, moment: 5 },
        { id: 'sd-m0', type: 'M', target: 0, moment: 6 },
        { id: 'sd-m1', type: 'M', target: 1, moment: 6 },
      ]
    }
  },
  {
    id: 'qft-3qubit',
    name: '3-Qubit Quantum Fourier Transform',
    description: 'Transforms computational basis into phase basis via Hadamards and controlled-phase rotations.',
    initialState: {
      numQubits: 3,
      operations: [
        { id: 'qft-h0', type: 'H', target: 0, moment: 0 },
        { id: 'qft-s1', type: 'S', target: 0, moment: 1 },
        { id: 'qft-t2', type: 'T', target: 0, moment: 2 },
        { id: 'qft-h1', type: 'H', target: 1, moment: 3 },
        { id: 'qft-s2', type: 'S', target: 1, moment: 4 },
        { id: 'qft-h2', type: 'H', target: 2, moment: 5 },
        { id: 'qft-sw', type: 'SWAP', control: 0, target: 2, moment: 6 },
      ]
    }
  }
];
