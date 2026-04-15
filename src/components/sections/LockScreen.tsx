'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../StarField';

interface LockScreenProps {
  onUnlock: () => void;
}

function getTimeUntilMidnight() {
  const now  = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
    ms: diff,
  };
}

function DigitBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative tabular-nums leading-none"
        style={{ fontSize: 'clamp(2.8rem, 10vw, 6rem)', fontFamily: 'var(--font-cormorant)', fontWeight: 300, color: '#f0c060' }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={value}
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }} className="block">
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span style={{ color: 'rgba(240,192,96,0.38)', fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.3em' }}>
        {label}
      </span>
    </div>
  );
}

function BurstParticle({ angle, delay }: { angle: number; delay: number }) {
  const dist = 80 + Math.random() * 180;
  return (
    <motion.div className="absolute rounded-full"
      style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4,
        background: Math.random() > 0.5 ? '#f0c060' : '#fffde8', top: '50%', left: '50%' }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ x: Math.cos(angle) * dist * (2 + Math.random() * 5),
        y: Math.sin(angle) * dist * (2 + Math.random() * 5), opacity: [0, 1, 0], scale: [0, 1.8, 0] }}
      transition={{ duration: 1.4 + Math.random() * 0.8, delay, ease: 'easeOut' }}
    />
  );
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const [t, setT] = useState(getTimeUntilMidnight());
  const [phase, setPhase] = useState<'idle' | 'implode' | 'explode'>('idle');
  const [starCount, setStarCount] = useState(35);

  useEffect(() => {
    const id = setInterval(() => setStarCount(n => Math.min(n + 4, 240)), 350);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const next = getTimeUntilMidnight();
      setT(next);
      if (next.ms <= 0) trigger();
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trigger = () => {
    setPhase('implode');
    setTimeout(() => setPhase('explode'), 650);
    setTimeout(onUnlock, 1800);
  };

  const bursts = Array.from({ length: 28 }, (_, i) => (i / 28) * Math.PI * 2);

  return (
    <div className="scene select-none" style={{ background: '#050810' }}>
      <StarField count={starCount} shooting zIndex={0} />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(240,192,96,0.04) 0%, transparent 65%)',
        zIndex: 1,
      }}/>

      {/* Implode / explode */}
      <AnimatePresence>
        {phase === 'implode' && (
          <motion.div className="absolute inset-0 bg-[#f0c060]" style={{ zIndex: 10 }}
            initial={{ opacity: 0, scale: 8 }} animate={{ opacity: [0, 0.85, 0], scale: [8, 1, 0.05] }}
            transition={{ duration: 0.65, ease: 'easeIn' }}/>
        )}
        {phase === 'explode' && (
          <motion.div className="absolute inset-0" style={{ zIndex: 10 }}
            initial={{ opacity: 1, scale: 0 }} animate={{ opacity: [1, 0.5, 0], scale: [0, 15] }}
            transition={{ duration: 1.1, ease: 'easeOut' }}>
            <div className="w-full h-full bg-[#f0c060] rounded-full"/>
          </motion.div>
        )}
      </AnimatePresence>
      {phase === 'explode' && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 11 }}>
          {bursts.map((a, i) => <BurstParticle key={i} angle={a} delay={i * 0.025} />)}
        </div>
      )}

      {/* Content */}
      <motion.div className="relative flex flex-col items-center gap-10 px-6 z-10"
        animate={phase !== 'idle' ? { scale: 0.2, opacity: 0 } : {}} transition={{ duration: 0.4 }}>

        {/* Casual opener — not cringy */}
        <motion.div className="text-center space-y-2"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.2 }}>
          <p style={{ color: 'rgba(253,244,227,0.55)', fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1rem, 3vw, 1.4rem)', fontWeight: 300, letterSpacing: '0.06em' }}>
            psst. you weren't supposed to find this yet.
          </p>
          <p style={{ color: 'rgba(240,192,96,0.35)', fontFamily: 'var(--font-dm-sans)', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            but since you're here —
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div className="flex items-end gap-3 md:gap-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
          <DigitBlock value={pad(t.h)} label="hours" />
          <motion.span style={{ color: 'rgba(240,192,96,0.4)', fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem,7vw,4.5rem)', marginBottom: '1.2rem' }}
            animate={{ opacity: [0.2, 0.7, 0.2] }} transition={{ repeat: Infinity, duration: 1.2 }}>:</motion.span>
          <DigitBlock value={pad(t.m)} label="min" />
          <motion.span style={{ color: 'rgba(240,192,96,0.4)', fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem,7vw,4.5rem)', marginBottom: '1.2rem' }}
            animate={{ opacity: [0.2, 0.7, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}>:</motion.span>
          <DigitBlock value={pad(t.s)} label="sec" />
        </motion.div>

        <motion.p style={{ color: 'rgba(253,244,227,0.28)', fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 300 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1.5 }}>
          something small. something real.
        </motion.p>

        {/* Enter button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8, duration: 1 }}>
          <motion.button onClick={trigger}
            className="relative px-10 py-3.5 rounded-full text-sm overflow-hidden"
            style={{ border: '1px solid rgba(240,192,96,0.3)', color: '#f0c060', fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: 12 }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
            <motion.span className="absolute inset-0 rounded-full" style={{ background: 'rgba(240,192,96,0.07)' }}
              initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}/>
            <span className="relative z-10">fine. come in.</span>
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.p className="absolute bottom-7"
        style={{ color: 'rgba(240,192,96,0.18)', fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
        April 16 · for Riya
      </motion.p>
    </div>
  );
}
