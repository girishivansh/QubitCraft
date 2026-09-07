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

class AITutorService {
  private apiUrl = 'http://localhost:8000/api/ai/tutor';

  async askTutor(request: TutorRequest): Promise<TutorResponse> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Tutor API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('AI Tutor request failed:', error);
      return {
        message: 'Quantum Tutor is temporarily unavailable. Please try again.',
        responseType: 'error',
        keyPoints: [],
        suggestions: [],
      };
    }
  }
}

export const aiTutorService = new AITutorService();
