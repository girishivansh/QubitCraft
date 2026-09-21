import { CircuitState, GateOperation } from '../types/circuit';
import { SimulationResult } from '../quantum/simulation/simulationTypes';

export interface TutorContext {
  learnerLevel?: string;
  lesson?: any;
  circuit?: CircuitState;
  selectedGate?: GateOperation;
  simulation?: SimulationResult;
  statevector?: any;
  selectedQubit?: number;
  activeAlgorithmName?: string;
  pageType?: string;
  pageTitle?: string;
}

export interface TutorMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TutorRequest {
  message: string;
  context?: TutorContext;
  conversation?: TutorMessage[];
}

export interface TutorResponse {
  message: string;
  responseType: 'explanation' | 'hint' | 'debug' | 'concept' | 'result' | 'error';
  keyPoints: string[];
  suggestions: string[];
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

function getSmartFallback(message: string, context?: TutorContext): TutorResponse {
  const query = message.toLowerCase();

  if (query.includes('what can you do') || query.includes('who are you') || query.includes('capabilities')) {
    return {
      message: `I'm **QubitCraft AI**, your specialized quantum computing tutor and laboratory assistant! Here's how I can help you:

* **Quantum Algorithm Deep-Dives**: Break down complex algorithms like **Grover's Search**, **Deutsch-Jozsa**, **Bernstein-Vazirani**, and **Quantum Fourier Transform (QFT)** step-by-step.
* **Circuit Analysis & Debugging**: Inspect the gates in your circuit, identify unintended decoherence or phase cancellations, and calculate statevector evolutions.
* **Physics & Mathematics**: Explain Dirac notation ($|\\psi\\rangle$, $\\langle\\phi|$), Hilbert spaces, phase kickback, and Bloch sphere coordinates.
* **Qiskit Code Generation**: Provide production-ready Python Qiskit 1.0+ code and OpenQASM 2.0 implementations.

What quantum concept would you like to explore today?`,
      responseType: 'explanation',
      keyPoints: ['Algorithm explanations', 'Circuit debugging', 'Dirac mathematics', 'Qiskit code generation'],
      suggestions: ["Explain Grover's Search Algorithm", "How does phase kickback work?", "What is Quantum Entanglement?"]
    };
  }

  if (query.includes('grover') || query.includes('search')) {
    return {
      message: `### Grover's Search Algorithm

Grover's algorithm searches an unsorted database of $N = 2^n$ items to locate a unique marked item in roughly $\\mathcal{O}(\\sqrt{N})$ queries, compared to the classical average of $\\frac{N}{2}$ queries.

#### The 3 Core Stages:
1. **Uniform Superposition**: Hadamards on all qubits initialize $|s\\rangle = \\frac{1}{\\sqrt{N}}\\sum_{x} |x\\rangle$ with equal amplitudes ($+1/\\sqrt{N}$).
2. **The Oracle ($U_\\omega$)**: Selectively flips the phase of the target state $|\\omega\\rangle$:
   $$U_\\omega|x\\rangle = (-1)^{f(x)}|x\\rangle$$
   This inverts the target amplitude to negative, lowering the overall average amplitude.
3. **The Diffusion Operator ($U_s = 2|s\\rangle\\langle s| - I$)**: Reflects all amplitudes about the new mean. Because the target was below the mean, it bounces far above it (**Amplitude Amplification**), while non-target states cancel out through destructive interference.

After approximately $R \\approx \\frac{\\pi}{4}\\sqrt{N}$ iterations, measuring the register yields the marked state with near 100% probability!`,
      responseType: 'concept',
      keyPoints: ['Quadratic speedup O(√N)', 'Phase inversion via oracle', 'Inversion about the mean via diffusion', 'Optimal iterations R ≈ (π/4)√N'],
      suggestions: ["Why does over-rotation occur in Grover's?", "Show me Qiskit code for Grover", "What is Phase Kickback?"]
    };
  }

  if (query.includes('phase kickback') || query.includes('kickback')) {
    return {
      message: `### The Principle of Phase Kickback

**Phase Kickback** is one of the foundational quantum algorithmic subroutines. It occurs when a quantum operation on an auxiliary (target) qubit causes a global phase shift that gets written into the *control* qubit instead!

#### Mathematical Derivation:
1. Prepare the target qubit in the eigenstate $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$ using $X$ followed by $H$.
2. The Pauli-$X$ gate has eigenvalue $-1$ on $|-\\rangle$:
   $$X|-\\rangle = -|-\\rangle$$
3. When applying a **Controlled-NOT (CNOT)** with control $|c\\rangle$ and target $|-\\rangle$:
   * If control is $|0\\rangle$: Target unchanged $\\implies |0\\rangle|-\\rangle$
   * If control is $|1\\rangle$: Target receives $X \\implies |1\\rangle(-|-\\rangle) = -|1\\rangle|-\\rangle$
4. Factoring out the target:
   $$\\text{CNOT} \\left( \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} \\otimes |-\\rangle \\right) = \\left( \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} \\right) \\otimes |-\\rangle$$

Notice the minus sign was kicked back into the control qubit! This enables oracles to evaluate functions into quantum phases simultaneously in **Deutsch-Jozsa**, **Bernstein-Vazirani**, and **Shor's algorithm**.`,
      responseType: 'explanation',
      keyPoints: ['Eigenstate |-⟩ has eigenvalue -1 for X gate', 'Control qubit receives the phase shift', 'Enables quantum parallelism without measuring'],
      suggestions: ["How does Deutsch-Jozsa use phase kickback?", "What is an entangled Bell State?"]
    };
  }

  if (query.includes('teleport') || query.includes('communication')) {
    return {
      message: `### Quantum Teleportation Protocol

Quantum teleportation transmits an unknown quantum state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ from Alice to Bob without sending the physical particle itself!

#### Protocol Steps:
1. **Shared Entanglement**: Alice and Bob share an EPR Bell pair $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$.
2. **Alice's Operations**: Alice performs a CNOT between her unknown qubit and her Bell half, then applies a Hadamard gate.
3. **Bell Measurement**: Alice measures her two qubits in the computational basis, collapsing the system into one of 4 outcomes ($00, 01, 10, 11$). The original state on Alice's qubit is destroyed (obeying the **No-Cloning Theorem**).
4. **Classical Transmission**: Alice sends her 2 measurement bits to Bob over a classical channel (speed $\\le c$).
5. **Bob's Unitary Correction**: Based on the two classical bits, Bob applies $I, X, Z,$ or $XZ$ to his qubit, recovering exact state $|\\psi\\rangle$!`,
      responseType: 'concept',
      keyPoints: ['Requires 1 Bell pair + 2 classical bits', 'Respects No-Cloning Theorem', 'Cannot transmit information faster than light'],
      suggestions: ["What is Superdense Coding?", "Explain Bell States"]
    };
  }

  if (query.includes('superposition') || query.includes('entanglement') || query.includes('bell state')) {
    return {
      message: `### Quantum Superposition & Entanglement

#### 1. Quantum Superposition
A classical bit can only be in state $0$ or $1$. A quantum bit (**qubit**) exists as a linear combination of both basis states:
$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle \\quad \\text{where} \\quad |\\alpha|^2 + |\\beta|^2 = 1$$
Applying a **Hadamard ($H$)** gate to ground state $|0\\rangle$ puts the qubit into equal superposition:
$$H|0\\rangle = |+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$$
Measuring this state yields $|0\\rangle$ with 50% probability and $|1\\rangle$ with 50% probability.

#### 2. Quantum Entanglement & The Bell State
When two qubits become entangled, their quantum states cannot be factored into independent individual states:
$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}} \\ne |\\psi_A\\rangle \\otimes |\\psi_B\\rangle$$

**How to create it in Quantum Lab:**
1. Apply **$H$** gate to Qubit 0 (creates superposition).
2. Apply **CNOT** gate with Qubit 0 as Control and Qubit 1 as Target.
3. Measuring Qubit 0 instantly dictates the measurement outcome of Qubit 1 with 100% correlation across any distance!`,
      responseType: 'concept',
      keyPoints: ['Superposition: linear combination |ψ⟩ = α|0⟩ + β|1⟩', 'Entanglement: inseparable bipartite state', 'Created with H + CNOT in 2 moments'],
      suggestions: ["How does measurement collapse superposition?", "Show me Bloch sphere coordinates", "Explain Bell States"]
    };
  }

  if (query.includes('differ from classical') || query.includes('classical vs quantum') || query.includes('how do quantum computers differ')) {
    return {
      message: `### Classical vs. Quantum Computing

| Feature | Classical Computing | Quantum Computing |
| :--- | :--- | :--- |
| **Fundamental Unit** | Classical bit ($0$ or $1$) | Qubit ($|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$) |
| **State Space** | $n$ bits store $1$ of $2^n$ numbers | $n$ qubits hold all $2^n$ amplitudes simultaneously |
| **Operations** | Boolean logic (AND, OR, NOT) | Unitary matrix transformations (reversible) |
| **Key Phenomena** | Deterministic binary | **Superposition, Entanglement, Interference** |
| **Scaling** | Linear growth $\\mathcal{O}(n)$ | Exponential state space $\\mathcal{O}(2^n)$ in $2^n$ complex Hilbert space |

Quantum computers do not simply "try every combination at once" — they use **quantum interference** to cancel out wrong answers while amplifying probability amplitudes of the correct solution!`,
      responseType: 'explanation',
      keyPoints: ['Qubit vs Bit', 'Reversible unitary operations', 'Interference amplification', 'Exponential 2^n state dimension'],
      suggestions: ["What can you do?", "How do I start learning quantum computing?", "Explain Grover's Search Algorithm"]
    };
  }

  if (query.includes('start learning') || query.includes('which learning path') || query.includes('learn next') || query.includes('roadmap')) {
    return {
      message: `### Recommended Quantum Learning Roadmap

1. **Phase 1: Quantum Foundations** (Beginner)
   * Core concepts: What is a qubit, Dirac bra-ket notation ($|0\\rangle, |1\\rangle$), and classical vs quantum differences.
   * *Target*: Understand superposition and measurement collapse.

2. **Phase 2: Single-Qubit Gates & The Bloch Sphere** (Beginner-Intermediate)
   * Core gates: Pauli-X, Y, Z, Hadamard ($H$), and phase gates ($S, T$).
   * *Target*: Visualizing statevector rotations in 3D on the unit Bloch sphere.

3. **Phase 3: Multi-Qubit Systems & Entanglement** (Intermediate)
   * Tensor products, Controlled-NOT (CNOT), Bell states ($|\\Phi^+\\rangle, |\\Psi^+\\rangle$), and Quantum Teleportation.
   * *Target*: Understanding non-local quantum correlations.

4. **Phase 4: Quantum Algorithms** (Advanced)
   * Oracles, Phase Kickback, **Deutsch-Jozsa**, **Bernstein-Vazirani**, and **Grover's Search Algorithm**.

Head to the **Learn Hub** to start with Lesson 1 or visit the **Quantum Lab** to assemble your first circuit!`,
      responseType: 'hint',
      keyPoints: ['Foundations → Gates → Entanglement → Algorithms', 'Start with Quantum Foundations', 'Hands-on practice in Quantum Lab'],
      suggestions: ["What mathematical background is required?", "How do daily streaks and XP work?", "What is a qubit?"]
    };
  }

  if (query.includes('bloch sphere') || query.includes('represent qubit')) {
    return {
      message: `### The Bloch Sphere Geometry

The **Bloch Sphere** is a geometric representation of pure single-qubit states on the surface of a unit sphere in $\\mathbb{R}^3$:

$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$

* **North Pole ($+Z$)**: Ground state $|0\\rangle$ ($\\theta = 0$)
* **South Pole ($-Z$)**: Excited state $|1\\rangle$ ($\\theta = \\pi$)
* **Equator ($X$-$Y$ plane)**: Superposition states with $\\theta = \\frac{\\pi}{2}$:
  * $+X$ axis: $|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$ ($\\phi = 0$)
  * $-X$ axis: $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$ ($\\phi = \\pi$)
  * $+Y$ axis: $|+i\\rangle = \\frac{|0\\rangle + i|1\\rangle}{\\sqrt{2}}$ ($\\phi = \\frac{\\pi}{2}$)
  * $-Y$ axis: $|-i\\rangle = \\frac{|0\\rangle - i|1\\rangle}{\\sqrt{2}}$ ($\\phi = \\frac{3\\pi}{2}$)

Single-qubit quantum gates correspond to rigid 3D spatial rotations around these axes!`,
      responseType: 'concept',
      keyPoints: ['Unit sphere R=1', 'Polar angle θ defines probabilities', 'Azimuthal angle φ defines relative phase', 'Gates = spatial rotations'],
      suggestions: ["What is the difference between H and X gates?", "Why does measurement collapse superposition?"]
    };
  }

  if (query.includes('difference between h and x') || query.includes('hadamard and pauli')) {
    return {
      message: `### Hadamard ($H$) vs. Pauli-$X$ Gate

#### 1. Pauli-$X$ Gate (Quantum NOT)
* **Action**: Bit-flip. Swaps computational basis states:
  $$X|0\\rangle = |1\\rangle, \\quad X|1\\rangle = |0\\rangle$$
* **Matrix**: $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$
* **Bloch Sphere**: $180^\\circ$ ($\\\\pi$ rad) rotation around the $X$-axis.

#### 2. Hadamard ($H$) Gate (Superposition Creator)
* **Action**: Moves computational states onto the equator:
  $$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle, \\quad H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$
* **Matrix**: $\\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$
* **Bloch Sphere**: $180^\\circ$ rotation around the diagonal $(X+Z)/\\sqrt{2}$ axis.

*Key takeaway*: $X$ inverts deterministic bits; $H$ creates quantum uncertainty and superposition!`,
      responseType: 'explanation',
      keyPoints: ['X is bit-flip (NOT)', 'H creates equal superposition', 'Both gates are Hermitian and unitary: H² = I, X² = I'],
      suggestions: ["How do I build a Bell State (|Φ+⟩)?", "Explain Phase Kickback"]
    };
  }

  if (query.includes('math') || query.includes('prerequisite')) {
    return {
      message: `### Mathematics Prerequisites for Quantum Computing

You don't need a physics degree to learn quantum computing! The mathematics primarily involves 4 core areas:

1. **Linear Algebra**:
   * Vectors (kets $|v\\rangle$ and bras $\\langle v|$)
   * Unitary matrices ($U^\\dagger U = I$)
   * Inner products $\\langle \\phi | \\psi \\rangle$ and Tensor products $A \\otimes B$
2. **Complex Numbers**:
   * Amplitudes $\\alpha = a + bi = r e^{i\\phi}$
   * Complex conjugate $\\alpha^* = a - bi$
   * Absolute magnitude squared $|\\alpha|^2 = a^2 + b^2$ (Born rule probability)
3. **Probability Theory**:
   * Discrete probability distributions where $\\sum P(x) = 1$
   * Expectation values and variance
4. **Basic Modulo Arithmetic**:
   * Relevant for cryptographic algorithms like Shor's ($a^r \\equiv 1 \\pmod N$).

QubitCraft teaches all of these intuitions visually inside each lesson!`,
      responseType: 'explanation',
      keyPoints: ['Linear algebra is 80% of quantum math', 'Complex numbers govern phase', 'Born Rule connects amplitudes to probabilities'],
      suggestions: ["Which learning path should I start with?", "What is Dirac notation |ψ⟩?"]
    };
  }

  if (query.includes('analogy') || query.includes('intuitive')) {
    return {
      message: `### Intuitive Real-World Analogies for Quantum Concepts

#### 1. Superposition: The Spinning Coin
Imagine a coin lying on a table. It is definitively **Heads** ($0$) or **Tails** ($1$).
Now spin the coin on its edge: while it spins, it is in a dynamic blend of both states with measurable angular properties (**superposition**). Only when you slap your hand down to stop it (**measurement**) does it collapse randomly into heads or tails!

#### 2. Entanglement: Magic Paired Dice
Imagine two dice rolled in different cities: London and Tokyo.
In classical physics, both outcomes are completely independent.
In quantum entanglement, the two dice are correlated: whenever the London die lands on a $6$, the Tokyo die instantly lands on a $6$, even if no signal had time to travel between them!

#### 3. Interference: Noise-Cancelling Waves
Like acoustic noise-cancelling headphones that broadcast opposite soundwaves to silence background noise, quantum algorithms arrange wave amplitudes so incorrect answers destructively cancel out ($+A - A = 0$) while the correct answer builds up constructively ($+A + A = 2A$)!`,
      responseType: 'concept',
      keyPoints: ['Spinning coin = Superposition', 'Magic paired dice = Entanglement', 'Noise cancellation = Quantum Interference'],
      suggestions: ["Explain Grover's Search Algorithm", "How do I build a Bell State?"]
    };
  }

  if (query.includes('quiz') || query.includes('test my knowledge')) {
    return {
      message: `### 🎯 Quick Quantum Quiz

**Question:**
You have a single qubit initialized to $|0\\rangle$. You apply a **Hadamard ($H$)** gate, followed by a **Pauli-$Z$** gate. What is the resulting quantum state?

* **A)** $|0\\rangle$
* **B)** $|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$
* **C)** $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$
* **D)** $|1\\rangle$

---
*Hint: What does the $Z$ gate do to the $|1\\rangle$ component of a superposition?* Type your answer (A, B, C, or D) below!`,
      responseType: 'hint',
      keyPoints: ['H|0⟩ = |+⟩', 'Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩', 'Combine H and Z matrices'],
      suggestions: ["Answer C: |-⟩", "Explain why Z changes |+⟩ to |-⟩"]
    };
  }

  if (query.includes('streak') || query.includes('xp') || query.includes('achievement')) {
    return {
      message: `### QubitCraft XP & Streaks System

* **Lesson Completion**: Earn **+50 to +100 XP** for finishing each interactive lesson.
* **Knowledge Checks**: Earn **+10 to +25 XP** for every correctly solved quiz.
* **Daily Streaks**: Complete at least 1 lesson or simulation per day to keep your streak flame alive! Consecutive days multiply streak bonuses.
* **Achievements**: Unlock specialized badges:
  * 🚀 **Quantum Pioneer**: Complete your first lesson.
  * ⚛️ **Superposition Master**: Construct and simulate a superposition circuit.
  * 🔗 **Entanglement Wizard**: Create all 4 Bell states in Quantum Lab.
  * ⚡ **Algorithm Ace**: Complete all quantum algorithm walkthroughs.

Check your current standing anytime on your **Dashboard**!`,
      responseType: 'explanation',
      keyPoints: ['XP rewarded for lessons and quizzes', 'Daily streak retention', 'Achievement milestones unlock badges'],
      suggestions: ["What should I learn next based on my progress?", "How do I build a Bell State?"]
    };
  }

  // Contextual fallback based on active circuit
  if (context?.circuit && context.circuit.operations.length > 0) {
    const numQ = context.circuit.numQubits;
    const gateCount = context.circuit.operations.length;
    const gateTypes = [...new Set(context.circuit.operations.map(o => o.type))].join(', ');

    return {
      message: `I analyzed your active quantum circuit with **${numQ} qubits** and **${gateCount} gates** (${gateTypes}):

* **Quantum Register**: Initialized to ground state $|0\\rangle^{\\otimes ${numQ}}$.
* **Active Gates**: You have placed ${gateTypes} operations across the circuit moments.
* **Quantum Transformation**: Single qubit gates rotate amplitudes on the Bloch sphere, while entangling gates (like CNOT / CZ) generate quantum correlation between wires.

Click **Simulate Circuit** in the toolbar to compute the statevector, or ask me to explain any specific gate in your composition!`,
      responseType: 'debug',
      keyPoints: [`${numQ} Qubits`, `${gateCount} Gate Operations`, `Gates: ${gateTypes}`],
      suggestions: ["How does Hadamard work?", "Explain CNOT entanglement", "What is the expected statevector?"]
    };
  }

  // General quantum response
  return {
    message: `That's an insightful quantum computing question!

In quantum mechanics, quantum states exist in a complex Hilbert space where probability amplitudes satisfy $\\sum |c_i|^2 = 1$. Quantum algorithms exploit three quantum properties that have no classical analogue:

1. **Superposition**: Using Hadamard or rotation gates to evaluate multiple states simultaneously.
2. **Entanglement**: Generating non-local correlations where measurement of one qubit instantly defines the state of another.
3. **Interference**: Engineering constructive interference for the correct answer while causing destructive interference to cancel incorrect paths.

Would you like me to walk through a mathematical derivation, show you code in Qiskit, or explain how to construct this in the Quantum Lab?`,
      responseType: 'explanation',
      keyPoints: ['Superposition', 'Entanglement', 'Interference'],
      suggestions: ["Explain Grover's Search Algorithm", "How does phase kickback work?", "What can you do?"]
  };
}

class AITutorService {
  private apiUrl = `${API_BASE_URL}/api/ai/tutor`;

  async askTutor(request: TutorRequest): Promise<TutorResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Backend unavailable or timed out -> Fallback to instant intelligent response
    }

    // Return instant high-quality quantum pedagogical fallback
    return getSmartFallback(request.message, request.context);
  }
}

export const aiTutorService = new AITutorService();
