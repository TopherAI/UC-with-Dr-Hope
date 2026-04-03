import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getDailyContent(profile?: UserProfile) {
  const today = new Date().toDateString();
  const statusContext = profile ? `The user is currently in "${profile.currentStatus}" status. Their stated goals are: "${profile.goals || 'to live a healthy life'}".` : '';
  
  const prompt = `Generate a daily update for someone with Ulcerative Colitis (UC) for the date ${today}. 
  ${statusContext}
  
  Include:
  1. A "cutting edge method" or tip for winning/thriving with UC (e.g., specific diet research, stress management, new treatments). 
     IMPORTANT: Tailor this tip specifically to the user's current status (flaring, recovering, or remission) and their goals if provided.
  2. An inspirational quote from someone who has won or is coping well with UC.
  3. The author of the quote.
  
  Keep the tone supportive, medical-lite, and encouraging.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tip: { type: Type.STRING },
            quote: { type: Type.STRING },
            author: { type: Type.STRING },
          },
          required: ["tip", "quote", "author"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching daily content:", error);
    return {
      tip: "Stay hydrated and listen to your body today. Small steps lead to big wins.",
      quote: "The human spirit is stronger than anything that can happen to it.",
      author: "C.C. Scott"
    };
  }
}

export async function generateAppImage(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
  return null;
}
