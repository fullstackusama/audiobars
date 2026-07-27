import { VisualizerStyle } from '../types';

/**
 * 100% Symmetrical 60 FPS HTML5 Canvas Audio Spectrum Renderer.
 */
export function renderSpectrum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: any,
  style: VisualizerStyle,
  colors: string[],
  barRadius: number = 4,
  barSpacing: number = 3
): void {
  ctx.clearRect(0, 0, width, height);

  const rawLen = dataArray.length;
  if (rawLen === 0) return;

  // Build Symmetrically Mirrored Frequency Array (Center-out or Left-Right Mirrored)
  const halfLen = Math.floor(rawLen / 2);
  const mirrored: number[] = new Array(halfLen * 2);

  for (let i = 0; i < halfLen; i++) {
    // Low frequencies (bass) placed in the center, tapering outward symmetrically
    const val = dataArray[i];
    mirrored[halfLen - 1 - i] = val;
    mirrored[halfLen + i] = val;
  }

  const len = mirrored.length;

  switch (style) {
    case 'bars': {
      // Symmetrical Equalizer Bars (Bass in center, tapering outward)
      const barWidth = (width / len) - barSpacing;
      let x = barSpacing / 2;

      for (let i = 0; i < len; i++) {
        const normVal = mirrored[i] / 255;
        // Windowing envelope for smooth edge tapering
        const envelope = Math.sin((i / (len - 1)) * Math.PI);
        const barHeight = Math.max(4, normVal * envelope * height * 0.85);

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, colors[0] || '#6366f1');
        gradient.addColorStop(0.5, colors[1] || '#06b6d4');
        gradient.addColorStop(1, colors[2] || '#38bdf8');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, height - barHeight, Math.max(2, barWidth), barHeight, [barRadius, barRadius, 0, 0]);
        } else {
          ctx.fillRect(x, height - barHeight, Math.max(2, barWidth), barHeight);
        }
        ctx.fill();

        x += barWidth + barSpacing;
      }
      break;
    }

    case 'wave': {
      // 100% Symmetrical Oscilloscope Waveform (Centered horizontally & vertically)
      ctx.lineWidth = 3;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, colors[0] || '#06b6d4');
      gradient.addColorStop(0.5, colors[1] || '#38bdf8');
      gradient.addColorStop(1, colors[0] || '#06b6d4');
      ctx.strokeStyle = gradient;

      const cy = height / 2;
      const sliceWidth = width / len;

      ctx.beginPath();
      let x = 0;

      for (let i = 0; i < len; i++) {
        const normVal = (mirrored[i] / 255) - 0.1;
        const envelope = Math.sin((i / (len - 1)) * Math.PI);
        const offset = normVal * envelope * (height * 0.45);

        // Alternating top & bottom sine pulse for symmetrical wave body
        const y = cy + (i % 2 === 0 ? -offset : offset);

        if (i === 0) {
          ctx.moveTo(x, cy);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(width, cy);
      ctx.stroke();

      // Mirror reflection glow line underneath
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      x = 0;

      for (let i = 0; i < len; i++) {
        const normVal = (mirrored[i] / 255) - 0.1;
        const envelope = Math.sin((i / (len - 1)) * Math.PI);
        const offset = normVal * envelope * (height * 0.45);
        const y = cy + (i % 2 === 0 ? offset : -offset);

        if (i === 0) ctx.moveTo(x, cy);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, cy);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      break;
    }

    case 'circle': {
      // 100% Bilaterally Symmetrical Radial Pulse Ring (Left-Right Mirrored 180°)
      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.25;

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, colors[0] || '#a855f7');
      gradient.addColorStop(1, colors[1] || '#ec4899');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;

      ctx.beginPath();

      const numPoints = 64;
      const pointsHalf = numPoints / 2;

      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        // Symmetric indexing across vertical axis
        const dataIdx = i <= pointsHalf ? i % halfLen : (numPoints - i) % halfLen;
        const normVal = dataArray[dataIdx] / 255;

        const amp = normVal * baseRadius * 0.9;
        const r = baseRadius + amp;

        const x = cx + Math.sin(angle) * r;
        const y = cy - Math.cos(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.stroke();

      // Inner glowing core ring
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      break;
    }

    case 'voice': {
      // Symmetrical AI Voice Note Pill Bars (Centered & Tapered)
      const numPills = 16;
      const pillWidth = 6;
      const gap = 6;
      const totalW = numPills * (pillWidth + gap) - gap;
      let x = (width - totalW) / 2;
      const cy = height / 2;

      for (let i = 0; i < numPills; i++) {
        const centerDist = Math.abs(i - (numPills - 1) / 2) / ((numPills - 1) / 2);
        const envelope = Math.cos(centerDist * (Math.PI / 2));
        
        const dataIdx = Math.floor(i % (rawLen / 4));
        const normVal = dataArray[dataIdx] / 255;
        const h = Math.max(6, normVal * envelope * (height * 0.75));

        ctx.fillStyle = colors[i % colors.length] || '#38bdf8';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, cy - h / 2, pillWidth, h, [3, 3, 3, 3]);
        } else {
          ctx.fillRect(x, cy - h / 2, pillWidth, h);
        }
        ctx.fill();

        x += pillWidth + gap;
      }
      break;
    }

    case 'dots': {
      // 100% Symmetrical Dot Matrix (Bass in center, tapering outward)
      const numDots = Math.min(32, len);
      const stepX = width / numDots;

      for (let i = 0; i < numDots; i++) {
        const normVal = mirrored[i] / 255;
        const envelope = Math.sin((i / (numDots - 1)) * Math.PI);
        const r = Math.max(2, normVal * envelope * 8);

        const x = i * stepX + stepX / 2;
        const y = height / 2;

        ctx.fillStyle = colors[i % colors.length] || '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'particles': {
      // Symmetrical Audio Specks (Flowing outward from center)
      const count = Math.min(36, len);
      const cx = width / 2;

      for (let i = 0; i < count; i++) {
        const normVal = mirrored[i] / 255;
        const isLeft = i % 2 === 0;
        const posFactor = (i / count);
        const x = isLeft ? cx - posFactor * (width / 2) : cx + posFactor * (width / 2);
        const y = height / 2 - (normVal - 0.5) * (height * 0.7);
        const size = Math.max(2, normVal * 6);

        ctx.fillStyle = colors[i % colors.length] || '#f43f5e';
        ctx.globalAlpha = Math.max(0.2, normVal);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      break;
    }
  }
}
