import React, { useEffect, useState } from 'react';

const ScreenCorruption = () => {
    const [intensity, setIntensity] = useState(0);
    const [glitchBars, setGlitchBars] = useState([]);

    useEffect(() => {
        // Slowly increase corruption over time
        const interval = setInterval(() => {
            setIntensity(prev => Math.min(prev + 0.5, 30));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Generate random glitch bars
        const generateBars = () => {
            if (Math.random() < intensity / 100) {
                const bars = [];
                const numBars = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < numBars; i++) {
                    bars.push({
                        top: Math.random() * 100,
                        height: Math.random() * 5 + 1,
                        offset: (Math.random() - 0.5) * 20
                    });
                }
                setGlitchBars(bars);
                setTimeout(() => setGlitchBars([]), 100);
            }
        };

        const interval = setInterval(generateBars, 500);
        return () => clearInterval(interval);
    }, [intensity]);

    return (
        <>
            {glitchBars.map((bar, i) => (
                <div
                    key={i}
                    style={{
                        position: 'fixed',
                        top: `${bar.top}%`,
                        left: `${bar.offset}px`,
                        width: '100vw',
                        height: `${bar.height}px`,
                        background: 'rgba(255,0,0,0.3)',
                        zIndex: 999996,
                        pointerEvents: 'none',
                        mixBlendMode: 'difference'
                    }}
                />
            ))}

            {/* Static noise overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: intensity / 200,
                pointerEvents: 'none',
                zIndex: 999995,
                mixBlendMode: 'overlay'
            }} />
        </>
    );
};

export default ScreenCorruption;
