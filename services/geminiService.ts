
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAntiCheatLog = async (playerData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following player performance metrics for suspicious behavior or cheating. Return a JSON object with a riskScore (0-100) and a brief reason.
      Player Metrics: ${JSON.stringify(playerData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            verdict: { type: Type.STRING, enum: ['Clean', 'Suspicious', 'Flagged'] }
          },
          required: ['riskScore', 'reason', 'verdict']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { riskScore: 0, reason: "Analysis unavailable", verdict: "Unknown" };
  }
};

export const getMatchProTips = async (map: string, mode: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 elite pro-tips for the Call of Duty map "${map}" in "${mode}" mode. Focus on positioning and meta-strategies. Return as a plain text string.`,
    });
    return response.text;
  } catch (error) {
    return "Stay focused and check your corners!";
  }
};
