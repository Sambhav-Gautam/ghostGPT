import React, { useState } from 'react';
import { audioManager } from '../services/AudioManager';

const RussianRoulette = ({ onJumpScare, onRedRoom }) => {
    const [round, setRound] = useState(0);
    const [message, setMessage] = useState("THE CHAMBER HAS 6 SLOTS. ONE IS LOADED.");
    const [isSpinning, setIsSpinning] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const taunts = [
        "LUCKY. FOR NOW.",
        "YOUR LUCK CANNOT LAST.",
        "I CAN HEAR YOUR HEART.",
        "THE NEXT ONE... MAYBE.",
        "WHY DO YOU KEEP PLAYING?",
        "DO YOU WANT TO DIE?"
    ];

    const spin = () => {
        if (isSpinning || gameOver) return;

        setIsSpinning(true);
        setMessage("*CLICK* ... *CLICK* ...");
        audioManager.playStatic();

        setTimeout(() => {
            // 1 in 6 chance of "bang"
            const isBang = Math.random() < (1 / 6);

            if (isBang) {
                setMessage("BANG.");
                setGameOver(true);
                audioManager.playScream();
                onJumpScare();
                onRedRoom(5000);
            } else {
                setRound(prev => prev + 1);
                setMessage(taunts[Math.min(round, taunts.length - 1)]);
                audioManager.playWhisper();
            }
            setIsSpinning(false);
        }, 1500 + Math.random() * 1000);
    };

    const reset = () => {
        setRound(0);
        setMessage("THE CHAMBER HAS 6 SLOTS. ONE IS LOADED.");
        setGameOver(false);
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
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textShadow: '0 0 20px red' }}>
                RUSSIAN ROULETTE
            </h2>

            <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '500px' }}>
                {message}
            </p>

            <p style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--terminal-green)' }}>
                ROUNDS SURVIVED: {round}
            </p>

            {!gameOver ? (
                <button
                    onClick={spin}
                    disabled={isSpinning}
                    style={{
                        padding: '20px 60px',
                        fontSize: '1.5rem',
                        background: isSpinning ? '#333' : 'linear-gradient(180deg, #440000, #220000)',
                        color: '#fff',
                        border: '2px solid var(--blood-red)',
                        cursor: isSpinning ? 'not-allowed' : 'pointer',
                        fontFamily: 'VT323, monospace',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 20px rgba(255,0,0,0.5)'
                    }}
                >
                    {isSpinning ? "..." : "PULL TRIGGER"}
                </button>
            ) : (
                <div>
                    <p style={{ fontSize: '3rem', color: '#ff0000', animation: 'shake 0.1s infinite' }}>YOU LOSE.</p>
                    <button onClick={reset} style={{ marginTop: '20px', padding: '10px 30px', background: '#111', color: 'var(--terminal-green)', border: '1px solid var(--terminal-green)', cursor: 'pointer' }}>
                        PLAY AGAIN?
                    </button>
                </div>
            )}
        </div>
    );
};

export default RussianRoulette;
