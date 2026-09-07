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
  }
];
