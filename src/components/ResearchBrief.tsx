import React from 'react';

interface Props {
  update: {
    category: string;
    topic: string;
    finding: string;
    source: string;
  };
}

export const ResearchBrief: React.FC<Props> = ({ update }) => {
  return (
    <section className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-serif italic">Research First</div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-indigo-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
            {update.category} Priority
          </span>
          <span className="text-indigo-200 text-[10px] uppercase tracking-widest font-bold">
            Daily Intelligence Briefing
          </span>
        </div>
        
        <h3 className="text-xl font-serif mb-2">{update.topic}</h3>
        <p className="text-sm text-indigo-100 leading-relaxed mb-4">
          "{update.finding}"
        </p>
        
        <div className="text-[10px] text-indigo-300 font-mono uppercase">
          Source: {update.source}
        </div>
      </div>
    </section>
  );
};
