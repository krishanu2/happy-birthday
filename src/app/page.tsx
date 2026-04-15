'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSceneSound } from '@/hooks/useSound';

const LockScreen     = dynamic(() => import('@/components/sections/LockScreen'),     { ssr: false });
const UniverseBirth  = dynamic(() => import('@/components/sections/UniverseBirth'),  { ssr: false });
const PigRoast       = dynamic(() => import('@/components/sections/PigRoast'),       { ssr: false });
const PlanetJourney  = dynamic(() => import('@/components/sections/PlanetJourney'),  { ssr: false });
const KrishanusDoor  = dynamic(() => import('@/components/sections/KrishanusDoor'),  { ssr: false });
const SketchReveal   = dynamic(() => import('@/components/sections/SketchReveal'),   { ssr: false });
const TheNote        = dynamic(() => import('@/components/sections/TheNote'),        { ssr: false });

type Scene = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const SCENE_LABELS = ['Waiting', 'Universe', 'The Roast', 'Journey', "The Door", 'The Sketch', 'The Note'];

export default function BirthdayUniverse() {
  const [scene, setScene] = useState<Scene>(0);
  const { play } = useSceneSound();

  const goTo = useCallback((n: Scene) => {
    setScene(n);
    const soundMap: Record<Scene, Parameters<typeof play>[0]> = {
      0: 'lock', 1: 'universe', 2: 'pig', 3: 'journey', 4: 'door', 5: 'sketch', 6: 'note',
    };
    play(soundMap[n]);
  }, [play]);

  const next = useCallback(() => {
    const n = Math.min(scene + 1, 6) as Scene;
    goTo(n);
  }, [scene, goTo]);

  return (
    <main
      className="relative w-screen overflow-hidden"
      style={{ height: '100dvh', background: '#050810' }}
      // Start music on first interaction
      onClick={() => play('lock')}
    >
      {/* ── Scenes ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {scene === 0 && (
            <motion.div key="s0" className="absolute inset-0">
              <LockScreen onUnlock={() => goTo(1)} />
            </motion.div>
          )}
          {scene === 1 && (
            <motion.div key="s1" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
              <UniverseBirth onComplete={() => goTo(2)} />
            </motion.div>
          )}
          {scene === 2 && (
            <motion.div key="s2" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <PigRoast onComplete={() => goTo(3)} />
            </motion.div>
          )}
          {scene === 3 && (
            <motion.div key="s3" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <PlanetJourney onComplete={() => goTo(4)} />
            </motion.div>
          )}
          {scene === 4 && (
            <motion.div key="s4" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <KrishanusDoor onComplete={() => goTo(5)} />
            </motion.div>
          )}
          {scene === 5 && (
            <motion.div key="s5" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
              <SketchReveal onComplete={() => goTo(6)} />
            </motion.div>
          )}
          {scene === 6 && (
            <motion.div key="s6" className="absolute inset-0 overflow-y-auto"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
              <TheNote />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Progress dots ─────────────────────────────────────────────── */}
      {scene > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1.5
          bg-black/35 backdrop-blur-sm rounded-full px-3 py-2">
          {SCENE_LABELS.slice(1).map((label, i) => {
            const s = (i + 1) as Scene;
            return (
              <motion.button
                key={s}
                title={label}
                onClick={() => goTo(s)}
                className="rounded-full transition-all duration-500 cursor-pointer"
                style={{
                  width:  s === scene ? 22 : 7,
                  height: 7,
                  background: s < scene
                    ? 'rgba(240,192,96,0.45)'
                    : s === scene
                    ? '#f0c060'
                    : 'rgba(253,244,227,0.12)',
                }}
                whileHover={{ scale: 1.3 }}
              />
            );
          })}
        </div>
      )}

      {/* ── Skip button (auto-play scenes only) ───────────────────────── */}
      {scene > 0 && scene < 3 && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 text-xs tracking-[0.3em] uppercase
            transition-colors duration-300 px-4 py-2 rounded-full"
          style={{
            color: 'rgba(253,244,227,0.3)',
            border: '1px solid rgba(253,244,227,0.08)',
            fontFamily: 'var(--font-dm-sans)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          onClick={(e) => { e.stopPropagation(); next(); }}
          whileHover={{ color: 'rgba(253,244,227,0.7)' }}
        >
          skip →
        </motion.button>
      )}
    </main>
  );
}
