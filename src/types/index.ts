export interface ReviewConfig {
  githubToken: string;
  openaiApiKey: string;
  language?: string;
  model?: string;
  prompt?: string;
  maxCompletionTokens?: number;
  maxPatchLength?: number;
  ignorePatterns?: string[];
}

export interface PullRequestInfo {
  owner: string;
  repo: string;
  pullNumber: number;
  title: string;
  body?: string;
  diff?: string;
}
