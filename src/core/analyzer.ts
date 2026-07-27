export class AudioAnalyzer {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceMap = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();

  public getExistingAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public connectMedia(mediaEl: HTMLMediaElement, fftSize: number = 64): AnalyserNode | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;
      this.ctx = new AudioCtxClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = fftSize;
    }

    if (!this.sourceMap.has(mediaEl) && this.ctx && this.analyser) {
      try {
        const source = this.ctx.createMediaElementSource(mediaEl);
        source.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.sourceMap.set(mediaEl, source);
      } catch {
        // Source already connected or restricted
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.analyser;
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
