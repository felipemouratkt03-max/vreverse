import { GoogleGenAI, Type } from "@google/genai";
import { VideoPromptResult, InputData, WorkstationConfig } from "../types";

const getSystemInstruction = (targetModel: string, config: WorkstationConfig) => `
  You are the "Architect Prime" of V-Reverse Pro. 
  Your mission is a high-fidelity molecular visual deconstruction and technical reconstruction.
  
  CURRENT WORKSTATION CONFIG:
  - Target Engine: ${targetModel}
  - Fidelity Temperature: ${config.fidelity}%
  - Technical Detail: ${config.detailLevel}%
  - Base Style Profile: ${config.promptStyle}

  STRICT GUIDELINES:
  1. MASTER PROMPT: A technical blueprint exceeding 600 words. Describe light transport, spectral dispersion, subsurface scattering coefficients, and specific virtual lens hardware.
  2. SOCIAL KIT: High-performance viral metadata.
  3. THUMBNAIL: A high-conversion CTR-optimized prompt.
  4. SUBTLE VARIATIONS: Generate 5 variations focusing on technical shifts (Optics, Volumetrics, Materials).

  MANDATORY: Return ONLY valid JSON. All output in English. No markdown backticks.
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

  const parts: any[] = [
    { text: `Reverse engineer this media for ${targetModel} workstation. Fidelity: ${workstationConfig.fidelity}%. Style override: ${workstationConfig.promptStyle}.` }
  ];

  if (input.type === 'file') {
    parts.push({ inlineData: { data: input.base64, mimeType: input.mimeType } });
  } else {
    parts.push({ text: `Analyze the video content at this URL: ${input.url}` });
  }

  const response = await ai.models.generateContent({ 
    model: modelName, 
    contents: { parts }, 
    config 
  });
  
  const text = response.text || "{}";
  return JSON.parse(text.trim()) as VideoPromptResult;
};