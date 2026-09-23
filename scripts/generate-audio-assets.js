import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Function to generate canonical 44.1kHz 16-bit Mono WAV Buffer
function createWavBuffer(sampleRate, durationSec, sampleGenerator) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2; // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // audioFormat (1 = PCM)
  buffer.writeUInt16LE(1, 22);  // numChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byteRate
  buffer.writeUInt16LE(2, 32);  // blockAlign
  buffer.writeUInt16LE(16, 34); // bitsPerSample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = sampleGenerator(t, durationSec);
    // Clamp sample to [-1, 1]
    sample = Math.max(-1, Math.min(1, sample));
    const intSample = Math.floor(sample < 0 ? sample * 32768 : sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 44100;

// 1. GGL_THEME: 12-second energetic broadcast theme
console.log('Generating ggl_theme.wav...');
const themeBuf = createWavBuffer(sampleRate, 12.0, (t, dur) => {
  const beat = (t % 0.5) / 0.5;
  const bar = Math.floor(t / 2.0);
  const roots = [220, 174.61, 261.63, 196.0];
  const root = roots[bar % 4];

  const bassFreq = root / 2;
  const bassEnv = Math.exp(-beat * 4);
  const bass = (Math.sin(2 * Math.PI * bassFreq * t) + 0.4 * Math.sin(4 * Math.PI * bassFreq * t)) * bassEnv * 0.4;

  const noteIdx = Math.floor(t * 8) % 4;
  const chordNotes = [root, root * 1.25, root * 1.5, root * 2.0];
  const leadFreq = chordNotes[noteIdx];
  const leadEnv = Math.exp(-((t * 8) % 1) * 3);
  const lead = Math.sin(2 * Math.PI * leadFreq * t) * leadEnv * 0.25;

  const kick = beat < 0.1 ? Math.sin(2 * Math.PI * 60 * (1 - beat * 10) * t) * (1 - beat * 10) * 0.4 : 0;
  const fade = t > dur - 1.0 ? (dur - t) : 1;
  return (bass + lead + kick) * fade;
});
fs.writeFileSync(path.join(audioDir, 'ggl_theme.wav'), themeBuf);

// 2. GGL_ENTRY: 4.5-second energetic walk-on fanfare
console.log('Generating ggl_entry.wav...');
const entryBuf = createWavBuffer(sampleRate, 4.5, (t, dur) => {
  const stabs = [
    { start: 0.0, end: 0.35, f: 261.63 },
    { start: 0.4, end: 0.75, f: 329.63 },
    { start: 0.8, end: 1.15, f: 392.00 },
    { start: 1.3, end: 1.65, f: 440.00 },
    { start: 1.8, end: 4.0,  f: 523.25 }
  ];

  let val = 0;
  for (const s of stabs) {
    if (t >= s.start && t < s.end) {
      const localT = t - s.start;
      const decay = s.end === 4.0 ? Math.exp(-localT * 0.8) : Math.exp(-localT * 4);
      val += (
        Math.sin(2 * Math.PI * s.f * t) * 0.4 +
        Math.sin(2 * Math.PI * s.f * 1.5 * t) * 0.25 +
        Math.sin(2 * Math.PI * s.f * 2 * t) * 0.15
      ) * decay;
    }
  }

  if (t >= 1.8) {
    const cT = t - 1.8;
    const cymbal = (Math.random() * 2 - 1) * Math.exp(-cT * 2) * 0.2;
    val += cymbal;
  }

  return val * 0.85;
});
fs.writeFileSync(path.join(audioDir, 'ggl_entry.wav'), entryBuf);

// 3. GGL_LAUGH: 2.8-second comedy rimshot (Ba-dum-tss)
console.log('Generating ggl_laugh.wav...');
const laughBuf = createWavBuffer(sampleRate, 2.8, (t, dur) => {
  let val = 0;
  if (t >= 0.0 && t < 0.2) {
    const lT = t;
    val += Math.sin(2 * Math.PI * (160 - lT * 400) * lT) * Math.exp(-lT * 15) * 0.6;
  }
  if (t >= 0.25 && t < 0.5) {
    const lT = t - 0.25;
    val += Math.sin(2 * Math.PI * (120 - lT * 300) * lT) * Math.exp(-lT * 12) * 0.6;
  }
  if (t >= 0.55 && t < 2.5) {
    const lT = t - 0.55;
    val += (Math.random() * 2 - 1) * Math.exp(-lT * 2.5) * 0.5;
  }
  return val;
});
fs.writeFileSync(path.join(audioDir, 'ggl_laugh.wav'), laughBuf);

// 4. GGL_APPLAUSE: 5.0-second audience cheer and clapping
console.log('Generating ggl_applause.wav...');
const applauseBuf = createWavBuffer(sampleRate, 5.0, (t, dur) => {
  const envelope = t < 1.0 ? t : (t > 4.0 ? (dur - t) : 1.0);
  const claps = (Math.random() > 0.94 ? (Math.random() * 2 - 1) : 0) * 0.5;
  const crowd = (Math.sin(2 * Math.PI * 400 * t) * 0.05 + (Math.random() * 2 - 1) * 0.35);
  return (claps + crowd) * envelope * 0.8;
});
fs.writeFileSync(path.join(audioDir, 'ggl_applause.wav'), applauseBuf);

// 5. GGL_SUSPENSE: 6.0-second cinematic heartbeat drum & rising pitch
console.log('Generating ggl_suspense.wav...');
const suspenseBuf = createWavBuffer(sampleRate, 6.0, (t, dur) => {
  const pulseTimes = [0.0, 0.2, 1.2, 1.4, 2.3, 2.5, 3.3, 3.5, 4.1, 4.3, 4.8, 5.0, 5.4, 5.6];
  let pulse = 0;
  for (const pt of pulseTimes) {
    if (t >= pt && t < pt + 0.18) {
      const pT = t - pt;
      pulse += Math.sin(2 * Math.PI * (65 - pT * 120) * pT) * Math.exp(-pT * 18) * 0.5;
    }
  }

  const pitch = 55 + (t / dur) * 120;
  const drone = (Math.sin(2 * Math.PI * pitch * t) + 0.3 * Math.sin(4 * Math.PI * pitch * t)) * (0.1 + (t / dur) * 0.3);

  return (pulse + drone) * 0.9;
});
fs.writeFileSync(path.join(audioDir, 'ggl_suspense.wav'), suspenseBuf);

// 6. GGL_WINNER: 5.5-second celebratory grand jackpot fanfare
console.log('Generating ggl_winner.wav...');
const winnerBuf = createWavBuffer(sampleRate, 5.5, (t, dur) => {
  const notes = [
    { start: 0.0, end: 0.25, f: 523.25 },
    { start: 0.25, end: 0.5, f: 659.25 },
    { start: 0.5, end: 0.75, f: 783.99 },
    { start: 0.75, end: 1.1, f: 1046.50 },
    { start: 1.1, end: 1.4, f: 783.99 },
    { start: 1.4, end: 5.0, f: 1046.50 }
  ];

  let val = 0;
  for (const n of notes) {
    if (t >= n.start && t < n.end) {
      const lT = t - n.start;
      const decay = n.end === 5.0 ? Math.exp(-lT * 0.6) : Math.exp(-lT * 4);
      val += (
        Math.sin(2 * Math.PI * n.f * t) * 0.45 +
        Math.sin(2 * Math.PI * (n.f * 1.5) * t) * 0.2 +
        Math.sin(2 * Math.PI * (n.f * 2.0) * t) * 0.15
      ) * decay;
    }
  }

  if (t >= 1.4) {
    const bellFreq = 2093.0;
    const bellT = t - 1.4;
    val += Math.sin(2 * Math.PI * bellFreq * t) * Math.exp(-bellT * 1.5) * 0.15;
  }

  return val * 0.9;
});
fs.writeFileSync(path.join(audioDir, 'ggl_winner.wav'), winnerBuf);

console.log('✅ All 6 production audio files successfully generated in public/audio/!');
