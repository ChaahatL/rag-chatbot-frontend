// src/components/ChatWindow.jsx
import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import TypingEffect from './TypingEffect';
import './ChatWindow.scss';

// Pass the isStreaming prop
const ChatWindow = ({ messages, loading, isStreaming }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-box">
            {messages.length === 0 ? (
                <div className="empty-chat">
                    <h1>Meet your News Assistant!</h1>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isLastAssistantMessage = msg.role === 'assistant' && index === messages.length - 1;

                    return (
                        <div key={index} className={`message ${msg.role}`}>
                            <div className="message-text">
                                {/* The fix is here: only use TypingEffect if streaming is active */}
                                {isLastAssistantMessage && isStreaming ? (
                                    <TypingEffect text={msg.content} />
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || '') }}
                                    ></div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
            {loading && <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div>}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;