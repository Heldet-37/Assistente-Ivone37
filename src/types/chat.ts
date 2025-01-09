export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ChatHistory {
  messages: Message[];
  lastUpdated: number;
}