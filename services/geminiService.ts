
import { GoogleGenAI, Type } from "@google/genai";
import { AddonType } from "../types";

// Always use named parameter for apiKey and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMinecraftContent = async (
  type: AddonType,
  name: string,
  description: string
) => {
  // Directly call ai.models.generateContent and await the response
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a valid Minecraft Bedrock Edition JSON for a ${type} called "${name}".
    Context: ${description}
    
    You must provide two JSON objects:
    1. Behavior Pack JSON
    2. Resource Pack JSON (if applicable, otherwise provide an empty object)
    
    Return the response in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          behavior_json: {
            type: Type.STRING,
            description: "The behavior pack JSON content as a string"
          },
          resource_json: {
            type: Type.STRING,
            description: "The resource pack JSON content as a string"
          },
          explanation: {
            type: Type.STRING,
            description: "A brief explanation of what was generated"
          }
        },
        required: ["behavior_json", "resource_json"]
      }
    }
  });

  // Extract generated text from the .text property (not a method)
  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr);
};
