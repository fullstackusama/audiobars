/**
 * Visualizer style presets.
 */
export type VisualizerStyle = 'bars' | 'wave' | 'circle' | 'dots' | 'voice' | 'particles';

/**
 * Options for configuring audio spectrum canvas renderer.
 */
export interface AudioBarsOptions {
  /** Visualizer style: 'bars' | 'wave' | 'circle' | 'dots' | 'voice' | 'particles' */
  style?: VisualizerStyle;

  /** Number of FFT frequency bins / bars (default: 32) */
  fftSize?: number;

  /** Primary gradient color or array of colors */
  colors?: string[];

  /** Cap radius for equalizers (default: 4) */
  barRadius?: number;

  /** Spacing between bars in pixels (default: 3) */
  barSpacing?: number;

  /** Enable synthetic idle motion wave when audio is paused (default: true) */
  idleMotion?: boolean;
}
