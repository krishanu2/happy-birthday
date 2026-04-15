'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import StarField from '../StarField';

interface PlanetJourneyProps {
  onComplete: () => void;
}

const WORLD_W   = 4200;   // total world scroll distance
const PIG_X_PCT = 0.32;   // pig sits at 32% from left of viewport

// ── Points of interest — triggered at these world positions ─────────────────
const POIS = [
  { at: 400,  icon: '✦', label: 'Constellation of First Moments', color: '#f0c060' },
  { at: 1100, icon: '✧', label: 'The Laughter Nebula',            color: '#c47a8a' },
  { at: 1900, icon: '🌿', label: 'Memory Meadows',                 color: '#7db894' },
  { at: 2800, icon: '✦', label: 'The Cozy House',                  color: '#e8733a' },
];

// ── Lantern ──────────────────────────────────────────────────────────────────
function Lantern({ worldX, delay, size = 1 }: { worldX: number; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left:    worldX,
        bottom:  `${38 + Math.sin(worldX * 0.01) * 12}%`,
      }}
      animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4], opacity: [0.55, 1, 0.55] }}
      transition={{ repeat: Infinity, duration: 3.5 + delay * 0.6, delay, ease: 'easeInOut' }}
    >
      <svg width={22 * size} height={34 * size} viewBox="0 0 22 34">
        <rect x="7" y="1" width="8" height="5" rx="2" fill="#8b5e0a" opacity="0.9"/>
        <ellipse cx="11" cy="20" rx="9" ry="13" fill="#e8733a" opacity="0.75"/>
        <ellipse cx="11" cy="20" rx="5.5" ry="8" fill="#f0c060" opacity="0.55"/>
        <line x1="11" y1="1" x2="11" y2="0" stroke="#8b5e0a" strokeWidth="1.5"/>
        <ellipse cx="11" cy="31.5" rx="4" ry="2" fill="#7b4a00" opacity="0.65"/>
      </svg>
    </motion.div>
  );
}

// ── Tree ─────────────────────────────────────────────────────────────────────
function Tree({ worldX, h = 55 }: { worldX: number; h?: number }) {
  return (
    <div className="absolute" style={{ left: worldX, bottom: '29%' }}>
      <motion.div
        animate={{ rotate: [-1.5, 1.5, -1.5], transformOrigin: 'bottom center' }}
        transition={{ repeat: Infinity, duration: 3 + (worldX % 4) * 0.5, ease: 'easeInOut' }}
      >
        <svg width="28" height={h} viewBox={`0 0 28 ${h}`}>
          <ellipse cx="14" cy={h * 0.38} rx="13" ry={h * 0.42} fill="#4a7a5a" opacity="0.75"/>
          <ellipse cx="14" cy={h * 0.28} rx="9"  ry={h * 0.3}  fill="#5a9a6a" opacity="0.6"/>
          <rect   x="11" y={h * 0.72} width="6" height={h * 0.28} rx="2" fill="#3a5a2a" opacity="0.8"/>
        </svg>
      </motion.div>
    </div>
  );
}

// ── Rock ─────────────────────────────────────────────────────────────────────
// ── "RIYA" written in stars ──────────────────────────────────────────────────
// Each letter is defined as star positions, connected by lines
const RIYA_STARS: Record<string, [number, number][]> = {
  R: [[0,0],[0,40],[0,20],[18,20],[22,10],[18,20],[22,40]],
  I: [[10,0],[10,40]],
  Y: [[0,0],[10,18],[20,0],[10,18],[10,40]],
  A: [[10,0],[0,40],[10,0],[20,40],[5,25],[15,25]],
};

function RiyaConstellation({ worldX }: { worldX: number }) {
  const letters = ['R','I','Y','A'];
  const letterWidth = 38;
  const spacing = 12;

  return (
    <div className="absolute pointer-events-none" style={{ left: worldX, top: '6%' }}>
      <svg width={letters.length * (letterWidth + spacing)} height={60} viewBox={`0 0 ${letters.length * (letterWidth + spacing)} 60`}>
        {letters.map((letter, li) => {
          const pts = RIYA_STARS[letter];
          const ox  = li * (letterWidth + spacing);
          // draw lines between consecutive points
          return (
            <g key={letter}>
              {pts.slice(1).map(([px, py], i) => {
                const [x1, y1] = pts[i];
                // Only draw if consecutive (skip jumps — signalled by matching x)
                const isJump = Math.abs(px - x1) > 15 || Math.abs(py - y1) > 22;
                if (isJump) return null;
                return (
                  <motion.line key={i}
                    x1={x1 + ox + 8} y1={y1 + 5} x2={px + ox + 8} y2={py + 5}
                    stroke="rgba(240,192,96,0.35)" strokeWidth="0.8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: li * 0.4 + i * 0.12, duration: 0.5 }}
                  />
                );
              })}
              {pts.map(([px, py], i) => (
                <motion.circle key={i}
                  cx={px + ox + 8} cy={py + 5} r={2.2}
                  fill="#fffde8"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
                  transition={{
                    opacity: { repeat: Infinity, duration: 2.5 + i * 0.3 },
                    scale:   { delay: li * 0.4 + i * 0.1, duration: 0.4 },
                  }}
                />
              ))}
            </g>
          );
        })}
        {/* Label below */}
        <motion.text
          x={(letters.length * (letterWidth + spacing)) / 2} y={58}
          textAnchor="middle" fontSize="8" fill="rgba(240,192,96,0.5)"
          style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.3em' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        >
          RIYA
        </motion.text>
      </svg>
    </div>
  );
}

function Rock({ worldX }: { worldX: number }) {
  return (
    <div className="absolute" style={{ left: worldX, bottom: '28%' }}>
      <svg width="32" height="20" viewBox="0 0 32 20">
        <ellipse cx="16" cy="14" rx="15" ry="10" fill="#3a2810" opacity="0.7"/>
        <ellipse cx="14" cy="12" rx="11" ry="7"  fill="#5a3e1e" opacity="0.6"/>
        <ellipse cx="11" cy="10" rx="5"  ry="3"  fill="#7a5a2e" opacity="0.3"/>
      </svg>
    </div>
  );
}

// ── Walking pig ──────────────────────────────────────────────────────────────
function WalkingPig({ speed }: { speed: number }) {
  // Legs alternate faster at higher speed
  const dur = Math.max(0.3, 0.7 - speed * 0.4);
  return (
    <motion.div
      animate={{ rotate: [-4, 4, -4], y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: dur, ease: 'easeInOut' }}
    >
      <svg width="76" height="88" viewBox="0 0 120 138">
        <ellipse cx="60" cy="85" rx="38" ry="36" fill="#f4a7b9"/>
        <ellipse cx="60" cy="90" rx="22" ry="20" fill="#fdd5e1"/>
        <ellipse cx="60" cy="52" rx="34" ry="30" fill="#f4a7b9"/>
        <circle cx="48" cy="54" r="9" fill="none" stroke="#2a1800" strokeWidth="2"/>
        <circle cx="72" cy="54" r="9" fill="none" stroke="#2a1800" strokeWidth="2"/>
        <line x1="57" y1="54" x2="63" y2="54" stroke="#2a1800" strokeWidth="2"/>
        <line x1="38.5" y1="51.5" x2="33" y2="49" stroke="#2a1800" strokeWidth="1.5"/>
        <line x1="81.5" y1="51.5" x2="87" y2="49" stroke="#2a1800" strokeWidth="1.5"/>
        <ellipse cx="48" cy="54" rx="4" ry="4" fill="#120800"/>
        <ellipse cx="72" cy="54" rx="4" ry="4" fill="#120800"/>
        <circle cx="49.5" cy="52.5" r="1.2" fill="white"/>
        <circle cx="73.5" cy="52.5" r="1.2" fill="white"/>
        <ellipse cx="60" cy="65" rx="13" ry="9" fill="#e8899a"/>
        <circle cx="55" cy="65" r="3.2" fill="#c06077"/>
        <circle cx="65" cy="65" r="3.2" fill="#c06077"/>
        <path d="M52 72 Q60 78 68 72" fill="none" stroke="#c06077" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="31" cy="35" rx="11" ry="14" fill="#f4a7b9"/>
        <ellipse cx="89" cy="35" rx="11" ry="14" fill="#f4a7b9"/>
        <ellipse cx="38" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.3"/>
        <ellipse cx="82" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.3"/>
        {/* Alternating legs */}
        <motion.rect x="35" y="116" width="14" height="18" rx="7" fill="#f4a7b9"
          animate={{ rotate: [-18, 18, -18], transformOrigin: '42px 116px' }}
          transition={{ repeat: Infinity, duration: dur }}/>
        <motion.rect x="71" y="116" width="14" height="18" rx="7" fill="#f4a7b9"
          animate={{ rotate: [18, -18, 18], transformOrigin: '78px 116px' }}
          transition={{ repeat: Infinity, duration: dur }}/>
      </svg>
    </motion.div>
  );
}

// ── POI popup ────────────────────────────────────────────────────────────────
function PoiPopup({ poi, onDismiss }: { poi: typeof POIS[0]; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      className="absolute left-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
      style={{ top: '14%', translateX: '-50%' }}
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.span
        className="text-3xl"
        animate={{ y: [-4, 4, -4], rotate: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >{poi.icon}</motion.span>
      <div
        className="rounded-xl px-4 py-2 text-sm text-center"
        style={{
          background: 'rgba(5,8,16,0.82)',
          border: `1px solid ${poi.color}55`,
          color: poi.color,
          fontFamily: 'var(--font-cormorant)',
          fontSize: 18,
          boxShadow: `0 0 24px ${poi.color}22`,
        }}
      >
        {poi.label}
      </div>
    </motion.div>
  );
}

// ── Main scene ───────────────────────────────────────────────────────────────
export default function PlanetJourney({ onComplete }: PlanetJourneyProps) {
  const worldX       = useMotionValue(0);            // world scroll position
  const springX      = useSpring(worldX, { damping: 28, stiffness: 180 });
  const [pos, setPos]       = useState(0);           // raw position for logic
  const [activePoi, setActivePoi] = useState<typeof POIS[0] | null>(null);
  const [seenPois, setSeenPois]   = useState<Set<number>>(new Set());
  const [speed, setSpeed]         = useState(0);
  const [holding, setHolding]     = useState(false);
  const [done, setDone]           = useState(false);
  const rafRef   = useRef<number>(0);
  const posRef   = useRef(0);
  const holdRef  = useRef(false);
  const doneRef  = useRef(false);

  // Base auto-walk speed (px/frame) — user holding speeds it up
  const BASE_SPEED   = 1.4;
  const BOOST_SPEED  = 4.2;

  const tick = useCallback(() => {
    if (doneRef.current) return;
    const spd = holdRef.current ? BOOST_SPEED : BASE_SPEED;
    setSpeed(holdRef.current ? 1 : 0);
    posRef.current = Math.min(posRef.current + spd, WORLD_W);
    worldX.set(-posRef.current);
    setPos(posRef.current);

    // Check POIs
    POIS.forEach((p, i) => {
      if (!seenPois.has(i) && posRef.current >= p.at && posRef.current < p.at + 60) {
        setSeenPois(prev => new Set([...prev, i]));
        setActivePoi(p);
      }
    });

    if (posRef.current >= WORLD_W) {
      doneRef.current = true;
      setDone(true);
      setTimeout(onComplete, 1200);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete, worldX]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const startHold = () => { holdRef.current = true;  setHolding(true);  };
  const stopHold  = () => { holdRef.current = false; setHolding(false); };

  const progress = Math.min(pos / WORLD_W, 1);

  // Parallax layer offsets derived from world position
  const bgOff  = useTransform(springX, v => v * 0.12);  // stars: barely move
  const midOff = useTransform(springX, v => v * 0.45);  // planet surface
  const fgOff  = useTransform(springX, v => v * 0.80);  // trees / lanterns

  // Lantern positions in world space
  const lanterns = [300,600,950,1350,1700,2050,2450,2820,3200,3600,3950].map((x, i) => ({
    worldX: x, delay: i * 0.3, size: 0.85 + (i % 3) * 0.15,
  }));
  const trees = [180,460,730,1050,1320,1600,1880,2200,2500,2800,3100,3450,3750].map((x, i) => ({
    worldX: x, h: 45 + (i % 4) * 14,
  }));
  const rocks = [280,620,1100,1540,2100,2620,3050,3500].map(x => ({ worldX: x }));

  return (
    <motion.div
      className="scene select-none"
      style={{ background: '#050810', overflow: 'hidden' }}
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.2 }}
      onPointerDown={startHold}
      onPointerUp={stopHold}
      onPointerLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
    >
      {/* ── Layer 0: Deep stars — move at 0.12x (barely) ── */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bgOff, zIndex: 0 }}
      >
        <div style={{ width: WORLD_W + 1200, height: '100%' }}>
          <StarField count={260} driftSpeed={0.04} zIndex={0} />
        </div>
      </motion.div>

      {/* Nebula wash — fixed */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(125,184,148,0.04) 0%, transparent 70%)',
        zIndex: 1,
      }}/>

      {/* ── Layer 1: Ground — moves at midOff (0.45x) ── */}
      <motion.div
        className="absolute"
        style={{ x: midOff, bottom: 0, left: 0, zIndex: 2, width: WORLD_W + 1000, height: '100%' }}
      >
        {/* Ground strip */}
        <div
          className="absolute bottom-0 left-0"
          style={{
            width: WORLD_W + 1000,
            height: '32%',
            background: 'linear-gradient(to top, #3a1200 0%, #7b3200 28%, #b86030 55%, #d48050 72%, transparent 100%)',
          }}
        />
        {/* Subtle surface details — craters */}
        {[200,800,1400,2100,2700,3300].map((x, i) => (
          <div key={i} className="absolute" style={{ left: x, bottom: '30%' }}>
            <svg width={22 + (i%3)*10} height={8 + (i%2)*4} viewBox="0 0 30 10">
              <ellipse cx="15" cy="6" rx="14" ry="5" fill="none" stroke="rgba(90,40,10,0.5)" strokeWidth="1.5"/>
            </svg>
          </div>
        ))}
        {/* Fog wisps */}
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="absolute pointer-events-none"
            style={{ bottom: '29%', left: 0, width: '100%', height: 80 }}
            animate={{ opacity: [0.04, 0.1, 0.04], x: [0, 40, 0] }}
            transition={{ repeat: Infinity, duration: 12 + i * 4, delay: i * 3 }}>
            <div style={{ width: '100%', height: '100%',
              background: `radial-gradient(ellipse ${80 + i*10}% 100% at ${30 + i*20}% 60%, rgba(125,184,148,0.09) 0%, transparent 70%)` }}/>
          </motion.div>
        ))}

        {/* ── "RIYA" constellation — appears mid-journey ── */}
        <RiyaConstellation worldX={1600} />

        {/* Shooting nebula wisps (colourful) */}
        {[
          { x: 400,  col: 'rgba(196,122,138,0.12)', w: 320, top: '8%' },
          { x: 1200, col: 'rgba(125,184,148,0.10)', w: 260, top: '14%' },
          { x: 2200, col: 'rgba(240,192,96,0.08)',  w: 380, top: '6%' },
          { x: 3100, col: 'rgba(113,128,255,0.08)', w: 280, top: '11%' },
        ].map((n, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            left: n.x, top: n.top, width: n.w, height: 90,
            background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${n.col} 0%, transparent 75%)`,
            filter: 'blur(18px)',
          }}/>
        ))}
      </motion.div>

      {/* ── Layer 2: Trees, rocks, lanterns — foreground (0.80x) ── */}
      <motion.div
        className="absolute"
        style={{ x: fgOff, bottom: 0, left: 0, zIndex: 4, width: WORLD_W + 600, height: '100%' }}
      >
        {trees.map(   (t, i) => <Tree    key={i} worldX={t.worldX} h={t.h}   />)}
        {rocks.map(   (r, i) => <Rock    key={i} worldX={r.worldX}            />)}
        {lanterns.map((l, i) => <Lantern key={i} worldX={l.worldX} delay={l.delay} size={l.size}/>)}
      </motion.div>

      {/* ── Pig — fixed in viewport ── */}
      <div
        className="absolute z-10"
        style={{
          left:    `${PIG_X_PCT * 100}%`,
          bottom:  '29.5%',
          transform: 'translateX(-50%)',
        }}
      >
        <WalkingPig speed={speed} />
      </div>

      {/* ── Shadow under pig ── */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          left: `${PIG_X_PCT * 100}%`,
          bottom: '28.8%',
          transform: 'translateX(-50%)',
          width: 50, height: 8,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 75%)',
        }}
      />

      {/* ── POI popup ── */}
      <AnimatePresence>
        {activePoi && (
          <PoiPopup
            key={activePoi.label}
            poi={activePoi}
            onDismiss={() => setActivePoi(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Progress bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{ height: 3, background: 'rgba(255,255,255,0.04)' }}
      >
        <motion.div
          className="h-full"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #e8733a, #f0c060)',
            boxShadow: '0 0 8px rgba(240,192,96,0.6)',
          }}
        />
        {/* POI ticks on bar */}
        {POIS.map((p, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${(p.at / WORLD_W) * 100}%`,
              width: 5, height: 5,
              background: seenPois.has(i) ? p.color : 'rgba(255,255,255,0.2)',
              boxShadow: seenPois.has(i) ? `0 0 6px ${p.color}` : 'none',
              transition: 'background 0.4s',
            }}
          />
        ))}
      </div>

      {/* ── Hold-to-rush hint ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: holding ? 0 : 0.55 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="rounded-full px-5 py-2 text-xs tracking-[0.3em] uppercase flex items-center gap-2"
          style={{
            background: 'rgba(5,8,16,0.7)',
            border: '1px solid rgba(240,192,96,0.2)',
            color: '#f0c060',
            fontFamily: 'var(--font-dm-sans)',
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
        >
          <span>hold to rush</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7l5 5 5-5" stroke="#f0c060" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Hold boost glow ── */}
      <AnimatePresence>
        {holding && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'radial-gradient(ellipse 60% 30% at 32% 72%, rgba(232,115,58,0.08) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Caption ── */}
      <motion.p
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center whitespace-nowrap"
        style={{
          color: 'rgba(253,244,227,0.28)',
          fontFamily: 'var(--font-cormorant)',
          fontSize: 18,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        A tiny world, built just for you
      </motion.p>
    </motion.div>
  );
}
