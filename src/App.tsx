import React, { useState } from 'react';
import { SymptomForm } from './components/SymptomForm';
import { InsightPanel } from './components/InsightPanel';
import { askDrHope } from './services/vertexService';
import { saveLogToLocalFolder } from './services/storageService';
import { parseDrHopeResponse } from './lib/parser';
import { UCSymptomLog, DrHopeInsight } from './types';

function App() {
  const [insight, setInsight] = useState<DrHopeInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConsultation = async (log: UCSymptomLog) => {
    setLoading(true);
    try {
      // 1. Prepare clinical context for the Researcher persona
      const clinicalData = `
        PATIENT LOG:
        Pain Level: ${log.painLevel}/10
        Frequency: ${log.frequency} movements
        Urgency: ${log.urgency}
        Bristol Type: ${log.bristolScaleType}
        Notes: ${log.notes}
      `;

      // 2. Fetch AI Insight
      const rawResponse = await askDrHope(clinicalData);
      const structuredInsight = parseDrHopeResponse(rawResponse.text);
      
      setInsight(structuredInsight);

      // 3. Optional: Trigger local save immediately or via button
      console.log("Analysis Complete for Log ID:", log.id);
    } catch (error) {
      console.error("Clinical Consultation Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-light text-indigo-950 tracking-tight">Dr. Hope</h1>
          <p className="text-slate-500 mt-2 font-medium uppercase text-xs tracking-[0.2em]">
            Elite GI Researcher & Patient Companion
          </p>
        </header>

        <main className="space-y-10">
          <section>
            <SymptomForm onSave={handleConsultation} />
          </section>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-indigo-600 font-medium animate-pulse">
                Analyzing biomarkers and clinical trends...
              </p>
            </div>
          )}

          {insight && !loading && (
            <section className="animate-in fade-in duration-1000">
              <InsightPanel insight={insight} />
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => saveLogToLocalFolder(insight)}
                  className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors uppercase tracking-widest font-bold"
                >
                  <span>↓</span> Archive Research Insight to Local Folder
                </button>
              </div>
            </section>
          )}
        </main>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 uppercase tracking-widest">
          Research Use Only • Honest Clinical Assessment Mode
        </footer>
      </div>
    </div>
  );
}

export default App;
