'use client';

import { useEffect, useRef, useMemo } from 'react';

interface StarFieldProps {
  count?: number;
  shooting?: boolean;
  driftSpeed?: number; // 0–1, default 0.3
  className?: string;
  zIndex?: number;
}

export default function StarField({
  count = 220,
  shooting = false,
  driftSpeed = 0.3,
  className = '',
  zIndex = 0,
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.8 + 0.4,
      baseOpacity: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinkleOffset: Math.random() * Math.PI * 2,
      // Drift
      vx: (Math.random() - 0.5) * 0.00008 * driftSpeed,
      vy: (Math.random() - 0.5) * 0.00008 * driftSpeed,
      // Color: mostly white/cream, rare blue or gold
      hue: i % 20 === 0 ? '#b3d9ff' : i % 30 === 0 ? '#f0c060' : '#fffde8',
    }));
  }, [count, driftSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;
    const shoots: { x: number; y: number; vx: number; vy: number; age: number; life: number }[] = [];

    const frame = () => {
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        // Drift wrap
        s.x = (s.x + s.vx + 1) % 1;
        s.y = (s.y + s.vy + 1) % 1;

        const pulse = Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.baseOpacity * (0.55 + 0.45 * pulse);
        const sz    = s.size * (0.85 + 0.15 * pulse);

        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, sz, 0, Math.PI * 2);
        ctx.fillStyle = s.hue;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      // Shooting stars
      if (shooting && Math.random() < 0.004) {
        const angle = Math.random() * 0.6 + 0.1; // radians, mostly diagonal
        const speed = 10 + Math.random() * 8;
        shoots.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.5,
          vx:  Math.cos(angle) * speed,
          vy:  Math.sin(angle) * speed,
          age: 0,
          life: 40 + Math.random() * 30,
        });
      }

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s2 = shoots[i];
        s2.x += s2.vx; s2.y += s2.vy; s2.age++;
        const prog  = s2.age / s2.life;
        const alpha2 = Math.sin(prog * Math.PI);
        const tail   = 60 + s2.vx * 2;
        const grad = ctx.createLinearGradient(s2.x - s2.vx * 6, s2.y - s2.vy * 6, s2.x, s2.y);
        grad.addColorStop(0, `rgba(255,253,232,0)`);
        grad.addColorStop(1, `rgba(255,253,232,${alpha2 * 0.9})`);
        ctx.beginPath();
        const spd = Math.sqrt(s2.vx * s2.vx + s2.vy * s2.vy) || 1;
        ctx.moveTo(s2.x - (s2.vx / spd) * tail, s2.y - (s2.vy / spd) * tail);
        ctx.lineTo(s2.x, s2.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 1;
        ctx.stroke();
        if (s2.age >= s2.life) shoots.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      t++;
      rafRef.current = requestAnimationFrame(frame);
    };

    frame();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [stars, shooting]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex }}
    />
  );
}
