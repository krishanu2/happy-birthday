'use client';

import { motion } from 'framer-motion';

interface PlanetProps {
  size?: number;
  showHouse?: boolean;
  showPig?: boolean;
  className?: string;
}

export default function Planet({ size = 400, showHouse = false, showPig = false, className = '' }: PlanetProps) {
  const r = size / 2;

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          {/* Planet gradient — warm terracotta/amber */}
          <radialGradient id="planetGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffcc80" />
            <stop offset="40%" stopColor="#e8956d" />
            <stop offset="75%" stopColor="#bf5b17" />
            <stop offset="100%" stopColor="#7b3200" />
          </radialGradient>

          {/* Atmosphere glow */}
          <radialGradient id="atmosphereGrad" cx="50%" cy="50%" r="55%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(255,179,71,0.3)" />
          </radialGradient>

          {/* Ring gradient */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,179,71,0.1)" />
            <stop offset="30%" stopColor="rgba(255,179,71,0.6)" />
            <stop offset="50%" stopColor="rgba(255,220,130,0.9)" />
            <stop offset="70%" stopColor="rgba(255,179,71,0.6)" />
            <stop offset="100%" stopColor="rgba(255,179,71,0.1)" />
          </linearGradient>

          <clipPath id="planetClip">
            <circle cx={r} cy={r} r={r - 4} />
          </clipPath>
        </defs>

        {/* Atmosphere outer glow */}
        <circle cx={r} cy={r} r={r + 18} fill="url(#atmosphereGrad)" opacity="0.6" />

        {/* Ring behind */}
        <ellipse
          cx={r} cy={r + r * 0.55}
          rx={r * 1.6} ry={r * 0.22}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={size * 0.04}
          opacity="0.5"
          clipPath="none"
        />

        {/* Planet body */}
        <circle cx={r} cy={r} r={r - 4} fill="url(#planetGrad)" />

        {/* Surface texture — dark bands */}
        <ellipse cx={r * 0.9} cy={r * 0.6} rx={r * 0.7} ry={r * 0.08} fill="rgba(100,40,0,0.15)" clipPath="url(#planetClip)" />
        <ellipse cx={r * 1.1} cy={r * 0.8} rx={r * 0.8} ry={r * 0.06} fill="rgba(100,40,0,0.12)" clipPath="url(#planetClip)" />
        <ellipse cx={r * 0.85} cy={r * 1.1} rx={r * 0.65} ry={r * 0.07} fill="rgba(100,40,0,0.1)" clipPath="url(#planetClip)" />

        {/* Highlight */}
        <ellipse cx={r * 0.65} cy={r * 0.55} rx={r * 0.25} ry={r * 0.18} fill="rgba(255,240,200,0.15)" clipPath="url(#planetClip)" />

        {/* Ring front */}
        <ellipse
          cx={r} cy={r + r * 0.55}
          rx={r * 1.6} ry={r * 0.22}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={size * 0.025}
          opacity="0.7"
        />

        {/* Tiny house on planet edge */}
        {showHouse && (
          <g transform={`translate(${r + r * 0.55}, ${r - r * 0.35}) rotate(25)`}>
            {/* House body */}
            <rect x="-18" y="-10" width="36" height="28" rx="3" fill="#c8956d" />
            {/* Roof */}
            <polygon points="-22,-10 0,-34 22,-10" fill="#8b4513" />
            {/* Door */}
            <rect x="-6" y="4" width="12" height="14" rx="2" fill="#5c2d0a" />
            {/* Window */}
            <rect x="-14" y="-4" width="9" height="9" rx="1" fill="#ffe082" opacity="0.9" />
            <rect x="5" y="-4" width="9" height="9" rx="1" fill="#ffe082" opacity="0.9" />
            {/* Warm glow */}
            <rect x="-14" y="-4" width="9" height="9" rx="1" fill="rgba(255,179,71,0.3)" />
            <rect x="5" y="-4" width="9" height="9" rx="1" fill="rgba(255,179,71,0.3)" />
            {/* Chimney smoke */}
            <path d="M8,-34 Q12,-44 6,-50 Q2,-58 10,-62" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
          </g>
        )}
      </svg>

      {/* Floating lanterns */}
      {showHouse && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 12}%`,
              }}
              animate={{
                y: [-5, 5, -5],
                x: [0, i % 2 === 0 ? 5 : -5, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + i * 0.5,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            >
              <svg width="18" height="28" viewBox="0 0 18 28">
                <ellipse cx="9" cy="15" rx="7" ry="10" fill="#ffb347" opacity="0.85"/>
                <ellipse cx="9" cy="15" rx="4" ry="7" fill="#fff176" opacity="0.6"/>
                <rect x="7" y="4" width="4" height="4" rx="1" fill="#c8956d"/>
                <line x1="9" y1="4" x2="9" y2="0" stroke="#c8956d" strokeWidth="1.5"/>
                <ellipse cx="9" cy="17" rx="2" ry="3" fill="rgba(255,255,150,0.4)"/>
              </svg>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
