import React, { useState } from 'react';
import { SymptomForm } from './components/SymptomForm';
import { InsightPanel } from './components/InsightPanel';
import { TrendAnalysis } from './components/TrendAnalysis';
import { HandoffControl } from './components/HandoffControl';
import { askDrHope } from './services/vertexService';
import { parseDrHopeResponse } from './lib/parser';
import { exportHandoff, importHandoff } from './services/handoffService';
import { UCSymptomLog, DrHopeInsight } from './types';
import { HandoffState } from './types/handoff';

function App() {
  const [insight, setInsight] = useState<DrHopeInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<UCSymptomLog[]>([]);
  const [isTrendsOpen, setIsTrendsOpen] = useState(false);

  const handleConsultation = async (log: UCSymptomLog) => {
    setLoading(true);
    try {
      setHistory(prev => [...prev, log]);
      const clinicalData = `Log: Pain ${log.painLevel}, Frequency ${log.frequency}. Notes: ${log.notes}`;
      const rawResponse = await askDrHope(clinicalData);
      setInsight(parseDrHopeResponse(rawResponse.text));
    } catch (error) {
      console.error("Clinical Handoff Blocked:", error);
    } finally {
      setLoading(false);
    }
  };

  const runHandoffExport = async () => {
    const state: HandoffState = {
      date: new Date().toISOString().split('T')[0],
      version: "1.1",
      sessionLogs: history,
      cumulativeInsights: insight ? [insight] : [],
      strategicSummary: {
        currentBattlePlan: insight?.clinicalObservation || "Awaiting initial clinical assessment.",
        consensusHighlights: insight?.consensusModels || [],
        proactivePriorities: ["Fitness", "Vagus Stretching", "Proactive Nutrition"]
      },
      researchContextVersion: "deep_research_composite_v1"
    };
    await exportHandoff(state);
  };

  const runHandoffImport = async () => {
    const state = await importHandoff();
    if (state) {
      setHistory(state.sessionLogs);
      if (state.cumulativeInsights.length > 0) {
        setInsight(state.cumulativeInsights[state.cumulativeInsights.length - 1]);
      }
      // Trigger a small "Success" notification if you add a toast library later
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto py-12 px-4">
        
        <header className="mb-6 flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-4xl font-serif font-light text-indigo-950 tracking-tight">Dr. Hope</h1>
            <p className="text-slate-500 mt-1 font-medium uppercase text-[9px] tracking-[0.2em]">Collective Intelligence Gateway</p>
          </div>
          <button onClick={() => setIsTrendsOpen(true)} className="text-[10px] font-bold uppercase text-indigo-600 tracking-widest hover:underline">Trends →</button>
        </header>

        {/* The Shift Transition Controls */}
        <HandoffControl 
          onImport={runHandoffImport} 
          onExport={runHandoffExport} 
          hasActiveSession={history.length > 0} 
        />

        <main className="space-y-6">
          <SymptomForm onSave={handleConsultation} />
          {loading && <div className="text-center py-10 animate-pulse text-indigo-600 font-medium text-sm">Orchestrating Multi-LLM Synthesis...</div>}
          {insight && !loading && <InsightPanel insight={insight} />}
        </main>

        <TrendAnalysis history={history} isOpen={isTrendsOpen} onClose={() => setIsTrendsOpen(false)} />
      </div>
    </div>
  );
}

export default App;
