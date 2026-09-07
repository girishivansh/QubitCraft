import { useState, useCallback } from 'react';
import { GateOperation, GateType, CircuitState } from '../types/circuit';
import { v4 as uuidv4 } from 'uuid';

export function useCircuitEditor(initialState?: CircuitState) {
  const [numQubits, setNumQubits] = useState(initialState?.numQubits || 3);
  const [operations, setOperations] = useState<GateOperation[]>(initialState?.operations || []);
  const [history, setHistory] = useState<GateOperation[][]>([initialState?.operations || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newOps: GateOperation[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newOps);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addOperation = useCallback((type: GateType, target: number, moment: number, control?: number) => {
    // Check if slot is occupied
    const isOccupied = operations.some(op => op.moment === moment && (op.target === target || op.control === target || op.target === control || op.control === control));
    if (isOccupied) return false;

    const newOp: GateOperation = {
      id: uuidv4(),
      type,
      target,
      control,
      moment
    };

    const newOps = [...operations, newOp];
    setOperations(newOps);
    saveToHistory(newOps);
    return true;
  }, [operations, saveToHistory]);

  const removeOperation = useCallback((id: string) => {
    const newOps = operations.filter(op => op.id !== id);
    setOperations(newOps);
    saveToHistory(newOps);
  }, [operations, saveToHistory]);

  const updateOperation = useCallback((id: string, updates: Partial<Omit<GateOperation, 'id' | 'type'>>) => {
    const newOps = operations.map(op => op.id === id ? { ...op, ...updates } : op);
    
    // Check for collisions after update
    const updatedOp = newOps.find(op => op.id === id)!;
    const isCollision = newOps.some(op => op.id !== id && op.moment === updatedOp.moment && 
      (op.target === updatedOp.target || op.control === updatedOp.target || op.target === updatedOp.control || op.control === updatedOp.control));
      
    if (isCollision) return false;

    setOperations(newOps);
    saveToHistory(newOps);
    return true;
  }, [operations, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setOperations(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setOperations(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const clear = useCallback(() => {
    setOperations([]);
    saveToHistory([]);
  }, [saveToHistory]);

  return {
    numQubits,
    setNumQubits,
    operations,
    addOperation,
    removeOperation,
    updateOperation,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    clear,
    circuitState: { numQubits, operations }
  };
}
