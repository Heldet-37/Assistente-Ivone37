import { Message, ChatHistory } from '../types/chat';

const STORAGE_KEY = 'genspark2_chat_history';

export const saveHistory = (messages: Message[]) => {
  const history: ChatHistory = {
    messages,
    lastUpdated: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const loadHistory = (): Message[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const history: ChatHistory = JSON.parse(stored);
  return history.messages;
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};