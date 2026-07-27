import { audiobars, VisualizerStyle, AudioBarsInstance } from '../src/index';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupPresetPads();
  setupSynthesizerLab();
  setupAudioPlayer();
  setupCopyButtons();
  setupThemeToggle();
});

/**
 * 1. Attach 6 visualizer style canvases in the Presets Grid
 */
function setupPresetPads(): void {
  const styles: VisualizerStyle[] = ['bars', 'wave', 'circle', 'voice', 'dots', 'particles'];

  styles.forEach((style) => {
    const canvas = document.getElementById(`canvas-${style}`) as HTMLCanvasElement;
    if (canvas) {
      audiobars.attach(canvas, null, {
        style,
        idleMotion: true,
        colors: getStyleColors(style),
      });
    }
  });
}

function getStyleColors(style: VisualizerStyle): string[] {
  switch (style) {
    case 'bars': return ['#6366f1', '#06b6d4', '#38bdf8'];
    case 'wave': return ['#06b6d4', '#38bdf8'];
    case 'circle': return ['#a855f7', '#ec4899'];
    case 'voice': return ['#38bdf8', '#818cf8', '#a855f7'];
    case 'dots': return ['#10b981', '#34d399'];
    case 'particles': return ['#f43f5e', '#fb7185'];
    default: return ['#6366f1', '#06b6d4'];
  }
}

/**
 * 2. Realtime Web Audio Sample Beat Synthesizer
 */
let audioCtx: AudioContext | null = null;
let isPlayingAudio = false;
let beatTimer: number | null = null;

function setupAudioPlayer(): void {
  const playBtn = document.getElementById('btn-play-audio')!;
  const playLabel = document.getElementById('play-sample-label')!;

  playBtn.addEventListener('click', () => {
    if (!isPlayingAudio) {
      startSynthBeat();
      isPlayingAudio = true;
      playBtn.classList.add('playing');
      playLabel.textContent = 'PAUSE AUDIO BEAT';
    } else {
      stopSynthBeat();
      isPlayingAudio = false;
      playBtn.classList.remove('playing');
      playLabel.textContent = 'PLAY SAMPLE AUDIO BEAT';
    }
  });
}

function startSynthBeat(): void {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const notes = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
  let step = 0;

  function playBeatStep(): void {
    if (!audioCtx || !isPlayingAudio) return;

    const now = audioCtx.currentTime;

    // Bass kick (low frequency)
    if (step % 2 === 0) {
      const kickOsc = audioCtx.createOscillator();
      const kickGain = audioCtx.createGain();
      kickOsc.type = 'triangle';
      kickOsc.frequency.setValueAtTime(150, now);
      kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      kickGain.gain.setValueAtTime(0.4, now);
      kickGain.gain.linearRampToValueAtTime(0.001, now + 0.12);

      kickOsc.connect(kickGain);
      kickGain.connect(audioCtx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.13);
    }

    // Synth Melody chord
    const freq = notes[step % notes.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = step % 4 === 0 ? 'square' : 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.19);

    step++;
    beatTimer = window.setTimeout(playBeatStep, 180);
  }

  playBeatStep();
}

function stopSynthBeat(): void {
  if (beatTimer) {
    clearTimeout(beatTimer);
    beatTimer = null;
  }
}

/**
 * 3. Theme Toggle Handler (Light / Dark)
 */
function setupThemeToggle(): void {
  const themeBtn = document.getElementById('toggle-theme')!;
  const themeLabel = document.getElementById('theme-label')!;

  const savedTheme = localStorage.getItem('audiobars_theme') || 'light';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('audiobars_theme', nextTheme);
  });

  function applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.classList.toggle('active', theme === 'light');
    themeLabel.textContent = theme === 'light' ? 'DARK THEME' : 'LIGHT THEME';
  }
}

/**
 * 4. Custom Laboratory Style Switcher
 */
let labInstance: AudioBarsInstance | null = null;
let currentStyle: VisualizerStyle = 'bars';

function setupSynthesizerLab(): void {
  const styleChips = document.querySelectorAll<HTMLButtonElement>('.style-chip');
  const labCanvas = document.getElementById('lab-canvas') as HTMLCanvasElement;

  if (labCanvas) {
    labInstance = audiobars.attach(labCanvas, null, {
      style: currentStyle,
      idleMotion: true,
      colors: getStyleColors(currentStyle),
    });
  }

  styleChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      styleChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentStyle = (chip.dataset.style as VisualizerStyle) || 'bars';

      if (labInstance) {
        labInstance.setStyle(currentStyle);
      }
      updateLabCode();
    });
  });
}

function updateLabCode(): void {
  const codeEl = document.getElementById('code-snippet')!;

  codeEl.textContent = `import { audiobars } from 'audiobars';

const canvas = document.querySelector('#spectrum-canvas');
const audioEl = document.querySelector('#audio-player');

// Attach 60 FPS spectrum visualizer
audiobars.${currentStyle}(canvas, audioEl, {
  colors: ['#6366f1', '#06b6d4', '#38bdf8'],
  idleMotion: true
});`;
}

/**
 * 5. Clipboard Copy Utilities
 */
function setupCopyButtons(): void {
  const copyInstallBtn = document.getElementById('copy-install-btn')!;
  const copyCodeBtn = document.getElementById('copy-code-btn')!;
  const copyExBtns = document.querySelectorAll<HTMLButtonElement>('.copy-ex-btn');

  copyInstallBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('npm install audiobars');
    showToast('Copied "npm install audiobars" to clipboard!');
  });

  copyCodeBtn.addEventListener('click', () => {
    const code = document.getElementById('code-snippet')!.textContent || '';
    navigator.clipboard.writeText(code);
    showToast('Copied visualizer code snippet!');
  });

  copyExBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      const codeEl = document.getElementById(targetId);
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.textContent || '');
        showToast('Copied example code!');
      }
    });
  });
}

function showToast(msg: string): void {
  const toast = document.getElementById('toast')!;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}
