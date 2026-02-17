import { GoogleGenAI, Type, Modality } from "@google/genai";

// ARBITER: The final judge of 70% payouts
export const verifyMatchResult = async (matchData: any, telemetry: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `SYSTEM: ELITE RIVALS ARBITER PROTOCOL.
      ANALYZING HIGH-STAKES MATCH TELEMETRY.
      MATCH CONFIG: ${JSON.stringify(matchData)}
      GSI LOGS: ${JSON.stringify(telemetry)}
      
      TASK:
      1. Determine legitimate winner based on performance metrics.
      2. Scan for cheating (aim-smoothing, wallhacks, lag-switching).
      3. Authorize 70% Prize Pool distribution.
      
      RETURN JSON ONLY: { "winnerId": "string", "report": "detailed integrity summary", "isVerified": boolean, "cheatRisk": number }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winnerId: { type: Type.STRING },
            report: { type: Type.STRING },
            isVerified: { type: Type.BOOLEAN },
            cheatRisk: { type: Type.NUMBER }
          },
          required: ['winnerId', 'report', 'isVerified', 'cheatRisk']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Arbiter Error:", error);
    return { winnerId: matchData.players[0]?.id, report: "Error during audit. Manual review triggered.", isVerified: false };
  }
};

// AUDITOR: Security check for Paystack withdrawals
export const authorizeWithdrawal = async (amount: number, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `FINANCIAL AUDIT: Request for $${amount}. 
      User Transaction History: ${JSON.stringify(history)}. 
      Check for: High-velocity withdrawal, 0 matches played after deposit, wash gaming.
      Return JSON: { "authorized": boolean, "reason": "detailed string", "fraudScore": number }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authorized: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            fraudScore: { type: Type.NUMBER }
          },
          required: ['authorized', 'reason', 'fraudScore']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch {
    return { authorized: false, reason: "Audit service timeout.", fraudScore: 100 };
  }
};

// RICHOCHET-X: AI-driven anti-cheat diagnostics
export const analyzeAntiCheatLog = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ELITE RIVALS ANTI-CHEAT SYSTEM:
      TELEMETRY: ${JSON.stringify(data)}
      TASK: Evaluate behavioral metrics for suspicious patterns.
      RETURN JSON ONLY: { "verdict": "string", "riskScore": number, "reason": "string" }`,
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
    return JSON.parse(response.text || '{}');
  } catch {
    return { verdict: 'Review Required', riskScore: 50, reason: "AI Analysis Timeout" };
  }
};

export const generateTacticalAdvice = async (map: string, score: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Map: ${map}. Current Score: ${JSON.stringify(score)}. Give 1 professional tactical advice.`,
    });
    return response.text || "Hold the high ground.";
  } catch { return "Maintain formation."; }
};

export const speakTacticalAdvice = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Comms: ${text}` }] }],
      config: { 
        responseModalities: [Modality.AUDIO], 
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } 
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (e) { console.error("TTS Fail", e); }
};

export const getLatestCodMeta = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Current COD Warzone Season 1 Reloaded meta loadouts? 2 sentences max.",
      config: { tools: [{ googleSearch: {} }] },
    });
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }))
      .slice(0, 2);

    return { 
      summary: response.text, 
      sources: sources 
    };
  } catch { return { summary: "Live data unavailable.", sources: [] }; }
};

// Raw PCM Audio Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number = 1): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}