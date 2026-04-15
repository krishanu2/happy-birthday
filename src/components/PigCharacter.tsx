'use client';

import { motion } from 'framer-motion';

interface PigProps {
  expression?: 'idle' | 'gasp' | 'walking' | 'serious' | 'sheepish';
  size?: number;
  className?: string;
  flipped?: boolean;
}

export default function PigCharacter({ expression = 'idle', size = 120, className = '', flipped = false }: PigProps) {
  const isGasping = expression === 'gasp';
  const isSheepish = expression === 'sheepish';
  const isSerious = expression === 'serious';

  // Eye expressions
  const eyeStyle = isGasping
    ? { scaleY: 1.6, y: -2 }
    : isSerious
    ? { scaleY: 0.6 }
    : isSheepish
    ? { scaleY: 0.8 }
    : { scaleY: 1 };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size * 1.15, transform: flipped ? 'scaleX(-1)' : undefined }}
      animate={
        expression === 'walking' || expression === 'idle'
          ? { rotate: [-4, 4, -4], y: [0, -4, 0] }
          : expression === 'gasp'
          ? { scale: [1, 1.05, 1] }
          : {}
      }
      transition={
        expression === 'walking' || expression === 'idle'
          ? { repeat: Infinity, duration: 0.7, ease: 'easeInOut' }
          : expression === 'gasp'
          ? { repeat: Infinity, duration: 0.5 }
          : {}
      }
    >
      <svg
        viewBox="0 0 120 138"
        width={size}
        height={size * 1.15}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="60" cy="85" rx="38" ry="36" fill="#f4a7b9" />

        {/* Belly */}
        <ellipse cx="60" cy="90" rx="22" ry="20" fill="#fdd5e1" />

        {/* Head */}
        <ellipse cx="60" cy="52" rx="34" ry="30" fill="#f4a7b9" />

        {/* Gandhi Glasses (small round spectacles) */}
        <circle cx="48" cy="54" r="9" fill="none" stroke="#5c3d2e" strokeWidth="2" opacity="0.9"/>
        <circle cx="72" cy="54" r="9" fill="none" stroke="#5c3d2e" strokeWidth="2" opacity="0.9"/>
        <line x1="57" y1="54" x2="63" y2="54" stroke="#5c3d2e" strokeWidth="2"/>
        <line x1="39" y1="52" x2="34" y2="50" stroke="#5c3d2e" strokeWidth="1.5"/>
        <line x1="81" y1="52" x2="86" y2="50" stroke="#5c3d2e" strokeWidth="1.5"/>

        {/* Eyes behind glasses */}
        <motion.ellipse
          cx="48" cy="54" rx="5" ry="5"
          fill="#2d1b00"
          animate={eyeStyle}
          transition={{ duration: 0.2 }}
        />
        <motion.ellipse
          cx="72" cy="54" rx="5" ry="5"
          fill="#2d1b00"
          animate={eyeStyle}
          transition={{ duration: 0.2 }}
        />

        {/* Eye shine */}
        <circle cx="50" cy="52" r="1.5" fill="white" opacity="0.9"/>
        <circle cx="74" cy="52" r="1.5" fill="white" opacity="0.9"/>

        {/* Snout */}
        <ellipse cx="60" cy="65" rx="13" ry="9" fill="#e8899a" />
        <circle cx="55" cy="65" r="3.5" fill="#c06077" />
        <circle cx="65" cy="65" r="3.5" fill="#c06077" />

        {/* Mouth */}
        {isGasping ? (
          <ellipse cx="60" cy="74" rx="7" ry="5" fill="#c06077" />
        ) : isSerious ? (
          <line x1="52" y1="73" x2="68" y2="73" stroke="#c06077" strokeWidth="2" strokeLinecap="round"/>
        ) : isSheepish ? (
          <path d="M53 73 Q60 79 67 73" fill="none" stroke="#c06077" strokeWidth="2" strokeLinecap="round"/>
        ) : (
          <path d="M52 72 Q60 78 68 72" fill="none" stroke="#c06077" strokeWidth="2" strokeLinecap="round"/>
        )}

        {/* Ears */}
        <ellipse cx="31" cy="35" rx="11" ry="14" fill="#f4a7b9" />
        <ellipse cx="31" cy="35" rx="6" ry="9" fill="#e8899a" />
        <ellipse cx="89" cy="35" rx="11" ry="14" fill="#f4a7b9" />
        <ellipse cx="89" cy="35" rx="6" ry="9" fill="#e8899a" />

        {/* Tiny tail */}
        <path d="M95 90 Q105 80 100 95 Q95 105 98 98" fill="none" stroke="#f4a7b9" strokeWidth="3" strokeLinecap="round"/>

        {/* Legs */}
        <rect x="37" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>
        <rect x="69" y="116" width="14" height="18" rx="7" fill="#f4a7b9"/>

        {/* Hooves */}
        <ellipse cx="44" cy="134" rx="7" ry="5" fill="#e8899a"/>
        <ellipse cx="76" cy="134" rx="7" ry="5" fill="#e8899a"/>

        {/* Blush */}
        <ellipse cx="38" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.35"/>
        <ellipse cx="82" cy="63" rx="7" ry="5" fill="#ff8fab" opacity="0.35"/>

        {/* Gasp lines */}
        {isGasping && (
          <>
            <line x1="20" y1="45" x2="10" y2="38" stroke="#ffb347" strokeWidth="2" opacity="0.8"/>
            <line x1="18" y1="55" x2="6" y2="52" stroke="#ffb347" strokeWidth="2" opacity="0.8"/>
            <line x1="100" y1="45" x2="110" y2="38" stroke="#ffb347" strokeWidth="2" opacity="0.8"/>
            <line x1="102" y1="55" x2="114" y2="52" stroke="#ffb347" strokeWidth="2" opacity="0.8"/>
          </>
        )}
      </svg>
    </motion.div>
  );
}
