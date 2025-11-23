import React, { useState, useRef, useEffect } from 'react';
import { useResearch } from '../context/ResearchContext';
import type { ChatMessage } from '../types';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow: React.FC = () => {
    const { messages, addMessage, isResearching, setResearching, setTopic } = useResearch();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isResearching) return;

        const userMsg = { role: 'user' as const, content: input };
        addMessage(userMsg);
        setTopic(input); // Set topic to trigger research loop
        setResearching(true); // Start the research process
        setInput('');
    };

    return (
        <div className="chat-window">
            <div className="messages-list">
                <AnimatePresence>
                    {messages.map((msg: ChatMessage, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`message-row ${msg.role}`}
                        >
                            <div
                                className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                            >
                                <p>{msg.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isResearching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="message-row assistant"
                    >
                        <div className="loading-bubble">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Researching...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-container">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter a research topic..."
                        className="chat-input"
                        disabled={isResearching}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isResearching}
                        className="send-button"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div >
    );
};

export default ChatWindow;
