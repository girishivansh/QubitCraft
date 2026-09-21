import { GateType, GateInfo } from '../../types/circuit';

export const GATE_INFO: Record<GateType, GateInfo> = {
  H: { type: 'H', name: 'Hadamard', description: 'Creates a superposition state.', category: 'single', color: 'bg-blue-100 dark:bg-blue-900/60 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200' },
  X: { type: 'X', name: 'Pauli-X', description: 'Bit-flip gate (quantum NOT).', category: 'single', color: 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200' },
  Y: { type: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip.', category: 'single', color: 'bg-teal-100 dark:bg-teal-900/60 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200' },
  Z: { type: 'Z', name: 'Pauli-Z', description: 'Phase flip gate.', category: 'single', color: 'bg-cyan-100 dark:bg-cyan-900/60 border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-200' },
  S: { type: 'S', name: 'S Gate', description: 'sqrt(Z) phase gate.', category: 'single', color: 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200' },
  T: { type: 'T', name: 'T Gate', description: 'sqrt(S) phase gate.', category: 'single', color: 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200' },
  SDG: { type: 'SDG', name: 'S-dagger', description: 'Inverse S gate.', category: 'single', color: 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200' },
  TDG: { type: 'TDG', name: 'T-dagger', description: 'Inverse T gate.', category: 'single', color: 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200' },
  CX: { type: 'CX', name: 'CNOT', description: 'Controlled-X gate.', category: 'multi', color: 'bg-purple-100 dark:bg-purple-900/60 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200' },
  CZ: { type: 'CZ', name: 'Controlled-Z', description: 'Controlled-Z gate.', category: 'multi', color: 'bg-purple-100 dark:bg-purple-900/60 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200' },
  SWAP: { type: 'SWAP', name: 'SWAP', description: 'Swaps two qubits.', category: 'multi', color: 'bg-purple-100 dark:bg-purple-900/60 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200' },
  M: { type: 'M', name: 'Measure', description: 'Measures the qubit.', category: 'measurement', color: 'bg-gray-200 dark:bg-slate-700 border-gray-400 dark:border-slate-500 text-gray-800 dark:text-slate-200' }
};
