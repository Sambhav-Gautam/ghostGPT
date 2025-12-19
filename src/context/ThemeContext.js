import React, { createContext, useContext, useEffect, useState } from 'react';
import useHauntingHours from '../hooks/useHauntingHours';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const isHauntingFromHook = useHauntingHours();
    const [manualThemeOverride, setManualThemeOverride] = useState(null); // 'haunted', 'light', or null for automatic
    const [effectiveTheme, setEffectiveTheme] = useState('light');

    // Determine the effective theme based on manual override or the hook
    useEffect(() => {
        let newTheme;
        if (manualThemeOverride) {
            newTheme = manualThemeOverride;
        } else {
            newTheme = isHauntingFromHook ? 'haunted' : 'light';
        }
        setEffectiveTheme(newTheme);
    }, [manualThemeOverride, isHauntingFromHook]);

    // Apply the effective theme to the document body
    useEffect(() => {
        if (effectiveTheme === 'haunted') {
            document.body.setAttribute('data-theme', 'haunted');
        } else {
            document.body.removeAttribute('data-theme');
        }
    }, [effectiveTheme]);

    const toggleHaunting = () => {
        // If there's a manual override, toggle it.
        // If no manual override, set it to 'haunted' to override the hook.
        setManualThemeOverride(prev => {
            if (prev === 'haunted') {
                return 'light';
            } else if (prev === 'light') {
                return null; // Revert to automatic detection
            } else { // prev is null (automatic)
                return 'haunted'; // Manually set to haunted
            }
        });
    };

    const value = {
        theme: effectiveTheme,
        isHaunting: effectiveTheme === 'haunted', // Expose the effective haunting state
        toggleHaunting,
        isManualOverrideActive: manualThemeOverride !== null,
        manualThemeOverride,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
