export enum AppMode {
  GENERATE = 'GENERATE',
  ANALYZE = 'ANALYZE'
}

export interface GeneratedImage {
  id: string;
  data: string; // Base64
  prompt: string;
  timestamp: number;
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export interface GeminiError {
  message: string;
  details?: string;
}