import { VisualizerStyle } from '../types';

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

  const len = dataArray.length;

  switch (style) {
    case 'bars': {
      const barWidth = (width / len) - barSpacing;
      let x = barSpacing / 2;

      for (let i = 0; i < len; i++) {
        const val = dataArray[i] / 255;
        const barHeight = Math.max(4, val * height * 0.85);

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
      ctx.lineWidth = 3;
      ctx.strokeStyle = colors[0] || '#06b6d4';
      ctx.beginPath();

      const sliceWidth = width / len;
      let x = 0;

      for (let i = 0; i < len; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      break;
    }

    case 'circle': {
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.25;

      ctx.strokeStyle = colors[0] || '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let i = 0; i < len; i++) {
        const rad = (i / len) * Math.PI * 2;
        const amp = (dataArray[i] / 255) * radius * 0.8;
        const r = radius + amp;

        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.stroke();
      break;
    }

    case 'voice': {
      const activeLen = Math.min(16, len);
      const barWidth = 6;
      const totalWidth = activeLen * (barWidth + 6);
      let x = (width - totalWidth) / 2;
      const cy = height / 2;

      for (let i = 0; i < activeLen; i++) {
        const val = dataArray[i] / 255;
        const h = Math.max(6, val * height * 0.7);

        ctx.fillStyle = colors[i % colors.length] || '#38bdf8';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, cy - h / 2, barWidth, h, [3, 3, 3, 3]);
        } else {
          ctx.fillRect(x, cy - h / 2, barWidth, h);
        }
        ctx.fill();

        x += barWidth + 6;
      }
      break;
    }

    case 'dots': {
      const cols = Math.min(32, len);
      const stepX = width / cols;

      for (let i = 0; i < cols; i++) {
        const val = dataArray[i] / 255;
        const radius = Math.max(2, val * 10);
        const x = i * stepX + stepX / 2;
        const y = height / 2 - (val - 0.5) * (height * 0.5);

        ctx.fillStyle = colors[i % colors.length] || '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'particles': {
      const count = Math.min(40, len);
      for (let i = 0; i < count; i++) {
        const val = dataArray[i] / 255;
        const x = (i / count) * width;
        const y = height - val * height;
        const size = Math.max(2, val * 8);

        ctx.fillStyle = colors[i % colors.length] || '#f43f5e';
        ctx.globalAlpha = Math.max(0.2, val);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      break;
    }
  }
}
