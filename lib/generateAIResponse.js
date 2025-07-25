import parseJsonResponse from "@/utils/parseJsonResponse";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Google AI
let ai;
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates an AI response using Gemini API
 * @param {string} text - The input text/prompt for the AI
 * @returns {Promise<{title: string, description: string, isError: boolean}>} - The AI response with title and description
 */
export async function generateAIResponse(text) {
  let aiTitle = "New Conversation";
  let aiDescription = "No response generated.";
  let isError = false;

  const prompt = `
Respond with a JSON object that contains:
{
  "title": "Short summary here",
  "description": "Longer explanation here"
}

Respond only with valid JSON. Don't include code blocks or text.

Prompt: ${text}
`;

  try {
    const structuredAiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
          propertyOrdering: ["title", "description"],
        },
      },
    });

    if (!structuredAiResponse?.text) {
      throw new Error("Structured AI response was invalid or empty.");
    }

    const data = parseJsonResponse(structuredAiResponse.text);

    aiTitle =
      data.title?.trim() && typeof data.title === "string"
        ? data.title.trim()
        : "New Conversation";

    aiDescription =
      data.description?.trim() && typeof data.description === "string"
        ? data.description.trim()
        : "No description available.";
  } catch (error) {
    console.error("Error generating AI response:", {
      error: error.message,
      stack: error.stack,
    });

    isError = true;
    aiTitle = "AI Service Error";
    aiDescription =
      "We encountered an issue processing your request. Please try again later.";
  }

  return { title: aiTitle, description: aiDescription, isError };
}
