export type CodeLanguage =
  | "auto"
  | "javascript"
  | "typescript"
  | "python"
  | "go"
  | "rust"
  | "java"
  | "other";

export type CodeExplanation = {
  whatItDoes: string;
  howItWorks: string[];
  timeComplexity: string;
  spaceComplexity: string;
  thingsToWatch: string[];
  deeper?: string;
  provider: string;
};

export type ExplainErrorBody = {
  error: string;
  code?: "MISSING_API_KEY" | "EMPTY_INPUT" | "UPSTREAM_ERROR";
};
