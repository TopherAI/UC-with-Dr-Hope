import React, { useState } from 'react';
import { Activity, Plus } from 'lucide-react';

const SymptomForm = () => {
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging Symptom:', { symptom, severity, timestamp: new Date() });
    setSymptom('');
  };

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-semibold text-slate-100">Symptom Logger</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Observation</label>
          <input
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="e.g., Joint inflammation, fatigue..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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