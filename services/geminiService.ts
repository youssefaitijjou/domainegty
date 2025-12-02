import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// CRITICAL: The API key must be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image based on a text prompt using the Nano Banana model.
 */
export const generateImageWithGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana model for generation
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Default to square
        },
      },
    });

    // Iterate through parts to find the image data
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64EncodeString = part.inlineData.data;
        // Construct the data URL
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Analyzes an image with a text prompt using Gemini 2.5 Flash.
 */
export const analyzeImageWithGemini = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    // Ensure base64 string doesn't contain the data URL prefix if passed from file reader
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt || "Describe this image in detail.",
          },
        ],
      },
    });

    return response.text || "No analysis text returned.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};