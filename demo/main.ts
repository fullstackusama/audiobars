import { audiobars, VisualizerStyle, AudioBarsInstance, AudioAnalyzer } from '../src/index';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  const audioEl = document.getElementById('demo-audio') as HTMLAudioElement;
  const analyzer = new AudioAnalyzer();

  setupPresetPads(audioEl);
  setupSynthesizerLab(audioEl);
  setupCustomPlayer(audioEl, analyzer);
  setupCopyButtons();
  setupThemeToggle();
});

/**
 * 1. Attach 6 visualizer style canvases connected to HTML5 Audio Element
 */
function setupPresetPads(audioEl: HTMLAudioElement): void {
  const styles: VisualizerStyle[] = ['bars', 'wave', 'circle', 'voice', 'dots', 'particles'];

  styles.forEach((style) => {
    const canvas = document.getElementById(`canvas-${style}`) as HTMLCanvasElement;
    if (canvas) {
      audiobars.attach(canvas, audioEl, {
        style,
        idleMotion: false, // 100% stationary when paused, animates ONLY when audio plays!
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
 * 2. Custom Minimalist Audio Player Event Logic
 */
function setupCustomPlayer(audioEl: HTMLAudioElement, analyzer: AudioAnalyzer): void {
  const playBtn = document.getElementById('custom-play-btn')!;
  const playSvg = document.getElementById('play-svg')!;
  const pauseSvg = document.getElementById('pause-svg')!;
  const btnLabel = document.getElementById('player-btn-label')!;
  const progressBar = document.getElementById('player-progress-bar')!;
  const timeText = document.getElementById('player-time')!;

  playBtn.addEventListener('click', () => {
    // Unlock AudioContext inside user gesture
    analyzer.resumeContext();

    if (audioEl.paused) {
      audioEl.play().then(() => {
        playBtn.classList.add('playing');
        playSvg.style.display = 'none';
        pauseSvg.style.display = 'inline-block';
        btnLabel.textContent = 'PAUSE PODCAST SPEECH';
      }).catch((err) => {
        console.error('Audio play error:', err);
        audioEl.play();
      });
    } else {
      audioEl.pause();
      playBtn.classList.remove('playing');
      playSvg.style.display = 'inline-block';
      pauseSvg.style.display = 'none';
      btnLabel.textContent = 'PLAY TED TALK / PODCAST SPEECH';
    }
  });

  audioEl.addEventListener('timeupdate', () => {
    if (!audioEl.duration) return;
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    progressBar.style.width = `${pct}%`;
    timeText.textContent = `${formatTime(audioEl.currentTime)} / ${formatTime(audioEl.duration || 34)}`;
  });

  audioEl.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
    playSvg.style.display = 'inline-block';
    pauseSvg.style.display = 'none';
    btnLabel.textContent = 'PLAY TED TALK / PODCAST SPEECH';
    progressBar.style.width = '0%';
  });
}

function formatTime(secs: number): string {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
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

function setupSynthesizerLab(audioEl: HTMLAudioElement): void {
  const styleChips = document.querySelectorAll<HTMLButtonElement>('.style-chip');
  const labCanvas = document.getElementById('lab-canvas') as HTMLCanvasElement;

  if (labCanvas) {
    labInstance = audiobars.attach(labCanvas, audioEl, {
      style: currentStyle,
      idleMotion: false,
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

// Attach 60 FPS spectrum visualizer to HTML5 audio element
audiobars.${currentStyle}(canvas, audioEl, {
  colors: ['#6366f1', '#06b6d4', '#38bdf8'],
  idleMotion: false
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
