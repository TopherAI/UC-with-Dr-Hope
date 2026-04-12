import { VertexAI } from '@google-cloud/vertexai';
import { DR_HOPE_SYSTEM_PROMPT } from '../lib/prompts';
import { getInternalResearchSnippet } from './researchLoader';

const project = process.env.VITE_GCP_PROJECT_ID; 
const location = 'us-central1';
const vertexAI = new VertexAI({project: project!, location: location});

export async function askDrHope(userMessage: string, history: any[] = []) {
  // 1. Retrieve the most relevant proactive research from your files
  const internalContext = getInternalResearchSnippet('Proactive Measures');

  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-pro-002',
    systemInstruction: DR_HOPE_SYSTEM_PROMPT,
  });

  const chat = generativeModel.startChat({
    history: history,
  });

  // 2. Inject the deep research data directly into the prompt context
  const augmentedMessage = `
    INTERNAL RESEARCH CONTEXT:
    ${internalContext}

    USER INPUT:
    ${userMessage}
  `;

  const result = await chat.sendMessage(augmentedMessage);
  const response = await result.response;
  return {
    text: response.candidates[0].content.parts[0].text,
  };
}
