import { useEffect, useRef, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.scss';
import Sidebar from './components/Sidebar';
import ChatWindow from "./components/ChatWindow";
import ChatInput from './components/ChatInput';

// Define the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Define the initial state for the reducer
const initialState = {
  messages: [],
  loading: false,
  sessionId: localStorage.getItem('chatbotSessionId') || null,
  input: '',
  isSidebarOpen: false,
};

// Reducer function to manage state changes
function reducer(state, action) {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE': {
      return { ...state, messages: [...state.messages, action.payload] };
    }
    case 'SET_LOADING': {
      return { ...state, loading: action.payload };
    }
    case 'SET_SESSION_ID': {
      // Save to localStorage when the sessionId is set
      if (action.payload) {
        localStorage.setItem('chatbotSessionId', action.payload);
      } else {
        localStorage.removeItem('chatbotSessionId');
      }
      return { ...state, sessionId: action.payload };
    }
    case 'SET_INPUT': {
      return { ...state, input: action.payload };
    }
    case 'TOGGLE_SIDEBAR': {
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    }
    case 'UPDATE_LAST_MESSAGE': {
      return {
        ...state,
        messages: state.messages.map((message, index) => {
          if (index === state.messages.length - 1 && message.role === 'assistant') {
            // Check if the payload indicates this is the first chunk
            if (action.payload.isFirstChunk) {
              return { ...message, content: action.payload.content };
            }
            // If not the first chunk, append the content
            return { ...message, content: message.content + action.payload.content };
          }
          return message;
        }),
      };
    }
    case 'SET_IS_STREAMING':
      return { ...state, isStreaming: action.payload };
    default: {
      throw new Error(`Unknown action type: ${action.type}`);
    }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const messagesEndRef = useRef(null);

  // Function to fetch chat history from the back-end
  const fetchHistory = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${API_URL}/chat/history?sessionId=${id}`);
      const data = await response.json();
      if (response.ok) {
        const formattedHistory = data.history.map(msg => {
          if (msg.user) {
            return { role: 'user', content: msg.user };
          } else if (msg.bot) {
            return { role: 'assistant', content: msg.bot };
          }
          return msg;
        });
        dispatch({ type: 'SET_MESSAGES', payload: formattedHistory });
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  // Effect hook for initial setup and history fetching
  useEffect(() => {
    let currentSessionId = state.sessionId;
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      dispatch({ type: 'SET_SESSION_ID', payload: currentSessionId });
    }
    
    // Fetch history for the current session on initial load
    fetchHistory(currentSessionId);
  }, [state.sessionId]);

  // Effect hook to automatically scroll to the bottom of the chat window
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [state.messages]);

  // Toggles the sidebar open or closed
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  // Handles sending a message to the chatbot with streaming
  const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!state.input.trim()) return;

      const userQuery = state.input;
      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: userQuery } });
      dispatch({ type: 'SET_INPUT', payload: '' });
      dispatch({ type: 'SET_LOADING', payload: true });

      // Add a single placeholder message for the bot's response
      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: '' } });

      dispatch({ type: 'SET_IS_STREAMING', payload: true });

      try {
          const response = await fetch(`${API_URL}/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: userQuery, sessionId: state.sessionId }),
          });

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let isFirstChunk = true; // <--- This flag is key

          while (true) {
              const { value, done } = await reader.read();
              if (done) {
                  break;
              }

              const chunk = decoder.decode(value, { stream: true });
              
              // Pass the chunk and the flag to the reducer
              dispatch({
                  type: 'UPDATE_LAST_MESSAGE',
                  payload: {
                      content: chunk,
                      isFirstChunk: isFirstChunk 
                  }
              });

              isFirstChunk = false; // Set to false after the first chunk
          }
      } catch (error) {
          console.error('Streaming error:', error);
          dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: 'An error occurred during streaming.' } });
      } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
          dispatch({ type: 'SET_IS_STREAMING', payload: false });
      }
  };
  
  // Deletes the old session from the back-end and starts a new one
  const handleNewChat = async () => {
    const oldSessionId = state.sessionId;

    // Make an API call to delete the old session from Redis
    if (oldSessionId) {
      try {
        const response = await fetch(`${API_URL}/chat/session/${oldSessionId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to delete old session:', errorData.error);
        }
      } catch (error) {
        console.error('Network error while deleting old session:', error);
      }
    }

    // Now, proceed with creating a new session on the front-end
    dispatch({ type: 'SET_MESSAGES', payload: [] });
    dispatch({ type: 'SET_SESSION_ID', payload: uuidv4() });
  };

  return (
    <div className="app-container">
      <Sidebar
        isSidebarOpen={state.isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleNewChat={handleNewChat}
      />
      <div className="main-content">
        <ChatWindow
          messages={state.messages}
          loading={state.loading}
          messagesEndRef={messagesEndRef}
          isStreaming={state.isStreaming}
        />
        <ChatInput
          input={state.input}
          setInput={(val) => dispatch({ type: 'SET_INPUT', payload: val })}
          handleSendMessage={handleSendMessage}
          loading={state.loading}
        />
      </div>
    </div>
  );
}

export default App;