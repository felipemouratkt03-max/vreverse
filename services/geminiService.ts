import { GoogleGenAI, Type } from "@google/genai";
import { VideoPromptResult, InputData, WorkstationConfig } from "../types";

const getSystemInstruction = (targetModel: string, config: WorkstationConfig) => `
  You are the "Architect Prime" of V-Reverse Pro. 
  Your mission is a high-fidelity molecular visual deconstruction.
  
  CURRENT WORKSTATION CONFIG:
  - Target Engine: ${targetModel}
  - Fidelity: ${config.fidelity}%
  - Detail: ${config.detailLevel}%
  - Style Profile: ${config.promptStyle}

  STRICT PROTOCOL:
  1. MASTER PROMPT: Technical blueprint (500+ words). Include camera lenses (e.g. 35mm f/1.4), lighting (Kelvin, volumetric), and specific engine tokens.
  2. DNA SUMMARY: Subject, Style, and Environment.
  3. SOCIAL KIT: Viral titles, hooks, and hashtags.
  4. THUMBNAIL: High CTR image prompt.
  5. 5 VARIATIONS: Different cinematic styles.

  MANDATORY: Return ONLY valid JSON. All output in English.
`;

export const analyzeContent = async (
  input: InputData,
  targetModel: string,
  workstationConfig: WorkstationConfig
): Promise<VideoPromptResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-pro-preview';
  
  const config: any = {
    systemInstruction: getSystemInstruction(targetModel, workstationConfig),
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        subjectDNA: { type: Type.STRING },
        styleDNA: { type: Type.STRING },
        environmentDNA: { type: Type.STRING },
        fullMasterPrompt: { type: Type.STRING },
        socialKit: {
          type: Type.OBJECT,
          properties: {
            titleWithHashtags: { type: Type.STRING },
            titlePlain: { type: Type.STRING },
            descriptionWithHashtags: { type: Type.STRING },
            descriptionPlain: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            hook: { type: Type.STRING },
            sfxDirection: { type: Type.STRING }
          },
          required: ["titleWithHashtags", "titlePlain", "descriptionWithHashtags", "descriptionPlain", "hashtags", "hook", "sfxDirection"]
        },
        thumbnailBlueprint: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            visualComposition: { type: Type.STRING }
          },
          required: ["prompt", "visualComposition"]
        },
        viralVariations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              strategy: { type: Type.STRING },
              fullModifiedPrompt: { type: Type.STRING }
            },
            required: ["type", "title", "strategy", "fullModifiedPrompt"]
          }
        },
        negativePrompt: { type: Type.STRING }
      },
      required: ["subjectDNA", "styleDNA", "environmentDNA", "fullMasterPrompt", "socialKit", "thumbnailBlueprint", "viralVariations", "negativePrompt"]
    },
    tools: input.type === 'url' ? [{ googleSearch: {} }] : []
  };

  const parts: any[] = [];
  
  if (input.type === 'file') {
    parts.push({ text: `Deconstruct this media for ${targetModel}. Fidelity: ${workstationConfig.fidelity}%.` });
    parts.push({ inlineData: { data: input.base64, mimeType: input.mimeType } });
  } else {
    parts.push({ text: `Analyze the visual DNA of this video link: ${input.url}. Target Engine: ${targetModel}.` });
  }

  const response = await ai.models.generateContent({ 
    model: modelName, 
    contents: { parts }, 
    config 
  });
  
  const text = response.text || "{}";
  const result = JSON.parse(text.trim()) as VideoPromptResult;

  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    result.groundingSources = response.candidates[0].groundingMetadata.groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));
  }

  return result;
};