import { GateType, GateInfo } from '../../types/circuit';

export const GATE_INFO: Record<GateType, GateInfo> = {
  H: { type: 'H', name: 'Hadamard', description: 'Creates a superposition state.', category: 'single', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  X: { type: 'X', name: 'Pauli-X', description: 'Bit-flip gate (quantum NOT).', category: 'single', color: 'bg-green-100 border-green-300 text-green-800' },
  Y: { type: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip.', category: 'single', color: 'bg-green-100 border-green-300 text-green-800' },
  Z: { type: 'Z', name: 'Pauli-Z', description: 'Phase flip gate.', category: 'single', color: 'bg-green-100 border-green-300 text-green-800' },
  S: { type: 'S', name: 'S Gate', description: 'sqrt(Z) phase gate.', category: 'single', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  T: { type: 'T', name: 'T Gate', description: 'sqrt(S) phase gate.', category: 'single', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  SDG: { type: 'SDG', name: 'S-dagger', description: 'Inverse S gate.', category: 'single', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  TDG: { type: 'TDG', name: 'T-dagger', description: 'Inverse T gate.', category: 'single', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  CX: { type: 'CX', name: 'CNOT', description: 'Controlled-X gate.', category: 'multi', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  CZ: { type: 'CZ', name: 'Controlled-Z', description: 'Controlled-Z gate.', category: 'multi', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  SWAP: { type: 'SWAP', name: 'SWAP', description: 'Swaps two qubits.', category: 'multi', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  M: { type: 'M', name: 'Measure', description: 'Measures the qubit.', category: 'measurement', color: 'bg-gray-200 border-gray-400 text-gray-800' }
};
