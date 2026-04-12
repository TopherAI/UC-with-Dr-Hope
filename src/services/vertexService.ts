import { DR_HOPE_SYSTEM_PROMPT } from '../lib/prompts';
import { getInternalResearchSnippet } from './researchLoader';

export async function askDrHope(userMessage: string) {
  const internalContext = getInternalResearchSnippet('Proactive Measures');
  
  const augmentedPrompt = `
    INTERNAL RESEARCH CONTEXT:
    ${internalContext}

    USER INPUT:
    ${userMessage}
  `;

  // We call our own Vercel API route here
  const response = await fetch('/api/consult', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: augmentedPrompt,
      systemInstruction: DR_HOPE_SYSTEM_PROMPT
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to consult Dr. Hope. Check API logs.');
  }

  return response.json(); // Returns { text: "..." }
}
