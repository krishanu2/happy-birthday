'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../StarField';

interface KrishanusDoorProps {
  onComplete: () => void;
}

type PigExpr  = 'idle' | 'gasp' | 'serious' | 'sheepish';
type KExpr    = 'hidden' | 'peek' | 'sheepish' | 'scribble' | 'proud';

type Line = {
  speaker: 'pig' | 'krishanu' | 'narrator';
  text: string;
  pigExpr?: PigExpr;
  kExpr?: KExpr;
  delay: number;
  duration: number;
};

const SCRIPT: Line[] = [
  // ── Knock ──
  { speaker: 'narrator',  text: '*Pig approaches the door. Adjusts glasses. Knocks three times.*', pigExpr: 'idle',    kExpr: 'hidden',   delay: 0,     duration: 3000 },
  { speaker: 'pig',       text: 'Open up. This is important.',                                     pigExpr: 'serious', kExpr: 'hidden',   delay: 3000,  duration: 3000 },
  // ── Door opens ──
  { speaker: 'krishanu',  text: '...who is it?',                                                   pigExpr: 'idle',    kExpr: 'peek',     delay: 6000,  duration: 2600 },
  { speaker: 'pig',       text: 'Quick. What is today\'s date.',                                   pigExpr: 'serious', kExpr: 'peek',     delay: 8600,  duration: 3000 },
  { speaker: 'krishanu',  text: 'Uh... the... sixteenth?',                                        pigExpr: 'idle',    kExpr: 'sheepish', delay: 11600, duration: 2800 },
  { speaker: 'pig',       text: 'Of.',                                                             pigExpr: 'serious', kExpr: 'sheepish', delay: 14400, duration: 2200 },
  { speaker: 'krishanu',  text: '...April.',                                                       pigExpr: 'idle',    kExpr: 'sheepish', delay: 16600, duration: 2400 },
  { speaker: 'pig',       text: 'And April 16th is.',                                             pigExpr: 'serious', kExpr: 'sheepish', delay: 19000, duration: 2800 },
  // ── The pause ──
  { speaker: 'narrator',  text: '*a very long pause*',                                             pigExpr: 'idle',    kExpr: 'sheepish', delay: 21800, duration: 3200 },
  { speaker: 'krishanu',  text: '...Tax deadline?',                                               pigExpr: 'idle',    kExpr: 'sheepish', delay: 25000, duration: 2800 },
  // ── Pig explodes ──
  { speaker: 'narrator',  text: '*PIG GASPS SO HARD GLASSES FALL OFF*',                           pigExpr: 'gasp',    kExpr: 'sheepish', delay: 27800, duration: 2400 },
  { speaker: 'pig',       text: 'KRISHANU MAHAPATRA.',                                            pigExpr: 'gasp',    kExpr: 'sheepish', delay: 30200, duration: 2600 },
  { speaker: 'krishanu',  text: 'RIYA\'S BIRTHDAY! I KNEW THAT! I WAS TESTING YOU!',             pigExpr: 'gasp',    kExpr: 'peek',     delay: 32800, duration: 3600 },
  { speaker: 'pig',       text: 'You had to think about it.',                                     pigExpr: 'serious', kExpr: 'sheepish', delay: 36400, duration: 3000 },
  { speaker: 'krishanu',  text: 'I was... buffering.',                                            pigExpr: 'idle',    kExpr: 'sheepish', delay: 39400, duration: 2800 },
  { speaker: 'pig',       text: 'You were asleep.',                                               pigExpr: 'serious', kExpr: 'sheepish', delay: 42200, duration: 2600 },
  { speaker: 'krishanu',  text: 'I was RESTING MY EYES for CREATIVE PURPOSES.',                  pigExpr: 'idle',    kExpr: 'peek',     delay: 44800, duration: 3400 },
  // ── The roast ──
  { speaker: 'pig',       text: 'You have called her Motu.',                                     pigExpr: 'sheepish',kExpr: 'sheepish', delay: 48200, duration: 2800 },
  { speaker: 'krishanu',  text: 'It\'s... affectionate—',                                        pigExpr: 'idle',    kExpr: 'sheepish', delay: 51000, duration: 2400 },
  { speaker: 'pig',       text: 'Buddhi.',                                                        pigExpr: 'gasp',    kExpr: 'sheepish', delay: 53400, duration: 2000 },
  { speaker: 'krishanu',  text: 'That one is also—',                                             pigExpr: 'idle',    kExpr: 'sheepish', delay: 55400, duration: 2200 },
  { speaker: 'pig',       text: 'To her face. Multiple times.',                                  pigExpr: 'serious', kExpr: 'sheepish', delay: 57600, duration: 2800 },
  { speaker: 'krishanu',  text: '...she laughed.',                                               pigExpr: 'idle',    kExpr: 'sheepish', delay: 60400, duration: 2200 },
  { speaker: 'pig',       text: 'This is your only chance. Go. Make something. NOW.',            pigExpr: 'serious', kExpr: 'sheepish', delay: 62600, duration: 3400 },
  // ── Scribbling ──
  { speaker: 'narrator',  text: '*frantic pencil sounds from inside*',                            pigExpr: 'idle',    kExpr: 'scribble', delay: 66200, duration: 3000 },
  { speaker: 'pig',       text: '...Is that a pencil?',                                           pigExpr: 'idle',    kExpr: 'scribble', delay: 69200, duration: 2600 },
  { speaker: 'krishanu',  text: 'I\'m DRAWING. It\'s ART.',                                      pigExpr: 'sheepish',kExpr: 'scribble', delay: 71800, duration: 2800 },
  { speaker: 'pig',       text: 'You Googled "how to draw a nose" didn\'t you.',                 pigExpr: 'idle',    kExpr: 'scribble', delay: 74600, duration: 3000 },
  { speaker: 'krishanu',  text: '...Twice.',                                                      pigExpr: 'sheepish',kExpr: 'scribble', delay: 77600, duration: 3000 },
  { speaker: 'narrator',  text: '*more intense scribbling*',                                      pigExpr: 'idle',    kExpr: 'scribble', delay: 80600, duration: 2800 },
  { speaker: 'krishanu',  text: 'Done. Is it good?',                                             pigExpr: 'idle',    kExpr: 'proud',    delay: 83400, duration: 2800 },
  { speaker: 'pig',       text: '*adjusts glasses* It\'s... present on the page.',               pigExpr: 'sheepish',kExpr: 'proud',    delay: 86200, duration: 3200 },
  { speaker: 'krishanu',  text: 'That\'s not—',                                                   pigExpr: 'idle',    kExpr: 'proud',    delay: 89400, duration: 2200 },
  { speaker: 'pig',       text: 'Send it. She\'ll love it.',                                     pigExpr: 'serious', kExpr: 'proud',    delay: 91600, duration: 3000 },
  { speaker: 'narrator',  text: '*paper airplane sails out the window into the cosmos*',          pigExpr: 'gasp',    kExpr: 'proud',    delay: 94600, duration: 2400 },
];

// ── Typewriter ────────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 42) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    setShown('');
    if (!text) return;
    let i = 0;
    const id = setInterval(() => { i++; setShown(text.slice(0, i)); if (i >= text.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return shown;
}

// ── Pig ───────────────────────────────────────────────────────────────────────
function Pig({ expr }: { expr?: PigExpr }) {
  return (
    <motion.div
      animate={expr === 'gasp' ? { scale: [1,1.1,1], y: [0,-6,0] } : expr !== 'serious' ? { rotate: [-4,4,-4], y: [0,-4,0] } : {}}
      transition={expr === 'gasp' ? { repeat: Infinity, duration: 0.4 } : { repeat: Infinity, duration: 0.75, ease: 'easeInOut' }}
    >
      <svg width="110" height="126" viewBox="0 0 120 138">
        <ellipse cx="60" cy="85" rx="38" ry="36" fill="#f4a7b9"/>
        <ellipse cx="60" cy="90" rx="22" ry="20" fill="#fdd5e1"/>
        <ellipse cx="60" cy="52" rx="34" ry="30" fill="#f4a7b9"/>
        <circle cx="48" cy="54" r="9" fill="none" stroke="#2a1800" strokeWidth="2.2"/>
        <circle cx="72" cy="54" r="9" fill="none" stroke="#2a1800" strokeWidth="2.2"/>
        <line x1="57" y1="54" x2="63" y2="54" stroke="#2a1800" strokeWidth="2"/>
        <line x1="38.5" y1="51.5" x2="33" y2="49" stroke="#2a1800" strokeWidth="1.5"/>
        <line x1="81.5" y1="51.5" x2="87" y2="49" stroke="#2a1800" strokeWidth="1.5"/>
        <motion.ellipse cx="48" cy="54" rx="4.5" ry="4.5" fill="#120800"
          animate={{ scaleY: expr === 'gasp' ? 1.6 : expr === 'serious' ? 0.5 : 1 }} transition={{ duration: 0.2 }}/>
        <motion.ellipse cx="72" cy="54" rx="4.5" ry="4.5" fill="#120800"
          animate={{ scaleY: expr === 'gasp' ? 1.6 : expr === 'serious' ? 0.5 : 1 }} transition={{ duration: 0.2 }}/>
        <circle cx="49.5" cy="52.5" r="1.3" fill="white" opacity="0.9"/>
        <circle cx="73.5" cy="52.5" r="1.3" fill="white" opacity="0.9"/>
        <ellipse cx="60" cy="65" rx="13" ry="9" fill="#e8899a"/>
        <circle cx="55" cy="65" r="3.5" fill="#c06077"/><circle cx="65" cy="65" r="3.5" fill="#c06077"/>
        {expr === 'gasp'    && <ellipse cx="60" cy="75" rx="7" ry="5.5" fill="#c06077"/>}
        {expr === 'serious' && <line x1="51" y1="73" x2="69" y2="73" stroke="#c06077" strokeWidth="2.2" strokeLinecap="round"/>}
        {expr === 'sheepish'&& <path d="M52 72 Q60 79 68 72" fill="none" stroke="#c06077" strokeWidth="2.2" strokeLinecap="round"/>}
        {(!expr || (expr !== 'gasp' && expr !== 'serious' && expr !== 'sheepish')) && <path d="M52 72 Q60 77 68 72" fill="none" stroke="#c06077" strokeWidth="2.2" strokeLinecap="round"/>}
        <ellipse cx="31" cy="35" rx="11" ry="14" fill="#f4a7b9"/><ellipse cx="31" cy="35" rx="6" ry="9" fill="#e8899a"/>
        <ellipse cx="89" cy="35" rx="11" ry="14" fill="#f4a7b9"/><ellipse cx="89" cy="35" rx="6" ry="9" fill="#e8899a"/>
        <ellipse cx="38" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.3"/>
        <ellipse cx="82" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.3"/>
        <rect x="37" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>
        <rect x="69" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>
        {expr === 'gasp' && <>
          <line x1="18" y1="43" x2="8" y2="36" stroke="#f0c060" strokeWidth="2" opacity="0.8"/>
          <line x1="16" y1="55" x2="4" y2="52" stroke="#f0c060" strokeWidth="2" opacity="0.8"/>
          <line x1="102" y1="43" x2="112" y2="36" stroke="#f0c060" strokeWidth="2" opacity="0.8"/>
          <line x1="104" y1="55" x2="116" y2="52" stroke="#f0c060" strokeWidth="2" opacity="0.8"/>
        </>}
      </svg>
    </motion.div>
  );
}

// ── Krishanu figure ───────────────────────────────────────────────────────────
function Krishanu({ expr }: { expr: KExpr }) {
  if (expr === 'hidden') return null;
  const happy  = expr === 'sheepish' || expr === 'scribble' || expr === 'proud';
  const scrib  = expr === 'scribble';
  const proud  = expr === 'proud';

  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <svg width="88" height="130" viewBox="0 0 100 148">
        {/* body */}
        <rect x="18" y="78" width="64" height="58" rx="8" fill="#4a2e1e"/>
        <text x="50" y="115" textAnchor="middle" fontSize="12" fill="#f0c060" opacity="0.5">✦</text>
        {/* head */}
        <ellipse cx="50" cy="52" rx="27" ry="27" fill="#c8845a"/>
        {/* hair */}
        <ellipse cx="50" cy="28" rx="27" ry="12" fill="#1a0a00"/>
        <ellipse cx="26" cy="40" rx="8" ry="14" fill="#1a0a00"/>
        <ellipse cx="74" cy="40" rx="8" ry="14" fill="#1a0a00"/>
        {/* eyes */}
        {happy ? (
          <>
            <path d="M37 50 Q42 44 47 50" fill="none" stroke="#1a0a00" strokeWidth="2.3" strokeLinecap="round"/>
            <path d="M53 50 Q58 44 63 50" fill="none" stroke="#1a0a00" strokeWidth="2.3" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <ellipse cx="42" cy="50" rx="4.5" ry="5" fill="#1a0a00"/>
            <ellipse cx="58" cy="50" rx="4.5" ry="5" fill="#1a0a00"/>
            <circle cx="43.5" cy="48.5" r="1.3" fill="white"/>
            <circle cx="59.5" cy="48.5" r="1.3" fill="white"/>
          </>
        )}
        {/* mouth */}
        {proud
          ? <path d="M38 64 Q50 74 62 64" fill="none" stroke="#9a4a28" strokeWidth="2.5" strokeLinecap="round"/>
          : happy
          ? <path d="M39 63 Q50 72 61 63" fill="none" stroke="#9a4a28" strokeWidth="2.2" strokeLinecap="round"/>
          : <path d="M39 63 Q50 68 61 63" fill="none" stroke="#9a4a28" strokeWidth="2" strokeLinecap="round"/>}
        {/* arms */}
        <rect x="0" y="83" width="20" height="10" rx="5" fill="#c8845a"/>
        <rect x="80" y="83" width="20" height="10" rx="5" fill="#c8845a"/>
        {/* legs */}
        <rect x="23" y="130" width="19" height="18" rx="6" fill="#2e1a0a"/>
        <rect x="58" y="130" width="19" height="18" rx="6" fill="#2e1a0a"/>
        {/* Scribble effect */}
        {scrib && (
          <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 0.3 }}>
            <line x1="80" y1="76" x2="95" y2="65" stroke="#f0c060" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="82" y1="70" x2="100" y2="62" stroke="#f0c060" strokeWidth="1" opacity="0.5"/>
            <text x="88" y="62" fontSize="10" fill="#f0c060" opacity="0.8">✏️</text>
          </motion.g>
        )}
        {proud && (
          <motion.g animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <text x="72" y="42" fontSize="14" fill="#f0c060" opacity="0.8">✦</text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}

// ── House ─────────────────────────────────────────────────────────────────────
function House({ doorOpen, kExpr, showPlane }: { doorOpen: boolean; kExpr: KExpr; showPlane: boolean }) {
  return (
    <div className="relative" style={{ width: 260, height: 260 }}>
      <svg width="260" height="260" viewBox="0 0 260 260">
        <defs>
          <radialGradient id="winGlow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8733a" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#e8733a" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* Roof */}
        <polygon points="15,115 130,18 245,115" fill="#4a2208"/>
        <polygon points="20,115 130,24 240,115" fill="#6b3510"/>
        {/* Walls */}
        <rect x="28" y="113" width="204" height="140" fill="#5c2d10"/>
        <rect x="30" y="115" width="200" height="138" fill="#6b3510"/>
        {/* Windows */}
        <ellipse cx="65" cy="158" rx="20" ry="17" fill="url(#winGlow2)" opacity="0.8"/>
        <rect x="47" y="145" width="36" height="28" rx="3" fill="rgba(255,224,130,0.2)"/>
        <rect x="47" y="145" width="36" height="28" rx="3" fill="none" stroke="#8b5e0a" strokeWidth="1.8"/>
        <line x1="65" y1="145" x2="65" y2="173" stroke="#8b5e0a" strokeWidth="1.4"/>
        <line x1="47" y1="159" x2="83" y2="159" stroke="#8b5e0a" strokeWidth="1.4"/>
        <ellipse cx="195" cy="158" rx="20" ry="17" fill="url(#winGlow2)" opacity="0.8"/>
        <rect x="177" y="145" width="36" height="28" rx="3" fill="rgba(255,224,130,0.2)"/>
        <rect x="177" y="145" width="36" height="28" rx="3" fill="none" stroke="#8b5e0a" strokeWidth="1.8"/>
        <line x1="195" y1="145" x2="195" y2="173" stroke="#8b5e0a" strokeWidth="1.4"/>
        <line x1="177" y1="159" x2="213" y2="159" stroke="#8b5e0a" strokeWidth="1.4"/>
        {/* Door */}
        <rect x="100" y="190" width="60" height="63" rx="4" fill="#3d1a00"/>
        {!doorOpen && (
          <>
            <rect x="103" y="193" width="25" height="28" rx="2" fill="none" stroke="#8b5e0a" strokeWidth="1" opacity="0.45"/>
            <rect x="132" y="193" width="25" height="28" rx="2" fill="none" stroke="#8b5e0a" strokeWidth="1" opacity="0.45"/>
            <circle cx="154" cy="225" r="3.5" fill="#f0c060" opacity="0.7"/>
          </>
        )}
        <text x="130" y="188" textAnchor="middle" fontSize="10" fill="#f0c060" opacity="0.5" style={{ fontFamily: 'var(--font-cormorant)' }}>K</text>
        {/* Chimney */}
        <rect x="170" y="28" width="22" height="42" rx="3" fill="#4a2208"/>
        {/* Chimney smoke */}
        {[0,1,2].map(i => (
          <motion.ellipse key={i} cx={181 + i * 3} cy={15 - i * 10} rx={6 + i * 2} ry={5 + i * 2}
            fill="rgba(180,180,160,0.15)"
            animate={{ y: [-5, -20], opacity: [0.2, 0] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.6, delay: i * 0.4 }}/>
        ))}
      </svg>

      {/* Krishanu in doorway */}
      <AnimatePresence>
        {doorOpen && kExpr !== 'hidden' && (
          <div className="absolute" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
            <Krishanu expr={kExpr} />
          </div>
        )}
      </AnimatePresence>

      {/* Warm door light spill */}
      {doorOpen && (
        <div className="absolute pointer-events-none" style={{
          bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 110, height: 70,
          background: 'radial-gradient(ellipse at top, rgba(232,115,58,0.22) 0%, transparent 70%)',
        }}/>
      )}

      {/* Paper airplane */}
      <AnimatePresence>
        {showPlane && (
          <motion.div className="absolute" style={{ top: 105, right: 30 }}
            initial={{ x: 0, y: 0, rotate: -8, opacity: 0 }}
            animate={{ x: 240, y: -200, rotate: 22, opacity: [0, 1, 1, 0.3, 0] }}
            transition={{ duration: 2.4, ease: 'easeOut' }}>
            <svg width="46" height="28" viewBox="0 0 46 28">
              <polygon points="0,14 46,0 33,14 46,28" fill="#fdf4e3" opacity="0.95"/>
              <line x1="0" y1="14" x2="33" y2="14" stroke="rgba(180,130,80,0.5)" strokeWidth="0.8"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scribble sfx bubble */}
      <AnimatePresence>
        {kExpr === 'scribble' && (
          <motion.div className="absolute" style={{ top: 80, right: 10 }}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0,1,0.7,1,0], scale: [0.5,1,0.9,1.1,0] }}
            transition={{ duration: 2, repeat: 2 }}>
            <div className="text-lg">✏️</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Dialog bubble ─────────────────────────────────────────────────────────────
function Bubble({ line }: { line: Line }) {
  const typed = useTypewriter(line.text, line.speaker === 'narrator' ? 30 : 38);
  const done  = typed === line.text;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.38 }}
      className="w-full max-w-lg rounded-2xl px-5 py-3.5 text-center"
      style={line.speaker === 'narrator' ? {
        color: 'rgba(196,122,138,0.65)', fontFamily: 'var(--font-syne-mono)', fontSize: 12, fontStyle: 'italic',
      } : {
        background: 'rgba(5,8,16,0.88)',
        border: `1px solid ${line.speaker === 'pig' ? 'rgba(240,192,96,0.3)' : 'rgba(253,244,227,0.1)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {line.speaker !== 'narrator' && (
        <p className="text-[10px] tracking-[0.35em] uppercase mb-1.5 opacity-50"
          style={{ color: line.speaker === 'pig' ? '#f0c060' : '#c47a8a', fontFamily: 'var(--font-dm-sans)' }}>
          {line.speaker === 'pig' ? '🐷  pig' : '😅  krishanu'}
        </p>
      )}
      <p className={!done ? 'cursor' : ''} style={{ fontFamily: 'var(--font-syne-mono)', fontSize: 14, color: '#fdf4e3', lineHeight: 1.6 }}>
        {typed}
      </p>
    </motion.div>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
export default function KrishanusDoor({ onComplete }: KrishanusDoorProps) {
  const [idx,      setIdx]      = useState(0);
  const [doorOpen, setDoorOpen] = useState(false);
  const [showPlane,setShowPlane]= useState(false);
  const [exiting,  setExiting]  = useState(false);

  const current = SCRIPT[idx];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SCRIPT.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setIdx(i);
        if (i >= 2)  setDoorOpen(true);
        if (i >= SCRIPT.length - 2) setShowPlane(true);
      }, line.delay));
    });
    const last = SCRIPT[SCRIPT.length - 1];
    timers.push(setTimeout(() => setExiting(true), last.delay + last.duration + 600));
    timers.push(setTimeout(onComplete, last.delay + last.duration + 1400));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Progress — spoken lines only
  const isSpeaker = (l: Line) => l.speaker === 'pig' || l.speaker === 'krishanu';
  const speakLines  = SCRIPT.filter(isSpeaker);
  const spokenSoFar = SCRIPT.slice(0, idx + 1).filter(isSpeaker).length;

  return (
    <motion.div className="scene" style={{ background: '#050810' }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.9 }}>
      <StarField count={140} zIndex={0} />

      {/* Ground warmth */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: '30%', background: 'linear-gradient(to top, #2a0e00, #6b2e0a, transparent)', zIndex: 1,
      }}/>

      {/* Characters */}
      <div className="relative z-10 flex flex-col md:flex-row items-end justify-center gap-6 md:gap-14 px-6 pb-14 w-full max-w-3xl">
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', damping: 18 }} className="flex-shrink-0">
          <Pig expr={current?.pigExpr} />
        </motion.div>
        <motion.div initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }} className="flex-shrink-0">
          <House doorOpen={doorOpen} kExpr={current?.kExpr ?? 'hidden'} showPlane={showPlane} />
        </motion.div>
      </div>

      {/* Dialog */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-20 w-full px-4 flex justify-center">
        <AnimatePresence mode="wait">
          <Bubble key={idx} line={current} />
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 z-30" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #e8733a, #f0c060)',
          width: `${(spokenSoFar / speakLines.length) * 100}%` }} transition={{ duration: 0.4 }}/>
      </div>
    </motion.div>
  );
}
