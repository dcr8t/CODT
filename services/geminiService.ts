
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Analyze RCON logs for suspicious activity (scripts, rapid fire, impossible movement)
export const analyzeRconLogs = async (logs: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these CS2 RCON logs for suspicious activity (scripts, rapid fire, impossible movement). 
      LOGS: ${JSON.stringify(logs)}
      
      Return a JSON with a securityVerdict ('Clean', 'Flagged'), a trustModifier (-50 to +50), and a brief technical explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            securityVerdict: { type: Type.STRING },
            trustModifier: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ['securityVerdict', 'trustModifier', 'explanation']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { securityVerdict: 'Unknown', trustModifier: 0, explanation: 'Analysis failed' };
  }
};

// Provide pro-level tactical strategies based on live score and map
export const generateTacticalAdvice = async (map: string, score: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Match on ${map}. Score is CT ${score.ct} - T ${score.t}. 
      Give a 1-sentence pro-strat for the trailing team.`,
    });
    return response.text;
  } catch (error) {
    return "Focus on map control and eco management.";
  }
};

// Perform deep behavioral analysis on player telemetry to detect cheating
export const analyzeAntiCheatLog = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a deep diagnostic on this player telemetry for suspicious patterns indicative of digital assistance or non-human aim.
      DATA: ${JSON.stringify(data)}
      
      Return a JSON with: verdict ('Flagged', 'Clean'), riskScore (0-100), and reason.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ['verdict', 'riskScore', 'reason']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { verdict: 'Unknown', riskScore: 0, reason: 'Deep diagnostic failed' };
  }
};
