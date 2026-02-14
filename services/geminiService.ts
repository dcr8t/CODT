
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const verifyMatchOutcomeWithAI = async (rawApiData: any, matchContext: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an official Call of Duty Tournament Arbitrator. 
      Analyze this simulated API JSON from Activision and determine the winner based on Placement #1.
      API DATA: ${JSON.stringify(rawApiData)}
      MATCH CONTEXT: ${JSON.stringify(matchContext)}
      
      Return a JSON with the winnerId, the winning score, and a 'securityAudit' string confirming no suspicious stat anomalies were found in the API data.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winnerId: { type: Type.STRING },
            winningScore: { type: Type.NUMBER },
            securityAudit: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          },
          required: ['winnerId', 'winningScore', 'securityAudit']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Verification Error:", error);
    return null;
  }
};

export const analyzeAntiCheatLog = async (playerData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following player performance metrics for suspicious behavior or cheating in Call of Duty. Return a JSON object with a riskScore (0-100), a detailed reason, and a verdict.
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

export const generateMatchCommentary = async (match: any, eventType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a hype, professional esports-style commentary line for a Call of Duty match on ${match.map}. Event: ${eventType}. Keep it under 20 words.`,
    });
    return response.text;
  } catch (error) {
    return "The action is heating up on the battlefield!";
  }
};
