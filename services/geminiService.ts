import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateItemInsight = async (itemName: string, currentPrice: number): Promise<string> => {
  if (!apiKey) {
    return "Chave de API não configurada.";
  }

  try {
    const model = 'gemini-2.5-flash';
    // Updated prompt for Portuguese context
    const prompt = `
      Você é um leiloeiro oficial experiente e sofisticado no Brasil.
      Escreva uma frase de venda curta, atraente e profissional (máximo 2 linhas) para um lote de leilão intitulado "${itemName}" avaliado atualmente em R$ ${currentPrice.toLocaleString('pt-BR')}.
      Foque na exclusividade, oportunidade de investimento ou escassez. 
      Use português formal e persuasivo. Não use hashtags.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Não foi possível gerar a análise no momento.";
  }
};