import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAiClient = () => {
  if (process.env.API_KEY) {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return null;
};

// --- Decoding Utils for Audio ---
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
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

// --- Core Services ---

export const getLatestCodMeta = async () => {
  const ai = getAiClient();
  if (!ai) return { summary: "Tactical uplink offline.", sources: [] };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What are the top meta loadouts and current trending map strategies for Call of Duty: Warzone Season 1 right now? Keep it extremely brief.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Intel Link",
      uri: chunk.web?.uri
    })) || [];

    return {
      summary: response.text,
      sources: sources.slice(0, 3)
    };
  } catch (error) {
    return { summary: "Failed to retrieve live battlefield data.", sources: [] };
  }
};

export const speakTacticalAdvice = async (text: string) => {
  const ai = getAiClient();
  if (!ai) return;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with extreme military professionalism: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Failure:", error);
  }
};

export const analyzeRconLogs = async (logs: any[]) => {
  const ai = getAiClient();
  if (!ai) return { securityVerdict: 'Error', trustModifier: 0, explanation: 'API Key Missing' };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze logs for hacking: ${JSON.stringify(logs)}. Return JSON: securityVerdict ('Clean', 'Flagged'), trustModifier (-50 to +50), explanation.`,
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
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { securityVerdict: 'Unknown', trustModifier: 0, explanation: 'Analysis failed' };
  }
};

export const generateTacticalAdvice = async (map: string, score: any) => {
  const ai = getAiClient();
  if (!ai) return "Tactical uplink offline.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Match on ${map}. Score CT ${score.ct} - T ${score.t}. Give a 1-sentence aggressive pro-strat.`,
    });
    return response.text;
  } catch (error) {
    return "Consolidate map control and hold angles.";
  }
};

export const analyzeAntiCheatLog = async (data: any) => {
  const ai = getAiClient();
  if (!ai) return { verdict: 'Error', riskScore: 0, reason: 'API Key Missing' };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze telemetry for aimbots: ${JSON.stringify(data)}. Return JSON: verdict, riskScore, reason.`,
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
  } catch (error) {
    return { verdict: 'Unknown', riskScore: 0, reason: 'Deep diagnostic failed' };
  }
};