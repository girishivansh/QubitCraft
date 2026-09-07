import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Experiment } from '../types/circuit';
import { experimentService } from '../services/experimentService';
import { Trash2, Play } from 'lucide-react';

export function Experiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    setExperiments(experimentService.getExperiments());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      experimentService.deleteExperiment(id);
      setExperiments(experimentService.getExperiments());
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experiments</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your saved quantum circuits</p>
        </div>
        <Link 
          to="/quantum-lab" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          New Experiment
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {experiments.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No experiments saved yet.</li>
          ) : (
            experiments.map(exp => (
              <li key={exp.id}>
                <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-indigo-600 truncate">{exp.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{exp.description}</p>
                      <p className="mt-2 text-xs text-gray-400">Created: {new Date(exp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex items-center space-x-4">
                    <Link 
                      to={`/quantum-lab`} 
                      state={{ loadExperiment: exp.id }} // Pass state if you implement load in QuantumLab
                      className="text-gray-400 hover:text-indigo-600"
                      title="Load in Lab"
                    >
                      <Play size={20} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(exp.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
