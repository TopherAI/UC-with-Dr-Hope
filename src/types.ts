export interface DailyContent {
  tip: string;
  quote: string;
  author: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'meal' | 'drink' | 'supplement' | 'activity' | 'trigger' | 'symptom';
  content: string;
  severity?: number; // 1-10 for symptoms
}

export interface UserProfile {
  name: string;
  diagnosisDate: string;
  currentStatus: 'flaring' | 'remission' | 'recovering';
  goals: string;
}
