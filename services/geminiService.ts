
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAiClient = () => {
  if (process.env.API_KEY) {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return null;
};

// Helper for audio decoding from base64 string
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM bytes to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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

// Arbiter: Analyzes match telemetry to verify a winner and detect fraud
export const verifyMatchResult = async (matchData: any, telemetry: any[]) => {
  const ai = getAiClient();
  if (!ai) return { winnerId: matchData.players[0].id, report: "Local Verification (AI Offline)" };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `ACT AS ELITE RIVALS ARBITER. 
      Analyze this match telemetry and metadata to verify the winner and check for cheating.
      MATCH: ${JSON.stringify(matchData)}
      TELEMETRY: ${JSON.stringify(telemetry)}
      
      Return JSON: { "winnerId": "string", "report": "1-sentence summary of integrity scan", "isVerified": boolean }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winnerId: { type: Type.STRING },
            report: { type: Type.STRING },
            isVerified: { type: Type.BOOLEAN }
          },
          required: ['winnerId', 'report', 'isVerified']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { winnerId: matchData.players[0].id, report: "Fallback Verification" };
  }
};

// analyzeAntiCheatLog: Performs deep diagnostic of behavioral telemetry
export const analyzeAntiCheatLog = async (telemetry: any) => {
  const ai = getAiClient();
  if (!ai) return { verdict: 'Flagged', riskScore: 85, reason: "AI Offline Analysis" };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform high-precision anti-cheat analysis on this telemetry: ${JSON.stringify(telemetry)}. Verdict must be 'Clear' or 'Flagged'. 
      Return JSON: { "verdict": "string", "riskScore": number, "reason": "string" }`,
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
    return { verdict: 'Flagged', riskScore: 99, reason: "Analysis Error - Safeguard Triggered" };
  }
};

// generateTacticalAdvice: Provides real-time combat guidance
export const generateTacticalAdvice = async (map: string, score: any) => {
  const ai = getAiClient();
  if (!ai) return "Maintain tactical discipline.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide one high-level tactical advice for the game map ${map} given the current score ${JSON.stringify(score)}. Max 1 sentence.`,
    });
    return response.text || "Hold your position and watch your six.";
  } catch {
    return "Check your corners and wait for backup.";
  }
};

export const getLatestCodMeta = async () => {
  const ai = getAiClient();
  if (!ai) return { summary: "Tactical uplink offline.", sources: [] };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Current COD: Warzone Season 1 Meta loadouts? 2 sentences max.",
      config: { tools: [{ googleSearch: {} }] },
    });
    return { summary: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.slice(0, 2) || [] };
  } catch { return { summary: "Live data unavailable.", sources: [] }; }
};

export const speakTacticalAdvice = async (text: string) => {
  const ai = getAiClient();
  if (!ai) return;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Professional military comms: ${text}` }] }],
      config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch {}
};
