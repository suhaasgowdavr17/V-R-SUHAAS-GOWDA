import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface ExtractedWorkEntry {
  date: string;
  description: string;
  income: number;
  employerName: string;
}

export async function extractWorkDetailsFromText(text: string): Promise<ExtractedWorkEntry | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract work details from the following description of daily work: "${text}". 
      If a specific date is mentioned (like "yesterday", "last Monday", "2nd May"), calculate the ISO date (YYYY-MM-DD) based on today's date (${new Date().toISOString().split('T')[0]}). 
      If no date is mentioned, assume today.
      Extract:
      1. date (YYYY-MM-DD)
      2. description (brief summary of what was done)
      3. income (numeric value in INR, default 0 if not mentioned)
      4. employerName (name of person or company mentioned, or "Unknown")`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            description: { type: Type.STRING },
            income: { type: Type.NUMBER },
            employerName: { type: Type.STRING }
          },
          required: ["date", "description", "income", "employerName"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as ExtractedWorkEntry;
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return null;
  }
}
