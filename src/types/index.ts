export interface UCSymptomLog {
  id: string;
  timestamp: string;
  painLevel: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  bristolScaleType: number;
  triggers: string[];
  notes: string;
}

export interface DrHopeInsight {
  clinicalObservation: string;
  researchContext: string;
  motivationalQuote: string;
  isAlertTriggered: boolean;
  // New: Consensus Tracking
  consensusModels: ('chatgpt' | 'claude' | 'gemini' | 'grok')[];
  rawSourcing?: {
    chatgpt?: string;
    claude?: string;
    gemini?: string;
    grok?: string;
  };
}
