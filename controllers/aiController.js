import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI requests will fail without it.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

export const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);

    // Handle different possible response shapes from the client
    const resp = result?.response;
    if (!resp) return "";

    if (typeof resp.text === 'function') {
      return await resp.text();
    }

    if (typeof resp === 'string') {
      return resp;
    }

    if (resp.body && typeof resp.body === 'string') {
      return resp.body;
    }

    if (result.outputText && typeof result.outputText === 'string') {
      return result.outputText;
    }

    // Fallback: JSON stringify the response
    return JSON.stringify(result);
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate AI response");
  }
};
