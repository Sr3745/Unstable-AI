const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const moodEmoji = document.getElementById('mood-emoji');
const body = document.body;

// A map to connect emotion strings to emojis and CSS classes
const moodMap = {
    'HAPPY': { emoji: '😄', class: 'mood-happy' },
    'SAD': { emoji: '😢', class: 'mood-sad' },
    'ANGRY': { emoji: '😠', class: 'mood-angry' },
    'LOVING': { emoji: '🥰', class: 'mood-loving' },
    'NEUTRAL': { emoji: '😐', class: 'mood-neutral' }
};

// Stores the entire conversation for context
let conversationHistory = [];

// Function to add a message to the chat box
function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message', `${sender}-message`);
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// Function to update the AI's mood
function updateMood(emotion) {
    const mood = moodMap[emotion] || moodMap['NEUTRAL'];
    moodEmoji.textContent = mood.emoji;
    body.className = ''; // Clear previous mood classes
    body.classList.add(mood.class);
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    // Add user's message to history for the AI's context
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });
    userInput.value = '';

    // Show a "typing..." indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'ai-message', 'typing-indicator');
    typingIndicator.textContent = '...';
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Send conversation history to our backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: conversationHistory })
        });

        const data = await response.json();
        const { emotion, reply } = data;
        
        // Remove typing indicator and add AI's real message
        chatBox.removeChild(typingIndicator);
        addMessage(reply, 'ai');
        
        // Add AI's response to history
        conversationHistory.push({ role: "model", parts: [{ text: JSON.stringify(data) }] });
        
        // Update the mood
        updateMood(emotion);

    } catch (error) {
        chatBox.removeChild(typingIndicator);
        addMessage("Sorry, I'm feeling a bit broken right now.", 'ai');
        console.error("Error:", error);
    }
});

// Initial greeting from the AI
function initialGreeting() {
    const firstMessage = "Oh... hey. What do you want?";
    addMessage(firstMessage, 'ai');
    conversationHistory.push({ role: "model", parts: [{ text: JSON.stringify({ emotion: "NEUTRAL", reply: firstMessage }) }] });
}

initialGreeting();