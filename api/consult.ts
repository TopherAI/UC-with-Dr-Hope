import { VertexAI } from '@google-cloud/vertexai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// These are set in your Vercel Project Settings, not the code
const project = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_LOCATION || 'us-central1';

const vertexAI = new VertexAI({ project: project || '', location: location });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { prompt, systemInstruction } = req.body;

  try {
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-pro-002',
      systemInstruction: systemInstruction,
    });

    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0].content.parts[0].text;

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Vertex AI Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
