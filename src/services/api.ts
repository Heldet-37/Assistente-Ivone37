import { apiClient } from './api-config';
import { SYSTEM_PROMPT } from './prompts';
import { ChatResponse } from '../types/chat';

export const sendMessage = async (content: string): Promise<string> => {
  try {
    const response = await apiClient.post<ChatResponse>('', {
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content }
      ],
      max_tokens: 500,
      stream: false
    });

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida do servidor');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro na API:', error.message);
    } else {
      console.error('Erro desconhecido na API');
    }
    throw new Error('Não foi possível obter uma resposta. Por favor, tente novamente.');
  }
};