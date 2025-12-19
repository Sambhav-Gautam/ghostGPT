import React from 'react';

const GhostLogo = ({ width = 100, height = 100, color = 'var(--terminal-green)' }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d="M100 20 C 60 20, 20 60, 20 100 L 20 180 Q 40 160, 60 180 Q 80 200, 100 180 Q 120 160, 140 180 Q 160 200, 180 180 L 180 100 C 180 60, 140 20, 100 20 Z"
                fill="transparent"
                stroke={color}
                strokeWidth="6"
                filter="url(#glow)"
            />
            <circle cx="70" cy="90" r="10" fill={color} filter="url(#glow)">
                <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="90" r="10" fill={color} filter="url(#glow)">
                <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" delay="1.5s" />
            </circle>
            <path
                d="M 60 130 Q 100 150, 140 130"
                stroke={color}
                strokeWidth="4"
                fill="none"
                filter="url(#glow)"
            />
        </svg>
    );
};

export default GhostLogo;
