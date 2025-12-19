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

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        // We can't actually do the brown noise math easily without state, 
        // let's just use simple white noise with a lowpass filter for "rumble"

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
}

// Global instance
export const audioManager = new AudioManager();

// Helper variable for brown noise generator
let lastOut = 0;
