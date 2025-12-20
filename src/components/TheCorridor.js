import React, { useRef, useEffect, useState, useCallback } from 'react';
import { audioManager } from '../services/AudioManager';

const TheCorridor = ({ onJumpScare, onRedRoom }) => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('menu');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gamePhase, setGamePhase] = useState('calm'); // calm, warning, terror
    const gameRef = useRef({
        player: { x: 400, y: 350, speed: 6 },
        entities: [],
        particles: [],
        corridorOffset: 0,
        darkness: 0.1,
        isRunning: false,
        keys: {},
        startTime: 0,
        terrorTriggered: false,
        warningFlash: 0,
        canvasWidth: 800,
        canvasHeight: 500
    });

    // Responsive canvas sizing
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

    useEffect(() => {
        const updateSize = () => {
            const maxWidth = Math.min(window.innerWidth - 40, 800);
            const maxHeight = Math.min(window.innerHeight - 250, 500);
            const aspectRatio = 800 / 500;

            let width = maxWidth;
            let height = width / aspectRatio;

            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }

            setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
            gameRef.current.canvasWidth = Math.floor(width);
            gameRef.current.canvasHeight = Math.floor(height);
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);


    const startGame = useCallback(() => {
        const game = gameRef.current;
        game.player = { x: canvasSize.width / 2, y: canvasSize.height * 0.7, speed: 6 };
        game.entities = [];
        game.particles = [];
        game.corridorOffset = 0;
        game.darkness = 0.1; // Start VERY bright
        game.isRunning = true;
        game.startTime = Date.now();
        game.terrorTriggered = false;
        game.warningFlash = 0;
        setScore(0);
        setGamePhase('calm');
        setGameState('playing');
        audioManager.startHeartbeat();
        audioManager.setHeartbeatSpeed(0.5); // Slow calm heartbeat
    }, []);

    const triggerTerror = useCallback(() => {
        const game = gameRef.current;
        const canvas = canvasRef.current;

        // MAXIMUM TERROR
        game.darkness = 0.9;
        audioManager.setHeartbeatSpeed(3.0);
        audioManager.playStatic();

        // Spawn MASSIVE wave of entities from ALL directions
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            game.entities.push({
                x: canvas.width / 2 + Math.cos(angle) * 600,
                y: canvas.height / 2 + Math.sin(angle) * 400,
                type: 'shadow',
                speed: 8 + Math.random() * 4,
                size: 60,
                phase: Math.random() * Math.PI * 2
            });
        }

        setGamePhase('terror');
    }, []);

    const gameOver = useCallback(() => {
        gameRef.current.isRunning = false;
        setGameState('dead');
        onJumpScare();
        onRedRoom(5000);
        audioManager.playScream();
        setHighScore(prev => Math.max(prev, score));
    }, [onJumpScare, onRedRoom, score]);

    // Game loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const game = gameRef.current;
        let animationId;
        let lastTime = Date.now();

        const CALM_DURATION = 25000; // 25 seconds of calm
        const WARNING_DURATION = 5000; // 5 seconds of warning
        const TERROR_TIME = CALM_DURATION + WARNING_DURATION; // 30 seconds total

        const update = () => {
            const now = Date.now();
            const delta = (now - lastTime) / 16;
            lastTime = now;

            const elapsedTime = now - game.startTime;
            setScore(Math.floor(elapsedTime / 100));

            // PHASE MANAGEMENT
            if (elapsedTime < CALM_DURATION) {
                // CALM PHASE - Easy, relaxing, barely any threats
                game.darkness = 0.1 + (elapsedTime / CALM_DURATION) * 0.1; // Slowly gets a tiny bit darker

                // Spawn very few, very slow entities
                if (game.entities.length < 2 && Math.random() < 0.002) {
                    game.entities.push({
                        x: Math.random() > 0.5 ? -100 : canvas.width + 100,
                        y: 200 + Math.random() * 200,
                        type: 'shadow',
                        speed: 0.5 + Math.random() * 0.5, // VERY SLOW
                        size: 40,
                        phase: 0
                    });
                }
            } else if (elapsedTime < TERROR_TIME && !game.terrorTriggered) {
                // WARNING PHASE - Something is wrong...
                setGamePhase('warning');
                game.warningFlash = Math.sin(now / 100) * 0.5 + 0.5;
                game.darkness = 0.3 + game.warningFlash * 0.2;
                audioManager.setHeartbeatSpeed(1.5);

                // Whispers and static hints
                if (Math.random() < 0.02) {
                    audioManager.playWhisper();
                }
            } else if (!game.terrorTriggered) {
                // TERROR TRIGGER - After 30 seconds, EVERYTHING ATTACKS
                game.terrorTriggered = true;
                triggerTerror();
            }

            // Player movement
            const moveSpeed = game.player.speed * delta;
            if (game.keys['ArrowLeft'] || game.keys['KeyA']) {
                game.player.x = Math.max(50, game.player.x - moveSpeed);
            }
            if (game.keys['ArrowRight'] || game.keys['KeyD']) {
                game.player.x = Math.min(canvas.width - 50, game.player.x + moveSpeed);
            }
            if (game.keys['ArrowUp'] || game.keys['KeyW']) {
                game.player.y = Math.max(200, game.player.y - moveSpeed);
            }
            if (game.keys['ArrowDown'] || game.keys['KeyS']) {
                game.player.y = Math.min(canvas.height - 50, game.player.y + moveSpeed);
            }

            // Update entities
            game.entities.forEach(entity => {
                const dx = game.player.x - entity.x;
                const dy = game.player.y - entity.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 0) {
                    entity.x += (dx / dist) * entity.speed * delta;
                    entity.y += (dy / dist) * entity.speed * delta;
                }
                entity.phase += 0.1;

                // Collision detection
                if (dist < entity.size + 15) {
                    gameOver();
                }
            });

            // Scroll corridor
            game.corridorOffset += 2 * delta;

            // Spawn particles
            if (Math.random() < 0.1) {
                game.particles.push({
                    x: Math.random() * canvas.width,
                    y: -10,
                    speed: 1 + Math.random() * 2,
                    size: Math.random() * 3,
                    life: 1
                });
            }

            game.particles = game.particles.filter(p => {
                p.y += p.speed * delta;
                p.life -= 0.005;
                return p.life > 0 && p.y < canvas.height;
            });
        };

        const draw = () => {
            // Clear with phase-appropriate color
            ctx.fillStyle = gamePhase === 'terror' ? '#1a0000' : '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw corridor perspective
            const vanishY = 100;
            const gradient = ctx.createLinearGradient(0, vanishY, 0, canvas.height);
            if (gamePhase === 'calm') {
                gradient.addColorStop(0, '#1a1a2a');
                gradient.addColorStop(1, '#0a0a15');
            } else if (gamePhase === 'warning') {
                gradient.addColorStop(0, '#2a1a1a');
                gradient.addColorStop(1, '#150a0a');
            } else {
                gradient.addColorStop(0, '#3a0000');
                gradient.addColorStop(1, '#1a0000');
            }
            ctx.fillStyle = gradient;

            // Floor
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(canvas.width / 2, vanishY);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.fill();

            // Walls
            ctx.strokeStyle = gamePhase === 'terror' ? '#ff0000' : '#333';
            ctx.lineWidth = 2;
            for (let i = 0; i < 10; i++) {
                const offset = (game.corridorOffset + i * 50) % 500;
                const scale = offset / 500;
                const x1 = canvas.width / 2 - scale * (canvas.width / 2);
                const x2 = canvas.width / 2 + scale * (canvas.width / 2);
                const y = vanishY + scale * (canvas.height - vanishY);

                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.stroke();
            }

            // Draw entities
            game.entities.forEach(entity => {
                ctx.save();
                ctx.translate(entity.x, entity.y);

                // Shadow figure
                ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
                ctx.beginPath();
                ctx.ellipse(0, 0, entity.size, entity.size * 1.5, 0, 0, Math.PI * 2);
                ctx.fill();

                // Glowing eyes - bigger in terror phase
                ctx.fillStyle = '#ff0000';
                const eyeSize = gamePhase === 'terror' ? 8 : 5;
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = gamePhase === 'terror' ? 30 : 10;
                ctx.beginPath();
                ctx.arc(-15, -20, eyeSize, 0, Math.PI * 2);
                ctx.arc(15, -20, eyeSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            // Draw particles
            ctx.fillStyle = 'rgba(100, 50, 50, 0.5)';
            game.particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw player
            ctx.save();
            ctx.translate(game.player.x, game.player.y);

            // Player glow
            const glowRadius = gamePhase === 'terror' ? 50 : 120;
            const playerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
            playerGlow.addColorStop(0, 'rgba(100, 255, 100, 0.4)');
            playerGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = playerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            // Player body
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Darkness overlay
            const darknessGradient = ctx.createRadialGradient(
                game.player.x, game.player.y, gamePhase === 'terror' ? 30 : 80,
                game.player.x, game.player.y, gamePhase === 'terror' ? 150 : 350
            );
            darknessGradient.addColorStop(0, 'transparent');
            darknessGradient.addColorStop(1, `rgba(0, 0, 0, ${game.darkness})`);
            ctx.fillStyle = darknessGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // WARNING FLASH
            if (gamePhase === 'warning') {
                ctx.fillStyle = `rgba(255, 0, 0, ${game.warningFlash * 0.15})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // TERROR PHASE - Red vignette
            if (gamePhase === 'terror') {
                const terrorVignette = ctx.createRadialGradient(
                    canvas.width / 2, canvas.height / 2, 50,
                    canvas.width / 2, canvas.height / 2, canvas.width
                );
                terrorVignette.addColorStop(0, 'transparent');
                terrorVignette.addColorStop(1, 'rgba(100, 0, 0, 0.8)');
                ctx.fillStyle = terrorVignette;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // UI
            ctx.fillStyle = gamePhase === 'terror' ? '#ff0000' : '#888';
            ctx.font = '24px VT323, monospace';
            const timeDisplay = Math.floor((Date.now() - game.startTime) / 1000);
            ctx.fillText(`TIME: ${timeDisplay}s`, 20, 40);

            if (gamePhase === 'calm') {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('STATUS: SAFE...', 20, 70);
            } else if (gamePhase === 'warning') {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('STATUS: SOMETHING IS WRONG...', 20, 70);
            } else {
                ctx.fillStyle = '#ff0000';
                ctx.font = '32px VT323, monospace';
                ctx.fillText('IT FOUND YOU', 20, 70);
            }
        };

        const gameLoop = () => {
            if (!game.isRunning) return;
            update();
            draw();
            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [gameState, gameOver, gamePhase, triggerTerror]);

    // Keyboard handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            gameRef.current.keys[e.code] = true;
            if (e.code === 'Space' && (gameState === 'menu' || gameState === 'dead')) {
                startGame();
            }
        };

        const handleKeyUp = (e) => {
            gameRef.current.keys[e.code] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState, startGame]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#000',
            padding: '10px',
            borderRadius: '10px',
            border: '3px solid #330000',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <h2 style={{
                fontFamily: 'Nosifer, cursive',
                color: '#ff0000',
                fontSize: 'clamp(1.2rem, 5vw, 3rem)',
                textShadow: '0 0 30px red',
                marginBottom: '10px',
                textAlign: 'center'
            }}>
                THE CORRIDOR
            </h2>

            <div style={{
                position: 'relative',
                border: '4px solid #330000',
                boxShadow: '0 0 50px rgba(255, 0, 0, 0.3)',
                maxWidth: '100%'
            }}>
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    style={{ display: 'block', background: '#000', maxWidth: '100%' }}
                />

                {/* Menu Overlay */}
                {gameState === 'menu' && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#888'
                    }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#aaa' }}>THE CORRIDOR</h3>
                        <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
                            A peaceful walk through an empty corridor.<br />
                            Nothing to worry about.<br />
                            <span style={{ color: '#444' }}>Just keep walking...</span>
                        </p>
                        <button
                            onClick={startGame}
                            style={{
                                padding: '15px 40px',
                                fontSize: '1.5rem',
                                background: 'linear-gradient(180deg, #333, #222)',
                                color: '#888',
                                border: '2px solid #444',
                                cursor: 'pointer',
                                fontFamily: 'VT323, monospace'
                            }}
                        >
                            [SPACE] TO WALK
                        </button>
                    </div>
                )}

                {/* Death Overlay */}
                {gameState === 'dead' && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(50, 0, 0, 0.95)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff0000',
                        animation: 'shake 0.1s infinite'
                    }}>
                        <h3 style={{
                            fontSize: '4rem',
                            fontFamily: 'Nosifer, cursive',
                            textShadow: '0 0 30px red',
                            marginBottom: '1rem'
                        }}>
                            IT GOT YOU
                        </h3>
                        <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                            SURVIVED: {Math.floor(score / 10)}s
                        </p>
                        <button
                            onClick={startGame}
                            style={{
                                padding: '15px 40px',
                                fontSize: '1.5rem',
                                background: 'linear-gradient(180deg, #660000, #330000)',
                                color: '#fff',
                                border: '2px solid #ff0000',
                                cursor: 'pointer',
                                fontFamily: 'VT323, monospace'
                            }}
                        >
                            [SPACE] TRY AGAIN
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Touch Controls */}
            {gameState === 'playing' && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: '10px'
                }}>
                    <button
                        onTouchStart={() => { gameRef.current.keys['KeyW'] = true; }}
                        onTouchEnd={() => { gameRef.current.keys['KeyW'] = false; }}
                        onMouseDown={() => { gameRef.current.keys['KeyW'] = true; }}
                        onMouseUp={() => { gameRef.current.keys['KeyW'] = false; }}
                        style={controlButtonStyle}
                    >▲</button>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                            onTouchStart={() => { gameRef.current.keys['KeyA'] = true; }}
                            onTouchEnd={() => { gameRef.current.keys['KeyA'] = false; }}
                            onMouseDown={() => { gameRef.current.keys['KeyA'] = true; }}
                            onMouseUp={() => { gameRef.current.keys['KeyA'] = false; }}
                            style={controlButtonStyle}
                        >◀</button>
                        <button
                            onTouchStart={() => { gameRef.current.keys['KeyS'] = true; }}
                            onTouchEnd={() => { gameRef.current.keys['KeyS'] = false; }}
                            onMouseDown={() => { gameRef.current.keys['KeyS'] = true; }}
                            onMouseUp={() => { gameRef.current.keys['KeyS'] = false; }}
                            style={controlButtonStyle}
                        >▼</button>
                        <button
                            onTouchStart={() => { gameRef.current.keys['KeyD'] = true; }}
                            onTouchEnd={() => { gameRef.current.keys['KeyD'] = false; }}
                            onMouseDown={() => { gameRef.current.keys['KeyD'] = true; }}
                            onMouseUp={() => { gameRef.current.keys['KeyD'] = false; }}
                            style={controlButtonStyle}
                        >▶</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px); }
                    25% { transform: translate(-1px, -1px); }
                    50% { transform: translate(1px, -1px); }
                    75% { transform: translate(-1px, 1px); }
                    100% { transform: translate(1px, 1px); }
                }
            `}</style>
        </div>
    );
};

const controlButtonStyle = {
    width: '50px',
    height: '50px',
    fontSize: '1.5rem',
    background: 'rgba(50, 0, 0, 0.8)',
    color: '#ff0000',
    border: '2px solid #ff0000',
    borderRadius: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'manipulation'
};

export default TheCorridor;
