import { GoogleGenAI } from "@google/genai";

// Safe access to environment variable that works in both Node.js and Browser environments
// without crashing if 'process' is undefined.
const getApiKey = () => {
  try {
    // Check if process is defined (Node/Build env)
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
    return '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
// Only initialize if we have a key, otherwise ai stays null
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const geminiService = {
  explainVerse: async (verseText: string, context: string): Promise<string> => {
    // Specific check: If AI is null, it means the Key is missing in Vercel/Env
    if (!ai) {
      console.warn("API Key missing. Please add API_KEY to Vercel Environment Variables.");
      return "Configuração necessária: Chave da IA não encontrada. Verifique as variáveis de ambiente na Vercel.";
    }

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
    } catch (error: any) {
      console.error("Gemini Error:", error);
      
      // Check for common API key errors
      if (error.toString().includes('400') || error.toString().includes('API key')) {
         return "Erro de Permissão: Verifique se sua Chave de API é válida e está ativa.";
      }

      return "A conexão com a IA falhou. Tente novamente em instantes.";
    }
  }
};
