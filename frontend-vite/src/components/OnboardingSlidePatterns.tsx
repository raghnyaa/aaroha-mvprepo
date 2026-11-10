import { motion } from 'motion/react';

// Slide 1: Observe - Geometric food symbol (circle + grid)
export function ObservePattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="280" height="280" viewBox="0 0 280 280" fill="none">
      {/* Outer circle (bowl) */}
      <motion.circle
        cx="140"
        cy="140"
        r="80"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
      />
      
      {/* Grid lines inside (symbolizing tracking/measurement) */}
      {/* Horizontal lines */}
      {[100, 120, 140, 160, 180].map((y, index) => (
        <motion.line
          key={`h-${y}`}
          x1="60"
          y1={y}
          x2="220"
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
        />
      ))}
      
      {/* Vertical lines */}
      {[100, 120, 140, 160, 180].map((x, index) => (
        <motion.line
          key={`v-${x}`}
          x1={x}
          y1="60"
          x2={x}
          y2="220"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 1.2 + index * 0.1, ease: 'easeOut' }}
        />
      ))}
      
      {/* Center dot */}
      <motion.circle
        cx="140"
        cy="140"
        r="6"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.8, ease: 'easeOut' }}
      />
      
      {/* Corner accents - small geometric shapes */}
      {[
        { x: 60, y: 60 },
        { x: 220, y: 60 },
        { x: 220, y: 220 },
        { x: 60, y: 220 },
      ].map((pos, index) => (
        <motion.circle
          key={`corner-${index}`}
          cx={pos.x}
          cy={pos.y}
          r="4"
          fill="currentColor"
          opacity="0.6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 0.4, delay: 2 + index * 0.1, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

// Slide 2: Reflect - Concentric rings pulsing like breath
export function ReflectPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="280" height="280" viewBox="0 0 280 280" fill="none">
      {/* Center thought bubble */}
      <motion.circle
        cx="140"
        cy="130"
        r="30"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      />
      
      {/* Small bubbles */}
      <motion.circle
        cx="125"
        cy="165"
        r="10"
        fill="currentColor"
        opacity="0.3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
      />
      <motion.circle
        cx="118"
        cy="180"
        r="6"
        fill="currentColor"
        opacity="0.2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
      />
      
      {/* Concentric circles - pulsing animation */}
      {[60, 80, 100, 120].map((radius, index) => (
        <motion.circle
          key={radius}
          cx="140"
          cy="130"
          r={radius}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0, 0.6, 0.6],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            pathLength: { duration: 1, delay: 1 + index * 0.2, ease: 'easeOut' },
            opacity: { duration: 2, delay: 1 + index * 0.2, repeat: Infinity, repeatType: 'reverse' },
            scale: { duration: 3, delay: 1 + index * 0.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
          }}
        />
      ))}
      
      {/* Radial lines for symmetry */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
        <motion.line
          key={angle}
          x1="140"
          y1="130"
          x2={140 + Math.cos((angle * Math.PI) / 180) * 120}
          y2={130 + Math.sin((angle * Math.PI) / 180) * 120}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.25"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 0.6, delay: 2 + index * 0.05, ease: 'easeOut' }}
        />
      ))}
      
      {/* Outer dots at line intersections */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
        <motion.circle
          key={`dot-${angle}`}
          cx={140 + Math.cos((angle * Math.PI) / 180) * 120}
          cy={130 + Math.sin((angle * Math.PI) / 180) * 120}
          r="3"
          fill="currentColor"
          opacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.4, delay: 2.5 + index * 0.06, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

// Slide 3: Discover - Kaleidoscopic interconnecting muggu shapes
export function DiscoverPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="320" height="320" viewBox="0 0 320 320" fill="none">
      {/* Center core */}
      <motion.circle
        cx="160"
        cy="160"
        r="8"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      />
      
      {/* Inner ring of small geometric shapes */}
      {[0, 60, 120, 180, 240, 300].map((angle, index) => {
        const x = 160 + Math.cos((angle * Math.PI) / 180) * 40;
        const y = 160 + Math.sin((angle * Math.PI) / 180) * 40;
        return (
          <motion.g key={`inner-${angle}`}>
            <motion.path
              d={`M ${x} ${y - 8} L ${x + 8} ${y} L ${x} ${y + 8} L ${x - 8} ${y} Z`}
              fill="currentColor"
              opacity="0.4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
            />
            <motion.line
              x1="160"
              y1="160"
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
            />
          </motion.g>
        );
      })}
      
      {/* Middle ring - connecting lines forming web */}
      <motion.circle
        cx="160"
        cy="160"
        r="80"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.2, delay: 1.4, ease: 'easeOut' }}
      />
      
      {/* Mid-level geometric nodes */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => {
        const x = 160 + Math.cos((angle * Math.PI) / 180) * 80;
        const y = 160 + Math.sin((angle * Math.PI) / 180) * 80;
        return (
          <motion.circle
            key={`mid-${angle}`}
            cx={x}
            cy={y}
            r="5"
            fill="currentColor"
            opacity="0.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 0.5, delay: 1.6 + index * 0.05, ease: 'easeOut' }}
          />
        );
      })}
      
      {/* Outer ring - larger pattern */}
      <motion.circle
        cx="160"
        cy="160"
        r="130"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1.5, delay: 2.2, ease: 'easeOut' }}
      />
      
      {/* Outer geometric shapes - kaleidoscopic pattern */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const x = 160 + Math.cos((angle * Math.PI) / 180) * 130;
        const y = 160 + Math.sin((angle * Math.PI) / 180) * 130;
        const nextAngle = angle + 45;
        const nextX = 160 + Math.cos((nextAngle * Math.PI) / 180) * 130;
        const nextY = 160 + Math.sin((nextAngle * Math.PI) / 180) * 130;
        
        return (
          <motion.g key={`outer-${angle}`}>
            {/* Triangle petals */}
            <motion.path
              d={`M ${x} ${y} L ${160 + Math.cos((angle * Math.PI) / 180) * 110} ${160 + Math.sin((angle * Math.PI) / 180) * 110} L ${nextX} ${nextY} Z`}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="currentColor"
              fillOpacity="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.5 + index * 0.1, ease: 'easeOut' }}
            />
            {/* Connecting lines to center */}
            <motion.line
              x1="160"
              y1="160"
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: 2.8 + index * 0.08, ease: 'easeOut' }}
            />
          </motion.g>
        );
      })}
      
      {/* Outermost decorative dots */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => {
        const x = 160 + Math.cos((angle * Math.PI) / 180) * 145;
        const y = 160 + Math.sin((angle * Math.PI) / 180) * 145;
        return (
          <motion.circle
            key={`outermost-${angle}`}
            cx={x}
            cy={y}
            r="3"
            fill="currentColor"
            opacity="0.6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.4, delay: 3.5 + index * 0.04, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
}
