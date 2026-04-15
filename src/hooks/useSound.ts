'use client';

import { useRef, useEffect, useCallback } from 'react';

type SoundScene = 'lock' | 'universe' | 'pig' | 'journey' | 'door' | 'airplane' | 'sketch' | 'note';

// Sound file map — add your own .mp3/.ogg files to /public/sounds/
const SOUND_MAP: Record<SoundScene, string> = {
  lock:     '/sounds/silence.mp3',   // silent / tick-tock
  universe: '/sounds/ambient.mp3',   // soft ambient hum
  pig:      '/sounds/playful.mp3',   // light plucks
  journey:  '/sounds/guitar.mp3',    // warm acoustic
  door:     '/sounds/comic.mp3',     // boink effects
  airplane: '/sounds/whoosh.mp3',    // soft whoosh
  sketch:   '/sounds/swell.mp3',     // orchestral swell
  note:     '/sounds/piano.mp3',     // intimate piano
};

// Volumes per scene
const VOLUMES: Record<SoundScene, number> = {
  lock: 0, universe: 0.25, pig: 0.2, journey: 0.25,
  door: 0.3, airplane: 0.35, sketch: 0.45, note: 0.3,
};

export function useSceneSound() {
  // We dynamically import Howler only client-side to avoid SSR issues
  const howlRef = useRef<InstanceType<typeof import('howler').Howl> | null>(null);
  const currentScene = useRef<SoundScene | null>(null);

  const play = useCallback(async (scene: SoundScene) => {
    if (currentScene.current === scene) return;
    currentScene.current = scene;

    const { Howl } = await import('howler');

    // Fade out old
    if (howlRef.current) {
      const old = howlRef.current;
      old.fade(old.volume(), 0, 1200);
      setTimeout(() => old.stop(), 1300);
    }

    const src = SOUND_MAP[scene];
    const vol = VOLUMES[scene];
    if (vol === 0) return;

    const h = new Howl({ src: [src], loop: true, volume: 0, html5: true });
    howlRef.current = h;
    h.play();
    h.fade(0, vol, 1500);
  }, []);

  const sfx = useCallback(async (src: string, volume = 0.5) => {
    const { Howl } = await import('howler');
    const h = new Howl({ src: [src], volume, html5: true });
    h.play();
  }, []);

  useEffect(() => {
    return () => {
      howlRef.current?.stop();
    };
  }, []);

  return { play, sfx };
}
