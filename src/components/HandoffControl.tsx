import React from 'react';

interface Props {
  onImport: () => void;
  onExport: () => void;
  hasActiveSession: boolean;
}

export const HandoffControl: React.FC<Props> = ({ onImport, onExport, hasActiveSession }) => {
  return (
    <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg mb-10 border border-slate-200 shadow-inner">
      <div className="flex items-center gap-3">
        <button 
          onClick={onImport}
          className="text-[9px] font-black uppercase tracking-widest bg-white border border-slate-300 px-4 py-2 rounded hover:bg-slate-50 transition-all shadow-sm active:translate-y-px"
        >
          Restore Collective Memory
        </button>
        {hasActiveSession && (
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Active Session</span>
          </div>
        )}
      </div>
      
      <button 
        onClick={onExport}
        className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded hover:bg-indigo-100 transition-all active:translate-y-px"
      >
        Finalize Research Shift
      </button>
    </div>
  );
};
