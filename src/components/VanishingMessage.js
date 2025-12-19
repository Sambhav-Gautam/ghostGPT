import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VanishingMessage = ({ message, duration = 3000, onVanish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onVanish) onVanish();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onVanish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="p-3 mb-2 rounded shadow-md bg-opacity-80"
                    style={{
                        backgroundColor: 'var(--bg-color)',
                        border: '1px solid var(--accent-color)',
                        color: 'var(--text-color)'
                    }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VanishingMessage;
