'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../StarField';
import { useCursor } from '@/hooks/useCursor';

interface PigRoastProps {
  onComplete: () => void;
}

type Expr = 'idle' | 'gasp' | 'serious' | 'sheepish';

type Line = {
  text: string;
  expr: Expr;
  narrator?: boolean;
  // interactive = wait for tap before showing next line
  interactive?: boolean;
  // prompt = text shown on the tap button
  prompt?: string;
};

const SCRIPT: Line[] = [
  { text: '*squints through tiny round spectacles*',             expr: 'idle',     narrator: true  },
  { text: 'Arey… wait a minute.',                               expr: 'gasp',     interactive: true, prompt: 'what now?' },
  { text: '*waddles dramatically closer*',                       expr: 'idle',     narrator: true  },
  { text: 'Oh beta. OH BETA.',                                  expr: 'gasp',     interactive: true, prompt: 'go on…' },
  { text: "You've become MOTU!",                                expr: 'gasp',     interactive: true, prompt: 'EXCUSE ME??' },
  { text: '*wheeze laugh* *wheeze laugh*',                      expr: 'idle',     narrator: true  },
  { text: "I'm joking. You're just pleasantly… round.",        expr: 'sheepish', interactive: true, prompt: '…continue.' },
  { text: "Like a warm chapati. Wholesome.",                    expr: 'sheepish', interactive: true, prompt: 'that\'s better?' },
  { text: "...filled with ghee.",                               expr: 'gasp',     interactive: true, prompt: 'PIG!!!' },
  { text: '*wheeze* *wheeze*',                                  expr: 'idle',     narrator: true  },
  { text: "*whispers* We both are. I'm literally a pig.",       expr: 'sheepish', interactive: true, prompt: 'fair enough.' },
  { text: "And that one grey hair? That's WISDOM.",             expr: 'idle',     interactive: true, prompt: 'sure it is.' },
  { text: 'Or stress. Probably stress. From dealing with Krishanu.', expr: 'gasp', interactive: true, prompt: 'accurate.' },
  { text: 'I counted — he\'s the reason for at least 3 of them.',  expr: 'gasp', interactive: true, prompt: '😭' },
  { text: '*clears throat very dramatically*',                  expr: 'serious',  narrator: true  },
  { text: 'But I was sent here for a reason.',                  expr: 'serious',  interactive: true, prompt: 'okay okay' },
  { text: 'Not to roast you — though I clearly excel at it.',  expr: 'idle',     interactive: true, prompt: 'clearly.' },
  { text: 'Follow me.',                                         expr: 'serious',  interactive: true, prompt: '→ let\'s go' },
];

// ── Typewriter ──────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 44) {
  const [shown, setShown] = useState('');
  const [done, setDone]   = useState(false);
  useEffect(() => {
    setShown(''); setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) { setDone(true); clearInterval(id); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { shown, done };
}

// ── Idle probe ──────────────────────────────────────────────────────────────
const IDLE_QUIPS = [
  '...you still there?',
  '*taps foot*',
  'hello? anyone home?',
  'I can wait. I have hooves and time.',
  'okay I\'m starting to feel judged.',
];

// ── Eye tracking pig ────────────────────────────────────────────────────────
function PigWithEyes({ expr, cursorX, cursorY }: { expr: Expr; cursorX: number; cursorY: number }) {
  // Eye offset — max 3px tracking
  const ox = (cursorX - 0.5) * 6;
  const oy = (cursorY - 0.5) * 4;

  return (
    <motion.div
      animate={
        expr === 'gasp'    ? { scale: [1, 1.08, 1], y: [0, -6, 0] } :
        expr === 'serious' ? {} :
        { rotate: [-4, 4, -4], y: [0, -4, 0] }
      }
      transition={
        expr === 'gasp'
          ? { repeat: Infinity, duration: 0.42 }
          : expr !== 'serious'
          ? { repeat: Infinity, duration: 0.72, ease: 'easeInOut' }
          : {}
      }
    >
      <svg width="160" height="184" viewBox="0 0 120 138">
        <ellipse cx="60" cy="85" rx="38" ry="36" fill="#f4a7b9"/>
        <ellipse cx="60" cy="90" rx="22" ry="20" fill="#fdd5e1"/>
        <ellipse cx="60" cy="52" rx="34" ry="30" fill="#f4a7b9"/>

        {/* Gandhi glasses */}
        <circle cx="48" cy="54" r="9" fill="none" stroke="#2a1800" strokeWidth="2.2"/>
        <circle cx="72" cy="54" r="9" fill="none" stroke="#2a1800" strokeWidth="2.2"/>
        <line x1="57" y1="54" x2="63" y2="54" stroke="#2a1800" strokeWidth="2"/>
        <line x1="38.5" y1="51.5" x2="33" y2="49" stroke="#2a1800" strokeWidth="1.5"/>
        <line x1="81.5" y1="51.5" x2="87" y2="49" stroke="#2a1800" strokeWidth="1.5"/>

        {/* Eye whites */}
        <ellipse cx="48" cy="54" rx="7" ry="7" fill="rgba(255,255,255,0.15)"/>
        <ellipse cx="72" cy="54" rx="7" ry="7" fill="rgba(255,255,255,0.15)"/>

        {/* Pupils — tracked */}
        <motion.g animate={{ x: ox, y: oy }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <motion.ellipse cx="48" cy="54" rx="4.5" ry="4.5" fill="#120800"
            animate={{ scaleY: expr === 'gasp' ? 1.6 : expr === 'serious' ? 0.5 : 1 }} transition={{ duration: 0.2 }}/>
          <motion.ellipse cx="72" cy="54" rx="4.5" ry="4.5" fill="#120800"
            animate={{ scaleY: expr === 'gasp' ? 1.6 : expr === 'serious' ? 0.5 : 1 }} transition={{ duration: 0.2 }}/>
          <circle cx="49.8" cy="52.5" r="1.4" fill="white" opacity="0.9"/>
          <circle cx="73.8" cy="52.5" r="1.4" fill="white" opacity="0.9"/>
        </motion.g>

        {/* Snout */}
        <ellipse cx="60" cy="65" rx="13" ry="9" fill="#e8899a"/>
        <circle cx="55" cy="65" r="3.5" fill="#c06077"/><circle cx="65" cy="65" r="3.5" fill="#c06077"/>

        {/* Mouth */}
        {expr === 'gasp'     && <ellipse cx="60" cy="75" rx="7" ry="5.5" fill="#c06077"/>}
        {expr === 'serious'  && <line x1="51" y1="73" x2="69" y2="73" stroke="#c06077" strokeWidth="2.2" strokeLinecap="round"/>}
        {expr === 'sheepish' && <path d="M52 72 Q60 79 68 72" fill="none" stroke="#c06077" strokeWidth="2.2" strokeLinecap="round"/>}
        {expr === 'idle'     && <path d="M52 72 Q60 77 68 72" fill="none" stroke="#c06077" strokeWidth="2.2" strokeLinecap="round"/>}

        {/* Ears */}
        <ellipse cx="31" cy="35" rx="11" ry="14" fill="#f4a7b9"/>
        <ellipse cx="31" cy="35" rx="6" ry="9" fill="#e8899a"/>
        <ellipse cx="89" cy="35" rx="11" ry="14" fill="#f4a7b9"/>
        <ellipse cx="89" cy="35" rx="6" ry="9" fill="#e8899a"/>

        {/* Blush */}
        <ellipse cx="37" cy="63" rx="7.5" ry="5" fill="#ff8fab" opacity="0.3"/>
        <ellipse cx="83" cy="63" rx="7.5" ry="5" fill="#ff8fab" opacity="0.3"/>

        {/* Crossed arms when gasp */}
        {expr === 'gasp' && (
          <g>
            <path d="M22 100 Q40 90 58 98" fill="none" stroke="#f4a7b9" strokeWidth="8" strokeLinecap="round"/>
            <path d="M98 100 Q80 90 62 98" fill="none" stroke="#f4a7b9" strokeWidth="8" strokeLinecap="round"/>
          </g>
        )}
        {expr !== 'gasp' && (
          <>
            <rect x="37" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>
            <rect x="69" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>
          </>
        )}

        {/* Gasp sparks */}
        {expr === 'gasp' && <>
          <motion.line x1="18" y1="43" x2="8" y2="36" stroke="#f0c060" strokeWidth="2"
            animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.4 }}/>
          <motion.line x1="16" y1="55" x2="4" y2="52" stroke="#f0c060" strokeWidth="2"
            animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }}/>
          <motion.line x1="102" y1="43" x2="112" y2="36" stroke="#f0c060" strokeWidth="2"
            animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.05 }}/>
          <motion.line x1="104" y1="55" x2="116" y2="52" stroke="#f0c060" strokeWidth="2"
            animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.15 }}/>
        </>}
      </svg>
    </motion.div>
  );
}

// ── Main scene ───────────────────────────────────────────────────────────────
export default function PigRoast({ onComplete }: PigRoastProps) {
  const cursor   = useCursor();
  const [lineIdx, setLineIdx]     = useState(0);
  const [waiting, setWaiting]     = useState(false); // waiting for tap
  const [exiting, setExiting]     = useState(false);
  const [idleQuip, setIdleQuip]   = useState<string | null>(null);
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCount  = useRef(0);

  const current = SCRIPT[lineIdx];

  // Auto-advance non-interactive lines after typewriter finishes
  const advance = () => {
    if (lineIdx >= SCRIPT.length - 1) {
      setExiting(true);
      setTimeout(onComplete, 900);
      return;
    }
    const next = lineIdx + 1;
    setLineIdx(next);
    setWaiting(!!SCRIPT[next]?.interactive);
    setIdleQuip(null);
    resetIdleTimer();
  };

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setIdleQuip(IDLE_QUIPS[idleCount.current % IDLE_QUIPS.length]);
      idleCount.current++;
      idleTimer.current = setTimeout(() => setIdleQuip(null), 2500);
    }, 3200);
  };

  // On tap — advance if waiting
  const handleTap = () => {
    if (!waiting) return;
    setWaiting(false);
    advance();
  };

  // Auto-advance narrator / non-interactive lines
  useEffect(() => {
    if (!current) return;
    if (!current.interactive) {
      const delay = current.narrator ? current.text.length * 28 + 1200 : current.text.length * 44 + 1600;
      const t = setTimeout(advance, delay);
      return () => clearTimeout(t);
    } else {
      resetIdleTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIdx]);

  useEffect(() => () => { if (idleTimer.current) clearTimeout(idleTimer.current); }, []);

  const prevLine = lineIdx > 0 ? SCRIPT[lineIdx - 1] : null;

  return (
    <motion.div
      className="scene"
      style={{ background: '#050810', cursor: waiting ? 'pointer' : 'default' }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.9 }}
      onClick={handleTap}
    >
      <StarField count={150} zIndex={0} />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 38% at 50% 78%, rgba(232,115,58,0.07) 0%, transparent 70%)',
        zIndex: 1,
      }}/>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-xl w-full">

        {/* Pig with eye tracking */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <PigWithEyes expr={current?.expr ?? 'idle'} cursorX={cursor.x} cursorY={cursor.y} />
        </motion.div>

        {/* Idle quip */}
        <AnimatePresence>
          {idleQuip && (
            <motion.div
              className="absolute rounded-2xl px-4 py-2 text-xs"
              style={{
                top: '12%', left: '55%',
                background: 'rgba(5,8,16,0.85)',
                border: '1px solid rgba(240,192,96,0.25)',
                color: '#f0c060',
                fontFamily: 'var(--font-syne-mono)',
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {idleQuip}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous line ghost — single, well separated */}
        {prevLine && (
          <motion.p
            key={`ghost-${lineIdx}`}
            className="text-center text-xs pointer-events-none"
            style={{
              color: prevLine.narrator ? 'rgba(196,122,138,0.2)' : 'rgba(253,244,227,0.15)',
              fontFamily: 'var(--font-syne-mono)',
            }}
            initial={{ opacity: 0.25 }} animate={{ opacity: 0.15 }} transition={{ duration: 0.8 }}
          >
            {prevLine.text}
          </motion.p>
        )}

        {/* Current bubble */}
        <div className="w-full min-h-[90px] flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            <TypeBubble key={lineIdx} line={current} onTyped={() => {
              if (!current?.interactive) return; // auto-handled above
              setWaiting(true);
              resetIdleTimer();
            }} />
          </AnimatePresence>

          {/* Tap prompt */}
          <AnimatePresence>
            {waiting && current?.prompt && (
              <motion.button
                className="px-5 py-2 rounded-full text-xs tracking-wider pointer-events-auto"
                style={{
                  border: '1px solid rgba(240,192,96,0.4)',
                  color: '#f0c060',
                  fontFamily: 'var(--font-dm-sans)',
                  background: 'rgba(5,8,16,0.7)',
                  cursor: 'pointer',
                }}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.06, background: 'rgba(240,192,96,0.1)' }}
                whileTap={{ scale: 0.94 }}
                onClick={(e) => { e.stopPropagation(); handleTap(); }}
              >
                {current.prompt}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-30" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${(lineIdx / (SCRIPT.length - 1)) * 100}%`, background: 'linear-gradient(90deg, #e8733a, #f0c060)' }}/>
      </div>
    </motion.div>
  );
}

// ── Bubble with typewriter + onTyped callback ────────────────────────────────
function TypeBubble({ line, onTyped }: { line: Line; onTyped: () => void }) {
  const { shown, done } = useTypewriter(line.text, line.narrator ? 28 : 44);

  useEffect(() => {
    if (done) onTyped();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.38 }}
      className="w-full max-w-lg rounded-2xl px-6 py-4 text-center"
      style={line.narrator ? {
        color: 'rgba(196,122,138,0.65)',
        fontFamily: 'var(--font-syne-mono)',
        fontSize: 12,
        fontStyle: 'italic',
      } : {
        background: 'rgba(5,8,16,0.88)',
        border: `1px solid ${line.expr === 'serious' ? 'rgba(240,192,96,0.35)' : 'rgba(253,244,227,0.1)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {!line.narrator && (
        <p className="text-[10px] tracking-[0.35em] uppercase mb-2 opacity-45"
          style={{ color: '#f0c060', fontFamily: 'var(--font-dm-sans)' }}>
          🐷 &nbsp;pig says
        </p>
      )}
      <p className={!done ? 'cursor' : ''}
        style={{
          fontFamily: 'var(--font-syne-mono)',
          fontSize: line.narrator ? 12 : 15,
          color: line.narrator ? undefined : line.expr === 'serious' ? '#f0c060' : '#fdf4e3',
          lineHeight: 1.65,
        }}>
        {shown}
      </p>
    </motion.div>
  );
}
