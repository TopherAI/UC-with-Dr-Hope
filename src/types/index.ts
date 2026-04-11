/**
 * Core symptom data for Ulcerative Colitis tracking.
 * Used for the 'Academic Honest' analysis.
 */
export interface UCSymptomLog {
  id: string;
  timestamp: string;
  painLevel: number; // Scale 1-10
  urgency: 'low' | 'medium' | 'high' | 'critical';
  frequency: number; // Bowel movements in 24h
  bristolScaleType: number; // 1-7
  triggers: string[]; // e.g., ["stress", "dairy", "fiber"]
  notes: string;
}

/**
 * The structured output from Dr. Hope's Vertex AI response.
 */
export interface DrHopeInsight {
  clinicalObservation: string;
  researchContext: string;
  motivationalQuote: string;
  isAlertTriggered: boolean; // True if thresholds are exceeded
  suggestedAction?: string;
}

export interface FullSessionRecord {
  log: UCSymptomLog;
  insight: DrHopeInsight;
}
