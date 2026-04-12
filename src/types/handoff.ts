import { UCSymptomLog, DrHopeInsight } from './index';

/**
 * The ultimate source of truth for shift handoffs.
 * This file allows the Multi-LLM Gateway to "wake up" with full context.
 */
export interface HandoffState {
  date: string;
  version: string;
  sessionLogs: UCSymptomLog[];
  cumulativeInsights: DrHopeInsight[];
  // Strategic "Memory" for the LLM Collective
  strategicSummary: {
    currentBattlePlan: string;
    consensusHighlights: string[];
    proactivePriorities: string[];
  };
  researchContextVersion: string; // Links back to your 4 Deep Research JSON files
}
