// Shared global map across all AudioAnalyzer instances to prevent duplicate MediaElementSource creation errors
const globalSourceMap = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();
let globalAudioCtx: AudioContext | null = null;

export class AudioAnalyzer {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  public getExistingAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public connectMedia(mediaEl: HTMLMediaElement, fftSize: number = 64): AnalyserNode | null {
    if (typeof window === 'undefined') return null;

    if (!globalAudioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;
      globalAudioCtx = new AudioCtxClass();
    }
    this.ctx = globalAudioCtx;

    if (!this.analyser && this.ctx) {
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = fftSize;
      this.analyser.smoothingTimeConstant = 0.8;
    }

    if (this.ctx && this.analyser) {
      let source = globalSourceMap.get(mediaEl);
      if (!source) {
        try {
          source = this.ctx.createMediaElementSource(mediaEl);
          source.connect(this.ctx.destination); // Send audio to speakers!
          globalSourceMap.set(mediaEl, source);
        } catch (e) {
          console.warn('MediaElementSource initialization warning:', e);
        }
      }

      if (source && this.analyser) {
        try {
          source.connect(this.analyser); // Send audio to spectrum analyzer!
        } catch {
          // Already connected to this analyzer
        }
      }
    }

    return this.analyser;
  }

  public resumeContext(): void {
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume().catch(() => {});
    }
  }

  public getSyntheticData(bufferLength: number, time: number): Uint8Array {
    const data = new Uint8Array(bufferLength);
    for (let i = 0; i < bufferLength; i++) {
      const sinVal = Math.sin(i * 0.2 + time) * Math.cos(i * 0.1 - time);
      data[i] = Math.floor(Math.max(15, (sinVal + 1) * 45));
    }
    return data;
  }
}
