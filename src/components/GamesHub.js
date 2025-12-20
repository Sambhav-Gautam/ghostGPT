import React, { useState } from 'react';
import RussianRoulette from './RussianRoulette';
import DontBlink from './DontBlink';
import TheRitual from './TheRitual';
import TheCorridor from './TheCorridor';

const GamesHub = ({ onJumpScare, onRedRoom }) => {
    const [selectedGame, setSelectedGame] = useState(null);

    if (selectedGame === 'roulette') {
        return (
            <div>
                <button onClick={() => setSelectedGame(null)} style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '10px 20px',
                    background: '#111',
                    color: 'var(--terminal-green)',
                    border: '1px solid var(--terminal-green)',
                    cursor: 'pointer',
                    zIndex: 100
                }}>
                    ← BACK
                </button>
                <RussianRoulette onJumpScare={onJumpScare} onRedRoom={onRedRoom} />
            </div>
        );
    }

    if (selectedGame === 'blink') {
        return (
            <div>
                <button onClick={() => setSelectedGame(null)} style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '10px 20px',
                    background: '#111',
                    color: 'var(--terminal-green)',
                    border: '1px solid var(--terminal-green)',
                    cursor: 'pointer',
                    zIndex: 100
                }}>
                    ← BACK
                </button>
                <DontBlink onJumpScare={onJumpScare} onRedRoom={onRedRoom} />
            </div>
        );
    }

    if (selectedGame === 'ritual') {
        return (
            <div>
                <button onClick={() => setSelectedGame(null)} style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '10px 20px',
                    background: '#111',
                    color: 'var(--terminal-green)',
                    border: '1px solid var(--terminal-green)',
                    cursor: 'pointer',
                    zIndex: 100
                }}>
                    ← BACK
                </button>
                <TheRitual onJumpScare={onJumpScare} onRedRoom={onRedRoom} />
            </div>
        );
    }

    if (selectedGame === 'corridor') {
        return (
            <div>
                <button onClick={() => setSelectedGame(null)} style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '10px 20px',
                    background: '#111',
                    color: 'var(--terminal-green)',
                    border: '1px solid var(--terminal-green)',
                    cursor: 'pointer',
                    zIndex: 100
                }}>
                    ← BACK
                </button>
                <TheCorridor onJumpScare={onJumpScare} onRedRoom={onRedRoom} />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: 'var(--blood-red)',
            textAlign: 'center',
            padding: '10px'
        }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', marginBottom: '1rem', fontFamily: 'Nosifer, cursive', textShadow: '0 0 20px red' }}>
                CHOOSE YOUR FATE
            </h2>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' }}>
                <button
                    onClick={() => setSelectedGame('ritual')}
                    style={{
                        padding: '40px 60px',
                        fontSize: '1.8rem',
                        background: 'linear-gradient(180deg, #660000, #220000)',
                        color: '#fff',
                        border: '3px solid #ff0000',
                        cursor: 'pointer',
                        fontFamily: 'Nosifer, cursive',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        boxShadow: '0 0 30px rgba(255,0,0,0.5)'
                    }}
                    onMouseOver={(e) => e.target.style.boxShadow = '0 0 50px red'}
                    onMouseOut={(e) => e.target.style.boxShadow = '0 0 30px rgba(255,0,0,0.5)'}
                >
                    🕯️ THE RITUAL
                    <div style={{ fontSize: '0.8rem', marginTop: '10px', color: '#ff6666' }}>⚠️ EXTREME</div>
                </button>

                <button
                    onClick={() => setSelectedGame('corridor')}
                    style={{
                        padding: '40px 60px',
                        fontSize: '1.8rem',
                        background: 'linear-gradient(180deg, #000033, #000011)',
                        color: '#fff',
                        border: '3px solid #ff0000',
                        cursor: 'pointer',
                        fontFamily: 'Nosifer, cursive',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        boxShadow: '0 0 30px rgba(0,100,255,0.5)'
                    }}
                    onMouseOver={(e) => e.target.style.boxShadow = '0 0 50px blue'}
                    onMouseOut={(e) => e.target.style.boxShadow = '0 0 30px rgba(0,100,255,0.5)'}
                >
                    🏃 THE CORRIDOR
                    <div style={{ fontSize: '0.8rem', marginTop: '10px', color: '#ff6666' }}>💀 IMPOSSIBLE</div>
                </button>

                <button
                    onClick={() => setSelectedGame('roulette')}
                    style={{
                        padding: '30px 50px',
                        fontSize: '1.5rem',
                        background: 'linear-gradient(180deg, #330000, #110000)',
                        color: '#fff',
                        border: '2px solid var(--blood-red)',
                        cursor: 'pointer',
                        fontFamily: 'VT323, monospace',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        boxShadow: '0 0 15px rgba(255,0,0,0.3)'
                    }}
                    onMouseOver={(e) => e.target.style.boxShadow = '0 0 30px red'}
                    onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(255,0,0,0.3)'}
                >
                    🔫 RUSSIAN ROULETTE
                </button>

                <button
                    onClick={() => setSelectedGame('blink')}
                    style={{
                        padding: '30px 50px',
                        fontSize: '1.5rem',
                        background: 'linear-gradient(180deg, #330000, #110000)',
                        color: '#fff',
                        border: '2px solid var(--blood-red)',
                        cursor: 'pointer',
                        fontFamily: 'VT323, monospace',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        boxShadow: '0 0 15px rgba(255,0,0,0.3)'
                    }}
                    onMouseOver={(e) => e.target.style.boxShadow = '0 0 30px red'}
                    onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(255,0,0,0.3)'}
                >
                    👁️ DON'T BLINK
                </button>
            </div>

            <p style={{ marginTop: '3rem', fontSize: '1rem', color: 'var(--terminal-dim)', fontStyle: 'italic' }}>
                "Every game has a price."
            </p>
        </div>
    );
};

export default GamesHub;
