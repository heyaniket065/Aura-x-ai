
import { GoogleGenAI, Modality } from "@google/genai";
import { AURA_X_SYSTEM_PROMPT } from '../constants';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the data:image/...;base64, part
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const generateEdit = async (files: File[], userPrompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const base64Images = await Promise.all(files.map(fileToBase64));
        
        const imageParts = files.map((file, index) => ({
            inlineData: {
                data: base64Images[index],
                mimeType: file.type,
            },
        }));

        const fullPrompt = `${AURA_X_SYSTEM_PROMPT}\n\n### USER COMMAND:\n${userPrompt}`;

        const textPart = {
            text: fullPrompt,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [textPart, ...imageParts],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        throw new Error("No image was generated. The model may have refused the request.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate image. Please check your prompt and uploaded files.");
    }
};
