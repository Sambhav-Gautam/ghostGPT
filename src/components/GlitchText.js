import React from 'react';

import './GlitchText.css'; // We'll create this for specific keyframes if needed, or use inline styles

const GlitchText = ({ text, as: Component = 'span', intensity = 'medium' }) => {
    // Simple random jitter using Framer Motion
    // For a robust glitch, CSS keyframes are often better, but let's try motion first for "react-ness"

    return (
        <div className="glitch-wrapper">
            <Component className="glitch" data-text={text}>
                {text}
            </Component>
        </div>
    );
};

export default GlitchText;
