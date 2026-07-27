# 🌊 audiobars

> Ultra-lightweight, zero-dependency 60 FPS HTML5 Canvas audio spectrum visualization micro-library with **0KB external assets**.

[![npm version](https://img.shields.io/npm/v/audiobars.svg?color=06b6d4&style=flat-square)](https://www.npmjs.com/package/audiobars)
[![bundle size](https://img.shields.io/bundlephobia/minzip/audiobars?color=10b981&label=gzipped&style=flat-square)](https://bundlephobia.com/package/audiobars)
[![license](https://img.shields.io/npm/l/audiobars.svg?color=a855f7&style=flat-square)](LICENSE)

Live Demo: [https://audiobars.vercel.app](https://audiobars.vercel.app)

---

## ⚡ Why audiobars?

Building real-time audio visualizers (equalizers, AI voice note waves, oscilloscope curves) for podcasts, music players, or voice note components usually requires complex Web Audio API setups, canvas scaling math, or importing heavy 50KB libraries.

**audiobars** is a **< 2.2 KB gzipped** zero-dependency micro-engine. Connect it to any HTML `<audio>` tag, Web Audio node, or microphone stream to render 60 FPS spectrum waves.

- 🎵 **6 Spectrum Styles**: Equalizers, waves, radial circles, voice note pulses, dots, and particles.
- 📐 **High-DPI Retina Sharpness**: Automatic `devicePixelRatio` scaling.
- ⚡ **Zero Layout Shift**: Renders on high-performance HTML5 2D Canvas.
- 💤 **Zero Idle CPU Overhead**: `requestAnimationFrame` render loop automatically pauses when audio stops.
- 🪶 **Micro Footprint**: Under **2.2 KB** gzipped!
- ⚛️ **React & Vanilla JS**: Works everywhere (React `<AudioBars>`, Next.js App Router, Vue, Svelte, or plain JS).

---

## 📦 Installation

```bash
npm install audiobars
# or
pnpm add audiobars
# or
yarn add audiobars
```

---

## 🚀 Quick Start

### 1. Vanilla JS / TypeScript

```typescript
import { audiobars } from 'audiobars';

const canvas = document.querySelector('#spectrum-canvas');
const audioEl = document.querySelector('#audio-player');

// Attach 60 FPS spectrum visualizer
audiobars.bars(canvas, audioEl);

// Styles
audiobars.wave(canvas, audioEl);
audiobars.circle(canvas, audioEl);
audiobars.voice(canvas, audioEl);
audiobars.dots(canvas, audioEl);
audiobars.particles(canvas, audioEl);
```

### 2. React / Next.js App Router (`<AudioBars>` & `useAudioBars`)

> [!TIP]
> `audiobars` is 100% SSR-safe. In Next.js App Router (Next.js 13/14/15/16), simply use `'use client'` on components importing UI hooks.

```tsx
'use client';

import React from 'react';
import { AudioBars } from 'audiobars/react';

export function VoiceNotePlayer() {
  return (
    <AudioBars 
      style="voice" 
      colors={['#38bdf8', '#818cf8', '#a855f7']} 
    />
  );
}
```

---

## 🎛️ 6 Visualizer Styles

| Style Preset | Geometry | Use Case |
| :--- | :--- | :--- |
| `audiobars.bars()` | Rounded gradient frequency equalizer bars | Audio players, podcasts, music dashboards |
| `audiobars.wave()` | Smooth sinusoidal oscilloscope curve | Sound wave previews, recording UI |
| `audiobars.circle()` | 360° radial frequency pulse ring | Album art overlay, circular players |
| `audiobars.voice()` | Dynamic AI voice note pulse wave | Siri / OpenAI voice note style interfaces |
| `audiobars.dots()` | Spectrum dot matrix | Minimalist audio meters, HUDs |
| `audiobars.particles()` | Audio-reactive floating specks | Ambient background visualizers |

---

## 📄 License

MIT © [fullstackusama](https://github.com/fullstackusama)
