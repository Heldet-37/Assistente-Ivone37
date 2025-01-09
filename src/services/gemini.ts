import { GoogleGenerativeAI } from "@google/generative-ai";
import { handleError } from '../utils/error';

const genAI = new GoogleGenerativeAI("AIzaSyCMomum53-8g3gNVg-gwODv6exeLFL2jVQ");

export async function analyzeImage(imageUrl: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Falha ao carregar a imagem');
    }
    
    const imageBlob = await response.blob();
    if (imageBlob.size === 0) {
      throw new Error('Imagem inválida');
    }
    
    const prompt = "Descreva detalhadamente esta imagem em português. Seja específico mas conciso.";
    
    const result = await model.generateContent([prompt, {
      inlineData: {
        data: await blobToBase64(imageBlob),
        mimeType: imageBlob.type
      }
    }]);
    
    if (!result.response) {
      throw new Error('Não foi possível analisar a imagem');
    }
    
    return result.response.text();
  } catch (error) {
    throw handleError(error, 'Erro ao analisar imagem');
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}