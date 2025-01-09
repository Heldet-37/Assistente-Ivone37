import axios from 'axios';

export const API_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct/v1/chat/completions';
export const API_KEY = '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';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});