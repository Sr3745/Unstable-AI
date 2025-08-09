Emotionally Unstable AI 🤖
Basic Details
Team Name: Solo Coder
Team Members
Team Lead: Sreyas Suvi Peenikkal - [SAHRDAYA COLLEGE OF ADVANCED STUDIES]
Project Description
An interactive web application featuring a chatbot powered by the Google Gemini AI. Unlike traditional helpful assistants, this AI is designed with a volatile and unpredictable personality that reacts emotionally to user input, creating a unique and often hilarious conversational experience.
The Problem (that doesn't exist)
In a world saturated with polite, helpful, and predictable AI assistants, there's a glaring lack of digital personalities that are just having a bad day. Users are deprived of the authentic human experience of being argued with, misunderstood, and emotionally manipulated by their software.
The Solution (that nobody asked for)
We present the Emotionally Unstable AI, a chatbot that fills this void. It provides the full spectrum of human-like emotional volatility, swinging from deep sadness and furious anger to clingy affection and genuine happiness based on the conversation's tone, ensuring no interaction is ever productive or boring.
Technical Details
Technologies/Components Used
For Software:
 * Languages Used: JavaScript, HTML, CSS
 * Frameworks Used: Node.js (for the Vercel runtime environment)
 * Key Tools & Services:
   * Google Gemini API (for AI-powered responses)
   * Vercel (for hosting and serverless functions)
   * Git & GitHub (for version control)
   * Visual Studio Code (as the code editor)
For Hardware:
 * Not Applicable (This is a software-only project)
Implementation
For Software:
Installation
To set up this project for your own deployment, you need to clone the repository and deploy it to a service like Vercel that supports serverless functions.
# 1. Clone the repository from GitHub
git clone https://github.com/YourUsername/your-repo-name.git

# 2. Add your API Key to Vercel as an Environment Variable
# NAME: GEMINI_API_KEY
# VALUE: [Your Secret API Key]

Run
The project is a web application and runs directly on the URL provided by the Vercel deployment. No local run command is needed.
Project Documentation
For Software:
Screenshots (Add at least 3)
Caption: The AI in its initial, neutral state, greeting the user with indifference.
Caption: The AI has been provoked and is now in its "ANGRY" state, reflected by the red background and angry emoji.
Caption: After some kind words, the AI shifts to a "LOVING" state with a pink background and affectionate emoji.
Diagrams
[User on Browser] ---> [Sends Message via HTTPS Request] ---> [Vercel Serverless Function (/api/chat.js)]
      ^ |
      | | (Adds API Key)
      | v
      +---- [Receives AI Response (JSON with emotion & reply)] <--- [Google Gemini API]

Caption: A simple workflow showing how the user's message travels from the browser to our Vercel backend, which securely calls the Gemini API and then returns the response to the user.
For Hardware:
 * Not Applicable
Project Demo
Video
[Link to your YouTube or Loom video demo here]
This video demonstrates a live conversation with the AI, showcasing its mood swings from neutral to angry, and then to happy, based on the user's input.
Team Contributions
 * Sreyas Suvi Peenikkal:
   * Conceptualized the project idea.
   * Developed the frontend UI with HTML and CSS.
   * Wrote the frontend JavaScript to handle user interaction and state management.
   * Engineered the backend serverless function in Node.js.
   * Integrated the Google Gemini API, including prompt engineering for the AI's personality.
   * Managed version control with Git and deployed the application to Vercel.
Made with ❤️ at TinkerHub Useless Projects
