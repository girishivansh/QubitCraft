import { SimulationRequest, SimulationResult, ComplexAmplitude, BlochVector } from './simulationTypes';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const API_URL = `${API_BASE_URL}/api/simulate`;

// Complex number helpers
interface Complex {
  r: number;
  i: number;
}

function cAdd(a: Complex, b: Complex): Complex {
  return { r: a.r + b.r, i: a.i + b.i };
}

function cMult(a: Complex, b: Complex): Complex {
  return { r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r };
}

function cMagSq(a: Complex): number {
  return a.r * a.r + a.i * a.i;
}

function cPhase(a: Complex): number {
  return Math.atan2(a.i, a.r);
}

// Single-qubit unitary matrices 2x2: [[u00, u01], [u10, u11]]
const INV_SQRT2 = 1 / Math.SQRT2;

const GATE_MATRICES: Record<string, [[Complex, Complex], [Complex, Complex]]> = {
  H: [
    [{ r: INV_SQRT2, i: 0 }, { r: INV_SQRT2, i: 0 }],
    [{ r: INV_SQRT2, i: 0 }, { r: -INV_SQRT2, i: 0 }]
  ],
  X: [
    [{ r: 0, i: 0 }, { r: 1, i: 0 }],
    [{ r: 1, i: 0 }, { r: 0, i: 0 }]
  ],
  Y: [
    [{ r: 0, i: 0 }, { r: 0, i: -1 }],
    [{ r: 0, i: 1 }, { r: 0, i: 0 }]
  ],
  Z: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: -1, i: 0 }]
  ],
  S: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: 0, i: 1 }]
  ],
  SDG: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: 0, i: -1 }]
  ],
  T: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: INV_SQRT2, i: INV_SQRT2 }]
  ],
  TDG: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: INV_SQRT2, i: -INV_SQRT2 }]
  ]
};

function simulateClientSide(request: SimulationRequest): SimulationResult {
  const startTime = performance.now();
  const numQubits = Math.min(Math.max(1, request.circuit.numQubits), 6);
  const dim = 1 << numQubits;
  const shots = request.shots || 1024;

  // Initialize state vector to |0...0>
  const state: Complex[] = Array.from({ length: dim }, (_, i) => ({
    r: i === 0 ? 1 : 0,
    i: 0
  }));

  // Sort operations by moment
  const ops = [...request.circuit.operations].sort((a, b) => a.moment - b.moment);

  // Apply operations sequentially
  for (const op of ops) {
    const target = op.target;
    const control = op.control;

    if (op.type === 'M') {
      // Measurement is sampled at the end
      continue;
    }

    if (op.type === 'CX' && control !== undefined) {
      // CNOT gate: if control bit is 1, flip target bit
      for (let i = 0; i < dim; i++) {
        const isControlOne = (i & (1 << (numQubits - 1 - control))) !== 0;
        const isTargetZero = (i & (1 << (numQubits - 1 - target))) === 0;

        if (isControlOne && isTargetZero) {
          const partner = i | (1 << (numQubits - 1 - target));
          const temp = state[i];
          state[i] = state[partner];
          state[partner] = temp;
        }
      }
    } else if (op.type === 'CZ' && control !== undefined) {
      // CZ gate: if both control and target are 1, multiply amplitude by -1
      for (let i = 0; i < dim; i++) {
        const isControlOne = (i & (1 << (numQubits - 1 - control))) !== 0;
        const isTargetOne = (i & (1 << (numQubits - 1 - target))) !== 0;
        if (isControlOne && isTargetOne) {
          state[i] = { r: -state[i].r, i: -state[i].i };
        }
      }
    } else if (op.type === 'SWAP' && control !== undefined) {
      // SWAP gate between target and control
      for (let i = 0; i < dim; i++) {
        const bit1 = (i >> (numQubits - 1 - target)) & 1;
        const bit2 = (i >> (numQubits - 1 - control)) & 1;
        if (bit1 !== bit2 && bit1 === 0) {
          const partner = (i | (1 << (numQubits - 1 - target))) & ~(1 << (numQubits - 1 - control));
          const temp = state[i];
          state[i] = state[partner];
          state[partner] = temp;
        }
      }
    } else if (GATE_MATRICES[op.type]) {
      // Single qubit gate
      const [row0, row1] = GATE_MATRICES[op.type];
      const targetBit = 1 << (numQubits - 1 - target);

      for (let i = 0; i < dim; i++) {
        if ((i & targetBit) === 0) {
          const i0 = i;
          const i1 = i | targetBit;
          const a0 = state[i0];
          const a1 = state[i1];

          state[i0] = cAdd(cMult(row0[0], a0), cMult(row0[1], a1));
          state[i1] = cAdd(cMult(row1[0], a0), cMult(row1[1], a1));
        }
      }
    }
  }

  // Calculate probabilities and statevector dictionary
  const probabilities: Record<string, number> = {};
  const statevector: Record<string, ComplexAmplitude> = {};

  for (let i = 0; i < dim; i++) {
    const bitStr = i.toString(2).padStart(numQubits, '0');
    const amp = state[i];
    const magSq = cMagSq(amp);
    const mag = Math.sqrt(magSq);
    const prob = Math.min(1, Math.max(0, magSq));
    const phase = cPhase(amp);

    probabilities[bitStr] = prob;
    statevector[bitStr] = {
      real: amp.r,
      imag: amp.i,
      magnitude: mag,
      probability: prob,
      phase: phase
    };
  }

  // Sample counts from probabilities
  const counts: Record<string, number> = {};
  const entries = Object.entries(probabilities);
  
  for (let s = 0; s < shots; s++) {
    const rand = Math.random();
    let cumulative = 0;
    let chosen = entries[entries.length - 1][0];

    for (const [stateStr, prob] of entries) {
      cumulative += prob;
      if (rand <= cumulative) {
        chosen = stateStr;
        break;
      }
    }
    counts[chosen] = (counts[chosen] || 0) + 1;
  }

  // Calculate single-qubit Bloch vectors
  const blochVectors: Record<number, BlochVector> = {};
  for (let q = 0; q < numQubits; q++) {
    const bitMask = 1 << (numQubits - 1 - q);
    let z = 0;
    let x = 0;
    let y = 0;

    for (let i = 0; i < dim; i++) {
      const prob = cMagSq(state[i]);
      if ((i & bitMask) === 0) {
        z += prob;
        const partner = i | bitMask;
        // x = 2 * Re(a0 * conj(a1))
        x += 2 * (state[i].r * state[partner].r + state[i].i * state[partner].i);
        // y = 2 * Im(conj(a0) * a1)
        y += 2 * (state[i].r * state[partner].i - state[i].i * state[partner].r);
      } else {
        z -= prob;
      }
    }

    blochVectors[q] = {
      x: Math.min(1, Math.max(-1, x)),
      y: Math.min(1, Math.max(-1, y)),
      z: Math.min(1, Math.max(-1, z))
    };
  }

  const executionTimeMs = performance.now() - startTime;
  const depth = ops.length > 0 ? Math.max(...ops.map(o => o.moment)) + 1 : 0;

  return {
    success: true,
    backend: 'Client Quantum Engine (Aer Compatible)',
    shots,
    counts,
    probabilities,
    statevector,
    blochVectors,
    executionTimeMs,
    metadata: {
      depth,
      gateCount: ops.length
    },
    timestamp: new Date().toISOString()
  };
}

export const simulationService = {
  async runSimulation(request: SimulationRequest): Promise<SimulationResult> {
    try {
      // Try backend first with a quick 3-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result: SimulationResult = await response.json();
        return result;
      }
    } catch {
      // Fallback seamlessly to high-fidelity client-side simulation
    }

    return simulateClientSide(request);
  }
};
