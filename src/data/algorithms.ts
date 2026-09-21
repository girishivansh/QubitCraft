import { GateOperation } from '../types/circuit';

export interface AlgorithmStep {
  stepNumber: number;
  title: string;
  description: string;
  mathNotation: string;
  activeGates: string[];
  probabilities: Record<string, number>; // e.g. { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 }
  qubitStates?: Record<number, { theta: number; phi: number; label: string }>;
  explanation: string;
}

export interface AlgorithmParameterOption {
  key: string;
  label: string;
  description: string;
  steps: AlgorithmStep[];
}

export interface QuantumAlgorithm {
  id: string;
  name: string;
  inventor: string;
  year: number;
  category: 'Oracular' | 'Search & Optimization' | 'Transforms' | 'Communication' | 'Cryptography';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  classicalComplexity: string;
  quantumComplexity: string;
  speedup: 'Exponential' | 'Quadratic' | 'Polynomial' | 'Communication Advantage';
  summary: string;
  templateId: string;
  numQubits: number;
  circuitOperations: GateOperation[];
  qiskitCode: string;
  openqasmCode: string;
  parameters?: {
    name: string;
    label: string;
    options: AlgorithmParameterOption[];
  };
  defaultSteps: AlgorithmStep[];
  theory: {
    problemStatement: string;
    howItWorks: string;
    mathematicalPrinciple: string;
    classicalVsQuantum: {
      metric: string;
      classical: string;
      quantum: string;
    }[];
    realWorldApplications: string[];
    limitations: string[];
  };
}

export const QUANTUM_ALGORITHMS: QuantumAlgorithm[] = [
  {
    id: 'grovers-algorithm',
    name: "Grover's Search Algorithm",
    inventor: "Lov Grover",
    year: 1996,
    category: 'Search & Optimization',
    difficulty: 'Intermediate',
    classicalComplexity: 'O(N)',
    quantumComplexity: 'O(√N)',
    speedup: 'Quadratic',
    summary: 'Finds a unique marked item in an unsorted database of N elements with high probability using amplitude amplification in roughly √N steps.',
    templateId: 'grover-2qubit',
    numQubits: 2,
    circuitOperations: [
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
    ],
    parameters: {
      name: 'targetState',
      label: 'Target State to Search',
      options: [
        {
          key: '11',
          label: '|11⟩ (Standard Oracle)',
          description: 'The oracle marks |11⟩ by flipping its phase using a CZ gate.',
          steps: [
            {
              stepNumber: 1,
              title: 'Initialization',
              description: 'All qubits are prepared in the computational ground state |00⟩.',
              mathNotation: '|ψ₀⟩ = |00⟩',
              activeGates: [],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: 'Before quantum operations begin, the quantum register is initialized to zero with 100% certainty in state |00⟩.'
            },
            {
              stepNumber: 2,
              title: 'Equal Superposition',
              description: 'Hadamard gates are applied to all qubits, creating a uniform superposition across all 4 database items.',
              mathNotation: '|ψ₁⟩ = H^{\\otimes 2}|00⟩ = \\frac{1}{2}(|00⟩ + |01⟩ + |10⟩ + |11⟩)',
              activeGates: ['H (q0)', 'H (q1)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Each item now has an equal amplitude of +0.5 and equal probability of 25% (1/4). No individual item is favored yet.'
            },
            {
              stepNumber: 3,
              title: 'Oracle Query (Phase Inversion)',
              description: 'The quantum oracle recognizes target |11⟩ and inverts its phase from +0.5 to -0.5.',
              mathNotation: 'U_ω|ψ₁⟩ = \\frac{1}{2}(|00⟩ + |01⟩ + |10⟩ - |11⟩)',
              activeGates: ['Oracle (CZ q0, q1)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Although the measurement probabilities are still 25% each (since |-0.5|² = 0.25), the phase of |11⟩ is now negative. The geometric mean of amplitudes is lowered to +0.25.'
            },
            {
              stepNumber: 4,
              title: 'Diffusion Operator (Inversion about Mean)',
              description: 'The Grover diffusion transform reflects all amplitudes about the new mean, constructively amplifying |11⟩ and canceling non-target states.',
              mathNotation: 'U_s = 2|s⟩⟨s| - I \\implies |ψ₃⟩ = 0|00⟩ + 0|01⟩ + 0|10⟩ + 1|11⟩',
              activeGates: ['H', 'X', 'CZ', 'X', 'H'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
              explanation: 'Amplitudes reflect over the mean: target amplitude (-0.5) flips to 2*(0.25) - (-0.5) = +1.0! Non-target amplitudes (+0.5) flip to 2*(0.25) - 0.5 = 0.0.'
            },
            {
              stepNumber: 5,
              title: 'Measurement',
              description: 'Both qubits are measured in the computational basis.',
              mathNotation: 'P(|11⟩) = 100\\%',
              activeGates: ['M (q0)', 'M (q1)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
              explanation: 'A single projective measurement reveals the target state |11⟩ with 100% theoretical fidelity in exactly 1 iteration.'
            }
          ]
        },
        {
          key: '10',
          label: '|10⟩ (Oracle for Item 2)',
          description: 'The oracle marks item |10⟩ by shifting its phase.',
          steps: [
            {
              stepNumber: 1,
              title: 'Initialization',
              description: 'Qubits start in state |00⟩.',
              mathNotation: '|ψ₀⟩ = |00⟩',
              activeGates: [],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: 'Register reset to |00⟩.'
            },
            {
              stepNumber: 2,
              title: 'Equal Superposition',
              description: 'Uniform superposition across all 4 database items.',
              mathNotation: '|ψ₁⟩ = \\frac{1}{2}(|00⟩ + |01⟩ + |10⟩ + |11⟩)',
              activeGates: ['H (q0)', 'H (q1)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Equal 25% probability for each state.'
            },
            {
              stepNumber: 3,
              title: 'Oracle Query (Phase Invert |10⟩)',
              description: 'The oracle marks state |10⟩ with a negative phase.',
              mathNotation: 'U_ω|ψ₁⟩ = \\frac{1}{2}(|00⟩ + |01⟩ - |10⟩ + |11⟩)',
              activeGates: ['Oracle (|10⟩)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'State |10⟩ amplitude inverted to -0.5.'
            },
            {
              stepNumber: 4,
              title: 'Diffusion Operator',
              description: 'Inversion about the mean concentrates probability into |10⟩.',
              mathNotation: '|ψ₃⟩ = 1|10⟩',
              activeGates: ['Diffusion Transform'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 },
              explanation: 'Destructive interference silences |00⟩, |01⟩, and |11⟩; constructive interference peaks at |10⟩.'
            },
            {
              stepNumber: 5,
              title: 'Measurement',
              description: 'Measurement yields |10⟩ with certainty.',
              mathNotation: 'P(|10⟩) = 100\\%',
              activeGates: ['M (q0)', 'M (q1)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 },
              explanation: 'Result collapses to |10⟩.'
            }
          ]
        },
        {
          key: '01',
          label: '|01⟩ (Oracle for Item 1)',
          description: 'The oracle marks item |01⟩.',
          steps: [
            {
              stepNumber: 1,
              title: 'Initialization',
              description: 'Qubits start in state |00⟩.',
              mathNotation: '|ψ₀⟩ = |00⟩',
              activeGates: [],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: 'Ground state initialized.'
            },
            {
              stepNumber: 2,
              title: 'Equal Superposition',
              description: 'Uniform superposition created by Hadamards.',
              mathNotation: '|ψ₁⟩ = \\frac{1}{2}(|00⟩ + |01⟩ + |10⟩ + |11⟩)',
              activeGates: ['H (q0)', 'H (q1)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'All 4 items have 25% probability.'
            },
            {
              stepNumber: 3,
              title: 'Oracle Query (Phase Invert |01⟩)',
              description: 'Target |01⟩ receives a -1 phase factor.',
              mathNotation: 'U_ω|ψ₁⟩ = \\frac{1}{2}(|00⟩ - |01⟩ + |10⟩ + |11⟩)',
              activeGates: ['Oracle (|01⟩)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: '|01⟩ amplitude becomes -0.5.'
            },
            {
              stepNumber: 4,
              title: 'Diffusion Operator',
              description: 'Amplitude amplification boosts |01⟩ to 100%.',
              mathNotation: '|ψ₃⟩ = 1|01⟩',
              activeGates: ['Diffusion Transform'],
              probabilities: { '00': 0.0, '01': 1.0, '10': 0.0, '11': 0.0 },
              explanation: 'Constructive interference boosts target item |01⟩.'
            },
            {
              stepNumber: 5,
              title: 'Measurement',
              description: 'Final measurement yields target item |01⟩.',
              mathNotation: 'P(|01⟩) = 100\\%',
              activeGates: ['M (q0)', 'M (q1)'],
              probabilities: { '00': 0.0, '01': 1.0, '10': 0.0, '11': 0.0 },
              explanation: 'Target found with 100% fidelity.'
            }
          ]
        }
      ]
    },
    defaultSteps: [], // will fallback to options[0].steps
    qiskitCode: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
import matplotlib.pyplot as plt

# Create 2-qubit Grover circuit for searching |11⟩
qc = QuantumCircuit(2, 2)

# Step 1: Initialize into uniform superposition
qc.h([0, 1])
qc.barrier()

# Step 2: Oracle for target |11⟩ (Controlled-Z flips phase of |11⟩)
qc.cz(0, 1)
qc.barrier()

# Step 3: Grover Diffusion Operator (Inversion about mean)
qc.h([0, 1])
qc.x([0, 1])
qc.cz(0, 1)
qc.x([0, 1])
qc.h([0, 1])
qc.barrier()

# Step 4: Measurement
qc.measure([0, 1], [0, 1])

# Run on Aer Simulator
simulator = AerSimulator()
compiled = transpile(qc, simulator)
result = simulator.run(compiled, shots=1024).result()
counts = result.get_counts()

print("Measurement Counts:", counts)
# Output: {'11': 1024} with 100% success!`,
    openqasmCode: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
h q[1];
cz q[0],q[1];
h q[0];
h q[1];
x q[0];
x q[1];
cz q[0],q[1];
x q[0];
x q[1];
h q[0];
h q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];`,
    theory: {
      problemStatement: "Given an unsorted database of N = 2ⁿ items, find a specific marked item ω satisfying f(ω) = 1, where f(x) = 0 for all x ≠ ω.",
      howItWorks: "Classically, finding the item requires querying the database on average N/2 times, and N times in the worst case. Grover's algorithm rotates the quantum state vector inside a two-dimensional subspace defined by the uniform superposition and the target state. Each Grover iteration rotates the vector towards the target by 2θ where sin(θ) = 1/√N. After R ≈ (π/4)√N iterations, the probability of measuring the target state approaches 1.",
      mathematicalPrinciple: "Grover iteration G = -U_s U_ω = (2|s⟩⟨s| - I)(I - 2|ω⟩⟨ω|), performing a geometric rotation of 2θ in Hilbert space.",
      classicalVsQuantum: [
        { metric: 'Database of 4 items', classical: '2 to 4 queries (avg 2.25)', quantum: '1 query (100% deterministic)' },
        { metric: 'Database of 1 Million items', classical: '~500,000 queries', quantum: '~785 queries (637x faster)' },
        { metric: 'Database of 1 Billion items', classical: '~500,000,000 queries', quantum: '~24,674 queries (20,000x faster)' },
        { metric: 'Query Complexity', classical: 'O(N)', quantum: 'O(√N)' }
      ],
      realWorldApplications: [
        'Unstructured database searching & inverted indexing',
        'Solving NP-complete problems (SAT solvers, traveling salesperson heuristic speedup)',
        'Collision finding in cryptographic hash functions (e.g., SHA-256 security effective bits cut from 256 to 128)',
        'Constraint satisfaction and graph coloring acceleration'
      ],
      limitations: [
        'Provides a polynomial (quadratic) speedup, not an exponential speedup.',
        'Over-rotation: applying more than the optimal number of iterations actually decreases the target probability.',
        'Requires fault-tolerant quantum hardware with sufficient circuit coherence time for large N.'
      ]
    }
  },

  {
    id: 'deutsch-jozsa-algorithm',
    name: 'Deutsch-Jozsa Algorithm',
    inventor: 'David Deutsch & Richard Jozsa',
    year: 1992,
    category: 'Oracular',
    difficulty: 'Beginner',
    classicalComplexity: 'O(2^(n-1) + 1)',
    quantumComplexity: 'O(1)',
    speedup: 'Exponential',
    summary: 'Determines whether an unknown black-box Boolean function is constant (returns same output for all inputs) or balanced (returns 0 for half and 1 for half) with 100% certainty in a single query.',
    templateId: 'deutsch-jozsa',
    numQubits: 2,
    circuitOperations: [
      { id: 'dj-x1', type: 'X', target: 1, moment: 0 },
      { id: 'dj-h0', type: 'H', target: 0, moment: 1 },
      { id: 'dj-h1', type: 'H', target: 1, moment: 1 },
      { id: 'dj-cx', type: 'CX', control: 0, target: 1, moment: 2 },
      { id: 'dj-h0b', type: 'H', target: 0, moment: 3 },
      { id: 'dj-m0', type: 'M', target: 0, moment: 4 },
    ],
    parameters: {
      name: 'functionType',
      label: 'Oracle Function Type',
      options: [
        {
          key: 'balanced',
          label: 'Balanced Oracle (f(0)=0, f(1)=1)',
          description: 'Implemented via a CNOT gate where target output depends on input.',
          steps: [
            {
              stepNumber: 1,
              title: 'Register Preparation',
              description: 'Input qubit q0 set to |0⟩; ancilla qubit q1 set to |1⟩ via Pauli-X.',
              mathNotation: '|ψ₀⟩ = |0⟩|1⟩',
              activeGates: ['X (q1)'],
              probabilities: { '00': 0.0, '01': 1.0, '10': 0.0, '11': 0.0 },
              explanation: 'The ancilla qubit is placed into |1⟩ so that a subsequent Hadamard puts it in the phase kickback state |-\\rangle = (|0\\rangle - |1\\rangle)/\\sqrt{2}.'
            },
            {
              stepNumber: 2,
              title: 'Hadamard Superposition',
              description: 'Hadamard gates create input superposition and ancilla phase state.',
              mathNotation: '|ψ₁⟩ = \\frac{|0⟩ + |1⟩}{\\sqrt{2}} \\otimes \\frac{|0⟩ - |1⟩}{\\sqrt{2}}',
              activeGates: ['H (q0)', 'H (q1)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Input qubit enters equal superposition of all possible inputs while ancilla enters |-\\rangle.'
            },
            {
              stepNumber: 3,
              title: 'Oracle Query & Phase Kickback',
              description: 'Oracle evaluates f(x). For balanced function, phase kickback flips sign of |1⟩ component.',
              mathNotation: 'U_f|x⟩|-\\rangle = (-1)^{f(x)}|x⟩|-\\rangle = \\frac{|0⟩ - |1⟩}{\\sqrt{2}} |-\\rangle',
              activeGates: ['Oracle (CNOT q0→q1)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Phase kickback transferred the function value into the phase of the input qubit! The state is now |-\\rangle |-\\rangle.'
            },
            {
              stepNumber: 4,
              title: 'Interference via Hadamard',
              description: 'Hadamard transforms phase differences into readable computational basis states.',
              mathNotation: 'H|-\\rangle = |1⟩ \\implies |ψ₄⟩ = |1⟩ |-\\rangle',
              activeGates: ['H (q0)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 0.5, '11': 0.5 },
              explanation: 'Constructive interference forces q0 to collapse to |1⟩. Any measurement of 1 conclusively proves the function is BALANCED!'
            },
            {
              stepNumber: 5,
              title: 'Measurement',
              description: 'Measuring q0 yields 1 with 100% certainty.',
              mathNotation: 'Result: q_0 = 1 \\implies \\text{BALANCED}',
              activeGates: ['M (q0)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 },
              explanation: 'A single quantum query determined the global property of the oracle without testing each input individually.'
            }
          ]
        },
        {
          key: 'constant',
          label: 'Constant Oracle (f(x)=0 for all x)',
          description: 'Identity oracle where output does not depend on input.',
          steps: [
            {
              stepNumber: 1,
              title: 'Register Preparation',
              description: 'Input qubit q0 set to |0⟩; ancilla qubit q1 set to |1⟩.',
              mathNotation: '|ψ₀⟩ = |0⟩|1⟩',
              activeGates: ['X (q1)'],
              probabilities: { '00': 0.0, '01': 1.0, '10': 0.0, '11': 0.0 },
              explanation: 'Ground state and ancilla prepared.'
            },
            {
              stepNumber: 2,
              title: 'Hadamard Superposition',
              description: 'Hadamard applied to both qubits.',
              mathNotation: '|ψ₁⟩ = |+⟩ |-\\rangle',
              activeGates: ['H (q0)', 'H (q1)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Equal superposition on input, phase state on ancilla.'
            },
            {
              stepNumber: 3,
              title: 'Constant Oracle Query',
              description: 'Since f(x)=0 everywhere, no phases are flipped.',
              mathNotation: 'U_f|+⟩|-\\rangle = (+1)|+⟩|-\\rangle',
              activeGates: ['Oracle (Constant Identity)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'The state remains unchanged as |+⟩ |-\\rangle because (-1)⁰ = +1 for all inputs.'
            },
            {
              stepNumber: 4,
              title: 'Interference via Hadamard',
              description: 'Hadamard on q0 rotates |+⟩ back to |0⟩.',
              mathNotation: 'H|+⟩ = |0⟩ \\implies |ψ₄⟩ = |0⟩ |-\\rangle',
              activeGates: ['H (q0)'],
              probabilities: { '00': 0.5, '01': 0.5, '10': 0.0, '11': 0.0 },
              explanation: 'Constructive interference guarantees q0 will collapse to |0⟩. A measurement of 0 proves the function is CONSTANT!'
            },
            {
              stepNumber: 5,
              title: 'Measurement',
              description: 'Measuring q0 yields 0 with 100% certainty.',
              mathNotation: 'Result: q_0 = 0 \\implies \\text{CONSTANT}',
              activeGates: ['M (q0)'],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: 'Evaluation complete: Output 0 denotes CONSTANT.'
            }
          ]
        }
      ]
    },
    defaultSteps: [],
    qiskitCode: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Deutsch-Jozsa Algorithm for 2-bit input (n=2, 1 ancilla)
n = 2
qc = QuantumCircuit(n + 1, n)

# 1. Ancilla in state |->
qc.x(n)
qc.h(range(n + 1))
qc.barrier()

# 2. Balanced Oracle: CNOT from q0 to ancilla
for qubit in range(n):
    qc.cx(qubit, n)
qc.barrier()

# 3. Apply Hadamards to input register
qc.h(range(n))
qc.barrier()

# 4. Measure input register
qc.measure(range(n), range(n))

# Execute on Aer
sim = AerSimulator()
counts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()
print("Counts:", counts)
# If result is '00', function is CONSTANT. Any other string means BALANCED!`,
    openqasmCode: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[2];

x q[2];
h q[0];
h q[1];
h q[2];
cx q[0],q[2];
cx q[1],q[2];
h q[0];
h q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];`,
    theory: {
      problemStatement: "Given an oracle evaluating a function f: {0,1}ⁿ → {0,1} promised to be either constant (f(x) = c for all x) or balanced (f(x) = 0 for half of inputs and 1 for the other half), determine which one it is.",
      howItWorks: "A classical algorithm must evaluate the function at least 2ⁿ⁻¹ + 1 times in the worst case to distinguish with certainty. The Deutsch-Jozsa algorithm utilizes quantum parallelism to evaluate f(x) on all 2ⁿ inputs simultaneously in a single query. Phase kickback encodes the output values into the relative phases of the quantum state, and Hadamard gates cause constructive interference at |0⟩ⁿ if and only if the function is constant.",
      mathematicalPrinciple: "|ψ_final⟩ = \\frac{1}{2ⁿ} \\sum_{x,y} (-1)^{f(x) \\oplus (x \\cdot y)} |y⟩. When y = 0...0, the amplitude is \\frac{1}{2ⁿ} \\sum_x (-1)^{f(x)}. For constant f, this equals ±1. For balanced f, it sums to 0.",
      classicalVsQuantum: [
        { metric: '1-bit input (n=1)', classical: '2 evaluations', quantum: '1 query' },
        { metric: '10-bit input (n=10)', classical: '513 evaluations', quantum: '1 query' },
        { metric: '30-bit input (n=30)', classical: '536,870,913 evaluations', quantum: '1 query' },
        { metric: 'Worst-case Queries', classical: 'O(2^(n-1) + 1)', quantum: 'O(1) (Exact)' }
      ],
      realWorldApplications: [
        'Historical breakthrough: First demonstration of exponential separation between classical and quantum query complexity.',
        'Foundation for Bernstein-Vazirani, Simon’s algorithm, and Shor’s factoring algorithm.',
        'Deterministic oracle classification in theoretical computer science.'
      ],
      limitations: [
        'The problem relies on the "promise" that the function is either constant or balanced.',
        'Does not speed up general unconstrained Boolean functions.',
        'Oracular algorithm: the complexity advantage is in queries to the black box, not physical gate compilation.'
      ]
    }
  },

  {
    id: 'bernstein-vazirani-algorithm',
    name: 'Bernstein-Vazirani Algorithm',
    inventor: 'Ethan Bernstein & Umesh Vazirani',
    year: 1993,
    category: 'Oracular',
    difficulty: 'Beginner',
    classicalComplexity: 'O(n)',
    quantumComplexity: 'O(1)',
    speedup: 'Polynomial',
    summary: 'Finds an unknown n-bit secret string s hidden inside a linear Boolean function f(x) = s · x (mod 2) in a single quantum query, whereas a classical computer requires n queries.',
    templateId: 'bernstein-vazirani',
    numQubits: 3,
    circuitOperations: [
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
    ],
    parameters: {
      name: 'secretKey',
      label: 'Secret Bitstring (s)',
      options: [
        {
          key: '11',
          label: 's = 11 (Both bits set)',
          description: 'CNOT from q0 and q1 to ancilla.',
          steps: [
            {
              stepNumber: 1,
              title: 'Initialization',
              description: 'Input qubits set to |00⟩, ancilla set to |1⟩ via X gate.',
              mathNotation: '|ψ₀⟩ = |00⟩|1⟩',
              activeGates: ['X (q2)'],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: 'Ground states initialized.'
            },
            {
              stepNumber: 2,
              title: 'Hadamard Superposition',
              description: 'Create equal superposition on inputs and phase state on ancilla.',
              mathNotation: '|ψ₁⟩ = \\frac{1}{2}(|00⟩ + |01⟩ + |10⟩ + |11⟩) \\otimes |-\\rangle',
              activeGates: ['H (q0, q1, q2)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'All potential input vectors x are in simultaneous superposition.'
            },
            {
              stepNumber: 3,
              title: 'Oracle Query f(x) = 11 · x',
              description: 'CNOTs apply phase kickback for each set bit in secret key s = 11.',
              mathNotation: 'U_f|x⟩|-\\rangle = (-1)^{s \\cdot x} |x⟩|-\\rangle',
              activeGates: ['CNOT q0→q2', 'CNOT q1→q2'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Phase kickback writes the dot product into the quantum phase: (-1)^(x₀·1 ⊕ x₁·1).'
            },
            {
              stepNumber: 4,
              title: 'Second Hadamard Transform',
              description: 'Applying Hadamards unscrambles the phase encoding directly into bitstring s.',
              mathNotation: 'H^{\\otimes 2} \\left( \\frac{1}{2} \\sum_x (-1)^{s \\cdot x} |x⟩ \\right) = |s⟩ = |11⟩',
              activeGates: ['H (q0, q1)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
              explanation: 'Destructive interference cancels all states except exactly |s⟩ = |11⟩!'
            },
            {
              stepNumber: 5,
              title: 'Measurement',
              description: 'Measurement directly outputs the secret key s = 11.',
              mathNotation: 'Measured: s = 11',
              activeGates: ['M (q0)', 'M (q1)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
              explanation: 'Secret key s discovered in just 1 single evaluation of the oracle.'
            }
          ]
        },
        {
          key: '10',
          label: 's = 10 (First bit set)',
          description: 'CNOT from q1 to ancilla.',
          steps: [
            {
              stepNumber: 1,
              title: 'Initialization',
              description: 'Qubits set to |00⟩|1⟩.',
              mathNotation: '|ψ₀⟩ = |00⟩|1⟩',
              activeGates: ['X (q2)'],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: 'Ancilla set to |1⟩.'
            },
            {
              stepNumber: 2,
              title: 'Superposition',
              description: 'Hadamard gates applied across all qubits.',
              mathNotation: '|ψ₁⟩ = |+⟩|+⟩|-\\rangle',
              activeGates: ['H (all)'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Uniform superposition.'
            },
            {
              stepNumber: 3,
              title: 'Oracle Query (s = 10)',
              description: 'Phase kickback on bits matching s=10.',
              mathNotation: '(-1)^{10 \\cdot x} |x⟩|-\\rangle',
              activeGates: ['CNOT q1→q2'],
              probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
              explanation: 'Phase flipped whenever x₁ = 1.'
            },
            {
              stepNumber: 4,
              title: 'Hadamard Interference',
              description: 'Hadamard transforms encode phase directly into |10⟩.',
              mathNotation: '|ψ₄⟩ = |10⟩',
              activeGates: ['H (q0, q1)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 },
              explanation: 'Constructive interference pins state to |10⟩.'
            },
            {
              stepNumber: 5,
              title: 'Measurement',
              description: 'Reveals secret string s = 10.',
              mathNotation: 'Measured: s = 10',
              activeGates: ['M (q0, q1)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 },
              explanation: 'Secret string s = 10 successfully retrieved in 1 query.'
            }
          ]
        }
      ]
    },
    defaultSteps: [],
    qiskitCode: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

secret_string = '11'
n = len(secret_string)

qc = QuantumCircuit(n + 1, n)

# 1. Put ancilla in |->
qc.x(n)
qc.h(range(n + 1))
qc.barrier()

# 2. Oracle: Apply CNOT wherever bit in secret_string is '1'
for index, bit in enumerate(reversed(secret_string)):
    if bit == '1':
        qc.cx(index, n)
qc.barrier()

# 3. Apply Hadamards to input register
qc.h(range(n))
qc.barrier()

# 4. Measure
qc.measure(range(n), range(n))

# Run simulation
sim = AerSimulator()
counts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()
print(f"Discovered secret string: {list(counts.keys())[0]}")`,
    openqasmCode: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[2];

x q[2];
h q[0];
h q[1];
h q[2];
cx q[0],q[2];
cx q[1],q[2];
h q[0];
h q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];`,
    theory: {
      problemStatement: "Given an oracle function f: {0,1}ⁿ → {0,1} defined by f(x) = s · x (mod 2) for an unknown secret bitstring s, determine s with minimum queries.",
      howItWorks: "Classically, each query with basis vectors eᵢ = 00..1..0 reveals only one bit sᵢ of s. Thus, exactly n queries are required. In the quantum algorithm, thanks to phase kickback and the self-inverse property of the Hadamard transform (H = H⁻¹), all n bits of s interfere constructively into a single measurement outcome in exactly 1 query.",
      mathematicalPrinciple: "H^{\\otimes n} \\left( \\frac{1}{\\sqrt{2ⁿ}} \\sum_x (-1)^{s \\cdot x} |x⟩ \\right) = |s⟩. Because the Hadamard transform of the parity function is a Dirac delta centered at s.",
      classicalVsQuantum: [
        { metric: 'n = 10 bits', classical: '10 queries', quantum: '1 query (10x speedup)' },
        { metric: 'n = 64 bits', classical: '64 queries', quantum: '1 query (64x speedup)' },
        { metric: 'n = 256 bits', classical: '256 queries', quantum: '1 query (256x speedup)' },
        { metric: 'Query Scaling', classical: 'O(n)', quantum: 'O(1)' }
      ],
      realWorldApplications: [
        'Proof of non-oracular circuit advantage for fault-tolerant quantum computers',
        'Cryptographic protocol verification and parity learning problem speedups',
        'Demonstrates deterministic single-query quantum state readout'
      ],
      limitations: [
        'Applies only to linear functions f(x) = s · x.',
        'Requires noiseless coherence across all n qubits to avoid bit errors during phase interference.'
      ]
    }
  },

  {
    id: 'quantum-fourier-transform',
    name: 'Quantum Fourier Transform (QFT)',
    inventor: 'Don Coppersmith',
    year: 1994,
    category: 'Transforms',
    difficulty: 'Advanced',
    classicalComplexity: 'O(n · 2^n)',
    quantumComplexity: 'O(n²)',
    speedup: 'Exponential',
    summary: 'The quantum analogue of the discrete Fourier transform. Maps computational basis states into phase representations, serving as the essential engine for Shor’s factoring and Quantum Phase Estimation.',
    templateId: 'qft-3qubit',
    numQubits: 3,
    circuitOperations: [
      { id: 'qft-h0', type: 'H', target: 0, moment: 0 },
      { id: 'qft-s1', type: 'S', target: 0, moment: 1 },
      { id: 'qft-t2', type: 'T', target: 0, moment: 2 },
      { id: 'qft-h1', type: 'H', target: 1, moment: 3 },
      { id: 'qft-s2', type: 'S', target: 1, moment: 4 },
      { id: 'qft-h2', type: 'H', target: 2, moment: 5 },
      { id: 'qft-sw', type: 'SWAP', control: 0, target: 2, moment: 6 },
    ],
    defaultSteps: [
      {
        stepNumber: 1,
        title: 'Input State Preparation',
        description: '3 qubits initialized into a binary encoded number (e.g. |4⟩ = |100⟩).',
        mathNotation: '|ψ₀⟩ = |j⟩ = |100⟩_2',
        activeGates: ['X (q0)'],
        probabilities: { '000': 0.0, '001': 0.0, '010': 0.0, '011': 0.0, '100': 1.0, '101': 0.0, '110': 0.0, '111': 0.0 },
        explanation: 'The input value is localized on computational basis state |100⟩.'
      },
      {
        stepNumber: 2,
        title: 'Hadamard on First Qubit',
        description: 'Hadamard puts q0 into superposition with phase factor based on most significant bit.',
        mathNotation: 'H|j_1⟩ = \\frac{1}{\\sqrt{2}}(|0⟩ + e^{2\\pi i 0.j_1}|1⟩)',
        activeGates: ['H (q0)'],
        probabilities: { '000': 0.5, '001': 0.0, '010': 0.0, '011': 0.0, '100': 0.5, '101': 0.0, '110': 0.0, '111': 0.0 },
        explanation: 'Qubit 0 enters superposition and receives initial phase.'
      },
      {
        stepNumber: 3,
        title: 'Controlled Phase Rotations (R_k)',
        description: 'Controlled phase gates add fractional binary angle rotations corresponding to subsequent qubits.',
        mathNotation: 'R_k = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{2\\pi i / 2^k} \\end{pmatrix}',
        activeGates: ['Controlled-S', 'Controlled-T'],
        probabilities: { '000': 0.125, '001': 0.125, '010': 0.125, '011': 0.125, '100': 0.125, '101': 0.125, '110': 0.125, '111': 0.125 },
        explanation: 'Controlled rotations precisely calibrate the geometric phase angles around the Z-axis of the Bloch sphere.'
      },
      {
        stepNumber: 4,
        title: 'Recursive Transformations',
        description: 'Hadamard and controlled-phase gates applied progressively to qubit 1 and qubit 2.',
        mathNotation: '\\bigotimes_{l=1}^n \\frac{1}{\\sqrt{2}} (|0⟩ + e^{2\\pi i 0.j_l \\dots j_n} |1⟩)',
        activeGates: ['H (q1)', 'Controlled-S', 'H (q2)'],
        probabilities: { '000': 0.125, '001': 0.125, '010': 0.125, '011': 0.125, '100': 0.125, '101': 0.125, '110': 0.125, '111': 0.125 },
        explanation: 'All qubits now lie along the equator of the Bloch sphere, each rotated by an angle directly proportional to the discrete Fourier frequency.'
      },
      {
        stepNumber: 5,
        title: 'Qubit SWAP Permutation',
        description: 'SWAP gates reverse the bit order to align with standard big-endian convention.',
        mathNotation: '|QFT(j)⟩ = \\frac{1}{\\sqrt{N}} \\sum_{k=0}^{N-1} e^{2\\pi i j k / N} |k⟩',
        activeGates: ['SWAP (q0, q2)'],
        probabilities: { '000': 0.125, '001': 0.125, '010': 0.125, '011': 0.125, '100': 0.125, '101': 0.125, '110': 0.125, '111': 0.125 },
        explanation: 'The amplitudes of the final state represent the discrete Fourier transform of the input state.'
      }
    ],
    qiskitCode: `import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

def build_qft(n):
    qc = QuantumCircuit(n)
    for j in range(n):
        qc.h(j)
        for k in range(j + 1, n):
            angle = np.pi / (2 ** (k - j))
            qc.cp(angle, k, j)
    # Reverse qubits
    for i in range(n // 2):
        qc.swap(i, n - i - 1)
    return qc

n = 3
qft_circ = build_qft(n)
print(qft_circ.draw())`,
    openqasmCode: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
h q[0];
cp(pi/2) q[1],q[0];
cp(pi/4) q[2],q[0];
h q[1];
cp(pi/2) q[2],q[1];
h q[2];
swap q[0],q[2];`,
    theory: {
      problemStatement: "Given a quantum state |j⟩ in an N = 2ⁿ-dimensional Hilbert space, transform it into the frequency representation \\frac{1}{\\sqrt{N}} \\sum_{k=0}^{N-1} e^{2\\pi i j k / N} |k⟩.",
      howItWorks: "Classical Fast Fourier Transform (FFT) requires O(n 2ⁿ) operations to compute on 2ⁿ numbers. The Quantum Fourier Transform performs this exact transformation on the amplitudes of an n-qubit quantum state using only O(n²) quantum gates. It decouples the entangled states into product states of individual qubit phase rotations.",
      mathematicalPrinciple: "|j⟩ \\mapsto \\frac{1}{\\sqrt{2^n}} \\bigotimes_{l=1}^n \\left( |0⟩ + e^{2\\pi i (0.j_l j_{l+1} \\dots j_n)} |1⟩ \\right).",
      classicalVsQuantum: [
        { metric: '10 qubits (N = 1,024)', classical: '10,240 operations', quantum: '45 gates (227x faster)' },
        { metric: '20 qubits (N = 1,048,576)', classical: '20,971,520 operations', quantum: '190 gates (110,000x faster)' },
        { metric: '30 qubits (N = 1,073,741,824)', classical: '32,212,254,720 ops', quantum: '435 gates (74M x faster)' },
        { metric: 'Algorithmic Complexity', classical: 'O(N log N) = O(n 2ⁿ)', quantum: 'O(n²)' }
      ],
      realWorldApplications: [
        'Shor’s Factoring Algorithm (powers modular period finding)',
        'Quantum Phase Estimation (QPE) for quantum chemistry & Hamiltonian simulation',
        'Discrete logarithm computation and elliptic curve cryptanalysis',
        'Quantum signal processing and frequency extraction'
      ],
      limitations: [
        'The Fourier amplitudes cannot be measured directly in a single shot; measurement collapses the state to a single random frequency proportional to its amplitude squared.',
        'High sensitivity to phase errors in small angle rotations (e.g. π/2ⁿ).'
      ]
    }
  },

  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    inventor: 'Bennett, Brassard, Crépeau, Jozsa, Peres & Wootters',
    year: 1993,
    category: 'Communication',
    difficulty: 'Intermediate',
    classicalComplexity: 'Infinite (Requires measuring state, violating No-Cloning)',
    quantumComplexity: '1 Bell Pair + 2 Classical Bits',
    speedup: 'Communication Advantage',
    summary: 'Transfers an unknown arbitrary quantum state |ψ⟩ from Alice to Bob using a shared entangled Bell pair and 2 classical bits, destroying the original state in compliance with the No-Cloning theorem.',
    templateId: 'quantum-teleportation',
    numQubits: 3,
    circuitOperations: [
      { id: 'qt-prep', type: 'H', target: 0, moment: 0 }, // Prep state to teleport
      { id: 'qt-t', type: 'T', target: 0, moment: 1 },
      { id: 'qt-bell-h', type: 'H', target: 1, moment: 2 }, // Create Bell pair between 1 and 2
      { id: 'qt-bell-cx', type: 'CX', control: 1, target: 2, moment: 3 },
      { id: 'qt-alice-cx', type: 'CX', control: 0, target: 1, moment: 4 }, // Alice Bell measurement
      { id: 'qt-alice-h', type: 'H', target: 0, moment: 5 },
      { id: 'qt-m0', type: 'M', target: 0, moment: 6 },
      { id: 'qt-m1', type: 'M', target: 1, moment: 6 },
    ],
    defaultSteps: [
      {
        stepNumber: 1,
        title: 'State Preparation & Entanglement',
        description: 'Alice prepares an unknown state |ψ⟩ = α|0⟩ + β|1⟩ on q0. Alice and Bob share an EPR pair (|00⟩ + |11⟩)/√2 on q1 and q2.',
        mathNotation: '|ψ_total⟩ = (α|0⟩ + β|1⟩) \\otimes \\frac{|00⟩ + |11⟩}{\\sqrt{2}}',
        activeGates: ['H (q1)', 'CX (q1→q2)'],
        probabilities: { '000': 0.25, '001': 0.0, '010': 0.0, '011': 0.25, '100': 0.25, '101': 0.0, '110': 0.0, '111': 0.25 },
        explanation: 'Qubit 1 belongs to Alice; Qubit 2 belongs to Bob (even if separated across the universe).'
      },
      {
        stepNumber: 2,
        title: 'Alice’s CNOT Entangling Operation',
        description: 'Alice interacts the target qubit with her half of the entangled Bell pair via CNOT.',
        mathNotation: 'CNOT_{0,1} |ψ_total⟩',
        activeGates: ['CNOT (q0→q1)'],
        probabilities: { '000': 0.25, '001': 0.0, '010': 0.0, '011': 0.25, '100': 0.0, '101': 0.25, '110': 0.25, '111': 0.0 },
        explanation: 'Target qubit state is now correlated with the shared entanglement channel.'
      },
      {
        stepNumber: 3,
        title: 'Alice’s Hadamard Transform',
        description: 'Alice applies a Hadamard gate to qubit 0, completing her Bell-basis measurement rotation.',
        mathNotation: 'H_0 \\left( CNOT_{0,1} |ψ_total⟩ \\right)',
        activeGates: ['H (q0)'],
        probabilities: { '000': 0.125, '001': 0.125, '010': 0.125, '011': 0.125, '100': 0.125, '101': 0.125, '110': 0.125, '111': 0.125 },
        explanation: 'The system decomposes into 4 equally probable Bell measurement outcomes for Alice, each mapping to Bob’s qubit rotated by a known Pauli operator.'
      },
      {
        stepNumber: 4,
        title: 'Bell Measurement & Classical Broadcast',
        description: 'Alice measures her two qubits (q0, q1), yielding classical bits (m0, m1) and sends them to Bob.',
        mathNotation: '(m_0, m_1) \\in \\{00, 01, 10, 11\\}',
        activeGates: ['M (q0)', 'M (q1)'],
        probabilities: { '000': 0.25, '001': 0.25, '010': 0.25, '011': 0.25 },
        explanation: 'Original state |ψ⟩ on q0 is destroyed! Bob’s qubit now holds X^{m1} Z^{m0} |ψ⟩.'
      },
      {
        stepNumber: 5,
        title: 'Bob’s Pauli Correction',
        description: 'Bob applies Pauli X if m1=1 and Pauli Z if m0=1, recovering the exact original quantum state |ψ⟩.',
        mathNotation: '|ψ_{Bob}⟩ = Z^{m_0} X^{m_1} (X^{m_1} Z^{m_0} |ψ⟩) = |ψ⟩',
        activeGates: ['Conditional X', 'Conditional Z'],
        probabilities: { '000': 0.5, '001': 0.5 },
        explanation: 'Target state is perfectly reconstructed at Bob’s terminal with 100% fidelity without violating the No-Cloning theorem or special relativity.'
      }
    ],
    qiskitCode: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

qc = QuantumCircuit(3, 3)

# 1. Prepare arbitrary state on q0: |ψ⟩ = H|0⟩
qc.h(0)
qc.barrier()

# 2. Prepare Bell pair between Alice (q1) and Bob (q2)
qc.h(1)
qc.cx(1, 2)
qc.barrier()

# 3. Alice interacts q0 with q1
qc.cx(0, 1)
qc.h(0)
qc.barrier()

# 4. Alice measures q0 and q1
qc.measure(0, 0)
qc.measure(1, 1)
qc.barrier()

# 5. Bob applies corrections based on classical bits
# If c1 == 1, apply X; if c0 == 1, apply Z
qc.cx(1, 2)
qc.cz(0, 2)
qc.measure(2, 2)

print(qc.draw())`,
    openqasmCode: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

h q[0];
barrier q;
h q[1];
cx q[1],q[2];
barrier q;
cx q[0],q[1];
h q[0];
measure q[0] -> c[0];
measure q[1] -> c[1];
cx q[1],q[2];
cz q[0],q[2];
measure q[2] -> c[2];`,
    theory: {
      problemStatement: "Transmit an unknown, fragile quantum state |ψ⟩ = α|0⟩ + β|1⟩ between two separated parties without physically transmitting the qubit particle itself.",
      howItWorks: "The No-Cloning Theorem dictates that an arbitrary quantum state cannot be measured without destroying it, nor can it be cloned. Quantum teleportation disassembles the state into purely quantum correlations (1 shared EPR Bell pair) and 2 classical bits. By performing a Bell measurement, Alice projects Bob’s entangled qubit into one of 4 known unitary rotations of |ψ⟩, which Bob reverses using classical feed-forward.",
      mathematicalPrinciple: "|ψ⟩ \\otimes |Φ^+⟩ = \\frac{1}{2} \\Big[ |Φ^+⟩|ψ⟩ + |Φ^-⟩(Z|ψ⟩) + |Ψ^+⟩(X|ψ⟩) + |Ψ^-⟩(XZ|ψ⟩) \\Big].",
      classicalVsQuantum: [
        { metric: 'Continuous parameters (α, β)', classical: 'Requires infinite classical bits', quantum: '2 classical bits + 1 Bell pair' },
        { metric: 'State Preservation', classical: 'Violates No-Cloning (Impossible)', quantum: '100% Fidelity (Unitary)' },
        { metric: 'Transmission Speed', classical: 'Speed of Light (c)', quantum: 'Bounded by classical message arrival (<= c)' }
      ],
      realWorldApplications: [
        'Quantum Internet & distributed quantum computing architectures',
        'Fault-tolerant quantum gate teleportation (Gottesman-Chuang magic state distillation)',
        'Satellite-based global quantum key distribution (QKD)',
        'Blind quantum cloud computing'
      ],
      limitations: [
        'Does NOT enable faster-than-light communication; Bob cannot recover the state until receiving Alice’s 2 classical bits.',
        'Consumes the Bell pair: entanglement is used up per teleported qubit.'
      ]
    }
  },

  {
    id: 'superdense-coding',
    name: 'Superdense Coding',
    inventor: 'Charles Bennett & Stephen Wiesner',
    year: 1992,
    category: 'Communication',
    difficulty: 'Intermediate',
    classicalComplexity: '1 Bit per physical transmission',
    quantumComplexity: '2 Classical Bits via 1 Qubit',
    speedup: 'Communication Advantage',
    summary: 'Transmits two classical bits of information from Alice to Bob by physically sending only a single qubit, leveraging a previously shared entangled Bell pair.',
    templateId: 'superdense-coding',
    numQubits: 2,
    circuitOperations: [
      { id: 'sd-bell-h', type: 'H', target: 0, moment: 0 },
      { id: 'sd-bell-cx', type: 'CX', control: 0, target: 1, moment: 1 },
      { id: 'sd-encode-z', type: 'Z', target: 0, moment: 2 }, // Encode msg
      { id: 'sd-encode-x', type: 'X', target: 0, moment: 3 },
      { id: 'sd-decode-cx', type: 'CX', control: 0, target: 1, moment: 4 },
      { id: 'sd-decode-h', type: 'H', target: 0, moment: 5 },
      { id: 'sd-m0', type: 'M', target: 0, moment: 6 },
      { id: 'sd-m1', type: 'M', target: 1, moment: 6 },
    ],
    parameters: {
      name: 'messageBits',
      label: '2-Bit Classical Message to Send',
      options: [
        {
          key: '00',
          label: 'Send "00" (Identity I)',
          description: 'Alice applies I gate (no change).',
          steps: [
            {
              stepNumber: 1,
              title: 'Shared Bell Pair Creation',
              description: 'Alice and Bob share Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2.',
              mathNotation: '|Φ^+⟩ = \\frac{|00⟩ + |11⟩}{\\sqrt{2}}',
              activeGates: ['H (q0)', 'CX (q0→q1)'],
              probabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 },
              explanation: 'Qubit 0 is with Alice; Qubit 1 is with Bob.'
            },
            {
              stepNumber: 2,
              title: 'Alice Encodes "00"',
              description: 'Alice applies Identity I to her qubit.',
              mathNotation: '(I \\otimes I)|Φ^+⟩ = |Φ^+⟩',
              activeGates: ['Identity'],
              probabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 },
              explanation: 'Alice sends her single qubit across to Bob.'
            },
            {
              stepNumber: 3,
              title: 'Bob Decodes Bell State',
              description: 'Bob applies CNOT and Hadamard across both qubits.',
              mathNotation: 'H_0 \\cdot CNOT_{0,1} |Φ^+⟩ = |00⟩',
              activeGates: ['CNOT (q0→q1)', 'H (q0)'],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: 'Bob untangles the pair back into computational basis.'
            },
            {
              stepNumber: 4,
              title: 'Measurement',
              description: 'Bob measures both qubits and reads "00".',
              mathNotation: 'Bob decoded: 00',
              activeGates: ['M (q0, q1)'],
              probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
              explanation: '2 classical bits transmitted by sending only 1 physical qubit!'
            }
          ]
        },
        {
          key: '11',
          label: 'Send "11" (Pauli XZ)',
          description: 'Alice applies X and Z to flip basis and phase.',
          steps: [
            {
              stepNumber: 1,
              title: 'Shared Bell Pair',
              description: 'Bell state |Φ⁺⟩ initialized.',
              mathNotation: '|Φ^+⟩ = \\frac{|00⟩ + |11⟩}{\\sqrt{2}}',
              activeGates: ['H', 'CX'],
              probabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 },
              explanation: 'Entanglement shared.'
            },
            {
              stepNumber: 2,
              title: 'Alice Encodes "11"',
              description: 'Alice applies X and Z to her qubit, transforming |Φ⁺⟩ into |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2.',
              mathNotation: '(XZ \\otimes I)|Φ^+⟩ = |Ψ^-⟩',
              activeGates: ['Z (q0)', 'X (q0)'],
              probabilities: { '00': 0.0, '01': 0.5, '10': 0.5, '11': 0.0 },
              explanation: 'Alice ships her single qubit to Bob.'
            },
            {
              stepNumber: 3,
              title: 'Bob Decodes',
              description: 'Bob applies CNOT and Hadamard, projecting |Ψ⁻⟩ to |11⟩.',
              mathNotation: 'H_0 \\cdot CNOT_{0,1} |Ψ^-⟩ = |11⟩',
              activeGates: ['CNOT (q0→q1)', 'H (q0)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
              explanation: 'Bob reconstructs the two classical bits.'
            },
            {
              stepNumber: 4,
              title: 'Measurement',
              description: 'Bob measures and reads "11" with 100% accuracy.',
              mathNotation: 'Bob decoded: 11',
              activeGates: ['M (q0, q1)'],
              probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
              explanation: 'Complete transmission achieved.'
            }
          ]
        }
      ]
    },
    defaultSteps: [],
    qiskitCode: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

def superdense_circuit(message='11'):
    qc = QuantumCircuit(2, 2)
    # Bell pair creation
    qc.h(0)
    qc.cx(0, 1)
    qc.barrier()
    
    # Alice encodes 2 bits on qubit 0
    if message == '01':
        qc.x(0)
    elif message == '10':
        qc.z(0)
    elif message == '11':
        qc.z(0)
        qc.x(0)
    qc.barrier()
    
    # Bob decodes
    qc.cx(0, 1)
    qc.h(0)
    qc.measure([0, 1], [0, 1])
    return qc

qc = superdense_circuit('11')
sim = AerSimulator()
counts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()
print(f"Sent: '11', Received: {list(counts.keys())[0]}")`,
    openqasmCode: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
cx q[0],q[1];
barrier q;
z q[0];
x q[0];
barrier q;
cx q[0],q[1];
h q[0];
measure q[0] -> c[0];
measure q[1] -> c[1];`,
    theory: {
      problemStatement: "Transmit two bits of classical information (00, 01, 10, or 11) by transmitting only a single quantum particle.",
      howItWorks: "According to Holevo's theorem, an isolated qubit can transmit at most one classical bit of accessible information. However, when the transmitting qubit is part of an entangled pair previously shared between sender and receiver, local operations (I, X, Z, XZ) on that single qubit can switch the composite system between all four mutually orthogonal Bell states. Sending that single qubit to the receiver permits a joint Bell measurement revealing both bits.",
      mathematicalPrinciple: "(I \\otimes I)|Φ^+⟩ = |Φ^+⟩; (X \\otimes I)|Φ^+⟩ = |Ψ^+⟩; (Z \\otimes I)|Φ^+⟩ = |Φ^-⟩; (XZ \\otimes I)|Φ^+⟩ = |Ψ^-⟩.",
      classicalVsQuantum: [
        { metric: 'Capacity per particle', classical: '1 bit per physical bit', quantum: '2 bits per physical qubit' },
        { metric: 'Resource Requirement', classical: '2 transmissions', quantum: '1 transmission + 1 prior Bell pair' }
      ],
      realWorldApplications: [
        'Doubling the communication channel capacity of quantum networks',
        'Quantum bus protocols between quantum processor cores',
        'Deep-space quantum communication optimization'
      ],
      limitations: [
        'Requires distributing a high-fidelity Bell pair in advance.',
        'Decoherence on either qubit before decoding introduces bit-flip or phase-flip errors.'
      ]
    }
  }
];
