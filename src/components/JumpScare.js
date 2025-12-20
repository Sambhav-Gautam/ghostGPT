import React, { useEffect, useState } from 'react';
import { audioManager } from '../services/AudioManager';

// TERRIFYING DEMON FACE
const DemonFace = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" fill="#000" />

        {/* Pale rotting skin */}
        <ellipse cx="50" cy="50" rx="45" ry="48" fill="#1a1510" />
        <ellipse cx="50" cy="50" rx="43" ry="46" fill="#0d0a08" />

        {/* Deep sunken eye sockets */}
        <ellipse cx="30" cy="35" rx="15" ry="18" fill="#000" />
        <ellipse cx="70" cy="35" rx="15" ry="18" fill="#000" />

        {/* Glowing red pupils that stare */}
        <circle cx="30" cy="37" r="8" fill="#ff0000">
            <animate attributeName="r" values="8;10;8" dur="0.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="37" r="8" fill="#ff0000">
            <animate attributeName="r" values="8;10;8" dur="0.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="37" r="3" fill="#fff" />
        <circle cx="70" cy="37" r="3" fill="#fff" />

        {/* Blood tears */}
        <path d="M30,52 L28,70 L32,85" stroke="#8B0000" strokeWidth="4" fill="none" />
        <path d="M70,52 L72,70 L68,85" stroke="#8B0000" strokeWidth="4" fill="none" />
        <path d="M25,55 L20,75" stroke="#8B0000" strokeWidth="2" fill="none" />
        <path d="M75,55 L80,75" stroke="#8B0000" strokeWidth="2" fill="none" />

        {/* Broken nose */}
        <path d="M50,40 L48,55 L52,55 L50,40" fill="#1a0a00" />

        {/* SCREAMING MOUTH - wide open */}
        <ellipse cx="50" cy="78" rx="30" ry="18" fill="#000" stroke="#300" strokeWidth="2" />

        {/* Broken teeth */}
        <rect x="35" y="68" width="5" height="12" fill="#888" transform="rotate(-10 37 74)" />
        <rect x="43" y="66" width="6" height="14" fill="#aaa" transform="rotate(5 46 73)" />
        <rect x="52" y="66" width="5" height="13" fill="#999" transform="rotate(-5 54 72)" />
        <rect x="60" y="68" width="5" height="11" fill="#777" transform="rotate(8 62 73)" />

        {/* Throat darkness */}
        <ellipse cx="50" cy="85" rx="15" ry="8" fill="#200" />

        {/* Cracked skin */}
        <path d="M20,30 L25,45 L18,60" stroke="#300" strokeWidth="1" fill="none" />
        <path d="M80,30 L75,45 L82,60" stroke="#300" strokeWidth="1" fill="none" />
        <path d="M50,10 L48,25 L53,30" stroke="#300" strokeWidth="1" fill="none" />
    </svg>
);

// STRETCHED SMILE FACE
const StretchedFace = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" fill="#000" />

        {/* Face outline */}
        <ellipse cx="50" cy="50" rx="45" ry="48" fill="#080808" />

        {/* Huge staring eyes */}
        <ellipse cx="28" cy="35" rx="18" ry="22" fill="#fff" />
        <ellipse cx="72" cy="35" rx="18" ry="22" fill="#fff" />

        {/* Bloodshot veins */}
        <path d="M15,30 L25,35" stroke="#ff0000" strokeWidth="1" />
        <path d="M15,40 L25,37" stroke="#ff0000" strokeWidth="1" />
        <path d="M85,30 L75,35" stroke="#ff0000" strokeWidth="1" />
        <path d="M85,40 L75,37" stroke="#ff0000" strokeWidth="1" />

        {/* Dilated pupils */}
        <circle cx="28" cy="35" r="12" fill="#000" />
        <circle cx="72" cy="35" r="12" fill="#000" />
        <circle cx="28" cy="35" r="5" fill="#8B0000" />
        <circle cx="72" cy="35" r="5" fill="#8B0000" />

        {/* IMPOSSIBLY WIDE SMILE */}
        <path d="M5,70 Q50,110 95,70" stroke="#ff0000" strokeWidth="3" fill="none" />
        <path d="M10,70 Q50,100 90,70" fill="#200" />

        {/* Teeth */}
        {[15, 25, 35, 45, 55, 65, 75, 85].map((x, i) => (
            <rect key={x} x={x} y="70" width="8" height="15" fill="#888"
                transform={`rotate(${(i - 4) * 3} ${x + 4} 77)`} />
        ))}
    </svg>
);

// HOLLOW VOID FACE
const VoidFace = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" fill="#000" />

        {/* Just the outline of a face in shadow */}
        <ellipse cx="50" cy="50" rx="40" ry="45" fill="none" stroke="#110" strokeWidth="2" />

        {/* Empty eye sockets - pure void */}
        <ellipse cx="30" cy="38" rx="12" ry="15" fill="#000" stroke="#ff0000" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="70" cy="38" rx="12" ry="15" fill="#000" stroke="#ff0000" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </ellipse>

        {/* Single glowing dot in each eye */}
        <circle cx="30" cy="40" r="2" fill="#ff0000">
            <animate attributeName="cy" values="40;35;40" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="40" r="2" fill="#ff0000">
            <animate attributeName="cy" values="40;35;40" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Gaping mouth void */}
        <ellipse cx="50" cy="75" rx="25" ry="20" fill="#000" stroke="#300" strokeWidth="1" />

        {/* Text inside the void */}
        <text x="50" y="78" textAnchor="middle" fill="#ff0000" fontSize="8" fontFamily="serif">
            DIE
        </text>
    </svg>
);

// Static noise overlay
const StaticNoise = () => (
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.4,
        mixBlendMode: 'overlay',
        animation: 'flicker 0.1s infinite'
    }} />
);

const JumpScare = ({ trigger }) => {
    const [visible, setVisible] = useState(false);
    const [faceIndex, setFaceIndex] = useState(0);
    const [strobe, setStrobe] = useState(false);
    const [intensity, setIntensity] = useState(0);

    useEffect(() => {
        if (trigger) {
            setFaceIndex(Math.floor(Math.random() * 3));
            setVisible(true);
            setStrobe(true);
            setIntensity(0);

            // Play the terrifying scream
            audioManager.playScream();

            // Play additional static for layered horror
            setTimeout(() => audioManager.playStatic(), 100);
            setTimeout(() => audioManager.playStatic(), 300);

            // Strobe effect - faster and more chaotic
            const strobeInterval = setInterval(() => {
                setStrobe(prev => !prev);
                setIntensity(prev => Math.min(prev + 0.1, 1));
            }, 30);

            const timer = setTimeout(() => {
                setVisible(false);
                setStrobe(false);
                clearInterval(strobeInterval);
            }, 2500); // 2.5 seconds of pure terror

            return () => {
                clearTimeout(timer);
                clearInterval(strobeInterval);
            };
        }
    }, [trigger]);

    if (!visible) return null;

    const faces = [DemonFace, StretchedFace, VoidFace];
    const SelectedFace = faces[faceIndex];

    const scaryMessages = ['DIE', 'RUN', 'IT SEES YOU', 'NO ESCAPE', 'HELP ME', 'BEHIND YOU'];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999999,
            pointerEvents: 'none',
            animation: 'shake 0.03s infinite',
            background: strobe ? `rgba(255, 0, 0, ${0.5 + intensity * 0.5})` : '#000'
        }}>
            {/* The face - zooms in slightly */}
            <div style={{
                width: '100%',
                height: '100%',
                transform: `scale(${1 + intensity * 0.3})`,
                transition: 'transform 0.1s'
            }}>
                <SelectedFace />
            </div>

            <StaticNoise />

            {/* Flashing text */}
            <div style={{
                position: 'absolute',
                bottom: '15%',
                width: '100%',
                textAlign: 'center',
                fontSize: 'clamp(2rem, 10vw, 6rem)',
                fontFamily: 'Nosifer, cursive',
                color: strobe ? '#000' : '#ff0000',
                textShadow: '0 0 50px red, 0 0 100px red',
                animation: 'pulse 0.2s infinite'
            }}>
                {scaryMessages[Math.floor(Math.random() * scaryMessages.length)]}
            </div>

            <style>{`
                @keyframes shake {
                    0% { transform: translate(3px, 3px) rotate(0deg); }
                    10% { transform: translate(-4px, -3px) rotate(-2deg); }
                    20% { transform: translate(-5px, 4px) rotate(2deg); }
                    30% { transform: translate(5px, 3px) rotate(0deg); }
                    40% { transform: translate(3px, -4px) rotate(2deg); }
                    50% { transform: translate(-3px, 3px) rotate(-2deg); }
                    60% { transform: translate(-5px, 2px) rotate(0deg); }
                    70% { transform: translate(5px, 2px) rotate(-2deg); }
                    80% { transform: translate(-3px, -3px) rotate(2deg); }
                    90% { transform: translate(3px, 3px) rotate(0deg); }
                    100% { transform: translate(2px, -4px) rotate(-2deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes flicker {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.2; }
                }
            `}</style>
        </div>
    );
};

export default JumpScare;
