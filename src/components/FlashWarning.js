import React, { useState } from 'react';

const FlashWarning = ({ onAccept }) => {
    const [shake, setShake] = useState(false);

    const handleAccept = () => {
        setShake(true);
        setTimeout(() => onAccept(), 500);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999999,
            animation: shake ? 'shake 0.1s infinite' : 'none'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                background: '#ff0000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                marginBottom: '2rem',
                animation: 'pulse 1s infinite'
            }}>
                ⚠️
            </div>

            <h1 style={{
                color: '#ff0000',
                fontSize: '3rem',
                fontFamily: 'Nosifer, cursive',
                textAlign: 'center',
                marginBottom: '1rem',
                textShadow: '0 0 20px red'
            }}>
                WARNING
            </h1>

            <div style={{
                color: '#ff6666',
                fontSize: '1.2rem',
                textAlign: 'center',
                maxWidth: '500px',
                lineHeight: '1.8',
                marginBottom: '2rem'
            }}>
                <p style={{ marginBottom: '1rem' }}>
                    This experience contains:
                </p>
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                    <li>⚡ FLASHING IMAGES</li>
                    <li>💀 DISTURBING CONTENT</li>
                    <li>🔊 LOUD SOUNDS</li>
                    <li>👁️ JUMP SCARES</li>
                    <li>🩸 PSYCHOLOGICAL HORROR</li>
                </ul>
                <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
                    NOT RECOMMENDED FOR THOSE WITH EPILEPSY OR HEART CONDITIONS.
                </p>
            </div>

            <button
                onClick={handleAccept}
                style={{
                    padding: '20px 60px',
                    fontSize: '1.5rem',
                    background: 'linear-gradient(180deg, #660000, #330000)',
                    color: '#fff',
                    border: '3px solid #ff0000',
                    cursor: 'pointer',
                    fontFamily: 'Nosifer, cursive',
                    boxShadow: '0 0 30px rgba(255,0,0,0.5)',
                    transition: 'all 0.3s'
                }}
            >
                I UNDERSTAND
            </button>

            <p style={{
                marginTop: '2rem',
                color: '#444',
                fontSize: '0.9rem'
            }}>
                You have been warned.
            </p>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                @keyframes shake {
                    0% { transform: translate(1px, 1px); }
                    25% { transform: translate(-1px, -1px); }
                    50% { transform: translate(1px, -1px); }
                    75% { transform: translate(-1px, 1px); }
                    100% { transform: translate(1px, 1px); }
                }
            `}</style>
        </div>
    );
};

export default FlashWarning;
