export interface SimulationRequest {
  circuit: {
    numQubits: number;
    operations: {
      id: string;
      type: string;
      target: number;
      control?: number;
      moment: number;
    }[];
  };
  shots: number;
}

export interface ComplexAmplitude {
  real: number;
  imag: number;
  magnitude: number;
  probability: number;
  phase: number;
}

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export interface SimulationStep {
  operationIndex: number;
  statevector?: Record<string, ComplexAmplitude>;
  blochVectors?: Record<number, BlochVector>;
}

export interface SimulationResult {
  success: boolean;
  backend: string;
  shots: number;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
  statevector?: Record<string, ComplexAmplitude>;
  blochVectors?: Record<number, BlochVector>;
  steps?: SimulationStep[];
  executionTimeMs: number;
  metadata: {
    depth: number;
    gateCount: number;
  };
  timestamp: string;
  error?: string;
}
