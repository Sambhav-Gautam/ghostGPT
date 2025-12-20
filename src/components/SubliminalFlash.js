import React, { useEffect, useState } from 'react';

const messages = [
    "BEHIND YOU",
    "RUN",
    "IT'S HERE",
    "DON'T LOOK",
    "HELP ME",
    "YOU'RE NEXT",
    "I SEE YOU",
    "LEAVE NOW"
];

const SubliminalFlash = () => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            // 5% chance every 3 seconds
            if (Math.random() < 0.05) {
                setMessage(messages[Math.floor(Math.random() * messages.length)]);
                setVisible(true);
                setTimeout(() => setVisible(false), 50); // 50ms flash
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '8rem',
            color: 'red',
            fontFamily: 'Nosifer, cursive',
            textShadow: '0 0 50px red',
            zIndex: 999998,
            pointerEvents: 'none',
            opacity: 0.8
        }}>
            {message}
        </div>
    );
};

export default SubliminalFlash;
