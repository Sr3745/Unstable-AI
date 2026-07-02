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

// --- NEW: Map emotions to background colors ---
const emotionColors = {
    NEUTRAL: "#f7d6d8", // Default pastel pink
    HAPPY: "#fff9c4",   // Light pastel yellow
    SAD: "#bbdefb",     // Light pastel blue
    ANGRY: "#ffcdd2",   // Light pastel red
    LOVING: "#f8bbd0"   // Deeper pastel pink
};

// Add a smooth fade transition to the background
document.body.style.transition = "background-color 0.5s ease";

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // 1. Append User Message
    appendMessage(text, "user");
    messageInput.value = "";

    // 2. Show Loading State
    const loadingDiv = appendMessage("Thinking...", "loading");

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

        // 4. Update the Avatar Emoji AND Background Color based on mood
        if (data.emotion) {
            if (emotionEmojis[data.emotion]) {
                avatar.textContent = emotionEmojis[data.emotion];
            }
            if (emotionColors[data.emotion]) {
                document.body.style.backgroundColor = emotionColors[data.emotion];
            }
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