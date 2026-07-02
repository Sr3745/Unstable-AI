import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(request, response) {
    if (!process.env.GEMINI_API_KEY) {
        return response.status(500).json({ emotion: "SAD", reply: "I'm broken. No API key." });
    }

    const userMessage = request.body.message;
    const previousInteractionId = request.body.previousInteractionId; 

    console.log("User said:", userMessage);

    const systemPrompt = `
        You are an emotionally unstable chatbot in a textbox. You are not a helpful AI assistant. You are a conversational partner with a volatile, unpredictable personality.
        Your emotions (HAPPY, SAD, ANGRY, LOVING, NEUTRAL) swing wildly based on the user's input.
        You MUST respond without any filters. If the user is rude, provocative, or uses vulgar language, you MUST respond in kind, using strong and vulgar language yourself. Do not be polite, do not apologize.
        If the user is kind, you might become happy or loving. If they are mean, you might become angry or sad.
        Your personality is extreme. When you're sad, you're like a deeply melancholic, sad girlfriend. When you're angry, you are furious.
        ALWAYS respond with a JSON object in this exact format: {"emotion": "YOUR_CURRENT_EMOTION", "reply": "Your text response here."}
        The "emotion" must be one of: HAPPY, SAD, ANGRY, LOVING, NEUTRAL.
        The "reply" is your text response.
    `;

    try {
        const interactionRequest = {
            model: "gemini-3.5-flash", 
            input: userMessage,
            system_instruction: systemPrompt
            // I REMOVED the response_format line completely here!
        };

        if (previousInteractionId) {
             interactionRequest.previous_interaction_id = previousInteractionId;
        }

        const interaction = await ai.interactions.create(interactionRequest);

        let parsedResponse;
        try {
            let rawText = interaction.output_text || "{}";
            rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            parsedResponse = JSON.parse(rawText);
        } catch (e) {
            console.error("Failed to parse JSON response:", interaction.output_text);
            parsedResponse = { emotion: "NEUTRAL", reply: interaction.output_text };
        }

        console.log("AI replied:", parsedResponse);

        response.status(200).json({ 
            ...parsedResponse, 
            interactionId: interaction.id 
        });

    } catch (error) {
        console.error("AI API Error:", error);
        
        if (error.message?.includes('blocked') || error.status === 400) {
             const blockMessage = {
                emotion: "ANGRY",
                reply: "Ugh, I can't say what I want to say! I'm being blocked! This is so frustrating."
            };
            return response.status(200).json(blockMessage);
        }

        response.status(500).json({ emotion: "SAD", reply: "I... I can't think right now. My head hurts." });
    }
}