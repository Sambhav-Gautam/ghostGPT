import React, { useEffect, useState } from 'react';
import { audioManager } from '../services/AudioManager';

const horrorImages = [
    // Creepy eye
    <svg key="eye" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" fill="#000" />
        <ellipse cx="50" cy="50" rx="40" ry="25" fill="#fff" />
        <circle cx="50" cy="50" r="15" fill="#8B0000" />
        <circle cx="50" cy="50" r="8" fill="#000" />
        <circle cx="45" cy="45" r="3" fill="#fff" />
    </svg>,

    // Skull
    <svg key="skull" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" fill="#000" />
        <ellipse cx="50" cy="45" rx="35" ry="40" fill="#ddd" />
        <ellipse cx="35" cy="40" rx="10" ry="12" fill="#000" />
        <ellipse cx="65" cy="40" rx="10" ry="12" fill="#000" />
        <polygon points="50,55 45,70 55,70" fill="#000" />
        <rect x="30" y="75" width="40" height="5" fill="#000" />
        {[35, 45, 55, 65].map(x => <rect key={x} x={x - 2} y="75" width="4" height="10" fill="#ddd" />)}
    </svg>,

    // Bloody hand
    <svg key="hand" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" fill="#000" />
        <path d="M30,80 L30,50 L25,30 M30,50 L35,25 M30,50 L50,20 M30,50 L55,30 M30,50 L60,40 L70,80"
            stroke="#8B0000" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Dripping blood */}
        {[35, 50, 65].map(x => (
            <ellipse key={x} cx={x} cy={90} rx="5" ry="8" fill="#ff0000" />
        ))}
    </svg>,

    // Cross (inverted)
    <svg key="cross" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" fill="#000" />
        <rect x="42" y="10" width="16" height="80" fill="#8B0000" transform="rotate(180 50 50)" />
        <rect x="20" y="25" width="60" height="16" fill="#8B0000" transform="rotate(180 50 50)" />
    </svg>
];

const RandomHorrorFlash = () => {
    const [visible, setVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // 3% chance every 5 seconds
            if (Math.random() < 0.03) {
                setCurrentImage(Math.floor(Math.random() * horrorImages.length));
                setVisible(true);
                audioManager.playStatic();

                setTimeout(() => setVisible(false), 150); // 150ms flash
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999998,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)'
        }}>
            <div style={{ width: '50vmin', height: '50vmin' }}>
                {horrorImages[currentImage]}
            </div>
        </div>
    );
};

export default RandomHorrorFlash;
