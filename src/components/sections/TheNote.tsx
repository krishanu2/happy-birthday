'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../StarField';

interface TheNoteProps {
  onComplete?: () => void;
}

// ── ✏️ FILL THESE IN ──────────────────────────────────────────────────────────
const PAGES = [
  {
    title: 'The Beginning',
    body: `Didi,
I've started this letter four times now.

Every time I write something, it feels too small. Like the words exist but they don't weigh enough. And you deserve words that weigh something.

So here it is. Plain and honest.

I was scared. Not of you — but of how real you felt. Because people who feel that real, that safe, that genuinely warm — they usually leave. That's just been the rule.

You never got the memo.`,
    isFinal: false,
  },
  {
    title: 'What You Actually Are',
    body: `I used to think I didn't need anyone.

Genuinely believed it. Carried everything alone and called it strength. Thought sharing things, leaning on someone — that was weakness.

Then this gol matol chasmish ladki from Jharkhand walked in and didn't say a single word about any of that.

She just... stayed. Quietly. Consistently. Without asking for anything back.

And slowly, without me even noticing — I stopped carrying things alone.

It took me 21 years to learn that. You taught me in a few months.`,
    isFinal: false,
  },
  {
    title: 'The Moment I Knew',
    body: `There's this one moment I keep coming back to.

You gave me a gift. The first real one anyone outside my family had ever given me. And I just stood there — completely frozen — because I didn't know what to do with it. With the fact that someone had thought about me. Had gone out of their way. Just because they wanted to.

I didn't cry that day. But I wanted to.

Because in that one moment I felt it — the thing I didn't know I had been missing.

Tu mera apna hai, Riya. Uss tarah ka apna jo khoon se nahi milta — jo shayad pichle janam ka hisaab hota hai.`,
    isFinal: false,
  },
  {
    title: 'What You Don\'t Know About Yourself',
    body: `You have no idea what you look like from where I'm standing.

You think you're just being normal. Listening, checking in, showing up. But Didi — that is not normal. That is one in a million. That is the thing people write about in songs and never actually find in real life.

You sat with me at my worst and never once made me feel like a burden. You celebrated things for me that I had already given up celebrating for myself.

Do you understand what that does to a person? To just know — someone's there. Someone sees you. Someone's not going anywhere.

You gave me that. Every single day. Without even realising it.`,
    isFinal: false,
  },
  {
    title: '',
    body: `Didi.

I've called you Motu. Buddhi. Made fun of the Gandhi ji glasses so many times you've probably stopped reacting. I've been annoying and loud and ridiculous and you've sat through every single bit of it — half irritated, half smiling — and come back the next day like nothing happened.

You chose me on the ordinary days. The random conversations. The stupid jokes. The days you just checked in because you felt like it.

That's where love actually lives. And that's where you showed up, every time.

Thank you for being my person. Thank you for making me feel like I belong somewhere, to someone.

Khush raho, Didi. Bahut zyada.
Aur jab bhi mushkil lage — bas ek baar peeche ghoom ke dekh.
Main wahan hounga. Hamesha.

"How long will I stand behind you? As long as stars are above you. And longer if I can." 🌙🌙

— tera chotu, Krishanu 🤍`,
    isFinal: true,
  },
];

// ── Constellation background ─────────────────────────────────────────────────
function ConstellationBg() {
  const clusters = [
    { cx: 8,  cy: 12 }, { cx: 82, cy: 8  },
    { cx: 15, cy: 72 }, { cx: 78, cy: 80 },
    { cx: 50, cy: 5  }, { cx: 92, cy: 45 },
  ];
  const pts = [[0,0],[22,-14],[48,4],[38,26],[8,22]];
  const lines = [[0,1],[1,2],[2,3],[3,4],[4,0]];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" style={{ zIndex: 0 }}>
      {clusters.map((c, ci) => (
        <g key={ci} transform={`translate(${c.cx}%, ${c.cy}%)`}>
          {lines.map(([a,b], i) => (
            <motion.line key={i}
              x1={pts[a][0]} y1={pts[a][1]}
              x2={pts[b][0]} y2={pts[b][1]}
              stroke="#f0c060" strokeWidth="0.6" opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: ci * 0.2 + i * 0.1, duration: 0.8 }}
            />
          ))}
          {pts.map(([px, py], i) => (
            <motion.circle key={i} cx={px} cy={py} r="2"
              fill="#fffde8"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 + i * 0.4 + ci * 0.3, delay: i * 0.2 }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

// ── Single page ──────────────────────────────────────────────────────────────
interface PageProps {
  page: typeof PAGES[0];
  idx: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  direction: number;
}

function Page({ page, idx, total, onNext, onPrev, direction }: PageProps) {
  const isLast = idx === total - 1;

  return (
    <motion.div
      key={idx}
      className="w-full"
      style={{ maxWidth: 'min(92vw, 500px)' }}
      initial={{ opacity: 0, x: direction * 60, rotateY: direction * 12 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: direction * -60, rotateY: direction * -12 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Paper */}
      <div
        className="paper-page relative rounded-b-xl rounded-t-none overflow-hidden"
        style={{
          boxShadow: `0 20px 80px rgba(0,0,0,0.55), 0 0 40px rgba(240,192,96,${isLast ? '0.12' : '0.06'})`,
          border: '1px solid rgba(200,160,100,0.25)',
        }}
      >
        {/* Left margin rule */}
        <div className="absolute top-0 bottom-0 left-14 w-px" style={{ background: 'rgba(220,80,80,0.2)', zIndex: 1 }}/>

        {/* Spiral holes */}
        <div className="absolute top-0 bottom-0 left-0 w-14 flex flex-col justify-around items-center py-3" style={{ zIndex: 2 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-full" style={{
              width: 18, height: 18,
              background: 'rgba(5,8,16,0.85)',
              border: '2px solid rgba(160,120,70,0.4)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
            }}/>
          ))}
        </div>

        {/* Ruled lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          paddingTop: 60, paddingLeft: 68, paddingRight: 24, paddingBottom: 32, zIndex: 1,
        }}>
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} style={{ height: 36, borderBottom: '1px solid rgba(160,120,60,0.18)' }}/>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-6" style={{ paddingLeft: 72 }}>
          {/* Page number & dot trail */}
          <div className="flex items-center justify-between mb-4">
            <span style={{
              color: 'rgba(150,100,40,0.5)',
              fontFamily: 'var(--font-caveat)',
              fontSize: 14,
            }}>
              {idx + 1} / {total}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-400" style={{
                  width: i === idx ? 18 : 6, height: 6,
                  background: i === idx
                    ? '#c8860a'
                    : i < idx
                    ? 'rgba(200,134,10,0.4)'
                    : 'rgba(200,134,10,0.15)',
                }}/>
              ))}
            </div>
          </div>

          {/* Title */}
          {page.title && (
            <h3 style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: 24,
              color: '#7a4a10',
              marginBottom: 14,
              lineHeight: 1.3,
            }}>
              {page.title}
            </h3>
          )}

          {/* Body */}
          <p
            className="whitespace-pre-line"
            style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: 18,
              color: '#3a2800',
              lineHeight: '2.1rem',
              minHeight: page.isFinal ? 240 : 180,
            }}
          >
            {page.body}
          </p>

          {/* Heart on last page */}
          {isLast && (
            <motion.div
              className="mt-6 flex justify-end"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <svg width="30" height="28" viewBox="0 0 30 28">
                <path
                  d="M15 26 C15 26 2 17 2 9 C2 4 6 1 10 2 C12 2 14 4 15 6 C16 4 18 2 20 2 C24 1 28 4 28 9 C28 17 15 26 15 26Z"
                  fill="none"
                  stroke="#c47a8a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          )}

          {/* Nav */}
          <div className="flex justify-between items-center mt-6 pt-3"
            style={{ borderTop: '1px solid rgba(160,120,60,0.2)' }}>
            <button
              onClick={onPrev}
              disabled={idx === 0}
              className="transition-all"
              style={{
                fontFamily: 'var(--font-caveat)',
                fontSize: 16,
                color: idx === 0 ? 'rgba(160,120,60,0.25)' : '#8b5a10',
                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                padding: '4px 8px',
              }}
            >
              ← prev
            </button>

            {isLast ? (
              <span style={{ fontFamily: 'var(--font-caveat)', fontSize: 16, color: 'rgba(196,122,138,0.6)' }}>
                fin. ♥
              </span>
            ) : (
              <button
                onClick={onNext}
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 16,
                  color: '#8b5a10',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                next →
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TheNote({ onComplete: _onComplete }: TheNoteProps) {
  const [idx,      setIdx]      = useState(0);
  const [dir,      setDir]      = useState(1);
  const [done,     setDone]     = useState(false);
  const [replaying,setReplaying]= useState(false);

  const goNext = () => {
    if (idx < PAGES.length - 1) { setDir(1); setIdx(i => i + 1); }
    else { setDone(true); }
  };
  const goPrev = () => {
    if (idx > 0) { setDir(-1); setIdx(i => i - 1); }
  };
  const replay = () => {
    setDone(false);
    setReplaying(true);
    setDir(1);
    setIdx(0);
    // reload page after brief flash
    setTimeout(() => { setReplaying(false); }, 400);
  };

  return (
    <div className="scene" style={{ background: '#050810', minHeight: '100dvh' }}>
      <StarField count={160} shooting zIndex={0} />
      <ConstellationBg />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(120,60,0,0.07) 0%, transparent 70%)',
        zIndex: 1,
      }}/>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-12 w-full">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs tracking-[0.45em] uppercase mb-2"
            style={{ color: 'rgba(240,192,96,0.45)', fontFamily: 'var(--font-dm-sans)' }}>
            the note
          </p>
          <h2 className="text-2xl md:text-3xl font-light"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#fdf4e3', opacity: 0.9 }}>
            A few things you should know.
          </h2>
        </motion.div>

        {/* Pages */}
        <AnimatePresence mode="wait" custom={dir}>
          <Page
            key={idx}
            page={PAGES[idx]}
            idx={idx}
            total={PAGES.length}
            onNext={goNext}
            onPrev={goPrev}
            direction={dir}
          />
        </AnimatePresence>

        {/* Done flourish */}
        <AnimatePresence>
          {done && !replaying && (
            <motion.div
              className="text-center flex flex-col items-center gap-5 py-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              <motion.div className="text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                🌟
              </motion.div>
              <p className="text-2xl font-light" style={{ fontFamily: 'var(--font-cormorant)', color: '#f0c060',
                textShadow: '0 0 30px rgba(240,192,96,0.5)' }}>
                Happy Birthday, Riya.
              </p>
              {/* Replay — teasing */}
              <motion.div className="flex flex-col items-center gap-2 mt-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <p style={{ fontFamily: 'var(--font-syne-mono)', fontSize: 11,
                  color: 'rgba(196,122,138,0.55)', letterSpacing: '0.1em' }}>
                  i know you want to read it again.
                </p>
                <motion.button onClick={replay}
                  className="px-6 py-2.5 rounded-full text-xs tracking-wider"
                  style={{ border: '1px solid rgba(240,192,96,0.25)', color: 'rgba(240,192,96,0.7)',
                    fontFamily: 'var(--font-dm-sans)', background: 'rgba(5,8,16,0.6)', cursor: 'pointer' }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(240,192,96,0.6)' }}
                  whileTap={{ scale: 0.95 }}>
                  read it again →
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
