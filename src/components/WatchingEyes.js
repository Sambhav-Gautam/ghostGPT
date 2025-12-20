import React, { useEffect, useState } from 'react';

const EyePair = ({ id, x, y }) => {
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        // Random blinking
        const blinkInterval = setInterval(() => {
            if (Math.random() < 0.1) {
                setBlink(true);
                setTimeout(() => setBlink(false), 200);
            }
        }, 2000 + Math.random() * 5000);
        return () => clearInterval(blinkInterval);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            opacity: blink ? 0 : 0.4, // Faint visibility
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
            filter: 'blur(1px)'
        }}>
            <div style={{
                width: '6px', height: '6px',
                backgroundColor: '#ff0000',
                borderRadius: '50%',
                boxShadow: '0 0 10px #ff0000',
                display: 'inline-block',
                marginRight: '15px'
            }} />
            <div style={{
                width: '6px', height: '6px',
                backgroundColor: '#ff0000',
                borderRadius: '50%',
                boxShadow: '0 0 10px #ff0000',
                display: 'inline-block'
            }} />
        </div>
    );
};

const WatchingEyes = () => {
    const [eyes, setEyes] = useState([]);

    useEffect(() => {
        // Generate static eyes
        const newEyes = [];
        for (let i = 0; i < 5; i++) {
            newEyes.push({
                id: i,
                x: Math.random() * 90 + 5,
                y: Math.random() * 90 + 5
            });
        }
        setEyes(newEyes);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
            {eyes.map(eye => <EyePair key={eye.id} {...eye} />)}
        </div>
    );
};

export default WatchingEyes;
