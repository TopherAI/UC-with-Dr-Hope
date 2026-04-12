import { DrHopeInsight } from '../types';

export function parseDrHopeResponse(rawText: string): DrHopeInsight {
  const sections = rawText.split(/###|\d\./).filter(s => s.trim().length > 0);

  // Logic: Dr. Hope will flag consensus in the text. 
  // We detect these flags to light up the UI badges.
  const checkConsensus = (text: string) => {
    const models: ('chatgpt' | 'claude' | 'gemini' | 'grok')[] = [];
    if (text.toLowerCase().includes('consensus') || text.toLowerCase().includes('all models')) {
       return ['chatgpt', 'claude', 'gemini', 'grok'];
    }
    // Default to at least the primary model
    return ['gemini'];
  };

  return {
    clinicalObservation: sections[0]?.trim() || "Analysis complete.",
    researchContext: sections[1]?.trim() || "Referencing proactive measures...",
    motivationalQuote: sections[2]?.trim() || "We stand resilient.",
    isAlertTriggered: rawText.includes("Critical") || rawText.includes("Consult your GI"),
    consensusModels: checkConsensus(rawText) as any
  };
}
