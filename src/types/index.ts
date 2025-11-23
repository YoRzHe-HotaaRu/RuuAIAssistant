export interface SearchResult {
  url: string;
  title: string;
  content: string;
  score: number;
  favicon?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  answer?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ResearchPaper {
  title: string;
  content: string; // Markdown content
  references: string[];
}

export interface AppState {
  messages: ChatMessage[];
  isResearching: boolean;
  researchTopic: string;
  paper: ResearchPaper | null;
  tokensUsed: number;
  timeElapsed: number;
}
