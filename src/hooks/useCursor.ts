'use client';

import { useState, useEffect } from 'react';

export function useCursor() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 }); // normalized 0–1

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        setPos({ x: e.touches[0].clientX / window.innerWidth, y: e.touches[0].clientY / window.innerHeight });
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return pos;
}
