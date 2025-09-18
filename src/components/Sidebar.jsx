// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.scss';

// Props are simplified as chatHistory and loadSession are no longer used
const Sidebar = ({ isSidebarOpen, toggleSidebar, handleNewChat }) => {
    return (
        <div className={`sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    ☰
                </button>
                <div className="sidebar-title">RAG News Chatbot</div>
            </div>
            <div className="sidebar-content">
                <button className="new-chat-btn" onClick={handleNewChat}>
                    + New chat
                </button>
            </div>
        </div>
    );
};

export default Sidebar;