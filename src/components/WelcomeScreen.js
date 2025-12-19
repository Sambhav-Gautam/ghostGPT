import React, { useState } from 'react';
import { audioManager } from '../services/AudioManager';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onEnter }) => {
    const [isEntering, setIsEntering] = useState(false);

    const handleEnter = async () => {
        setIsEntering(true);
        await audioManager.initialize();
        audioManager.playStatic();

        // Slight delay to let the sound start
        setTimeout(() => {
            onEnter();
        }, 1000);
    };

    return (
        <div className="welcome-container">
            {!isEntering ? (
                <button
                    className="summon-btn"
                    onClick={handleEnter}
                >
                    Summon the Ghost
                </button>
            ) : (
                <div className="entering-text">
                    CONNECTING TO THE OTHER SIDE...
                </div>
            )}
        </div>
    );
};

export default WelcomeScreen;
