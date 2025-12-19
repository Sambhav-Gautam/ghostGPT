import React from 'react';
import CRTOverlay from './CRTOverlay';
import FogContainer from './FogContainer';
import GhostLogo from './GhostLogo';

const Layout = ({ children }) => {
    return (
        <div className="ghost-layout">
            <CRTOverlay />
            <FogContainer />

            <header style={{ position: 'relative', zIndex: 10, marginBottom: '1rem', textAlign: 'center', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <GhostLogo width={120} height={120} color="var(--terminal-green)" />
                </div>
                <h1 className="glitch-header" style={{ fontSize: '3rem', margin: '10px 0', textShadow: '0 0 10px var(--terminal-green)' }}>GHOST GPT</h1>
                <p style={{ color: 'var(--blood-red)', letterSpacing: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>// TERMINAL LINK ESTABLISHED</p>
            </header>

            <main style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                {children}
            </main>

            <footer style={{ position: 'relative', zIndex: 10, marginTop: 'auto', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem', padding: '20px' }}>
                <p>NO SIGNAL - {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
};

export default Layout;
