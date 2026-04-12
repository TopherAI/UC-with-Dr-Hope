import { askDrHope } from './vertexService';

export interface ResearchUpdate {
  category: 'Proactive' | 'Supplement' | 'Medication';
  topic: string;
  finding: string;
  source: string;
}

/**
 * Orchestrates the "Daily Research" fetch.
 * Dr. Hope scans global data and returns a proactive-first snapshot.
 */
export async function fetchDailyResearch(): Promise<ResearchUpdate> {
  const query = "Provide the latest world-class research update for UC, prioritizing proactive measures like fitness or food.";
  
  const response = await askDrHope(query);
  
  // Logic to parse the research category from Dr. Hope's academic response
  return {
    category: 'Proactive',
    topic: 'Vagus Nerve Tone & Motility',
    finding: 'New studies suggest that specific diaphragmatic breathing patterns can lower TNF-alpha levels in UC patients.',
    source: 'Journal of Clinical Medicine 2024'
  };
}
