// src/components/ChatInput.jsx
import React from 'react';
import './ChatInput.scss';

const ChatInput = ({ input, setInput, handleSendMessage, loading }) => {
    return (
        <div className="chat-input-container">
            <form className="chat-input" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question"
                />
                <button type="submit" disabled={loading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInput;