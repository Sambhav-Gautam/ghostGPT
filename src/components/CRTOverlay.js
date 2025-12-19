import React from 'react';
import './CRTOverlay.css';

const CRTOverlay = () => {
    return (
        <div className="crt-container">
            <div className="scanlines"></div>
            <div className="noise"></div>
            <div className="vignette"></div>
        </div>
    );
};

export default CRTOverlay;
