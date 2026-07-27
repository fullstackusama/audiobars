const fs = require('fs');

function createWavBuffer(seconds = 10, sampleRate = 44100) {
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
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C major arpeggio
  let offset = 44;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.floor(t * 4) % notes.length;
    const freq = notes[noteIndex];

    // Main melody tone
    let sample = Math.sin(2 * Math.PI * freq * t) * 0.4;
    // Bass kick every 0.5s
    const beatTime = t % 0.5;
    if (beatTime < 0.1) {
      sample += Math.sin(2 * Math.PI * (120 - beatTime * 800) * t) * 0.5;
    }

    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}

const wavBuffer = createWavBuffer(12);
fs.writeFileSync('C:/Users/LENOVO/.gemini/antigravity/scratch/audiobars/demo/sample.wav', wavBuffer);
console.log('Successfully generated sample.wav');
