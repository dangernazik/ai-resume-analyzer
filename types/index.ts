export type AnalysisResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
};

export type AnalyzeRequest = {
  resumeText: string;
  jobDescription: string;
};