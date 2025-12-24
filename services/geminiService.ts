
import { GoogleGenAI, Type } from "@google/genai";
import type { Church } from "../types";

// Check for API key at runtime
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Some features may not work.');
}

// Initialize the GoogleGenAI client only if API key is available
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

/**
 * Generates a prayer suggestion based on a user-provided topic using the Gemini API.
 * @param topic The topic for the prayer.
 * @returns A string containing the prayer suggestion, or an error message.
 */
type GenerateContentResponse = {
    candidates: Array<{
        content: {
            parts: Array<{ text: string }>;
        };
    }>;
};

export const generatePrayerSuggestion = async (topic: string): Promise<string> => {
    if (!ai) {
        throw new Error('Gemini API is not configured. Please check your environment variables.');
    }
    
    if (!topic?.trim()) {
        return 'Please provide a valid topic for the prayer.';
    }
    
    try {
        const prompt = `Write a short, heartfelt prayer suggestion about the following topic: "${topic}". Keep it under 50 words. The prayer should be encouraging and hopeful.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 1,
                topK: 32,
            }
        });

        const text = response.candidates[0].content.parts[0].text;
        
        if (!text) {
            return "Sorry, I couldn't come up with a suggestion right now. Please try again.";
        }

        return text.trim();
    } catch (error) {
        console.error("Error generating prayer suggestion with Gemini:", error);
        return "There was an issue generating a prayer suggestion. Please check your connection and try again.";
    }
};

/**
 * Uses the Gemini API to find church locations based on a search query.
 * @param query The search query (e.g., "churches in Paris" or a specific lat/lng).
 * @returns An array of Church objects.
 */
export const findChurchesByQuery = async (query: string): Promise<Church[]> => {
    try {
        const prompt = `You are a helpful assistant that finds church locations. Based on the query "${query}", provide a list of up to 15 relevant churches. For each church, include its name, city, country, pincode, and an accurate latitude (lat) and longitude (lng). Respond ONLY with a valid JSON array of objects.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        
        const text = response.candidates[0].content.parts[0].text.trim();
        if (!text) {
            return [];
        }
        
        // The Gemini response with a schema is already valid JSON.
        const churches: Church[] = JSON.parse(text);
        // Add unique IDs based on index if the model doesn't provide them
        return churches.map((church, index) => ({ ...church, id: church.id || Date.now() + index }));

    } catch (error) {
        console.error("Error finding churches with Gemini:", error);
        return [];
    }
};

/**
 * Moderates user-submitted text to ensure it's an appropriate prayer request.
 * @param text The text content of the post to moderate.
 * @returns An object indicating if the post is a prayer request and appropriate.
 */
interface ModerationResult {
    isPrayerRequest: boolean;
    isAppropriate: boolean;
    reason: string;
}

export const moderatePrayerRequest = async (
    text: string
): Promise<ModerationResult> => {
    try {
        const prompt = `You are a strict but fair content moderator for a Christian prayer app.
        Your task is to determine if the following text is a genuine prayer request, a message of thanksgiving, or spiritual praise.
        The text MUST NOT contain hate speech, violence, profanity, spam, advertisements, or any other inappropriate content.
        
        Analyze the following text: "${text}"
        
        Respond with a JSON object. The object must have three fields:
        1. "isPrayerRequest": boolean (true if it's a prayer, thanksgiving, or praise; false otherwise)
        2. "isAppropriate": boolean (true if it's free of harmful/inappropriate content; false otherwise)
        3. "reason": string (A brief, user-friendly explanation if either check fails. E.g., "This does not seem to be a prayer request." or "This content violates community guidelines." If both pass, say "Content is appropriate.")`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isPrayerRequest: { type: Type.BOOLEAN },
                        isAppropriate: { type: Type.BOOLEAN },
                        reason: { type: Type.STRING },
                    },
                    required: ["isPrayerRequest", "isAppropriate", "reason"],
                },
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            return {
                isPrayerRequest: false,
                isAppropriate: false,
                reason: "Moderation check failed. Please try again.",
            };
        }

        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error moderating prayer request with Gemini:", error);
        return {
            isPrayerRequest: false,
            isAppropriate: false,
            reason: "Could not connect to the moderation service. Please check your connection.",
        };
    }
};
