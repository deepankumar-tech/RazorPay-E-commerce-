// Web Audio Synthesizer for Payment Audio Feedback (Zero external assets required)

class PaymentSoundHelper {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // 🎵 Payment Success Chime (Crisp 4-note victory chord + optional voice announcement)
  public playPaymentSuccessSound(amount?: number) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 4-Note Uplifting Major Chord: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz) -> C6 (1046.50Hz)
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.55);
      });

      // Voice notification sound confirmation
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const msg = new SpeechSynthesisUtterance();
          msg.text = amount
            ? `Payment of ₹${amount.toLocaleString('en-IN')} successful!`
            : 'Payment authorized successfully!';
          msg.rate = 1.05;
          msg.pitch = 1.1;
          window.speechSynthesis.speak(msg);
        }, 400);
      }
    } catch (e) {
      console.warn('Audio playback notice:', e);
    }
  }

  // ⚡ Payment Processing / PIN Authorization Sound
  public playProcessingSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('Audio notice:', e);
    }
  }

  // ❌ Payment Cancelled Sound
  public playCancelSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const notes = [400, 300];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.22);
      });
    } catch (e) {
      console.warn('Audio notice:', e);
    }
  }
}

export const paymentSound = new PaymentSoundHelper();
