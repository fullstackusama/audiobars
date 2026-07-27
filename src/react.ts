'use client';

import React, { useEffect, useRef } from 'react';
import { AudioBarsOptions, VisualizerStyle } from './types';
import { audiobars } from './index';

export interface AudioBarsProps extends Omit<AudioBarsOptions, 'style'> {
  style?: VisualizerStyle;
  canvasStyle?: React.CSSProperties;
  mediaRef?: React.RefObject<HTMLMediaElement>;
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * React Component wrapper to render 60 FPS audio spectrum visualizer.
 * @example
 * <AudioBars style="bars" colors={['#6366f1', '#06b6d4']} />
 */
export function AudioBars({
  style = 'bars',
  fftSize = 64,
  colors = ['#6366f1', '#06b6d4', '#38bdf8'],
  barRadius = 4,
  barSpacing = 3,
  idleMotion = true,
  mediaRef,
  className,
  canvasStyle,
  width = '100%',
  height = 100,
  ...props
}: AudioBarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const mediaEl = mediaRef?.current || null;

    const instance = audiobars.attach(canvasRef.current, mediaEl, {
      style,
      fftSize,
      colors,
      barRadius,
      barSpacing,
      idleMotion,
    });

    return () => {
      instance.destroy();
    };
  }, [style, fftSize, colors, barRadius, barSpacing, idleMotion, mediaRef]);

  return React.createElement('canvas', {
    ref: canvasRef,
    className,
    style: { width, height, ...canvasStyle },
    ...props,
  });
}

/**
 * React Hook to attach audiobars to a ref'd canvas.
 */
export function useAudioBars(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  mediaRef?: React.RefObject<HTMLMediaElement>,
  options: AudioBarsOptions = {}
) {
  useEffect(() => {
    if (!canvasRef.current) return;
    const instance = audiobars.attach(canvasRef.current, mediaRef?.current, options);
    return () => instance.destroy();
  }, [canvasRef, mediaRef, options]);
}
