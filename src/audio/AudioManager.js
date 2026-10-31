/**
 * AudioManager for Namma Fragile OS
 * 100% Client-Side Procedural Web Audio API Sound Synthesizer + SpeechSynthesis fallback.
 * Zero external audio assets required; immune to 404s or network dropouts.
 */

class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.volume = 0.8;
    this.isUnlocked = false;
    this.activeUtterance = null;

    // Try to restore saved preferences
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('namma_os_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    }
  }

  /**
   * Lazily initializes AudioContext on user interaction to comply with browser autoplay policies.
   */
  initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        this.masterGain.connect(this.audioCtx.destination);
        this.isUnlocked = true;
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    return this.audioCtx;
  }

  setVolume(newVol) {
    this.volume = Math.max(0, Math.min(1, newVol));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx?.currentTime || 0);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('namma_os_muted', String(this.isMuted));
    }
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.audioCtx.currentTime
      );
    }
    // Cancel active speech synthesis if muted
    if (this.isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  // =========================================================================
  // PROCEDURAL WEB AUDIO SYNTHESIZERS (Zero Asset Loading Risk)
  // =========================================================================

  /**
   * Synthesized Exasperated Sigh: Soft descending low-pass tone
   */
  playSigh() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.6);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.65);
  }

  /**
   * Synthesized Error Buzz: Harsh dual-tone warning
   */
  playErrorBuzz() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    [180, 125].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    });
  }

  /**
   * Synthesized UI Collapse / Shatter Thud: Heavy bass drop with noise burst
   */
  playShatterThud() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // 1. Deep Sub Bass Impact
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(180, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.5);

    subGain.gain.setValueAtTime(0.4, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(ctx.currentTime);
    subOsc.stop(ctx.currentTime + 0.6);

    // 2. Clattering noise burst
    try {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noise.start(ctx.currentTime);
    } catch (e) {
      // Fallback silently if buffer creation fails
    }
  }

  /**
   * Synthesized Victory Chime: C5 - E5 - G5 - C6 Major Arpeggio on recovery
   */
  playVictoryChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  /**
   * Bengaluru Auto Horn: Classic dual-frequency square wave honk
   */
  playAutoHorn() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    [440, 554.37].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.24);
    });
  }

  /**
   * General SFX dispatcher
   */
  playSfx(soundType) {
    switch (soundType) {
      case 'sigh':
        this.playSigh();
        break;
      case 'warning':
      case 'beep':
        this.playErrorBuzz();
        break;
      case 'crash':
        this.playShatterThud();
        break;
      case 'victory':
        this.playVictoryChime();
        break;
      case 'honk':
        this.playAutoHorn();
        break;
      default:
        break;
    }
  }

  // =========================================================================
  // ZERO-ASSET SPEECH SYNTHESIS ENGINE (en-IN fallback)
  // =========================================================================

  /**
   * Speaks dialogue using browser Web Speech API with Indian English accent
   */
  speak(text) {
    if (this.isMuted || !text || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior utterance

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = this.volume;

      // Search for Indian English voice (en-IN)
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(
        (v) =>
          v.lang === 'en-IN' ||
          v.lang === 'en_IN' ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('hindi')
      );

      if (inVoice) {
        utterance.voice = inVoice;
      }

      this.activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      // Speech synthesis error handled gracefully
    }
  }
}

// Global Singleton
export const audioManager = new AudioManager();
