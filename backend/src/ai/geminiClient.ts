import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

export const getGeminiClient = () => {
  if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === 'your_gemini_api_key') {
    return null;
  }
  return new GoogleGenerativeAI(env.GEMINI_API_KEY);
};

export const generateGeminiContent = async (prompt: string, systemInstruction?: string): Promise<string | null> => {
  const client = getGeminiClient();
  if (!client) return null;

  const candidateModels = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-pro',
  ];

  for (const modelName of candidateModels) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction || 'You are an intelligent, friendly e-commerce shopping copilot for an Amazon/Flipkart-style store.',
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini generation failed on model ${modelName}:`, err.message || err);
    }
  }

  return null;
};
