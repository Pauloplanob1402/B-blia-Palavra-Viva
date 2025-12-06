import { GoogleGenAI } from "@google/genai";

// NOTE: In a production app, these calls should go through a backend to protect the API Key.
// For this client-side demo, we assume the environment variable is available.
// We use a safe check for process to avoid crashing in browsers where it might be undefined.
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const geminiService = {
  explainVerse: async (verseText: string, context: string): Promise<string> => {
    if (!ai) return "Chave de API não configurada. Adicione sua chave Gemini para usar este recurso.";

    try {
      const model = 'gemini-2.5-flash';
      const prompt = `
        Você é um assistente bíblico sábio e teológico.
        Explique o seguinte versículo de forma concisa, inspiradora e teologicamente correta (máximo 100 palavras).
        Dê contexto histórico se relevante.

        Versículo: "${verseText}"
        Contexto: ${context}
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text || "Não foi possível gerar uma explicação no momento.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao conectar com a inteligência artificial. Verifique sua conexão.";
    }
  }
};
