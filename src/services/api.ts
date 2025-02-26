import { apiClient } from './api-config';
import { SYSTEM_PROMPT } from './prompts';
import { ChatResponse } from '../types/chat';

let conversationHistory: { role: string; content: string }[] = [];

export const sendMessage = async (content: string): Promise<string> => {
  try {
    // Adiciona a mensagem do usuário ao histórico
    conversationHistory.push({ role: "user", content });

    // Limita o histórico para evitar tokens excessivos (ajuste conforme necessário)
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    const response = await apiClient.post<ChatResponse>('', {
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory // Inclui todo o histórico da conversa
      ],
      max_tokens: 500,
      stream: false
    });

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida do servidor');
    }

    // Adiciona a resposta ao histórico
    conversationHistory.push({
      role: "assistant",
      content: response.data.choices[0].message.content
    });

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

// Função para limpar o histórico quando necessário
export const clearConversationHistory = () => {
  conversationHistory = [];
};