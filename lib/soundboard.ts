'use client';

// Web Audio API Sound Synthesizer for GGL Live Show Control Room & Public Display
// 100% reliable, zero external network dependencies, high fidelity entertainment effects

let audioCtx: AudioContext | null = null;
let activeOscillators: (OscillatorNode | AudioNode)[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAllSounds() {
  try {
    activeOscillators.forEach(node => {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch (e) {}
    });
    activeOscillators = [];
  } catch (e) {
    console.error('Error stopping sounds:', e);
  }
}

export function playSound(type: 'THEME' | 'ENTRY' | 'LAUGH' | 'APPLAUSE' | 'SUSPENSE' | 'WINNER' | 'STOP') {
  if (type === 'STOP') {
    stopAllSounds();
    return;
  }

  try {
    const ctx = getAudioContext();
    stopAllSounds();

    const now = ctx.currentTime;

    switch (type) {
      // 1. GGL SHOW THEME
      case 'THEME': {
        const notes = [220, 277.18, 329.63, 440, 415.3, 329.63, 277.18, 220];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.22);
          
          gain.gain.setValueAtTime(0.2, now + i * 0.22);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.22);
          osc.stop(now + i * 0.22 + 0.36);
          activeOscillators.push(osc);
        });
        break;
      }

      // 2. ENTRY / FANFARE
      case 'ENTRY': {
        const chords = [
          [261.63, 329.63, 392.0], // C
          [293.66, 369.99, 440.0], // D
          [329.63, 415.3, 493.88], // E
          [523.25, 659.25, 783.99]  // High C Major
        ];
        chords.forEach((chord, i) => {
          chord.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.3);

            const duration = i === 3 ? 1.2 : 0.28;
            gain.gain.setValueAtTime(0.25, now + i * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.3);
            osc.stop(now + i * 0.3 + duration);
            activeOscillators.push(osc);
          });
        });
        break;
      }

      // 3. APPLAUSE / CHEER
      case 'APPLAUSE': {
        const bufferSize = ctx.sampleRate * 2.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 1.8));
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.Q.setValueAtTime(1.5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start(now);
        activeOscillators.push(whiteNoise);
        break;
      }

      // 4. SUSPENSE / DRUM ROLL PULSE
      case 'SUSPENSE': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 3.0);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 2.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
        activeOscillators.push(osc);
        break;
      }

      // 5. WINNER / CELEBRATION
      case 'WINNER': {
        // Dramatic celebratory arpeggio fanfare + big brass
        const fanfare = [
          { f: 523.25, t: 0.0, d: 0.18 }, // C5
          { f: 523.25, t: 0.18, d: 0.18 }, // C5
          { f: 523.25, t: 0.36, d: 0.18 }, // C5
          { f: 659.25, t: 0.54, d: 0.35 }, // E5
          { f: 783.99, t: 0.90, d: 0.35 }, // G5
          { f: 1046.50, t: 1.25, d: 1.8 }  // C6 grand finale
        ];

        fanfare.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, now + item.t);

          gain.gain.setValueAtTime(0.4, now + item.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + item.t);
          osc.stop(now + item.t + item.d);
          activeOscillators.push(osc);
        });
        break;
      }

      // 6. LAUGH / RIMSHOT
      case 'LAUGH': {
        // Quick comedic drum rimshot
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
        activeOscillators.push(osc);
        break;
      }
    }
  } catch (err) {
    console.warn('Audio playback error (user interaction might be needed):', err);
  }
}
