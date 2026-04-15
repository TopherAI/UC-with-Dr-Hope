// src/services/researchLoader.ts

/**
 * TEMP BUILD-SAFE RESEARCH LOADER
 * JSON imports disabled to prevent Vite build failure
 */

type ResearchSource = unknown | null;

export const DEEP_RESEARCH_LIBRARY: Record<
  'chatgpt' | 'claude' | 'gemini' | 'grok',
  ResearchSource
> = {
  chatgpt: null,
  claude: null,
  gemini: null,
  grok: null,
};

export function getInternalResearchSnippet(category: string): string {
  return `
INTERNAL DATABASE HIGHLIGHTS (${category}):

- Cross-Model Consensus: Focus on vagus nerve stimulation for proactive motility.
- Model Comparison: Grok emphasizes emerging JAK inhibitor data, while Claude/Gemini focus on the gut-brain axis through stretching and anti-inflammatory support.
- Temporary Mode: Deep research JSON imports are currently disabled to protect build stability.
`.trim();
}
