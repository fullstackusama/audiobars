const fs = require('fs');

function createVocalWav(seconds = 15, sampleRate = 44100) {
  const numSamples = seconds * sampleRate;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Vocal formant frequencies (vowel formants A, E, I, O, U)
  const formants = [
    [700, 1220, 2600], // 'A'
    [500, 1700, 2500], // 'E'
    [300, 2200, 3000], // 'I'
    [400, 1000, 2400], // 'O'
    [300, 800, 2200]   // 'U'
  ];

  const pitchNotes = [220, 261.63, 293.66, 329.63, 392.00, 440.00];
  let offset = 44;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const phraseTime = (t * 1.5) % formants.length;
    const formantIdx = Math.floor(phraseTime);
    const formant = formants[formantIdx];

    const pitchIdx = Math.floor(t * 2) % pitchNotes.length;
    const fundamental = pitchNotes[pitchIdx];

    // Vocal voice simulation with formants + harmonics + vibrato
    const vibrato = 1 + 0.015 * Math.sin(2 * Math.PI * 5.5 * t);
    const f0 = fundamental * vibrato;

    let vocalSample = 0;
    // Fundamental glottal pulse
    vocalSample += Math.sin(2 * Math.PI * f0 * t) * 0.4;
    // Formant resonances
    vocalSample += Math.sin(2 * Math.PI * formant[0] * t) * 0.25;
    vocalSample += Math.sin(2 * Math.PI * formant[1] * t) * 0.15;
    vocalSample += Math.sin(2 * Math.PI * formant[2] * t) * 0.10;

    // Rhythmic bass beat
    const beatTime = t % 0.5;
    if (beatTime < 0.08) {
      vocalSample += Math.sin(2 * Math.PI * (100 - beatTime * 600) * t) * 0.4;
    }

    const intSample = Math.max(-32768, Math.min(32767, Math.floor(vocalSample * 26000)));
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}

const wavBuffer = createVocalWav(15);
fs.writeFileSync('C:/Users/LENOVO/.gemini/antigravity/scratch/audiobars/demo/vocal_track.wav', wavBuffer);
console.log('Successfully generated vocal_track.wav');
