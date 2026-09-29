import { Experiment, CircuitState } from '../types/circuit';
import { v4 as uuidv4 } from 'uuid';
import { apiFetch } from './apiClient';

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

    // Asynchronously persist to MongoDB backend
    apiFetch<Experiment>('/api/experiments', {
      method: 'POST',
      body: JSON.stringify({
        name: newExperiment.name,
        description: newExperiment.description,
        circuit: newExperiment.circuit,
      }),
    }).catch(err => console.warn('Failed to sync experiment to MongoDB:', err));

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

    // Asynchronously update in MongoDB backend
    apiFetch<Experiment>(`/api/experiments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }).catch(err => console.warn('Failed to update experiment in MongoDB:', err));

    return experiments[index];
  },

  deleteExperiment(id: string): void {
    const experiments = this.getExperiments().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));

    // Asynchronously delete from MongoDB backend
    apiFetch(`/api/experiments/${id}`, {
      method: 'DELETE',
    }).catch(err => console.warn('Failed to delete experiment from MongoDB:', err));
  },

  /**
   * Fetches latest experiments from MongoDB backend and syncs local storage.
   */
  async syncExperiments(): Promise<Experiment[]> {
    const { data } = await apiFetch<Experiment[]>('/api/experiments');
    if (data && Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
    return this.getExperiments();
  }
};
