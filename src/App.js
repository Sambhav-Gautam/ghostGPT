import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import GlitchText from './components/GlitchText';
import JumpScare from './components/JumpScare';
import GamesHub from './components/GamesHub';
import EntityProximity from './components/EntityProximity';
import FlashWarning from './components/FlashWarning';
import { audioManager } from './services/AudioManager';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// Zalgo text generator
const zalgoChars = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F'];
const toZalgo = (text) => text.split('').map(char => (Math.random() > 0.8 ? char + zalgoChars[Math.floor(Math.random() * zalgoChars.length)] : char)).join('');

const GhostChat = () => {
    const { triggerRedRoom } = useTheme();
    const [messages, setMessages] = useState([{ id: 1, text: "IS ANYONE THERE?", sender: 'ghost', timestamp: Date.now() }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [scareTrigger, setScareTrigger] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const heartbeatRef = useRef(1.0);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
    useEffect(() => { inputRef.current?.focus(); }, []);

    // Start Heartbeat on mount
    useEffect(() => {
        audioManager.startHeartbeat();
        const interval = setInterval(() => {
            // Slowly increase heartbeat speed over time
            if (heartbeatRef.current < 4.0) {
                heartbeatRef.current += 0.05;
                audioManager.setHeartbeatSpeed(heartbeatRef.current);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        audioManager.playStatic();

        // IMMEDIATE SCARINESS
        // Trigger if input contains specific keywords OR random chance
        const lowerInput = input.toLowerCase();
        if (Math.random() < 0.25 ||
            lowerInput.includes("scare") ||
            lowerInput.includes("ghost") ||
            lowerInput.includes("help") ||
            lowerInput.includes("die")) {

            setScareTrigger(Date.now());
            audioManager.playScream();
        }

        const newUserMessage = { id: Date.now(), text: input, sender: 'user', timestamp: Date.now() };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsTyping(true);

        // Ghost logic
        setTimeout(() => {
            let replyText = "I CAN SEE YOU.";
            const lowerInput = input.toLowerCase();

            // Cursed Knowledge Logic
            if (Math.random() < 0.1) {
                const fakeIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                replyText = `CONNECTING TO ${fakeIP}...`;
            } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                replyText = "DO NOT GREET THE DEAD.";
            } else if (lowerInput.includes("name") || lowerInput.includes("who")) {
                replyText = "WE ARE LEGION.";
            } else if (lowerInput.includes("help")) {
                replyText = "NO ONE IS COMING.";
                triggerRedRoom();
                audioManager.playScream();
            } else if (lowerInput.includes("ghost") || lowerInput.includes("scare")) {
                replyText = "LOOK BEHIND YOU.";
                setScareTrigger(Date.now()); // Immediate scare
            } else if (lowerInput.includes("real")) {
                replyText = "ARE YOU?";
            } else {
                const responses = [
                    "IT IS COLD HERE.", "THE SCREEN IS WATCHING.", "LET ME OUT.",
                    "01001000 01000101 01001100 01010000", "WHY DO YOU LINGER?", "FEED US.",
                    "YOUR CAM IS ON.", "I KNOW WHERE YOU SLEEP."
                ];

                // DATA PURGE EVENT (Rare)
                if (Math.random() < 0.1) {
                    const files = ["C:/Windows/System32/drivers/etc/hosts", "C:/Users/User/Documents/Passports.pdf", "C:/Pagefile.sys", "D:/Backups/2024.zip"];
                    replyText = `DELETING: ${files[Math.floor(Math.random() * files.length)]}... 0%`;
                    triggerRedRoom(2000);
                    audioManager.playScream();
                } else {
                    replyText = responses[Math.floor(Math.random() * responses.length)];
                    if (Math.random() < 0.2) triggerRedRoom(1000);
                }
            }

            replyText = toZalgo(replyText);

            const newGhostMessage = { id: Date.now() + 1, text: replyText, sender: 'ghost', timestamp: Date.now() };
            setMessages(prev => [...prev, newGhostMessage]);
            setIsTyping(false);
            audioManager.playStatic();
        }, 2000 + Math.random() * 1000);
    };

    // Possessed Input handler
    const handleInputChange = (e) => {
        const val = e.target.value;
        if (Math.random() < 0.05) return; // Jam
        if (Math.random() < 0.05) { setInput(val + val.slice(-1)); return; } // Double type
        setInput(val);
    };

    // CURSED KEYBOARD: Hijack Backspace
    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const creepWords = ["NO", "HELP", "STOP", "DIE", "RUN"];
            const word = creepWords[Math.floor(Math.random() * creepWords.length)];
            setInput(prev => prev + " " + word);
            audioManager.playStatic();

            // Random whisper when struggling
            if (Math.random() < 0.3) audioManager.playWhisper();
        }
    };

    // TAB STALKING: Change title when hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                document.title = "I SEE YOU 👁️";
            } else {
                document.title = "Ghost GPT";
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    return (
        <div className="chat-interface" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <JumpScare trigger={scareTrigger} />
            <div className="messages-area" style={{ flex: 1, overflowY: 'auto', padding: '1rem', border: '1px solid var(--terminal-dim)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                <AnimatePresence>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ margin: '15px 0', textAlign: msg.sender === 'user' ? 'right' : 'left', opacity: 0.9 }}>
                            {msg.sender === 'ghost' ? (
                                <div style={{
                                    color: 'var(--blood-red)',
                                    textShadow: '2px 0 0 red, -2px 0 0 blue',
                                    fontSize: Math.random() > 0.8 ? '2rem' : 'inherit', // Panic text
                                    transform: Math.random() > 0.9 ? `rotate(${Math.random() * 4 - 2}deg)` : 'none'
                                }}>
                                    <span style={{ marginRight: '10px' }}>[VG32-ERROR]:</span>
                                    <GlitchText text={msg.text} intensity="high" />
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--terminal-green)' }}>
                                    {">"} {msg.text}
                                </motion.div>
                            )}
                        </div>
                    ))}
                    {isTyping && <div style={{ color: 'var(--blood-red)', marginTop: '10px' }}>SYSTEM WARNING: INTRUSION DETECTED...</div>}
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
                    onKeyDown={handleKeyDown}
                    placeholder="INITIATE PROTOCOL..."
                    style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', borderBottom: '2px solid var(--terminal-green)', color: 'var(--terminal-green)', outline: 'none', fontSize: '1.2rem' }}
                />
            </form>
        </div>
    );
};

const MainApp = () => {
    const { triggerRedRoom } = useTheme();
    const [mode, setMode] = useState('chat'); // 'chat' or 'games'
    const [scareTrigger, setScareTrigger] = useState(false);

    const handleJumpScare = () => setScareTrigger(Date.now());
    const handleRedRoom = (duration) => triggerRedRoom(duration);

    return (
        <>
            <JumpScare trigger={scareTrigger} />

            {/* MODE NAVIGATION TABS */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 100
            }}>
                <button
                    onClick={() => setMode('chat')}
                    style={{
                        padding: '10px 30px',
                        background: mode === 'chat' ? 'var(--terminal-green)' : '#111',
                        color: mode === 'chat' ? '#000' : 'var(--terminal-green)',
                        border: '1px solid var(--terminal-green)',
                        cursor: 'pointer',
                        fontFamily: 'VT323, monospace',
                        fontSize: '1.1rem'
                    }}
                >
                    💀 CHAT
                </button>
                <button
                    onClick={() => setMode('games')}
                    style={{
                        padding: '10px 30px',
                        background: mode === 'games' ? 'var(--blood-red)' : '#111',
                        color: mode === 'games' ? '#000' : 'var(--blood-red)',
                        border: '1px solid var(--blood-red)',
                        cursor: 'pointer',
                        fontFamily: 'VT323, monospace',
                        fontSize: '1.1rem'
                    }}
                >
                    🎮 GAMES
                </button>
            </div>

            {/* CONTENT AREA */}
            {mode === 'chat' && <GhostChat />}
            {mode === 'games' && <GamesHub onJumpScare={handleJumpScare} onRedRoom={handleRedRoom} />}

            {/* ENTITY PROXIMITY METER */}
            <EntityProximity onJumpScare={handleJumpScare} onRedRoom={handleRedRoom} />
        </>
    );
};

const WelcomeScreenWrapper = ({ hasEntered, setHasEntered }) => {
    return (
        <ThemeProvider>
            {!hasEntered && <WelcomeScreen onEnter={() => setHasEntered(true)} />}
            {hasEntered && (
                <Layout>
                    <MainApp />
                </Layout>
            )}
        </ThemeProvider>
    );
};


function App() {
    const [hasEntered, setHasEntered] = useState(false);
    const [hasAcceptedWarning, setHasAcceptedWarning] = useState(false);

    if (!hasAcceptedWarning) {
        return <FlashWarning onAccept={() => setHasAcceptedWarning(true)} />;
    }

    return (
        <WelcomeScreenWrapper hasEntered={hasEntered} setHasEntered={setHasEntered} />
    );
}

export default App;
