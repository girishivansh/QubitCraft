import { CircuitState } from '../../types/circuit';

export const simulationSerializer = {
  toQiskit(circuit: CircuitState): string {
    let code = `from qiskit import QuantumCircuit, execute, Aer\n\n`;
    
    // Check if we need classical bits for measurement
    const hasMeasurement = circuit.operations.some(op => op.type === 'M');
    if (hasMeasurement) {
        code += `qc = QuantumCircuit(${circuit.numQubits}, ${circuit.numQubits})\n\n`;
    } else {
        code += `qc = QuantumCircuit(${circuit.numQubits})\n\n`;
    }
    
    const sortedOps = [...circuit.operations].sort((a, b) => a.moment - b.moment);
    
    for (const op of sortedOps) {
      const { type, target, control } = op;
      const lowerType = type.toLowerCase();
      
      if (control !== undefined) {
        // e.g. cx, cz
        code += `qc.${lowerType}(${control}, ${target})\n`;
      } else {
        if (lowerType === 'm') {
          code += `qc.measure(${target}, ${target})\n`;
        } else {
          code += `qc.${lowerType}(${target})\n`;
        }
      }
    }
    
    return code;
  }
};
