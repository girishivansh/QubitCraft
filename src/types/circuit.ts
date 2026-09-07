export type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'SDG' | 'TDG' | 'CX' | 'CZ' | 'SWAP' | 'M';

export interface GateInfo {
  type: GateType;
  name: string;
  description: string;
  category: 'single' | 'multi' | 'measurement';
  matrix?: [number, number][][]; // Optional for now
  color?: string; // UI color representation
}

export interface GateOperation {
  id: string; // Unique ID for the operation instance
  type: GateType;
  target: number; // Qubit index (row)
  control?: number; // Optional control qubit index for multi-qubit gates
  moment: number; // Moment index (column)
}

export interface CircuitState {
  numQubits: number;
  operations: GateOperation[];
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  circuit: CircuitState;
  createdAt: string;
  updatedAt: string;
}

export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  initialState: CircuitState;
}
