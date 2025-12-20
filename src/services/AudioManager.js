export class AudioManager {
    constructor() {
        this.audioCtx = null;
        this.droneOsc = null;
        this.gainNode = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = 0.05; // Low volume for drone
        this.gainNode.connect(this.audioCtx.destination);

        // Create a buffer for brown noise
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        this.droneOsc = this.audioCtx.createOscillator();
        this.droneOsc.type = 'sawtooth';
        this.droneOsc.frequency.value = 50; // Low rumble

        // Filter to make it dark
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;

        this.droneOsc.connect(filter);
        filter.connect(this.gainNode);
        this.droneOsc.start();

        this.isInitialized = true;
    }

    startHeartbeat() {
        if (!this.audioCtx) return;

        // Stop existing heartbeat if any
        if (this.heartbeatOsc) this.heartbeatOsc.stop();

        this.heartbeatOsc = this.audioCtx.createOscillator();
        this.heartbeatGain = this.audioCtx.createGain();

        this.heartbeatOsc.type = 'triangle';
        this.heartbeatOsc.frequency.value = 1.5; // ~90 BPM base

        // Create a pulsing effect
        const lfo = this.audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 1.5;
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = 500; // Filter modulation depth

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;

        this.heartbeatOsc.connect(filter);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        filter.connect(this.heartbeatGain);
        this.heartbeatGain.connect(this.audioCtx.destination);

        this.heartbeatGain.gain.value = 0.3;

        this.heartbeatOsc.start();
        lfo.start();

        // Store references to manipulate later (speed up)
        this.heartbeatControls = { osc: this.heartbeatOsc, lfo: lfo };
    }

    setHeartbeatSpeed(multiplier) {
        if (this.heartbeatControls) {
            this.heartbeatControls.osc.frequency.linearRampToValueAtTime(1.5 * multiplier, this.audioCtx.currentTime + 2);
            this.heartbeatControls.lfo.frequency.linearRampToValueAtTime(1.5 * multiplier, this.audioCtx.currentTime + 2);
        }
    }

    playScream() {
        if (!this.audioCtx) return;

        // MAXIMUM VOLUME SETTINGS - ALL GAINS AT MAX
        const masterGain = this.audioCtx.createGain();
        masterGain.gain.value = 1.0; // FULL BLAST
        masterGain.connect(this.audioCtx.destination);

        // LAYER 1: PIERCING SHRIEK - most terrifying frequency for humans
        const shriek = this.audioCtx.createOscillator();
        const shriekGain = this.audioCtx.createGain();
        shriek.type = 'sawtooth';
        shriek.frequency.setValueAtTime(2500, this.audioCtx.currentTime); // Start HIGH
        shriek.frequency.exponentialRampToValueAtTime(3500, this.audioCtx.currentTime + 0.02); // SPIKE
        shriek.frequency.exponentialRampToValueAtTime(1500, this.audioCtx.currentTime + 0.3);
        shriek.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 2);
        shriek.connect(shriekGain);
        shriekGain.connect(masterGain);
        shriekGain.gain.setValueAtTime(1.0, this.audioCtx.currentTime); // MAX
        shriekGain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 2.5);
        shriek.start();
        shriek.stop(this.audioCtx.currentTime + 2.5);

        // LAYER 2: SECOND SHRIEK - slightly offset for thickness
        const shriek2 = this.audioCtx.createOscillator();
        const shriekGain2 = this.audioCtx.createGain();
        shriek2.type = 'square';
        shriek2.frequency.setValueAtTime(2200, this.audioCtx.currentTime);
        shriek2.frequency.exponentialRampToValueAtTime(3000, this.audioCtx.currentTime + 0.03);
        shriek2.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 1);
        shriek2.connect(shriekGain2);
        shriekGain2.connect(masterGain);
        shriekGain2.gain.setValueAtTime(0.9, this.audioCtx.currentTime);
        shriekGain2.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 2);
        shriek2.start();
        shriek2.stop(this.audioCtx.currentTime + 2);

        // LAYER 3: LOW BASS RUMBLE - shakes your chest
        const bass = this.audioCtx.createOscillator();
        const bassGain = this.audioCtx.createGain();
        bass.type = 'triangle';
        bass.frequency.setValueAtTime(40, this.audioCtx.currentTime);
        bass.frequency.exponentialRampToValueAtTime(25, this.audioCtx.currentTime + 1);
        bass.connect(bassGain);
        bassGain.connect(masterGain);
        bassGain.gain.setValueAtTime(1.0, this.audioCtx.currentTime); // MAX BASS
        bassGain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 2);
        bass.start();
        bass.stop(this.audioCtx.currentTime + 2);

        // LAYER 4: CHAOTIC MODULATED DISTORTION
        const chaos = this.audioCtx.createOscillator();
        const chaosGain = this.audioCtx.createGain();
        const modulator = this.audioCtx.createOscillator();
        const modGain = this.audioCtx.createGain();
        chaos.type = 'sawtooth';
        chaos.frequency.setValueAtTime(500, this.audioCtx.currentTime);
        modulator.type = 'square';
        modulator.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        modGain.gain.value = 800;
        modulator.connect(modGain);
        modGain.connect(chaos.frequency);
        chaos.connect(chaosGain);
        chaosGain.connect(masterGain);
        chaosGain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
        chaosGain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.5);
        chaos.start();
        modulator.start();
        chaos.stop(this.audioCtx.currentTime + 1.5);
        modulator.stop(this.audioCtx.currentTime + 1.5);

        // LAYER 5: MASSIVE NOISE BURST - like an explosion
        const noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 1, this.audioCtx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1);
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
        noise.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start();
    }

    playStatic() {
        if (!this.audioCtx) return;

        const noise = this.audioCtx.createBufferSource();
        const buffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 0.2, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;
        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.value = 0.1;
        noise.connect(noiseGain);
        noiseGain.connect(this.audioCtx.destination);
        noise.start();
    }

    playWhisper() {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const panner = this.audioCtx.createPanner();

        // White noise for whisper
        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass to sound like a whisper
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 1;

        // Spatial movement: Left to Right
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'linear';
        panner.positionX.setValueAtTime(-10, this.audioCtx.currentTime);
        panner.positionX.linearRampToValueAtTime(10, this.audioCtx.currentTime + 2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(this.audioCtx.destination);

        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, this.audioCtx.currentTime + 1);
        gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 2);

        noise.start();
        noise.stop(this.audioCtx.currentTime + 2);
    }
}

// Global instance
export const audioManager = new AudioManager();
