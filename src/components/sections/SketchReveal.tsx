'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import StarField from '../StarField';

interface SketchRevealProps {
  onComplete: () => void;
}

// ── Krishanu at desk — animated SVG ─────────────────────────────────────────
function SketchingDesk({ phase }: { phase: 'drawing' | 'done' }) {
  return (
    <motion.div className="relative" style={{ width: 280, height: 200 }}>
      <svg width="280" height="200" viewBox="0 0 280 200">
        {/* Desk */}
        <rect x="10" y="145" width="260" height="12" rx="4" fill="#5c3010" opacity="0.9"/>
        <rect x="20" y="155" width="10" height="40" rx="3" fill="#4a2208"/>
        <rect x="250" y="155" width="10" height="40" rx="3" fill="#4a2208"/>

        {/* Paper on desk */}
        <motion.rect x="80" y="118" width="120" height="30" rx="2" fill="#fdf4e3"
          animate={phase === 'drawing' ? { rotate: [-0.5, 0.5, -0.5] } : { rotate: 0 }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{ transformOrigin: '140px 133px' }}/>
        {/* Pencil lines on paper — drawn progressively */}
        <motion.line x1="92" y1="128" x2="130" y2="128" stroke="#555" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1.2 }}/>
        <motion.line x1="92" y1="133" x2="145" y2="133" stroke="#555" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1 }}/>
        <motion.ellipse cx="160" cy="128" rx="12" ry="14" fill="none" stroke="#555" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 1.5 }}/>
        <motion.ellipse cx="185" cy="128" rx="10" ry="12" fill="none" stroke="#555" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6, duration: 1.2 }}/>

        {/* Krishanu body */}
        <rect x="100" y="72" width="80" height="50" rx="8" fill="#4a2e1e"/>
        {/* Head */}
        <ellipse cx="140" cy="48" rx="28" ry="28" fill="#c8845a"/>
        {/* Hair */}
        <ellipse cx="140" cy="24" rx="28" ry="12" fill="#1a0a00"/>
        <ellipse cx="115" cy="36" rx="8" ry="14" fill="#1a0a00"/>
        <ellipse cx="165" cy="36" rx="8" ry="14" fill="#1a0a00"/>
        {/* Focused eyes */}
        <path d="M126 47 Q131 41 136 47" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
        <path d="M144 47 Q149 41 154 47" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
        {/* Tongue out — concentrating */}
        <motion.path d="M133 60 Q140 68 147 60" fill="none" stroke="#9a4a28" strokeWidth="2" strokeLinecap="round"
          animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 0.9 }}/>
        <motion.ellipse cx="140" cy="64" rx="5" ry="3" fill="#e88080" opacity="0.7"
          animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 0.9 }}/>
        {/* Arms reaching forward */}
        <rect x="60" y="90" width="44" height="10" rx="5" fill="#c8845a" transform="rotate(-10 82 95)"/>
        <rect x="176" y="90" width="44" height="10" rx="5" fill="#c8845a" transform="rotate(10 198 95)"/>
        {/* Pencil in hand */}
        <motion.g
          animate={phase === 'drawing'
            ? { rotate: [-8, 8, -8], x: [-4, 4, -4] }
            : { rotate: 0, x: 0 }}
          transition={{ repeat: Infinity, duration: 0.35, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 118px' }}
        >
          <rect x="88" y="108" width="5" height="24" rx="2" fill="#f0c060" transform="rotate(-20 90 120)"/>
          <polygon points="86,128 91,128 88.5,135" fill="#c8845a" transform="rotate(-20 90 120)"/>
        </motion.g>

        {/* Crumpled papers on floor */}
        {[{x:30,y:170},{x:55,y:175},{x:245,y:168},{x:230,y:178}].map((p,i) => (
          <motion.ellipse key={i} cx={p.x} cy={p.y} rx={10+i*2} ry={7}
            fill="#fdf4e3" opacity="0.4"
            animate={{ rotate: [-3,3,-3] }} transition={{ repeat:Infinity, duration: 2+i*0.4 }}/>
        ))}

        {/* Google search bubble */}
        <AnimatePresence>
          {phase === 'drawing' && (
            <motion.g
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: [0,1,1,0] }}
              transition={{ delay: 2.5, duration: 4, times: [0,0.1,0.8,1] }}>
              <rect x="14" y="10" width="130" height="22" rx="6" fill="rgba(5,8,16,0.85)" stroke="rgba(240,192,96,0.3)" strokeWidth="1"/>
              <text x="22" y="25" fontSize="8.5" fill="#f0c060" style={{ fontFamily: 'var(--font-syne-mono)' }}>
                🔍 "how to draw glasses on face"
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

// ── Build-up text sequence before sketch ────────────────────────────────────
const BUILD_UP = [
  { text: 'Two days.', sub: null,                                     delay: 0    },
  { text: 'Four drafts.',  sub: null,                                 delay: 2800 },
  { text: 'Three Google searches.',  sub: '"how to draw a nose"',     delay: 5600 },
  { text: 'One "how to draw glasses on a person".',  sub: 'at 2am.', delay: 8800 },
  { text: "The pig's official review:",  sub: "\"It's... present on the page.\"", delay: 12200 },
  { text: 'Here it is.',  sub: 'be nice.',                            delay: 15800 },
];

// ── Main scene ────────────────────────────────────────────────────────────────
export default function SketchReveal({ onComplete }: SketchRevealProps) {
  const [buildIdx,   setBuildIdx]   = useState(-1);
  const [showDesk,   setShowDesk]   = useState(false);
  const [showSketch, setShowSketch] = useState(false);
  const [showTitle,  setShowTitle]  = useState(false);
  const [showDl,     setShowDl]     = useState(false);
  const [exiting,    setExiting]    = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const T: ReturnType<typeof setTimeout>[] = [];
    T.push(setTimeout(() => setShowDesk(true),   400));

    BUILD_UP.forEach((b, i) => {
      T.push(setTimeout(() => setBuildIdx(i), b.delay + 2000));
    });

    T.push(setTimeout(() => {
      setShowDesk(false);
      setTimeout(() => setShowSketch(true), 800);
    }, 19000));

    T.push(setTimeout(() => setShowTitle(true),  21000));
    T.push(setTimeout(() => setShowDl(true),     24000));
    T.push(setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 1200);
    }, 36000));

    return () => T.forEach(clearTimeout);
  }, [onComplete]);

  // Download handler — teasing
  const [dlClicked, setDlClicked] = useState(false);
  const [dlPhase,   setDlPhase]   = useState(0);
  const handleDownload = () => {
    if (dlPhase === 0) {
      setDlClicked(true);
      setDlPhase(1);
      setTimeout(() => setDlPhase(2), 2000);
      setTimeout(() => setDlPhase(3), 4200);
      return;
    }
    if (dlPhase === 3) {
      // Actually download
      const a = document.createElement('a');
      a.href = '/sketch.png';
      a.download = 'krishanu-drew-this-for-you.png';
      a.click();
      setDlPhase(4);
    }
  };

  const dlLabels = [
    'download the sketch',
    'are you sure? he worked very hard.',
    '...he googled "how to draw" twice.',
    'fine. here you go. 🎁',
    '✓ saved. please appreciate it.',
  ];

  const currentBuild = BUILD_UP[buildIdx];

  return (
    <motion.div className="scene" style={{ background: '#050810' }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 1.5 }}>
      <StarField count={200} shooting zIndex={0} />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 50% at 50% 55%, rgba(196,122,138,0.05) 0%, rgba(232,115,58,0.04) 40%, transparent 70%)',
        zIndex: 1,
      }}/>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-8 w-full max-w-lg">

        {/* ── Desk scene + build-up text ── */}
        <AnimatePresence mode="wait">
          {showDesk && (
            <motion.div key="desk" className="flex flex-col items-center gap-5 w-full"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.8 }}>

              <SketchingDesk phase="drawing" />

              {/* Build-up text */}
              <div className="text-center min-h-[72px] flex flex-col items-center justify-center gap-1.5">
                <AnimatePresence mode="wait">
                  {currentBuild && (
                    <motion.div key={buildIdx}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5 }}>
                      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.3rem,4vw,1.8rem)',
                        color: '#fdf4e3', fontWeight: 300 }}>
                        {currentBuild.text}
                      </p>
                      {currentBuild.sub && (
                        <p style={{ fontFamily: 'var(--font-syne-mono)', fontSize: 12,
                          color: 'rgba(196,122,138,0.7)', marginTop: 4 }}>
                          {currentBuild.sub}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Sketch reveal ── */}
          {showSketch && (
            <motion.div key="sketch" className="flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

              {/* Glow rings */}
              {[0,1,2].map(i => (
                <motion.div key={i} className="absolute rounded-2xl pointer-events-none"
                  style={{ inset: -16 - i * 12, zIndex: -1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.12, 1.25] }}
                  transition={{ duration: 2.5, delay: i * 0.3 }}
                >
                  <div className="w-full h-full rounded-2xl" style={{
                    background: 'radial-gradient(ellipse, rgba(240,192,96,0.25) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                  }}/>
                </motion.div>
              ))}

              {/* Continuous pulse */}
              <motion.div className="absolute -inset-3 rounded-2xl pointer-events-none" style={{ zIndex: -1 }}
                animate={{ opacity: [0.12, 0.35, 0.12] }} transition={{ repeat: Infinity, duration: 3 }}>
                <div className="w-full h-full rounded-2xl" style={{
                  background: 'radial-gradient(ellipse, rgba(240,192,96,0.2) 0%, transparent 65%)',
                  filter: 'blur(16px)',
                }}/>
              </motion.div>

              {/* The sketch image */}
              <motion.div className="rounded-xl overflow-hidden relative"
                initial={{ scale: 0.9, filter: 'brightness(0) blur(16px)' }}
                animate={{ scale: 1, filter: 'brightness(1.04) blur(0px) sepia(0.12)' }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                style={{ boxShadow: '0 0 60px rgba(240,192,96,0.2), 0 30px 80px rgba(0,0,0,0.6)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imgRef} src="/sketch.png" alt="Krishanu's sketch"
                  style={{ width: '100%', maxWidth: 380, height: 'auto', display: 'block' }}
                />
                {/* Signature overlay */}
                <motion.div className="absolute top-3 right-4"
                  style={{ fontFamily: 'var(--font-caveat)', fontSize: 18, color: 'rgba(240,192,96,0.55)',
                    textShadow: '0 0 10px rgba(240,192,96,0.3)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  Krishanu ✦
                </motion.div>
              </motion.div>

              {/* Title */}
              <AnimatePresence>
                {showTitle && (
                  <motion.div className="text-center space-y-2"
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <p className="text-xs tracking-[0.45em] uppercase"
                      style={{ color: 'rgba(240,192,96,0.45)', fontFamily: 'var(--font-dm-sans)' }}>
                      from his universe to yours
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-0.5">
                      {'Happy Birthday, Riya.'.split('').map((ch, i) => (
                        <motion.span key={i}
                          className={`text-4xl md:text-5xl font-light ${ch === ' ' ? 'mx-1.5' : ''}`}
                          style={{ fontFamily: 'var(--font-cormorant)', color: '#f0c060',
                            textShadow: '0 0 30px rgba(240,192,96,0.6)' }}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}>
                          {ch}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Download button — teasing */}
              <AnimatePresence>
                {showDl && (
                  <motion.div className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <motion.button
                      onClick={handleDownload}
                      disabled={dlPhase === 4}
                      className="relative px-6 py-2.5 rounded-full text-xs tracking-wider overflow-hidden"
                      style={{
                        border: `1px solid ${dlPhase >= 2 ? 'rgba(196,122,138,0.5)' : 'rgba(240,192,96,0.35)'}`,
                        color: dlPhase >= 2 ? '#c47a8a' : '#f0c060',
                        fontFamily: 'var(--font-dm-sans)',
                        background: 'rgba(5,8,16,0.7)',
                        cursor: dlPhase === 4 ? 'default' : 'pointer',
                        minWidth: 220,
                      }}
                      whileHover={dlPhase < 4 ? { scale: 1.04 } : {}}
                      whileTap={dlPhase < 4 ? { scale: 0.96 } : {}}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span key={dlPhase}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
                          className="block">
                          {dlLabels[Math.min(dlPhase, dlLabels.length - 1)]}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                    {dlPhase === 1 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ fontSize: 10, color: 'rgba(253,244,227,0.3)', fontFamily: 'var(--font-dm-sans)' }}>
                        (he spent 2 days on this. just so you know.)
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
