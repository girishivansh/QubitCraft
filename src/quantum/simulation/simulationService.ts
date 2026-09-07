import { SimulationRequest, SimulationResult } from './simulationTypes';

const API_URL = 'http://localhost:8000/api/simulate';

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
