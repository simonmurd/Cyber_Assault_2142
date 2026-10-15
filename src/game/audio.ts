/**
 * Procedural Web Audio API sound synthesizer for Cyber Assault 2142.
 * High-fidelity retro cyberpunk audio effects without external asset dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private bgmPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
      this.bgmPlaying = false;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public laser() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore audio glitches
    }
  }

  public focusedBeam() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = 650;
      filter.Q.value = 4;

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      const now = this.ctx.currentTime;

      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.linearRampToValueAtTime(320, now + 0.22);

      osc2.frequency.setValueAtTime(360, now);
      osc2.frequency.linearRampToValueAtTime(640, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch {}
  }

  public overheatWarning() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const t = now + i * 0.08;
        osc.frequency.setValueAtTime(1200, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      }
    } catch {}
  }

  public dashJet() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.15);
    } catch {}
  }

  public grappleFire() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.09);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public grappleLatch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.setValueAtTime(2400, now + 0.02);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  public explosion(size: 'small' | 'medium' | 'boss' = 'medium') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const duration = size === 'boss' ? 0.6 : size === 'medium' ? 0.35 : 0.18;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const now = this.ctx.currentTime;
      filter.frequency.setValueAtTime(size === 'boss' ? 800 : 500, now);
      filter.frequency.exponentialRampToValueAtTime(30, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(size === 'boss' ? 0.35 : 0.22, now);
      gain.gain.linearRampToValueAtTime(0.01, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {}
  }

  public bossAlert() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  public bossCoreExpose() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  public missileLaunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  public sniperTelegraph() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public hit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public startBGM() {
    if (this.isMuted || this.bgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    const notes = [110, 110, 130.8, 110, 146.8, 130.8, 110, 98];
    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const freq = notes[step % notes.length];
        step++;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
      } catch {}
    }, 180);
  }

  public stopBGM() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.bgmPlaying = false;
  }
}

export const audioFX = new SoundEngine();
