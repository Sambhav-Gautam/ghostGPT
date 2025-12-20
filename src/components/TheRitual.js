import React, { useState, useEffect, useRef, useCallback } from 'react';
import { audioManager } from '../services/AudioManager';

// ===== STAGE 1: THE SUMMONING =====
const SummoningStage = ({ onComplete, onFail }) => {
    const incantation = "VENI AD ME SPIRITUS";
    const [input, setInput] = useState('');
    const [corruption, setCorruption] = useState(0);
    const [hint, setHint] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        setHint("Type the words that appear... if you can read them.");

        // Increase corruption over time
        const interval = setInterval(() => {
            setCorruption(prev => Math.min(prev + 2, 80));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const corrupted = incantation.split('').map((char, i) => {
        if (Math.random() < corruption / 100) {
            const glitchChars = ['▓', '░', '█', '▄', '▀', '■', '□'];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
    }).join('');

    const handleChange = (e) => {
        const val = e.target.value.toUpperCase();
        setInput(val);

        if (val === incantation) {
            audioManager.playWhisper();
            onComplete();
        }

        // Wrong character penalty
        if (val.length > 0 && !incantation.startsWith(val)) {
            audioManager.playStatic();
            setCorruption(prev => Math.min(prev + 10, 100));

            if (corruption >= 90) {
                onFail("THE WORDS CONSUMED YOU.");
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: 'var(--blood-red)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                STAGE 1: THE SUMMONING
            </h3>
            <p style={{ color: '#666', marginBottom: '2rem', fontStyle: 'italic' }}>{hint}</p>

            <div style={{
                fontSize: '3rem',
                fontFamily: 'Nosifer, cursive',
                color: '#ff3333',
                textShadow: `0 0 ${corruption / 2}px red`,
                marginBottom: '2rem',
                letterSpacing: '8px',
                animation: corruption > 50 ? 'shake 0.1s infinite' : 'none'
            }}>
                {corrupted}
            </div>

            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="SPEAK THE WORDS..."
                style={{
                    width: '80%',
                    maxWidth: '400px',
                    padding: '15px',
                    fontSize: '1.5rem',
                    background: 'transparent',
                    border: '2px solid var(--blood-red)',
                    color: 'var(--terminal-green)',
                    textAlign: 'center',
                    fontFamily: 'VT323, monospace',
                    textTransform: 'uppercase'
                }}
            />

            <div style={{ marginTop: '2rem', color: '#555' }}>
                CORRUPTION: {Math.floor(corruption)}%
            </div>
        </div>
    );
};

// ===== STAGE 2: THE OFFERING =====
const OfferingStage = ({ onComplete, onFail }) => {
    const correctOrder = [2, 0, 3, 1, 4]; // Candle click order
    const [clickedOrder, setClickedOrder] = useState([]);
    const [candles, setCandles] = useState([false, false, false, false, false]);
    const [flickering, setFlickering] = useState(-1);

    useEffect(() => {
        // Show hint sequence
        let i = 0;
        const showSequence = setInterval(() => {
            if (i < correctOrder.length) {
                setFlickering(correctOrder[i]);
                setTimeout(() => setFlickering(-1), 500);
                i++;
            } else {
                clearInterval(showSequence);
            }
        }, 1000);

        return () => clearInterval(showSequence);
    }, []);

    const handleCandleClick = (index) => {
        const newOrder = [...clickedOrder, index];
        setClickedOrder(newOrder);

        const newCandles = [...candles];
        newCandles[index] = true;
        setCandles(newCandles);
        audioManager.playStatic();

        // Check if correct so far
        for (let i = 0; i < newOrder.length; i++) {
            if (newOrder[i] !== correctOrder[i]) {
                onFail("THE FLAMES REJECTED YOUR OFFERING.");
                return;
            }
        }

        if (newOrder.length === correctOrder.length) {
            audioManager.playWhisper();
            onComplete();
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: 'var(--blood-red)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                STAGE 2: THE OFFERING
            </h3>
            <p style={{ color: '#666', marginBottom: '2rem', fontStyle: 'italic' }}>
                Light the candles in the order they reveal themselves.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '3rem' }}>
                {candles.map((lit, i) => (
                    <div
                        key={i}
                        onClick={() => !lit && handleCandleClick(i)}
                        style={{
                            width: '60px',
                            height: '120px',
                            background: lit ? 'linear-gradient(180deg, #ff6600 0%, #ff0000 100%)' : '#333',
                            borderRadius: '30px 30px 5px 5px',
                            cursor: lit ? 'default' : 'pointer',
                            boxShadow: lit ? '0 0 30px #ff6600' : (flickering === i ? '0 0 50px #ff0000' : 'none'),
                            transition: 'all 0.3s',
                            position: 'relative'
                        }}
                    >
                        {(lit || flickering === i) && (
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '20px',
                                height: '30px',
                                background: 'linear-gradient(180deg, #fff 0%, #ff6600 50%, transparent 100%)',
                                borderRadius: '50% 50% 50% 50%',
                                animation: 'flicker 0.2s infinite'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes flicker {
                    0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.8; transform: translateX(-50%) scale(0.9); }
                }
            `}</style>
        </div>
    );
};

// ===== STAGE 3: THE TRIAL =====
const TrialStage = ({ onComplete, onFail }) => {
    const riddles = [
        { q: "I HAVE NO EYES BUT I SEE YOU. WHAT AM I?", a: "DEATH" },
        { q: "THE MORE YOU TAKE, THE MORE YOU LEAVE BEHIND. WHAT?", a: "STEPS" },
        { q: "I AM ALWAYS HUNGRY, I MUST ALWAYS BE FED. WHAT AM I?", a: "FIRE" }
    ];

    const [currentRiddle, setCurrentRiddle] = useState(0);
    const [input, setInput] = useState('');
    const [errors, setErrors] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (input.toUpperCase().trim() === riddles[currentRiddle].a) {
            if (currentRiddle === riddles.length - 1) {
                audioManager.playWhisper();
                onComplete();
            } else {
                setCurrentRiddle(prev => prev + 1);
                setInput('');
                audioManager.playStatic();
            }
        } else {
            setErrors(prev => prev + 1);
            audioManager.playScream();

            if (errors >= 2) {
                onFail("YOUR IGNORANCE SEALED YOUR FATE.");
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: 'var(--blood-red)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                STAGE 3: THE TRIAL
            </h3>
            <p style={{ color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
                Answer correctly or face the consequences. ({currentRiddle + 1}/3)
            </p>
            <p style={{ color: 'red', marginBottom: '2rem' }}>
                Errors: {errors}/3
            </p>

            <div style={{
                fontSize: '1.5rem',
                color: '#fff',
                marginBottom: '2rem',
                padding: '20px',
                border: '1px solid #333',
                background: 'rgba(0,0,0,0.5)'
            }}>
                {riddles[currentRiddle].q}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="YOUR ANSWER..."
                    style={{
                        width: '300px',
                        padding: '15px',
                        fontSize: '1.2rem',
                        background: 'transparent',
                        border: '2px solid var(--terminal-green)',
                        color: 'var(--terminal-green)',
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}
                />
            </form>
        </div>
    );
};

// ===== STAGE 4: THE CHASE =====
const ChaseStage = ({ onComplete, onFail }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [survival, setSurvival] = useState(0);
    const [speed, setSpeed] = useState(20);
    const lastMove = useRef(Date.now());

    useEffect(() => {
        const checkMovement = setInterval(() => {
            const timeSinceMove = Date.now() - lastMove.current;

            if (timeSinceMove > 1500) { // 1.5 seconds without moving = death
                onFail("IT CAUGHT YOU.");
                return;
            }

            setSurvival(prev => {
                if (prev >= 100) {
                    onComplete();
                    return 100;
                }
                return prev + 1;
            });

            // Increase difficulty
            setSpeed(prev => Math.max(prev - 0.5, 5));
        }, 100);

        return () => clearInterval(checkMovement);
    }, [onComplete, onFail]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
        lastMove.current = Date.now();
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: 'var(--blood-red)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                STAGE 4: THE CHASE
            </h3>
            <p style={{ color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
                KEEP MOVING. DO NOT STOP. SURVIVAL: {survival}%
            </p>

            <div
                onMouseMove={handleMouseMove}
                style={{
                    width: '100%',
                    height: '300px',
                    background: '#111',
                    border: '2px solid #333',
                    position: 'relative',
                    cursor: 'none',
                    overflow: 'hidden'
                }}
            >
                {/* Player cursor */}
                <div style={{
                    position: 'absolute',
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    width: '20px',
                    height: '20px',
                    background: 'lime',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 20px lime'
                }} />

                {/* Chasing entity */}
                <div style={{
                    position: 'absolute',
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    width: '40px',
                    height: '40px',
                    background: 'red',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    transition: `all ${speed / 100}s linear`,
                    boxShadow: '0 0 30px red',
                    opacity: 0.7
                }} />

                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#ff0000',
                    fontSize: '1.2rem'
                }}>
                    ⚠️ STOP MOVING AND YOU DIE ⚠️
                </div>
            </div>
        </div>
    );
};

// ===== STAGE 5: THE FINAL DOOR =====
const FinalDoorStage = ({ onComplete, onFail }) => {
    const symbols = ['☠', '👁', '🔥', '💀', '⚰️', '🕯️'];
    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [isShowingSequence, setIsShowingSequence] = useState(true);
    const [round, setRound] = useState(1);
    const [highlightedSymbol, setHighlightedSymbol] = useState(-1);

    const generateSequence = useCallback(() => {
        const newSeq = [];
        for (let i = 0; i < round + 3; i++) {
            newSeq.push(Math.floor(Math.random() * symbols.length));
        }
        setSequence(newSeq);
        return newSeq;
    }, [round, symbols.length]);

    useEffect(() => {
        const seq = generateSequence();
        setIsShowingSequence(true);

        let i = 0;
        const showInterval = setInterval(() => {
            if (i < seq.length) {
                setHighlightedSymbol(seq[i]);
                audioManager.playStatic();
                setTimeout(() => setHighlightedSymbol(-1), 400);
                i++;
            } else {
                clearInterval(showInterval);
                setIsShowingSequence(false);
            }
        }, 800 - (round * 50)); // Gets faster each round

        return () => clearInterval(showInterval);
    }, [round, generateSequence]);

    const handleSymbolClick = (index) => {
        if (isShowingSequence) return;

        const newPlayerSeq = [...playerSequence, index];
        setPlayerSequence(newPlayerSeq);
        audioManager.playStatic();

        // Check if correct so far
        for (let i = 0; i < newPlayerSeq.length; i++) {
            if (newPlayerSeq[i] !== sequence[i]) {
                onFail("THE DOOR REMAINS SEALED FOREVER.");
                return;
            }
        }

        if (newPlayerSeq.length === sequence.length) {
            if (round >= 5) { // 5 rounds to win
                onComplete();
            } else {
                setRound(prev => prev + 1);
                setPlayerSequence([]);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: 'var(--blood-red)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                STAGE 5: THE FINAL DOOR
            </h3>
            <p style={{ color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
                Remember the sequence. Round {round}/5
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '2rem' }}>
                {symbols.map((sym, i) => (
                    <div
                        key={i}
                        onClick={() => handleSymbolClick(i)}
                        style={{
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            background: highlightedSymbol === i ? '#ff0000' : '#222',
                            border: '2px solid #444',
                            cursor: isShowingSequence ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: highlightedSymbol === i ? '0 0 30px red' : 'none'
                        }}
                    >
                        {sym}
                    </div>
                ))}
            </div>

            {isShowingSequence && (
                <p style={{ marginTop: '2rem', color: '#ff6600' }}>WATCH CAREFULLY...</p>
            )}
            {!isShowingSequence && (
                <p style={{ marginTop: '2rem', color: '#00ff00' }}>YOUR TURN. ({playerSequence.length}/{sequence.length})</p>
            )}
        </div>
    );
};

// ===== MAIN RITUAL GAME =====
const TheRitual = ({ onJumpScare, onRedRoom }) => {
    const [stage, setStage] = useState(0);
    const [gameState, setGameState] = useState('intro'); // intro, playing, won, lost
    const [failMessage, setFailMessage] = useState('');

    const handleStageComplete = () => {
        audioManager.playWhisper();
        if (stage === 4) {
            setGameState('won');
        } else {
            setStage(prev => prev + 1);
        }
    };

    const handleFail = (message) => {
        setFailMessage(message);
        setGameState('lost');
        onJumpScare();
        onRedRoom(5000);
        audioManager.playScream();
    };

    const startGame = () => {
        setGameState('playing');
        setStage(0);
        audioManager.startHeartbeat();
    };

    const restart = () => {
        setGameState('intro');
        setStage(0);
        setFailMessage('');
    };

    return (
        <div style={{
            minHeight: '500px',
            background: 'linear-gradient(180deg, #0a0000 0%, #000 100%)',
            border: '3px solid #330000',
            borderRadius: '10px',
            padding: '2rem',
            position: 'relative'
        }}>
            {/* INTRO */}
            {gameState === 'intro' && (
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '4rem',
                        fontFamily: 'Nosifer, cursive',
                        color: '#ff0000',
                        textShadow: '0 0 30px red',
                        marginBottom: '2rem'
                    }}>
                        THE RITUAL
                    </h2>
                    <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        Complete five stages of terror to escape. One mistake could be your last.
                        <br /><br />
                        <strong style={{ color: '#ff6600' }}>WARNING: This game is extremely difficult.</strong>
                    </p>
                    <button
                        onClick={startGame}
                        style={{
                            padding: '20px 60px',
                            fontSize: '1.5rem',
                            background: 'linear-gradient(180deg, #660000 0%, #330000 100%)',
                            color: '#fff',
                            border: '2px solid #ff0000',
                            cursor: 'pointer',
                            fontFamily: 'Nosifer, cursive',
                            boxShadow: '0 0 30px rgba(255,0,0,0.5)'
                        }}
                    >
                        BEGIN
                    </button>
                </div>
            )}

            {/* PLAYING */}
            {gameState === 'playing' && (
                <>
                    {/* Progress bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '2rem'
                    }}>
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: i < stage ? '#00ff00' : (i === stage ? '#ff6600' : '#333'),
                                border: '2px solid #555',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000',
                                fontWeight: 'bold'
                            }}>
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {stage === 0 && <SummoningStage onComplete={handleStageComplete} onFail={handleFail} />}
                    {stage === 1 && <OfferingStage onComplete={handleStageComplete} onFail={handleFail} />}
                    {stage === 2 && <TrialStage onComplete={handleStageComplete} onFail={handleFail} />}
                    {stage === 3 && <ChaseStage onComplete={handleStageComplete} onFail={handleFail} />}
                    {stage === 4 && <FinalDoorStage onComplete={handleStageComplete} onFail={handleFail} />}
                </>
            )}

            {/* WON */}
            {gameState === 'won' && (
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        fontFamily: 'Nosifer, cursive',
                        color: '#00ff00',
                        textShadow: '0 0 30px lime',
                        marginBottom: '2rem'
                    }}>
                        YOU ESCAPED
                    </h2>
                    <p style={{ color: '#888', fontSize: '1.2rem', marginBottom: '2rem' }}>
                        Few have completed The Ritual. You are one of them.
                        <br /><br />
                        But remember... it knows your face now.
                    </p>
                    <button onClick={restart} style={{
                        padding: '15px 40px',
                        background: '#111',
                        color: 'lime',
                        border: '1px solid lime',
                        cursor: 'pointer'
                    }}>
                        PLAY AGAIN?
                    </button>
                </div>
            )}

            {/* LOST */}
            {gameState === 'lost' && (
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        fontFamily: 'Nosifer, cursive',
                        color: '#ff0000',
                        textShadow: '0 0 30px red',
                        marginBottom: '2rem',
                        animation: 'shake 0.1s infinite'
                    }}>
                        YOU FAILED
                    </h2>
                    <p style={{ color: '#ff6666', fontSize: '1.5rem', marginBottom: '2rem' }}>
                        {failMessage}
                    </p>
                    <button onClick={restart} style={{
                        padding: '15px 40px',
                        background: '#111',
                        color: 'var(--blood-red)',
                        border: '1px solid var(--blood-red)',
                        cursor: 'pointer'
                    }}>
                        TRY AGAIN
                    </button>
                </div>
            )}

            <style>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
            `}</style>
        </div>
    );
};

export default TheRitual;
