import React from 'react';
import { DrHopeInsight } from '../types';

interface Props {
  insight: DrHopeInsight;
}

export const InsightPanel: React.FC<Props> = ({ insight }) => {
  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Academic/Clinical Section */}
      <section className="bg-white border-l-4 border-indigo-600 p-6 shadow-sm rounded-r-xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Researcher's Clinical Observation</h3>
        <p className="text-slate-700 font-sans leading-relaxed">
          {insight.clinicalObservation}
        </p>
        
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Evidence Context</h4>
          <p className="text-sm text-slate-600 italic mt-1">
            {insight.researchContext}
          </p>
        </div>
      </section>

      {/* 2. Motivational Section (The "Pretty Quote") */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-indigo-100 text-center">
        <span className="absolute top-0 left-4 text-6xl text-indigo-200 font-serif opacity-50">“</span>
        <blockquote className="relative z-10">
          <p className="text-xl font-serif italic text-slate-800 leading-snug">
            {insight.motivationalQuote}
          </p>
        </blockquote>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="h-1 w-8 bg-indigo-200 rounded-full"></div>
        </div>
      </section>

      {/* 3. Honest Alert (Conditional) */}
      {insight.isAlertTriggered && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg flex items-start space-x-3">
          <div className="text-rose-600 font-bold text-xl">!</div>
          <p className="text-sm text-rose-800">
            <strong>Honest Assessment:</strong> Based on clinical thresholds, this data indicates significant activity. Please prioritize a review with your gastroenterology team.
          </p>
        </div>
      )}
    </div>
  );
};
