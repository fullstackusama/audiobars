import { AudioAnalyzer } from './core/analyzer';
import { renderSpectrum } from './core/renderers';
import { AudioBarsOptions, VisualizerStyle } from './types';

export class AudioBarsInstance {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private analyzer: AudioAnalyzer;
  private mediaEl: HTMLMediaElement | null = null;
  private options: Required<AudioBarsOptions>;
  private isRunning: boolean = false;
  private rafId: number | null = null;
  private timeOffset: number = 0;

  constructor(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options: AudioBarsOptions = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mediaEl = mediaEl || null;
    this.analyzer = new AudioAnalyzer();

    this.options = {
      style: options.style ?? 'bars',
      fftSize: options.fftSize ?? 64,
      colors: options.colors ?? ['#6366f1', '#06b6d4', '#38bdf8'],
      barRadius: options.barRadius ?? 4,
      barSpacing: options.barSpacing ?? 3,
      idleMotion: options.idleMotion ?? true,
    };

    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined' || !this.canvas || !this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    if (this.mediaEl) {
      this.analyzer.connectMedia(this.mediaEl, this.options.fftSize);
      this.mediaEl.addEventListener('play', () => this.start());
      this.mediaEl.addEventListener('pause', () => this.stopIfIdle());
    }

    this.start();
  }

  private resize(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    const w = rect.width || 300;
    const h = rect.height || 100;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;

    this.ctx.scale(dpr, dpr);
  }

  public setStyle(style: VisualizerStyle): void {
    this.options.style = style;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  public stopIfIdle(): void {
    if (!this.options.idleMotion) {
      this.isRunning = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
    }
  }

  private loop(): void {
    if (!this.ctx || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 100;

    const analyser = this.analyzer.getExistingAnalyser();
    let dataArray: any;

    if (analyser && this.mediaEl && !this.mediaEl.paused) {
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
    } else {
      this.timeOffset += 0.05;
      dataArray = this.analyzer.getSyntheticData(this.options.fftSize / 2, this.timeOffset);
    }

    renderSpectrum(
      this.ctx,
      width,
      height,
      dataArray,
      this.options.style,
      this.options.colors,
      this.options.barRadius,
      this.options.barSpacing
    );

    if (this.isRunning) {
      this.rafId = requestAnimationFrame(() => this.loop());
    }
  }

  public destroy(): void {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

export class PresetsManager {
  public attach(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return new AudioBarsInstance(canvas, mediaEl, options);
  }

  public bars(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return new AudioBarsInstance(canvas, mediaEl, { style: 'bars', ...options });
  }

  public wave(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return new AudioBarsInstance(canvas, mediaEl, { style: 'wave', ...options });
  }

  public circle(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return new AudioBarsInstance(canvas, mediaEl, { style: 'circle', ...options });
  }

  public dots(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return new AudioBarsInstance(canvas, mediaEl, { style: 'dots', ...options });
  }

  public voice(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return new AudioBarsInstance(canvas, mediaEl, { style: 'voice', ...options });
  }

  public particles(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return new AudioBarsInstance(canvas, mediaEl, { style: 'particles', ...options });
  }
}
