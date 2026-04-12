import React, { useState } from 'react';
import { DrHopeInsight } from '../types';

interface Props {
  insight: DrHopeInsight;
}

export const InsightPanel: React.FC<Props> = ({ insight }) => {
  const [activeSource, setActiveSource] = useState<string | null>(null);

  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Multi-Model Consensus Badge */}
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full animate-pulse ${insight.consensusModels.length === 4 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {insight.consensusModels.length === 4 ? 'Unanimous Model Consensus' : 'Consensus Intelligence'}
          </span>
        </div>
        <div className="flex -space-x-1">
          {insight.consensusModels.map(m => (
            <div key={m} className="h-5 w-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-black uppercase text-slate-400">
              {m[0]}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Clinical Insight */}
      <section className="bg-white border-l-4 border-indigo-600 p-8 shadow-sm rounded-r-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Academic Honest Assessment</h3>
        <p className="text-slate-800 font-serif leading-relaxed text-lg">
          {insight.clinicalObservation}
        </p>
      </section>

      {/* 3. The Research Brief (Proactive Focus) */}
      <section className="bg-indigo-900 text-indigo-50 p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-4">Strategic Proactive Guidance</h4>
        <p className="text-md leading-relaxed mb-6 font-medium">
          {insight.researchContext}
        </p>
        
        {/* Toggleable Model Research */}
        <div className="border-t border-indigo-800 pt-6">
          <p className="text-[10px] text-indigo-400 uppercase font-bold mb-3 tracking-widest">Deep Research Sourcing:</p>
          <div className="flex gap-2">
            {['chatgpt', 'claude', 'gemini', 'grok'].map(source => (
              <button
                key={source}
                onClick={() => setActiveSource(activeSource === source ? null : source)}
                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                  activeSource === source ? 'bg-white text-indigo-900' : 'bg-indigo-800 text-indigo-300 hover:bg-indigo-700'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
          
          {activeSource && (
            <div className="mt-4 p-4 bg-indigo-950 rounded-lg animate-in zoom-in-95 duration-200">
              <p className="text-xs text-indigo-200 leading-relaxed italic">
                {/* This will pull from your deep_research.json logic */}
                "Extracted intelligence from {activeSource}: High-confidence correlation between specific amino acid profiles and mucosal layer resilience."
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. The Pretty Quote */}
      <section className="text-center py-10 px-6">
        <blockquote className="text-2xl font-serif italic text-slate-400 leading-tight">
          "{insight.motivationalQuote}"
        </blockquote>
      </section>
    </div>
  );
};
