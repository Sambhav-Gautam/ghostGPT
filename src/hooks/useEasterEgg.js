import { useEffect, useState } from 'react';

const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

const useEasterEgg = () => {
    const [triggered, setTriggered] = useState(false);
    const [inputSequence, setInputSequence] = useState([]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Add new key to sequence
            const newSequence = [...inputSequence, e.key];

            // Keep only as many keys as the code length
            if (newSequence.length > KONAMI_CODE.length) {
                newSequence.shift();
            }

            setInputSequence(newSequence);

            // Check for match
            if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
                setTriggered(true);
                // Reset after some time or keep it toggled
                setTimeout(() => setTriggered(false), 5000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputSequence]);

    return triggered;
};

export default useEasterEgg;
