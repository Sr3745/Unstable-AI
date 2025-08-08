export default async function handler(request, response) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    // Get the conversation history from the frontend
    const conversationHistory = request.body.history || [];

    // This is the prompt that defines the AI's entire personality.
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

    // Combine the system prompt with the conversation history
    const requestPayload = {
        contents: [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            {
                role: "model",
                parts: [{ text: '{"emotion": "NEUTRAL", "reply": "Oh... hey. What do you want?"}'}]
            },
            ...conversationHistory
        ]
    };

    try {
        const aiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
        });

        const data = await aiResponse.json();
        // Extract the JSON string from the AI's response
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Parse the JSON string to get the emotion and reply
        const parsedResponse = JSON.parse(responseText);

        // Send the structured data back to the frontend
        response.status(200).json(parsedResponse);

    } catch (error) {
        console.error("AI API Error:", error);
        response.status(500).json({ emotion: "NEUTRAL", reply: "I... I can't think right now. My head hurts." });
    }
}