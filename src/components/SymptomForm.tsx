import React, { useState } from 'react';
import { Activity, Plus, ChevronDown, ChevronUp } from 'lucide-react';

// Structured payload to match the HandoffState architecture
export interface VectorLog {
  fitness: string;
  food: string;
  supplements: string;
  environment: string;
  emotional: string;
  pharm: string;
}

const SymptomForm = () => {
  const [observation, setObservation] = useState('');
  const [severity, setSeverity] = useState(5);
  const [showVectors, setShowVectors] = useState(false);
  
  // 6-Vector Clinical Synthesis State
  const [vectors, setVectors] = useState<VectorLog>({
    fitness: '',
    food: '',
    supplements: '',
    environment: '',
    emotional: '',
    pharm: ''
  });

  const handleVectorChange = (field: keyof VectorLog, value: string) => {
    setVectors(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // The structured payload for your WoW, MoM, YoY charts
    const symptomLogData = {
      id: crypto.randomUUID(), // Native standard, no 3rd party libs
      timestamp: new Date().toISOString(),
      observation,
      severity,
      vectors
    };

    console.log('Vectorized Clinical Observation Logged:', symptomLogData);
    // TODO: Dispatch to your backend/persistence layer here

    // Reset form for next frictionless entry
    setObservation('');
    setSeverity(5);
    setVectors({ fitness: '', food: '', supplements: '', environment: '', emotional: '', pharm: '' });
    setShowVectors(false);
  };

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-semibold text-slate-100">Symptom Logger</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Frictionless Logging */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Observation</label>
          <input
            type="text"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="e.g., Joint inflammation, fatigue..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 text-center">
            Severity Index: <span className="text-emerald-400 font-bold">{severity}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* 6-Vector Clinical Synthesis Expansion */}
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowVectors(!showVectors)}
            className="w-full flex items-center justify-between p-3 bg-slate-800/50 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <span>6-Vector Deep Dive (Optional)</span>
            {showVectors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showVectors && (
            <div className="p-4 bg-slate-800/20 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(vectors).map((vectorKey) => (
                <div key={vectorKey}>
                  <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">
                    {vectorKey}
                  </label>
                  <input
                    type="text"
                    value={vectors[vectorKey as keyof VectorLog]}
                    onChange={(e) => handleVectorChange(vectorKey as keyof VectorLog, e.target.value)}
                    placeholder={`Log ${vectorKey}...`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5" />
          Log Clinical Observation
        </button>
      </form>
    </div>
  );
};

export default SymptomForm;
