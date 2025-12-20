import React, { useEffect, useState } from 'react';
import { audioManager } from '../services/AudioManager';

const EntityProximity = ({ onJumpScare, onRedRoom }) => {
    const [distance, setDistance] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setDistance(prev => {
                const newDist = prev - (Math.random() * 2);

                // Play whisper at certain thresholds
                if (newDist <= 50 && prev > 50) {
                    audioManager.playWhisper();
                }
                if (newDist <= 25 && prev > 25) {
                    audioManager.playWhisper();
                }

                // IT HAS ARRIVED
                if (newDist <= 0) {
                    onJumpScare();
                    onRedRoom(5000);
                    audioManager.playScream();
                    return 100; // Reset after attack
                }

                return Math.max(0, newDist);
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onJumpScare, onRedRoom]);

    const getColor = () => {
        if (distance > 66) return 'lime';
        if (distance > 33) return 'yellow';
        return 'red';
    };

    const getMessage = () => {
        if (distance > 66) return 'SAFE...';
        if (distance > 33) return 'IT APPROACHES...';
        if (distance > 10) return 'IT IS NEAR...';
        return 'RUN.';
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px',
            background: 'rgba(0,0,0,0.8)',
            border: `2px solid ${getColor()}`,
            color: getColor(),
            fontFamily: 'VT323, monospace',
            fontSize: '1rem',
            zIndex: 1000,
            textAlign: 'center',
            minWidth: '150px'
        }}>
            <div style={{ marginBottom: '5px', fontSize: '0.8rem' }}>ENTITY DISTANCE</div>
            <div style={{
                width: '100%',
                height: '10px',
                background: '#111',
                border: '1px solid #333'
            }}>
                <div style={{
                    width: `${distance}%`,
                    height: '100%',
                    background: getColor(),
                    transition: 'width 0.5s, background 0.5s'
                }} />
            </div>
            <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>{getMessage()}</div>
        </div>
    );
};

export default EntityProximity;
