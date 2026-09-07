import time
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
import numpy as np
from datetime import datetime

from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
import qiskit.quantum_info as qi

# --- Pydantic Models ---

class Operation(BaseModel):
    id: str
    type: str
    target: int
    control: Optional[int] = None
    moment: int

class Circuit(BaseModel):
    numQubits: int
    operations: List[Operation]

class SimulationRequest(BaseModel):
    circuit: Circuit
    shots: int = 1024

class ComplexAmplitude(BaseModel):
    real: float
    imag: float
    magnitude: float
    probability: float
    phase: float

class BlochVector(BaseModel):
    x: float
    y: float
    z: float

class SimulationMetadata(BaseModel):
    depth: int
    gateCount: int

class SimulationStep(BaseModel):
    operationIndex: int
    statevector: Optional[Dict[str, ComplexAmplitude]] = None
    blochVectors: Optional[Dict[int, BlochVector]] = None

class SimulationResult(BaseModel):
    success: bool
    backend: str
    shots: int
    counts: Dict[str, int]
    probabilities: Dict[str, float]
    statevector: Optional[Dict[str, ComplexAmplitude]] = None
    blochVectors: Optional[Dict[int, BlochVector]] = None
    steps: Optional[List[SimulationStep]] = None
    executionTimeMs: float
    metadata: SimulationMetadata
    timestamp: str
    error: Optional[str] = None

# --- Simulator ---

def get_state_info(sv: qi.Statevector, num_qubits: int):
    sv_dict = {}
    for i, amp in enumerate(sv):
        bin_str = format(i, f'0{num_qubits}b')
        real = float(np.real(amp))
        imag = float(np.imag(amp))
        mag = float(np.abs(amp))
        prob = mag ** 2
        phase = float(np.angle(amp))
        sv_dict[bin_str] = ComplexAmplitude(
            real=real, imag=imag, magnitude=mag, probability=prob, phase=phase
        )
        
    rho = qi.DensityMatrix(sv)
    bloch_vectors = {}
    for q in range(num_qubits):
        qubits_to_trace = list(range(num_qubits))
        qubits_to_trace.remove(q)
        if qubits_to_trace:
            reduced_rho = qi.partial_trace(rho, qubits_to_trace)
        else:
            reduced_rho = rho
            
        x_val = np.real(reduced_rho.expectation_value(qi.Pauli('X')))
        y_val = np.real(reduced_rho.expectation_value(qi.Pauli('Y')))
        z_val = np.real(reduced_rho.expectation_value(qi.Pauli('Z')))
        
        bloch_vectors[q] = BlochVector(x=float(x_val), y=float(y_val), z=float(z_val))
    return sv_dict, bloch_vectors

def simulate_circuit(request: SimulationRequest) -> SimulationResult:
    start_time = time.time()
    
    try:
        num_qubits = request.circuit.numQubits
        operations = request.circuit.operations
        shots = request.shots
        
        qc = QuantumCircuit(num_qubits, num_qubits)
        
        # Build circuit
        for op in operations:
            op_type = op.type.upper()
            target = op.target
            control = op.control
            
            if target >= num_qubits or target < 0:
                raise ValueError(f"Invalid target qubit index: {target}")
            if control is not None and (control >= num_qubits or control < 0 or control == target):
                raise ValueError(f"Invalid control qubit index: {control}")
                
            if op_type == 'H':
                qc.h(target)
            elif op_type == 'X':
                qc.x(target)
            elif op_type == 'Y':
                qc.y(target)
            elif op_type == 'Z':
                qc.z(target)
            elif op_type == 'S':
                qc.s(target)
            elif op_type == 'T':
                qc.t(target)
            elif op_type == 'SDG':
                qc.sdg(target)
            elif op_type == 'TDG':
                qc.tdg(target)
            elif op_type == 'CX':
                qc.cx(control, target)
            elif op_type == 'CZ':
                qc.cz(control, target)
            elif op_type == 'SWAP':
                qc.swap(control, target)
            elif op_type == 'M':
                qc.measure(target, target)
            else:
                raise ValueError(f"Unsupported gate type: {op_type}")
                
        depth = qc.depth()
        gate_count = sum(qc.count_ops().values())
        
        qc_state = QuantumCircuit(num_qubits)
        steps = []
        for idx, op in enumerate(operations):
            if op.type.upper() == 'M':
                continue
            
            op_type = op.type.upper()
            target = op.target
            control = op.control
            
            if op_type == 'H':
                qc_state.h(target)
            elif op_type == 'X':
                qc_state.x(target)
            elif op_type == 'Y':
                qc_state.y(target)
            elif op_type == 'Z':
                qc_state.z(target)
            elif op_type == 'S':
                qc_state.s(target)
            elif op_type == 'T':
                qc_state.t(target)
            elif op_type == 'SDG':
                qc_state.sdg(target)
            elif op_type == 'TDG':
                qc_state.tdg(target)
            elif op_type == 'CX':
                qc_state.cx(control, target)
            elif op_type == 'CZ':
                qc_state.cz(control, target)
            elif op_type == 'SWAP':
                qc_state.swap(control, target)
                
            sv = qi.Statevector.from_instruction(qc_state)
            step_sv, step_bloch = get_state_info(sv, num_qubits)
            steps.append(SimulationStep(
                operationIndex=idx,
                statevector=step_sv,
                blochVectors=step_bloch
            ))
            
        final_sv = qi.Statevector.from_instruction(qc_state)
        sv_dict, bloch_vectors = get_state_info(final_sv, num_qubits)
            
        has_measurement = any(op.type.upper() == 'M' for op in operations)
        if not has_measurement:
            for i in range(num_qubits):
                qc.measure(i, i)
        
        simulator = AerSimulator()
        job_counts = simulator.run(qc, shots=shots)
        result_counts = job_counts.result()
        counts_raw = result_counts.get_counts()
        
        counts = {}
        probabilities = {}
        for k, v in counts_raw.items():
            key = k.replace(" ", "")
            counts[key] = int(v)
            probabilities[key] = float(v) / shots
            
        exec_time = (time.time() - start_time) * 1000
        
        return SimulationResult(
            success=True,
            backend="qiskit-aer",
            shots=shots,
            counts=counts,
            probabilities=probabilities,
            statevector=sv_dict,
            blochVectors=bloch_vectors,
            steps=steps,
            executionTimeMs=exec_time,
            metadata=SimulationMetadata(depth=depth, gateCount=gate_count),
            timestamp=datetime.utcnow().isoformat(),
        )

    except Exception as e:
        exec_time = (time.time() - start_time) * 1000
        return SimulationResult(
            success=False,
            backend="qiskit-aer",
            shots=request.shots if hasattr(request, 'shots') else 0,
            counts={},
            probabilities={},
            executionTimeMs=exec_time,
            metadata=SimulationMetadata(depth=0, gateCount=0),
            timestamp=datetime.utcnow().isoformat(),
            error=str(e)
        )
