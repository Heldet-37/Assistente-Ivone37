import axios from 'axios';

const WHATSAPP_API_URL = process.env.REACT_APP_WHATSAPP_API_URL;
const WHATSAPP_TOKEN = process.env.REACT_APP_WHATSAPP_TOKEN;

export const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw new Error('Falha ao enviar mensagem no WhatsApp');
  }
};