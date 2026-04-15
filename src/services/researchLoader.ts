// src/services/researchLoader.ts

/**
 * TEMP BUILD-SAFE RESEARCH LOADER
 *
 * Direct JSON imports are disabled because Vite is failing to parse one or more
 * deep research JSON files during build on Vercel.
 *
 * We are preserving the research files themselves and returning a safe fallback
 * until the JSON loading strategy is rebuilt.
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

/**
 * Returns a safe internal snippet even while the research JSON imports are disabled.
 */
export function getInternalResearchSnippet(category: string): string {
  return `
INTERNAL DATABASE HIGHLIGHTS
