import React, { useEffect, useState } from 'react';

const CursorStalker = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setTargetPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        // Slow follow effect
        const interval = setInterval(() => {
            setPosition(prev => ({
                x: prev.x + (targetPosition.x - prev.x) * 0.05,
                y: prev.y + (targetPosition.y - prev.y) * 0.05
            }));
        }, 30);

        return () => clearInterval(interval);
    }, [targetPosition]);

    return (
        <div style={{
            position: 'fixed',
            left: position.x - 15,
            top: position.y - 15,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,0,0,0.5) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 999997,
            filter: 'blur(2px)',
            mixBlendMode: 'multiply'
        }} />
    );
};

export default CursorStalker;
