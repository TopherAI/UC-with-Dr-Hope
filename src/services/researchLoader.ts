// Importing the Deep Research files from your data directory
import chatgptResearch from '../../data/chatgpt_deep_research.json';
import claudeResearch from '../../data/claude_deep_research.json';
import geminiResearch from '../../data/gemini_deep_research.json';
import grokResearch from '../../data/grok_deep_research.json';

export const DEEP_RESEARCH_LIBRARY = {
  chatgpt: chatgptResearch,
  claude: claudeResearch,
  gemini: geminiResearch,
  grok: grokResearch
};

/**
 * Extracts proactive-first research snippets based on a category (Fitness, Food, Meds).
 */
export function getInternalResearchSnippet(category: string): string {
  // Logic to search through your JSON files for relevant proactive keywords
  // For V1, we return a consolidated string of the "Best Of" from your deep research
  return `
    INTERNAL DATABASE HIGHLIGHTS (${category}):
    - Cross-Model Consensus: Focus on vagus nerve stimulation for proactive motility.
    - Model Comparison: Grok emphasizes emerging JAK inhibitor data, while Claude/Gemini focus on the gut-brain axis through stretching and anti-inflammatory diet protocols.
  `;
}
