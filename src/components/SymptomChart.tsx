
import React from 'react';
import { UCSymptomLog } from '../types';

interface Props {
  logs: UCSymptomLog[];
}

export const SymptomChart: React.FC<Props> = ({ logs }) => {
  const maxPain = 10;
  // Show last 7 entries for a weekly trend view
  const displayLogs = logs.slice(-7);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 flex justify-between items-center">
        <span>7-Day Pain Biomarker Trend</span>
        {logs.length > 0 && <span className="text-indigo-600">n={logs.length}</span>}
      </h3>
      
      <div className="flex items-end justify-between h-32 gap-3">
        {displayLogs.map((log) => (
          <div key={log.id} className="flex flex-col items-center flex-1 group relative">
            {/* The Bar */}
            <div 
              className={`w-full rounded-t-sm transition-all duration-500 group-hover:brightness-110 relative ${
                log.painLevel >= 7 ? 'bg-rose-400' : 'bg-indigo-400'
              }`}
              style={{ height: `${(log.painLevel / maxPain) * 100}%` }}
            >
              {/* Tooltip on Hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                Pain: {log.painLevel}
              </div>
            </div>
            
            {/* X-Axis Label */}
            <span className="text-[9px] mt-3 text-slate-400 font-medium">
              {new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="w-full flex items-center justify-center text-slate-300 italic text-sm border-2 border-dashed border-slate-100 rounded-lg py-10">
            Awaiting longitudinal data...
          </div>
        )}
      </div>
    </div>
  );
};
