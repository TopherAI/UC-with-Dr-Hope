import React, { useState } from 'react';
import { SymptomForm } from './components/SymptomForm';
import { InsightPanel } from './components/InsightPanel';
import { TrendAnalysis } from './components/TrendAnalysis';
import { askDrHope } from './services/vertexService';
import { saveLogToLocalFolder } from './services/storageService';
import { parseDrHopeResponse } from './lib/parser';
import { UCSymptomLog, DrHopeInsight } from './types';

function App() {
  const [insight, setInsight] = useState<DrHopeInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<UCSymptomLog[]>([]);
  const [isTrendsOpen, setIsTrendsOpen] = useState(false);

  const handleConsultation = async (log: UCSymptomLog) => {
    setLoading(true);
    try {
      // 1. Update history for the Trend Lab
      setHistory(prev => [...prev, log]);

      // 2. Prepare context for the Researcher persona
      const clinicalData = `
        PATIENT LOG:
        Pain Level: ${log.painLevel}/10
        Frequency: ${log.frequency} movements
        Urgency: ${log.urgency}
        Bristol Type: ${log.bristolScaleType}
        Notes: ${log.notes}
      `;

      // 3. Fetch academic/honest insight
      const rawResponse = await askDrHope(clinicalData);
      const structuredInsight = parseDrHopeResponse(rawResponse.text);
      
      setInsight(structuredInsight);
    } catch (error) {
      console.error("Clinical Consultation Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      <div className="max-w-2xl mx-auto py-12 px-4">
        
        {/* Header with Trend Toggle */}
        <header className="mb-12 flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-4xl font-serif font-light text-indigo-950 tracking-tight">Dr. Hope</h1>
            <p className="text-slate-500 mt-2 font-medium uppercase text-[9px] tracking-[0.2em]">
              Elite GI Researcher & Patient Companion
            </p>
          </div>
          
          <button 
            onClick={() => setIsTrendsOpen(true)}
            className="group flex flex-col items-end pt-2"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 group-hover:text-indigo-800 transition-colors">
              Look at Trends →
            </span>
            <div className="h-0.5 w-8 bg-indigo-100 mt-1 group-hover:w-full transition-all duration-300"></div>
          </button>
        </header>

        <main className="space-y-10">
          <section>
            <SymptomForm onSave={handleConsultation} />
          </section>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-indigo-
