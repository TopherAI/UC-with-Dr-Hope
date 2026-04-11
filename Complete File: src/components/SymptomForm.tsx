import React, { useState } from 'react';
import { UCSymptomLog } from '../types';
import { BRISTOL_DESCRIPTIONS, UC_ALERTS } from '../lib/constants';

interface Props {
  onSave: (log: UCSymptomLog) => void;
}

export const SymptomForm: React.FC<Props> = ({ onSave }) => {
  const [formData, setFormData] = useState<Partial<UCSymptomLog>>({
    painLevel: 1,
    urgency: 'low',
    frequency: 0,
    bristolScaleType: 4,
    triggers: [],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    } as UCSymptomLog);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
      <h2 className="text-xl font-serif text-slate-800 border-b pb-2">Daily Clinical Log</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Pain Level (1-10)</label>
        <input 
          type="range" min="1" max="10" 
          value={formData.painLevel}
          onChange={(e) => setFormData({...formData, painLevel: Number(e.target.value)})}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-500 px-1">
          <span>Mild</span>
          <span className={formData.painLevel! >= UC_ALERTS.PAIN_THRESHOLD ? 'text-red-600 font-bold' : ''}>
            Current: {formData.painLevel}
          </span>
          <span>Severe</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Stool Frequency</label>
          <input 
            type="number" 
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setFormData({...formData, frequency: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Urgency</label>
          <select 
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical (Tenesmus)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Bristol Stool Scale</label>
        <select 
          value={formData.bristolScaleType}
          className="mt-1 block w-full text-sm border-slate-300 rounded-md"
          onChange={(e) => setFormData({...formData, bristolScaleType: Number(e.target.value)})}
        >
          {Object.entries(BRISTOL_DESCRIPTIONS).map(([key, desc]) => (
            <option key={key} value={key}>Type {key}: {desc}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
        Analyze with Dr. Hope
      </button>
    </form>
  );
};
