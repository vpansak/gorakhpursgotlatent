// High Performance Web Audio API Sound Effects Engine for GGL Live Shows
// Zero latency, zero external asset dependencies, works seamlessly offline

let audioCtx: AudioContext | null = null;
let currentActiveSources: (AudioNode | { stop: () => void })[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAllComputerJiSounds() {
  currentActiveSources.forEach((src) => {
    try {
      if ('stop' in src && typeof src.stop === 'function') {
        src.stop();
      } else if ('disconnect' in src && typeof (src as any).disconnect === 'function') {
        (src as any).disconnect();
      }
    } catch {
      // ignore already stopped
    }
  });
  currentActiveSources = [];
}

/**
 * 1. Sad Sound Effect (Classic Sad Trombone: Wah-Wah-Wah-Womp)
 */
export function playSadSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(volume * 0.45, now);
  master.connect(ctx.destination);

  const notes = [
    { freq: 246.94, duration: 0.35, slide: 240 }, // B3
    { freq: 233.08, duration: 0.35, slide: 226 }, // Bb3
    { freq: 220.0, duration: 0.35, slide: 213 },  // A3
    { freq: 207.65, duration: 1.1, slide: 160 },  // Ab3 with deep sad slide
  ];

  let noteTime = now;
  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc2.type = 'triangle';

    osc.frequency.setValueAtTime(n.freq, noteTime);
    osc.frequency.exponentialRampToValueAtTime(n.slide, noteTime + n.duration);
    osc2.frequency.setValueAtTime(n.freq * 0.5, noteTime);

    // Wah-wah filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, noteTime);
    filter.frequency.linearRampToValueAtTime(1200, noteTime + n.duration * 0.4);
    filter.frequency.linearRampToValueAtTime(400, noteTime + n.duration);

    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.8, noteTime + 0.05);
    gain.gain.setValueAtTime(0.7, noteTime + n.duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, noteTime + n.duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start(noteTime);
    osc2.start(noteTime);
    osc.stop(noteTime + n.duration);
    osc2.stop(noteTime + n.duration);

    currentActiveSources.push(osc, osc2);
    noteTime += n.duration + 0.08;
  });
}

/**
 * 2. Crowd Cheering & Applause
 */
export function playCrowdSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 3.6;

  // Generate multi-burst clapping noise
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Clapping simulation using filtered impulse bursts + crowd cheer noise
  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    // Base roar of crowd
    const roar = (Math.random() * 2 - 1) * 0.4;
    // Random individual claps
    const clapChance = Math.random();
    const clap = clapChance > 0.985 ? (Math.random() * 2 - 1) * 1.5 : 0;
    data[i] = (roar + clap) * Math.sin((t / duration) * Math.PI);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(1400, now);
  bandpass.Q.setValueAtTime(1.2, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(volume * 0.85, now + 0.4);
  gain.gain.setValueAtTime(volume * 0.8, now + duration - 0.8);
  gain.gain.linearRampToValueAtTime(0.01, now + duration);

  noise.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(ctx.destination);

  // Cheering tones (excited crowd vocal harmonics)
  const cheerHarmonics = [320, 480, 640];
  cheerHarmonics.forEach((freq) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq + Math.random() * 40, now);
    osc.frequency.linearRampToValueAtTime(freq * 1.25, now + 1.2);
    osc.frequency.linearRampToValueAtTime(freq * 0.9, now + duration);

    oscGain.gain.setValueAtTime(0.01, now);
    oscGain.gain.linearRampToValueAtTime(volume * 0.08, now + 0.5);
    oscGain.gain.linearRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
    currentActiveSources.push(osc);
  });

  noise.start(now);
  noise.stop(now + duration);
  currentActiveSources.push(noise);
}

/**
 * 3. Log Has Rhe Ho (Audience Laughter / Hahaha)
 */
export function playLaughSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(volume * 0.6, now);
  master.connect(ctx.destination);

  // 8 rapid bursts of "Ha - Ha - Ha - Ha - Ha - Ha - Ha - Ha"
  const laughs = [
    { pitch: 480, time: 0.0, dur: 0.16 },
    { pitch: 520, time: 0.17, dur: 0.16 },
    { pitch: 490, time: 0.34, dur: 0.16 },
    { pitch: 460, time: 0.51, dur: 0.15 },
    { pitch: 440, time: 0.67, dur: 0.15 },
    { pitch: 410, time: 0.83, dur: 0.18 },
    { pitch: 380, time: 1.02, dur: 0.25 },
    { pitch: 350, time: 1.28, dur: 0.35 },
  ];

  laughs.forEach((l) => {
    const t = now + l.time;
    // Voice oscillator 1 (sawtooth for vocal cords)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(l.pitch, t);
    osc1.frequency.exponentialRampToValueAtTime(l.pitch * 0.85, t + l.dur);

    // Voice oscillator 2 (triangle for throat resonance)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(l.pitch * 0.5, t);

    // Formant filter (vowel "A" / "Ha")
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    filter.Q.setValueAtTime(3.5, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.9, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.01, t + l.dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + l.dur);
    osc2.stop(t + l.dur);
    currentActiveSources.push(osc1, osc2);
  });
}

/**
 * 4. Red Wrong Buzzer (Harsh Game-show Buzzer)
 */
export function playBuzzerSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 0.9;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';

  osc1.frequency.setValueAtTime(130, now);
  osc2.frequency.setValueAtTime(138, now); // Detuned for discordant buzz

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(750, now);

  gain.gain.setValueAtTime(volume * 0.85, now);
  gain.gain.setValueAtTime(volume * 0.85, now + duration - 0.1);
  gain.gain.linearRampToValueAtTime(0.001, now + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
  currentActiveSources.push(osc1, osc2);
}

/**
 * 5. Cricket (Awkward Silence / Sannata Chirps)
 */
export function playCricketSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(volume * 0.45, now);
  master.connect(ctx.destination);

  const chirps = [0.0, 0.08, 0.16, 0.5, 0.58, 0.66, 1.2, 1.28, 1.36];

  chirps.forEach((chTime) => {
    const t = now + chTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(4500, t);
    osc.frequency.linearRampToValueAtTime(4900, t + 0.04);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.8, t + 0.015);
    gain.gain.linearRampToValueAtTime(0, t + 0.05);

    osc.connect(gain);
    gain.connect(master);

    osc.start(t);
    osc.stop(t + 0.06);
    currentActiveSources.push(osc);
  });
}

/**
 * 6. Tada / Victory Fanfare (Celebration Chords)
 */
export function playTadaSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(volume * 0.55, now);
  master.connect(ctx.destination);

  // Fanfare sequence: C4 -> E4 -> G4 -> High C5 (held)
  const notes = [
    { freq: 261.63, time: 0.0, dur: 0.14 },
    { freq: 329.63, time: 0.14, dur: 0.14 },
    { freq: 392.0, time: 0.28, dur: 0.14 },
    { freq: 523.25, time: 0.44, dur: 1.4 },
  ];

  notes.forEach((n) => {
    const t = now + n.time;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(n.freq, t);
    osc2.frequency.setValueAtTime(n.freq * 1.002, t);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.8, t + 0.03);
    gain.gain.setValueAtTime(0.7, t + n.dur - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + n.dur);
    osc2.stop(t + n.dur);
    currentActiveSources.push(osc1, osc2);
  });
}

/**
 * 7. Cartoon Boing / Spring
 */
export function playBoingSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 0.7;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.22);
  osc.frequency.linearRampToValueAtTime(320, now + duration);

  // Tremolo for spring effect
  const tremolo = ctx.createOscillator();
  const tremoloGain = ctx.createGain();
  tremolo.frequency.setValueAtTime(26, now);
  tremoloGain.gain.setValueAtTime(40, now);
  tremolo.connect(osc.frequency);

  gain.gain.setValueAtTime(volume * 0.75, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  tremolo.start(now);
  osc.start(now);
  tremolo.stop(now + duration);
  osc.stop(now + duration);
  currentActiveSources.push(osc, tremolo);
}

/**
 * 8. Drumroll (Suspense & Tension)
 */
export function playDrumrollSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 2.2;

  // Snare roll bursts
  const hits = 38;
  for (let i = 0; i < hits; i++) {
    const t = now + (i / hits) * 1.8;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 + Math.random() * 20, t);

    const hitVol = (i / hits) * volume * 0.6 + 0.1;
    gain.gain.setValueAtTime(hitVol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
    currentActiveSources.push(osc);
  }

  // Final cymbal / kick punch
  const crashTime = now + 1.85;
  const kickOsc = ctx.createOscillator();
  const kickGain = ctx.createGain();
  kickOsc.frequency.setValueAtTime(140, crashTime);
  kickOsc.frequency.exponentialRampToValueAtTime(40, crashTime + 0.25);
  kickGain.gain.setValueAtTime(volume * 0.9, crashTime);
  kickGain.gain.exponentialRampToValueAtTime(0.001, crashTime + 0.35);

  kickOsc.connect(kickGain);
  kickGain.connect(ctx.destination);
  kickOsc.start(crashTime);
  kickOsc.stop(crashTime + 0.35);
  currentActiveSources.push(kickOsc);
}

/**
 * 9. Bruh / Funny Meme Sound
 */
export function playBruhSound(volume = 0.8) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 0.85;

  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.linearRampToValueAtTime(220, now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume * 0.8, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
  currentActiveSources.push(osc);
}

export const SOUND_EFFECTS = [
  { id: 'crowd', label: '👏 Crowd Cheer', desc: 'भीड़ तालियां', color: 'bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-400', play: playCrowdSound },
  { id: 'laugh', label: '🤣 Audience Laugh', desc: 'हँसी ठाहाके', color: 'bg-amber-500 hover:bg-amber-400 text-black border-amber-400', play: playLaughSound },
  { id: 'sad', label: '😢 Sad Womp', desc: 'दुखद संगीत', color: 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400', play: playSadSound },
  { id: 'buzzer', label: '🔔 Red Buzzer', desc: 'गलत उत्तर', color: 'bg-red-600 hover:bg-red-500 text-white border-red-500', play: playBuzzerSound },
  { id: 'cricket', label: '🦗 Cricket Silence', desc: 'सन्नाटा', color: 'bg-teal-700 hover:bg-teal-600 text-white border-teal-500', play: playCricketSound },
  { id: 'tada', label: '🎺 Fanfare Tada', desc: 'जीत / बधाई', color: 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-400', play: playTadaSound },
  { id: 'boing', label: '🤪 Funny Boing', desc: 'स्प्रिंग', color: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white border-fuchsia-400', play: playBoingSound },
  { id: 'drumroll', label: '🥁 Drumroll', desc: 'सस्पेंस', color: 'bg-orange-600 hover:bg-orange-500 text-white border-orange-400', play: playDrumrollSound },
  { id: 'bruh', label: '💨 Bruh Meme', desc: 'मीम साउंड', color: 'bg-slate-700 hover:bg-slate-600 text-white border-slate-500', play: playBruhSound },
];
