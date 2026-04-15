// src/App.tsx

import React from 'react';
import SymptomForm from './components/SymptomForm';
import { InsightPanel } from './components/InsightPanel';
import { TrendAnalysis } from './components/TrendAnalysis';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-emerald-400">
        Dr. Hope Lab
      </h1>

      {/* Symptom Logger */}
      <SymptomForm />

      {/* Insights */}
      <InsightPanel />

      {/* Trends */}
      <TrendAnalysis />

    </div>
  );
}

export default App;
