import React from 'react';
import ChatWindow from './ChatWindow';
import PaperRenderer from './PaperRenderer';
import StatusBar from './StatusBar';
import '../styles/index.css';

const Layout: React.FC = () => {
    return (
        <div className="app-container">
            {/* Left Panel: Chat */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1 className="app-title">
                        Ruu Research Assistant
                    </h1>
                </div>
                <div className="chat-container">
                    <ChatWindow />
                </div>
                <StatusBar />
            </div>

            {/* Right Panel: Paper Preview */}
            <div className="main-content">
                <div className="paper-preview">
                    <PaperRenderer />
                </div>
            </div>
        </div>
    );
};

export default Layout;
