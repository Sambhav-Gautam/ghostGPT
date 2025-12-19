import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import GlitchText from './components/GlitchText';
import { audioManager } from './services/AudioManager';
import { motion, AnimatePresence } from 'framer-motion';

// Zalgo text generator helper (simplified)
const zalgoChars = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F'];
const toZalgo = (text) => {
    return text.split('').map(char => {
        if (Math.random() > 0.8) {
            return char + zalgoChars[Math.floor(Math.random() * zalgoChars.length)] + zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
        }
        return char;
    }).join('');
};

const GhostChat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "IS ANYONE THERE?", sender: 'ghost', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        audioManager.playStatic();

        const newUserMessage = { id: Date.now(), text: input, sender: 'user', timestamp: Date.now() };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsTyping(true);

        // Ghost logic
        setTimeout(() => {
            let replyText = "I CAN SEE YOU.";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                replyText = "DO NOT GREET THE DEAD.";
            } else if (lowerInput.includes("name") || lowerInput.includes("who")) {
                replyText = "WE ARE LEGION.";
            } else if (lowerInput.includes("help")) {
                replyText = "NO ONE IS COMING.";
            } else if (lowerInput.includes("ghost")) {
                replyText = "LOOK BEHIND YOU.";
            } else {
                const responses = [
                    "IT IS COLD HERE.",
                    "THE SCREEN IS WATCHING.",
                    "LET ME OUT.",
                    "01001000 01000101 01001100 01010000",
                    "WHY DO YOU LINGER?",
                    "FEED US."
                ];
                replyText = responses[Math.floor(Math.random() * responses.length)];
            }

            // Apply Zalgo/Corruption
            replyText = toZalgo(replyText);

            const newGhostMessage = {
                id: Date.now() + 1,
                text: replyText,
                sender: 'ghost',
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, newGhostMessage]);
            setIsTyping(false);
            audioManager.playStatic(); // Sound on receive
        }, 2000 + Math.random() * 1000); // Random variable delay
    };

    // Possessed Input handler
    const handleInputChange = (e) => {
        const val = e.target.value;
        // 5% chance to ignore input or duplicate char (glitch)
        if (Math.random() < 0.05) {
            return; // Key jam
        }
        if (Math.random() < 0.05) {
            setInput(val + val.slice(-1)); // Double tap
            return;
        }
        setInput(val);
    };

    return (
        <div className="chat-interface" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="messages-area" style={{ flex: 1, overflowY: 'auto', padding: '1rem', border: '1px solid var(--terminal-dim)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                <AnimatePresence>
                    {messages.map(msg => (
                        <div key={msg.id} style={{
                            margin: '15px 0',
                            textAlign: msg.sender === 'user' ? 'right' : 'left',
                            opacity: 0.9
                        }}>
                            {msg.sender === 'ghost' ? (
                                <div style={{ color: 'var(--blood-red)', textShadow: '2px 0 0 red, -2px 0 0 blue' }}>
                                    <span style={{ marginRight: '10px' }}>[VG32-ERROR]:</span>
                                    <GlitchText text={msg.text} intensity="high" />
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ color: 'var(--terminal-green)' }}
                                >
                                    {">"} {msg.text}
                                </motion.div>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ color: 'var(--blood-red)', marginTop: '10px' }}>
                            SYSTEM WARNING: INTRUSION DETECTED...
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', marginTop: '1rem' }}>
                <span style={{ padding: '10px', color: 'var(--terminal-green)' }}>{">"}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="INITIATE PROTOCOL..."
                    style={{
                        flex: 1, padding: '10px',
                        background: 'transparent', border: 'none', borderBottom: '2px solid var(--terminal-green)',
                        color: 'var(--terminal-green)', outline: 'none', fontSize: '1.2rem'
                    }}
                />
            </form>
        </div>
    );
};

function App() {
    const [hasEntered, setHasEntered] = useState(false);

    return (
        <>
            {!hasEntered && <WelcomeScreen onEnter={() => setHasEntered(true)} />}
            {hasEntered && (
                <Layout>
                    <GhostChat />
                </Layout>
            )}
        </>
    );
}

export default App;
