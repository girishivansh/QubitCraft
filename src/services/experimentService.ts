import { Experiment, CircuitState } from '../types/circuit';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'qubitcraft_experiments';

export const experimentService = {
  getExperiments(): Experiment[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getExperiment(id: string): Experiment | undefined {
    return this.getExperiments().find(e => e.id === id);
  },

  saveExperiment(name: string, description: string, circuit: CircuitState): Experiment {
    const experiments = this.getExperiments();
    const newExperiment: Experiment = {
      id: uuidv4(),
      name,
      description,
      circuit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    experiments.push(newExperiment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
    return newExperiment;
  },

  updateExperiment(id: string, updates: Partial<Omit<Experiment, 'id' | 'createdAt'>>): Experiment | undefined {
    const experiments = this.getExperiments();
    const index = experiments.findIndex(e => e.id === id);
    if (index === -1) return undefined;

    experiments[index] = {
      ...experiments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
    return experiments[index];
  },

  deleteExperiment(id: string): void {
    const experiments = this.getExperiments().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  }
};
