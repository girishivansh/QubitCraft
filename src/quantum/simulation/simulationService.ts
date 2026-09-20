import { SimulationRequest, SimulationResult } from './simulationTypes';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const API_URL = `${API_BASE_URL}/api/simulate`;

export const simulationService = {
  async runSimulation(request: SimulationRequest): Promise<SimulationResult> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Simulation failed: ${response.statusText}`);
      }

      const result: SimulationResult = await response.json();
      return result;
    } catch (error) {
      console.error('Error during simulation:', error);
      throw error;
    }
  }
};
