# 💬 Gemini Chat App — Next.js Project

A full-stack AI-powered chat application using **Next.js 14**, **MongoDB Atlas**, and **Google Gemini API**. The app allows users to start new conversations, view/edit/delete old ones, and get AI responses in a real-time chat interface.

---

## 📚 Assignment Overview

### ✅ HTML to Next.js Conversion

- `index.html` → Initial landing page (`/`)
- `chat.html` → Chat interface (`/conversation/[id]`)

### ✅ Core Features

- User can type a message and press **Enter** or click **Send**
- The message goes to a **server route** (not client-side)
- Server sends it to **Google Gemini API**
- The Gemini response is rendered on the UI

🚫 Client-side direct API calls to Gemini are strictly **not allowed**

---

### ✅ MongoDB Atlas Integration

- Store data in **MongoDB Atlas**
- Collections:
- `conversations`: Stores metadata (id, title, timestamp, description)

---

### ✅ Create Chat Behavior

- Clicking “Create Chat” brings up the prompt form
- Suggested prompts shown in the center (click-to-send)
- A **new conversation is created only after** the user sends a message

---

### ✅ Sidebar: Conversations

- Load all past conversations under "Conversations"
- Clicking on one loads its message history from MongoDB
- User can continue messaging on existing threads

---

### ✅ Conversation Management

- Each conversation has:
- **Edit title**
- **Delete conversation**
  -Share Dynamic URL: /conversation/<CONVERSATION_ROUTE>

### 🔄 1. Page Load Animations (Initial or Route Load)

- Add smooth animations when a page is loaded or route changes.
- Recommended: Use Tailwind CSS custom animations.
- Example Effects:
  - top to bottom slide in

### Simple mobail and teb responsive
