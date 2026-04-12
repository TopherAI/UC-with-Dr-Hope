import React from 'react';
import { UCSymptomLog } from '../types';
import { SymptomChart } from './SymptomChart';

interface Props {
  history: UCSymptomLog[];
  isOpen: boolean;
  onClose: () => void;
}

export const TrendAnalysis: React.FC<Props> = ({ history, isOpen, onClose }) => {
  if (!isOpen) return null;

  const averagePain = history.length > 0 
    ? (history.reduce((acc, log) => acc + log.painLevel, 0) / history.length).toFixed(1)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-serif text-slate-900">Researcher's Trend Lab</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <SymptomChart logs={history} />

        <div className="space-y-8 mt-10">
          <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-2">Aggregate Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Avg. Pain Level</p>
                <p className="text-2xl font-serif text-slate-800">{averagePain}<span className="text-sm text-slate-400">/10</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Data Points</p>
                <p className="text-2xl font-serif text-slate-800">{history.length}</p>
              </div>
            </div>
          </section>

          <section className="prose prose-slate prose-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Researcher's Clinical Note</h4>
            <p className="italic text-slate-600">
              "When viewing longitudinal data, look for environmental correlations. 
              Consistent pain levels above 4 may indicate sub-clinical inflammation 
              that warrants a review of current maintenance therapy."
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
