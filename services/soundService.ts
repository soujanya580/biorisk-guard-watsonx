
class SoundService {
  private context: AudioContext | null = null;

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Changed from private to public to fix error in CrisisSimulation.tsx
  playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
    this.init();
    if (!this.context) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.context.currentTime);
    
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  playAssessmentComplete() {
    this.playTone(880, 0.5, 'sine', 0.1);
    setTimeout(() => this.playTone(1108.73, 0.5, 'sine', 0.08), 100);
  }

  playAlert() {
    this.playTone(440, 0.3, 'sawtooth', 0.05);
    setTimeout(() => this.playTone(330, 0.3, 'sawtooth', 0.05), 150);
  }

  playSuccess() {
    const now = this.context?.currentTime || 0;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.05), i * 100);
    });
  }
}

export const sounds = new SoundService();
