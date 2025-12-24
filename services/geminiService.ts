
import { GoogleGenAI, Type } from "@google/genai";
// Fix: Corrected import path for Church type
import { Church } from "../types";

// Initialize the GoogleGenAI client as per the coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a prayer suggestion based on a user-provided topic using the Gemini API.
 * @param topic The topic for the prayer.
 * @returns A string containing the prayer suggestion, or an error message.
 */
export const generatePrayerSuggestion = async (topic: string): Promise<string> => {
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

        const text = response.text;
        
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
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            name: { type: Type.STRING },
                            city: { type: Type.STRING },
                            country: { type: Type.STRING },
                            pincode: { type: Type.STRING },
                            lat: { type: Type.NUMBER },
                            lng: { type: Type.NUMBER },
                        },
                        required: ["id", "name", "city", "country", "pincode", "lat", "lng"],
                    },
                },
            },
        });
        
        const text = response.text.trim();
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
export const moderatePrayerRequest = async (
    text: string
): Promise<{ isPrayerRequest: boolean; isAppropriate: boolean; reason: string }> => {
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
