import { PresetsManager, AudioBarsInstance } from './presets';
import { AudioBarsOptions } from './types';

export * from './types';
export { AudioAnalyzer } from './core/analyzer';
export { renderSpectrum } from './core/renderers';
export { PresetsManager, AudioBarsInstance } from './presets';
export { useAudioBars, AudioBars } from './react';

/**
 * Main AudioBars class unifying attachments & presets.
 */
export class AudioBarsClass {
  private presetsManager: PresetsManager;

  constructor() {
    this.presetsManager = new PresetsManager();
  }

  public attach(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return this.presetsManager.attach(canvas, mediaEl, options);
  }

  // --- Preset shortcuts ---
  public bars(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return this.presetsManager.bars(canvas, mediaEl, options);
  }

  public wave(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return this.presetsManager.wave(canvas, mediaEl, options);
  }

  public circle(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return this.presetsManager.circle(canvas, mediaEl, options);
  }

  public dots(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return this.presetsManager.dots(canvas, mediaEl, options);
  }

  public voice(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return this.presetsManager.voice(canvas, mediaEl, options);
  }

  public particles(canvas: HTMLCanvasElement, mediaEl?: HTMLMediaElement | null, options?: AudioBarsOptions): AudioBarsInstance {
    return this.presetsManager.particles(canvas, mediaEl, options);
  }
}

/**
 * Singleton instance of AudioBars for quick import and use.
 * @example
 * import { audiobars } from 'audiobars';
 * audiobars.bars(document.querySelector('canvas'));
 */
export const audiobars = new AudioBarsClass();

/**
 * Factory function to create custom AudioBars instances.
 */
export function createAudioBars(): AudioBarsClass {
  return new AudioBarsClass();
}

export default audiobars;
