export interface LLMTrainingExample {
  id: string;
  question: string;
  idealAnswer: string;
}

export interface LLMConfig {
  assistantName: string;
  greetingMessage: string;
  systemPrompt: string;
  customKnowledge: string;
  temperature: number;
  model: "gemini-3-flash-preview" | "gemini-3.8-flash" | "gemini-2.5-flash-lite";
  quickPrompts: string[];
  trainingExamples: LLMTrainingExample[];
  updatedAt: string;
}
