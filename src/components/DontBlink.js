import React, { useState, useEffect, useRef } from 'react';
import { audioManager } from '../services/AudioManager';

const DontBlink = ({ onJumpScare, onRedRoom }) => {
    const [gameState, setGameState] = useState('idle'); // idle, playing, lost, won
    const [timer, setTimer] = useState(0);
    const [safeZoneSize, setSafeZoneSize] = useState(200);
    const [mouseInZone, setMouseInZone] = useState(false);
    const [taunt, setTaunt] = useState("");
    const zoneRef = useRef(null);
    const timeoutRef = useRef(null);

    const taunts = [
        "STEADY...",
        "YOUR HAND IS SHAKING.",
        "DON'T LOOK AWAY.",
        "ALMOST... ALMOST...",
        "I CAN SEE YOUR FEAR.",
        "YOU WANT TO STOP, DON'T YOU?"
    ];

    const startGame = () => {
        setGameState('playing');
        setTimer(0);
        setSafeZoneSize(200);
        setTaunt("KEEP YOUR CURSOR ON THE EYE.");
        audioManager.startHeartbeat();
    };

    useEffect(() => {
        if (gameState !== 'playing') return;

        const interval = setInterval(() => {
            setTimer(prev => {
                const newTime = prev + 1;

                // Win condition: 30 seconds
                if (newTime >= 30) {
                    setGameState('won');
                    clearInterval(interval);
                    audioManager.playWhisper();
                    return 30;
                }

                // Shrink safe zone every 5 seconds
                if (newTime % 5 === 0 && safeZoneSize > 80) {
                    setSafeZoneSize(prev => prev - 20);
                }

                // Random taunts
                if (newTime % 4 === 0) {
                    setTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
                }

                // Random flickers
                if (Math.random() < 0.1) {
                    onRedRoom(200);
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState, safeZoneSize, onRedRoom]);

    const handleMouseEnter = () => {
        setMouseInZone(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleMouseLeave = () => {
        setMouseInZone(false);
        if (gameState === 'playing') {
            // Start countdown to lose
            timeoutRef.current = setTimeout(() => {
                if (gameState === 'playing') {
                    setGameState('lost');
                    audioManager.playScream();
                    onJumpScare();
                    onRedRoom(3000);
                }
            }, 2000); // 2 seconds to get back
        }
    };

    const reset = () => {
        setGameState('idle');
        setTimer(0);
        setSafeZoneSize(200);
        setTaunt("");
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: 'var(--blood-red)',
            textAlign: 'center',
            fontFamily: 'Nosifer, cursive'
        }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 0 20px red' }}>
                DON'T BLINK
            </h2>

            {gameState === 'idle' && (
                <div>
                    <p style={{ fontSize: '1.2rem', maxWidth: '400px', marginBottom: '2rem' }}>
                        Keep your cursor on the eye for 30 seconds. Leave the eye for more than 2 seconds, and you lose.
                    </p>
                    <button onClick={startGame} style={{
                        padding: '15px 40px',
                        fontSize: '1.3rem',
                        background: 'linear-gradient(180deg, #440000, #220000)',
                        color: '#fff',
                        border: '2px solid var(--blood-red)',
                        cursor: 'pointer',
                        fontFamily: 'VT323, monospace'
                    }}>
                        START
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ fontSize: '1rem', color: 'var(--terminal-green)', marginBottom: '1rem' }}>
                        TIME: {timer}s / 30s
                    </p>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem', minHeight: '30px' }}>
                        {taunt}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                        📱 Touch and hold the eye
                    </p>
                    <div
                        ref={zoneRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleMouseEnter}
                        onTouchEnd={handleMouseLeave}
                        style={{
                            width: `${safeZoneSize}px`,
                            height: `${safeZoneSize}px`,
                            borderRadius: '50%',
                            background: mouseInZone ? 'radial-gradient(circle, #330000 0%, #000 70%)' : 'radial-gradient(circle, #550000 0%, #110000 70%)',
                            border: `3px solid ${mouseInZone ? 'lime' : 'red'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '5rem',
                            cursor: 'none',
                            transition: 'width 0.5s, height 0.5s, border-color 0.2s',
                            boxShadow: mouseInZone ? '0 0 30px lime' : '0 0 30px red',
                            touchAction: 'none'
                        }}
                    >
                        👁️
                    </div>
                    {!mouseInZone && <p style={{ marginTop: '1rem', color: 'yellow' }}>⚠️ RETURN TO THE EYE!</p>}
                </div>
            )}

            {gameState === 'lost' && (
                <div>
                    <p style={{ fontSize: '3rem', color: '#ff0000', animation: 'shake 0.1s infinite' }}>YOU BLINKED.</p>
                    <button onClick={reset} style={{ marginTop: '20px', padding: '10px 30px', background: '#111', color: 'var(--terminal-green)', border: '1px solid var(--terminal-green)', cursor: 'pointer' }}>
                        TRY AGAIN?
                    </button>
                </div>
            )}

            {gameState === 'won' && (
                <div>
                    <p style={{ fontSize: '2rem', color: 'lime' }}>YOU SURVIVED.</p>
                    <p style={{ fontSize: '1rem', marginTop: '1rem' }}>...FOR NOW.</p>
                    <button onClick={reset} style={{ marginTop: '20px', padding: '10px 30px', background: '#111', color: 'var(--terminal-green)', border: '1px solid var(--terminal-green)', cursor: 'pointer' }}>
                        PLAY AGAIN?
                    </button>
                </div>
            )}
        </div>
    );
};

export default DontBlink;
