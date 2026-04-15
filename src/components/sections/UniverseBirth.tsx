'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, stagger, useAnimate } from 'framer-motion';
import StarField from '../StarField';

interface UniverseBirthProps {
  onComplete: () => void;
}

// ── Word-by-word text lines ─────────────────────────────────────────────────
const TEXT_SEQUENCE = [
  { words: ['Every', 'universe', 'has', 'a', 'center.'], size: 'text-2xl md:text-4xl', delay: 0 },
  { words: ['A', 'point', 'where', 'gravity', 'bends.'], size: 'text-xl md:text-3xl', delay: 4500 },
  { words: ['Where', 'light', 'returns', 'from.'], size: 'text-xl md:text-3xl', delay: 8500 },
  { words: ['…'], size: 'text-3xl md:text-5xl', delay: 12500 },
  { words: ['This', 'one', 'has', 'you.'], size: 'text-4xl md:text-6xl golden', delay: 15000 },
];

// ── Dust-particle planet assembly canvas ────────────────────────────────────
function PlanetCanvas({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    canvas.width  = 420;
    canvas.height = 420;
    const cx = 210, cy = 210, R = 155;

    // Dust particles that orbit and converge
    const N = 200;
    const particles = Array.from({ length: N }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const orbitR = R * (1.5 + Math.random() * 3.5);
      return {
        angle,
        orbitR,
        speed: (Math.random() * 0.006 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        converge: 0,           // 0→1 as planet forms
        convergeRate: 0.003 + Math.random() * 0.004,
        size: Math.random() * 2.5 + 0.8,
        color: Math.random() > 0.5
          ? `rgba(240,192,96,${0.3 + Math.random() * 0.5})`
          : `rgba(253,244,227,${0.2 + Math.random() * 0.4})`,
        finalAngle: (i / N) * Math.PI * 2,
        finalR: Math.random() * R * 0.95,
      };
    });

    const draw = () => {
      tRef.current++;
      ctx.clearRect(0, 0, 420, 420);

      // ── Glow halo ──
      const convergeMean = particles.reduce((s, p) => s + p.converge, 0) / N;
      if (convergeMean > 0.1) {
        const grd = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 1.5);
        grd.addColorStop(0, `rgba(232,115,58,${0.08 * convergeMean})`);
        grd.addColorStop(0.5, `rgba(240,192,96,${0.05 * convergeMean})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 420, 420);
      }

      // ── Planet body (fades in as convergeMean rises) ──
      if (convergeMean > 0.4) {
        const a = Math.min(1, (convergeMean - 0.4) / 0.4);
        ctx.save();
        ctx.globalAlpha = a;

        // Atmosphere
        const atm = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.2);
        atm.addColorStop(0, 'transparent');
        atm.addColorStop(1, `rgba(232,115,58,0.15)`);
        ctx.fillStyle = atm;
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2); ctx.fill();

        // Surface
        const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.25, 0, cx, cy, R);
        grad.addColorStop(0, '#e8a96a');
        grad.addColorStop(0.35, '#c87038');
        grad.addColorStop(0.7, '#8b4218');
        grad.addColorStop(1, '#4a1a00');
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();

        // Bands
        ctx.globalAlpha = a * 0.12;
        for (let b = 0; b < 3; b++) {
          const by = cy + (b - 1) * R * 0.32;
          ctx.beginPath();
          ctx.ellipse(cx, by, R * 0.95, R * 0.08, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#3a1000'; ctx.fill();
        }

        // Highlight
        ctx.globalAlpha = a * 0.18;
        ctx.beginPath();
        ctx.ellipse(cx - R * 0.28, cy - R * 0.28, R * 0.3, R * 0.2, -0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff0cc'; ctx.fill();

        ctx.restore();

        // Ring
        ctx.save();
        ctx.globalAlpha = a * 0.6;
        ctx.translate(cx, cy);
        ctx.scale(1, 0.22);
        const ring = ctx.createLinearGradient(-R * 1.7, 0, R * 1.7, 0);
        ring.addColorStop(0,    'rgba(240,192,96,0)');
        ring.addColorStop(0.25, 'rgba(240,192,96,0.6)');
        ring.addColorStop(0.5,  'rgba(253,244,227,0.9)');
        ring.addColorStop(0.75, 'rgba(240,192,96,0.6)');
        ring.addColorStop(1,    'rgba(240,192,96,0)');
        ctx.strokeStyle = ring;
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(0, 0, R * 1.55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // ── Dust particles ──
      for (const p of particles) {
        p.angle += p.speed;
        p.converge = Math.min(1, p.converge + p.convergeRate);

        const orbitX = cx + Math.cos(p.angle) * p.orbitR;
        const orbitY = cy + Math.sin(p.angle) * p.orbitR;
        const finalX = cx + Math.cos(p.finalAngle) * p.finalR;
        const finalY = cy + Math.sin(p.finalAngle) * p.finalR;
        const c = p.converge;
        const x = orbitX * (1 - c) + finalX * c;
        const y = orbitY * (1 - c) + finalY * c;

        if (c > 0.9) continue; // fully absorbed

        ctx.globalAlpha = (1 - c) * 0.85;
        ctx.beginPath();
        ctx.arc(x, y, p.size * (1 - c * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 320, height: 320, imageRendering: 'pixelated' }}
      className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

// ── Animated word-by-word line ──────────────────────────────────────────────
function TextLine({
  words,
  size,
  onDone,
}: {
  words: string[];
  size: string;
  onDone: () => void;
}) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      'span',
      { opacity: [0, 1], y: [14, 0], filter: ['blur(4px)', 'blur(0px)'] },
      { delay: stagger(0.14), duration: 0.55, ease: 'easeOut' }
    ).then(() => setTimeout(onDone, 1400));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isGolden = size.includes('golden');
  const cleanSize = size.replace(' golden', '');

  return (
    <div ref={scope} className={`flex flex-wrap justify-center gap-x-3 gap-y-1 ${cleanSize}`}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          style={{
            opacity: 0,
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            color: isGolden ? '#f0c060' : 'rgba(253,244,227,0.9)',
            ...(isGolden ? { textShadow: '0 0 40px rgba(240,192,96,0.6), 0 0 80px rgba(240,192,96,0.25)' } : {}),
          }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
}

// ── Main scene ──────────────────────────────────────────────────────────────
export default function UniverseBirth({ onComplete }: UniverseBirthProps) {
  const [lineIdx,     setLineIdx]     = useState(-1);
  const [showPlanet,  setShowPlanet]  = useState(false);
  const [showPig,     setShowPig]     = useState(false);
  const [exiting,     setExiting]     = useState(false);

  // Kick off first line after mount
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TEXT_SEQUENCE.forEach((line, i) => {
      timers.push(setTimeout(() => setLineIdx(i), line.delay));
    });
    timers.push(setTimeout(() => setShowPlanet(true), 18500));
    timers.push(setTimeout(() => setShowPig(true),    22000));
    timers.push(setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 1200);
    }, 27000));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="scene"
      style={{ background: '#050810' }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <StarField count={280} shooting zIndex={0} />

      {/* Nebula wash */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(196,122,138,0.04) 0%, transparent 70%)',
        zIndex: 1,
      }} />

      {/* Text phase */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-8">
        <AnimatePresence mode="wait">
          {lineIdx >= 0 && lineIdx < TEXT_SEQUENCE.length && (
            <motion.div
              key={lineIdx}
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TextLine
                words={TEXT_SEQUENCE[lineIdx].words}
                size={TEXT_SEQUENCE[lineIdx].size}
                onDone={() => {/* stagger handles it */}}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Planet assembly */}
      <AnimatePresence>
        {showPlanet && (
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 0.8, -0.8, 0] }}
              transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
            >
              <PlanetCanvas visible={showPlanet} />
            </motion.div>

            {/* Pig */}
            <AnimatePresence>
              {showPig && (
                <motion.div
                  className="absolute"
                  style={{ bottom: 20, left: '50%', translateX: '-50%' }}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                >
                  {/* Tiny pig SVG — waddling */}
                  <PigWaddle />
                  <motion.div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-xl px-3 py-1.5 text-xs whitespace-nowrap"
                    style={{
                      background: 'rgba(13,31,45,0.85)',
                      border: '1px solid rgba(240,192,96,0.3)',
                      color: '#f0c060',
                      fontFamily: 'var(--font-syne-mono)',
                    }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    ✦ oh! a visitor.
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PigWaddle() {
  return (
    <motion.div
      animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut' }}
    >
      <svg width="72" height="82" viewBox="0 0 120 138">
        <ellipse cx="60" cy="85" rx="38" ry="36" fill="#f4a7b9"/>
        <ellipse cx="60" cy="90" rx="22" ry="20" fill="#fdd5e1"/>
        <ellipse cx="60" cy="52" rx="34" ry="30" fill="#f4a7b9"/>
        {/* Gandhi glasses */}
        <circle cx="48" cy="54" r="9" fill="none" stroke="#3d2800" strokeWidth="2.2"/>
        <circle cx="72" cy="54" r="9" fill="none" stroke="#3d2800" strokeWidth="2.2"/>
        <line x1="57" y1="54" x2="63" y2="54" stroke="#3d2800" strokeWidth="2"/>
        <line x1="39" y1="52" x2="34" y2="50" stroke="#3d2800" strokeWidth="1.5"/>
        <line x1="81" y1="52" x2="86" y2="50" stroke="#3d2800" strokeWidth="1.5"/>
        <ellipse cx="48" cy="54" rx="4.5" ry="4.5" fill="#1a0800"/>
        <ellipse cx="72" cy="54" rx="4.5" ry="4.5" fill="#1a0800"/>
        <circle cx="50" cy="52" r="1.3" fill="white"/>
        <circle cx="74" cy="52" r="1.3" fill="white"/>
        <ellipse cx="60" cy="65" rx="13" ry="9" fill="#e8899a"/>
        <circle cx="55" cy="65" r="3.5" fill="#c06077"/>
        <circle cx="65" cy="65" r="3.5" fill="#c06077"/>
        <path d="M52 72 Q60 78 68 72" fill="none" stroke="#c06077" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="31" cy="35" rx="11" ry="14" fill="#f4a7b9"/>
        <ellipse cx="31" cy="35" rx="6" ry="9" fill="#e8899a"/>
        <ellipse cx="89" cy="35" rx="11" ry="14" fill="#f4a7b9"/>
        <ellipse cx="89" cy="35" rx="6" ry="9" fill="#e8899a"/>
        <ellipse cx="38" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.35"/>
        <ellipse cx="82" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.35"/>
        <rect x="37" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>
        <rect x="69" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>
      </svg>
    </motion.div>
  );
}
