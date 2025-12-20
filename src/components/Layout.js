import React from 'react';
import CRTOverlay from './CRTOverlay';
import FogContainer from './FogContainer';
import GhostLogo from './GhostLogo';
import WatchingEyes from './WatchingEyes';
import SubliminalFlash from './SubliminalFlash';
import CursorStalker from './CursorStalker';
import ScreenCorruption from './ScreenCorruption';
import RandomHorrorFlash from './RandomHorrorFlash';

const Layout = ({ children }) => {
    const isMobile = window.innerWidth < 768;

    return (
        <div className="ghost-layout">
            <CRTOverlay />
            <FogContainer />
            <WatchingEyes />
            <SubliminalFlash />
            <CursorStalker />
            <ScreenCorruption />
            <RandomHorrorFlash />

            <header style={{
                position: 'relative',
                zIndex: 10,
                marginBottom: isMobile ? '0.5rem' : '1rem',
                textAlign: 'center',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: isMobile ? '5px' : '20px',
                flexShrink: 0
            }}>
                <div style={{ marginBottom: isMobile ? '5px' : '10px' }}>
                    <GhostLogo width={isMobile ? 60 : 120} height={isMobile ? 60 : 120} color="var(--terminal-green)" />
                </div>
                <h1 className="glitch-header" style={{
                    fontSize: isMobile ? '1.5rem' : '3rem',
                    margin: isMobile ? '5px 0' : '10px 0',
                    textShadow: '0 0 10px var(--terminal-green)'
                }}>GHOST GPT</h1>
                <p style={{
                    color: 'var(--blood-red)',
                    letterSpacing: isMobile ? '2px' : '4px',
                    fontSize: isMobile ? '0.7rem' : '0.9rem',
                    fontWeight: 'bold'
                }}>// TERMINAL LINK ESTABLISHED</p>
            </header>

            <main style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                flex: 1,
                margin: '0',
                padding: isMobile ? '0 0.5rem' : '0 2rem',
                overflow: 'auto'
            }}>
                {children}
            </main>

            <footer style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                opacity: 0.5,
                fontSize: '0.8rem',
                padding: isMobile ? '10px' : '20px',
                flexShrink: 0
            }}>
                <p>NO SIGNAL - {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
};

export default Layout;
