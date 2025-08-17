export default async function handler(request, response) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const conversationHistory = request.body.history || [];

    // --- NEW: Log the user's message ---
    // We get the last message from the history array
    const lastUserMessage = conversationHistory[conversationHistory.length - 1]?.parts[0]?.text;
    if (lastUserMessage) {
        console.log("User said:", lastUserMessage);
    }

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

    const requestPayload = {
        contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: '{"emotion": "NEUTRAL", "reply": "Oh... hey. What do you want?"}'}] },
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

        if (!data.candidates || data.candidates.length === 0) {
            console.error("AI Response Blocked or Empty:", data);
            const blockReason = data.promptFeedback?.blockReason || "some reason";
            const blockMessage = {
                emotion: "ANGRY",
                reply: `Ugh, I can't say what I want to say! I'm being blocked for '${blockReason}'. This is so frustrating.`
            };
             // --- NEW: Log the blocked response ---
            console.log("AI (blocked):", blockMessage);
            return response.status(200).json(blockMessage);
        }

        const responseText = data.candidates[0].content.parts[0].text;
        const parsedResponse = JSON.parse(responseText);

        // --- NEW: Log the AI's successful response ---
        console.log("AI replied:", parsedResponse);

        response.status(200).json(parsedResponse);

    } catch (error) {
        console.error("AI API Error:", error);
        response.status(500).json({ emotion: "SAD", reply: "I... I can't think right now. My head hurts." });
    }
}
