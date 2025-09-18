# RAG-Powered News Chatbot - Frontend

This repository contains the frontend client for a full-stack chatbot that provides real-time answers to queries over a news corpus. The application is built using a Retrieval-Augmented Generation (RAG) pipeline.

## ✨ Features

  * **Interactive Chat Interface:** A modern and responsive chat screen built with React and SCSS.
  * **Streaming Responses:** Bot replies are displayed with a realistic typing effect as they are streamed from the backend.
  * **Persistent Sessions:** Chat history is saved and retrieved from a Redis database, allowing conversations to persist across page refreshes.
  * **Session Management:** Users can start a new session at any time with a dedicated button.

## 🚀 Technologies

  * **Frontend:**
      * React: A component-based JavaScript library for building user interfaces.
      * SCSS: A powerful CSS preprocessor for styling.
      * `marked.js`: A library for parsing markdown to HTML for rich chat messages.
  * **Backend (Dependency):**
      * Node.js (Express): The REST API that handles all RAG and chat logic.
      * Redis: An in-memory database used for caching and managing chat sessions.

## ⚙️ Getting Started

### Prerequisites

  * Node.js installed on your machine.
  * Access to the backend repository and its API running locally or deployed.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ChaahatL/rag-chatbot-frontend.git
    cd rag-chatbot-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env.local` file:**
    Create a new file named `.env.local` in the root of the project and add your backend API URL.

    ```env
    REACT_APP_API_URL=http://localhost:3000
    ```

    (Note: If your backend is deployed, use the deployed URL instead of `localhost`.)

4.  **Start the development server:**

    ```bash
    npm start
    ```

    The application will be accessible at `http://localhost:3001`.

## 🌐 Caching & Performance

This application leverages an in-memory database (Redis) on the backend for highly efficient caching of conversation history.

  * **Chat History:** Each conversation is stored in Redis with a Time-To-Live (TTL) of **1 hour (3600 seconds)**. This TTL ensures that inactive sessions are automatically cleared from memory, optimizing performance and resource usage.
  * **Configuration:** The TTL can be configured in the backend's `index.js` file to a different value if needed.

## 📄 License

This project is open-source and available under the MIT License.

## 🙏 Acknowledgements

  * **Jina Embeddings** and **Google Gemini API** for the core RAG functionality.
  * **Qdrant** for the vector database.
  * **Redis** for in-memory chat history.
