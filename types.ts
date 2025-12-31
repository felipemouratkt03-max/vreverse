export interface ViralVariation {
  type: string;
  title: string;
  strategy: string;
  fullModifiedPrompt: string;
}

export interface VideoPromptResult {
  subjectDNA: string;
  styleDNA: string;
  environmentDNA: string;
  fullMasterPrompt: string;
  socialKit: {
    titleWithHashtags: string;
    titlePlain: string;
    descriptionWithHashtags: string;
    descriptionPlain: string;
    hashtags: string[];
    hook: string;
    sfxDirection: string;
  };
  thumbnailBlueprint: {
    prompt: string;
    visualComposition: string;
  };
  viralVariations: ViralVariation[];
  negativePrompt: string;
  groundingSources?: { title: string; uri: string }[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface WorkstationConfig {
  fidelity: number;
  detailLevel: number;
  promptStyle: string;
}

export type InputData = 
  | { type: 'file'; base64: string; mimeType: string }
  | { type: 'url'; url: string };

export const TARGET_MODELS = [
  { id: 'midjourney', name: 'Midjourney v6', icon: '🎨' },
  { id: 'sora', name: 'OpenAI Sora', icon: '👁️' },
  { id: 'veo', name: 'Google Veo', icon: '🎬' },
  { id: 'kling', name: 'Kling AI', icon: '⚡' },
  { id: 'runway', name: 'Runway Gen-3', icon: '🚀' }
];