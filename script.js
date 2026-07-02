// This tracks the server-side conversation ID
let currentInteractionId = null;

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const avatar = document.getElementById("avatar");

// Map emotions to corresponding emojis
const emotionEmojis = {
    NEUTRAL: "😐",
    HAPPY: "😊",
    SAD: "😭",
    ANGRY: "😡",
    LOVING: "🥰"
};

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // 1. Append User Message
    appendMessage(text, "user");
    messageInput.value = "";

    // 2. Show Loading State
    const loadingDiv = appendMessage("Thinking...", "ai loading");

    try {
        // 3. Post to our backend Vercel function
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: text,
                previousInteractionId: currentInteractionId // Pass the history link
            })
        });

        const data = await response.json();
        loadingDiv.remove();

        // 4. Update the Avatar Emoji based on the AI's current mood
        if (data.emotion && emotionEmojis[data.emotion]) {
            avatar.textContent = emotionEmojis[data.emotion];
        }

        // 5. Append AI Reply
        appendMessage(data.reply || "...", "ai");

        // 6. Save the interaction ID for the next message loop!
        if (data.interactionId) {
            currentInteractionId = data.interactionId;
        }

    } catch (error) {
        console.error("Error sending message:", error);
        loadingDiv.remove();
        appendMessage("System error... even I messed up.", "ai");
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});