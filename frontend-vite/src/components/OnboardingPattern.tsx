import { motion } from 'motion/react';

interface OnboardingPatternProps {
  type: 'observe' | 'reflect' | 'transform';
  className?: string;
}

export function OnboardingPattern({ type, className = '' }: OnboardingPatternProps) {
  const patterns = {
    // Simple geometric pattern forming around a food icon (bowl)
    observe: (
      <svg className={className} width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Center food icon - simple bowl */}
        <motion.circle
          cx="150"
          cy="150"
          r="25"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />
        <motion.path
          d="M 130 150 Q 150 170, 170 150"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        />
        
        {/* Forming geometric lines around the icon */}
        {/* Square frame */}
        <motion.rect
          x="100"
          y="100"
          width="100"
          height="100"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
        />
        
        {/* Connecting lines from center to corners */}
        {[
          { x1: 150, y1: 150, x2: 100, y2: 100 },
          { x1: 150, y1: 150, x2: 200, y2: 100 },
          { x1: 150, y1: 150, x2: 200, y2: 200 },
          { x1: 150, y1: 150, x2: 100, y2: 200 },
        ].map((line, index) => (
          <motion.line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 1 + index * 0.1, ease: 'easeOut' }}
          />
        ))}
        
        {/* Outer dots at corners */}
        {[
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 200, y: 200 },
          { x: 100, y: 200 },
        ].map((pos, index) => (
          <motion.circle
            key={index}
            cx={pos.x}
            cy={pos.y}
            r="3"
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.4, delay: 1.6 + index * 0.1, ease: 'easeOut' }}
          />
        ))}
        
        {/* Decorative lines at midpoints */}
        {[
          { x1: 150, y1: 100, x2: 150, y2: 80 },
          { x1: 200, y1: 150, x2: 220, y2: 150 },
          { x1: 150, y1: 200, x2: 150, y2: 220 },
          { x1: 100, y1: 150, x2: 80, y2: 150 },
        ].map((line, index) => (
          <motion.line
            key={`mid-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 0.5, delay: 2 + index * 0.1, ease: 'easeOut' }}
          />
        ))}
      </svg>
    ),

    // Symmetric circular lines around a thought bubble
    reflect: (
      <svg className={className} width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Center thought bubble - minimalist */}
        <motion.circle
          cx="150"
          cy="145"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        />
        <motion.circle
          cx="140"
          cy="170"
          r="6"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        />
        <motion.circle
          cx="135"
          cy="182"
          r="3"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        />
        
        {/* Concentric circles around it */}
        {[50, 70, 90].map((radius, index) => (
          <motion.circle
            key={radius}
            cx="150"
            cy="145"
            r={radius}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 - index * 0.1 }}
            transition={{ duration: 1.2, delay: 0.8 + index * 0.2, ease: 'easeOut' }}
          />
        ))}
        
        {/* Radial lines creating symmetry */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <motion.line
            key={angle}
            x1="150"
            y1="145"
            x2={150 + Math.cos((angle * Math.PI) / 180) * 90}
            y2={145 + Math.sin((angle * Math.PI) / 180) * 90}
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 0.8, delay: 1.4 + index * 0.05, ease: 'easeOut' }}
          />
        ))}
        
        {/* Dots at intersections on outer circle */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <motion.circle
            key={`dot-${angle}`}
            cx={150 + Math.cos((angle * Math.PI) / 180) * 90}
            cy={145 + Math.sin((angle * Math.PI) / 180) * 90}
            r="2.5"
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.4, delay: 2 + index * 0.08, ease: 'easeOut' }}
          />
        ))}
        
        {/* Decorative arcs */}
        {[0, 90, 180, 270].map((angle, index) => (
          <motion.path
            key={`arc-${angle}`}
            d={`M ${150 + Math.cos((angle * Math.PI) / 180) * 50} ${145 + Math.sin((angle * Math.PI) / 180) * 50} 
                A 20 20 0 0 1 ${150 + Math.cos(((angle + 45) * Math.PI) / 180) * 70} ${145 + Math.sin(((angle + 45) * Math.PI) / 180) * 70}`}
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 2.5 + index * 0.1, ease: 'easeOut' }}
          />
        ))}
      </svg>
    ),

    // Full muggu pattern expanding outward
    transform: (
      <svg className={className} width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Center point */}
        <motion.circle
          cx="150"
          cy="150"
          r="5"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        />
        
        {/* Inner circle */}
        <motion.circle
          cx="150"
          cy="150"
          r="30"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        />
        
        {/* Radiating lines from center */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => (
          <motion.line
            key={angle}
            x1="150"
            y1="150"
            x2={150 + Math.cos((angle * Math.PI) / 180) * 110}
            y2={150 + Math.sin((angle * Math.PI) / 180) * 110}
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.6 + index * 0.05, ease: 'easeOut' }}
          />
        ))}
        
        {/* Middle circle */}
        <motion.circle
          cx="150"
          cy="150"
          r="60"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
        />
        
        {/* Outer circle */}
        <motion.circle
          cx="150"
          cy="150"
          r="110"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.2, delay: 1.6, ease: 'easeOut' }}
        />
        
        {/* Geometric petals/segments */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => (
          <motion.path
            key={`petal-${angle}`}
            d={`M ${150 + Math.cos((angle * Math.PI) / 180) * 30} ${150 + Math.sin((angle * Math.PI) / 180) * 30}
                L ${150 + Math.cos((angle * Math.PI) / 180) * 60} ${150 + Math.sin((angle * Math.PI) / 180) * 60}
                L ${150 + Math.cos(((angle + 30) * Math.PI) / 180) * 45} ${150 + Math.sin(((angle + 30) * Math.PI) / 180) * 45}
                Z`}
            stroke="currentColor"
            strokeWidth="0.5"
            fill="currentColor"
            fillOpacity="0.1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 + index * 0.1, ease: 'easeOut' }}
          />
        ))}
        
        {/* Dots at outer intersections */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => (
          <motion.circle
            key={`outer-dot-${angle}`}
            cx={150 + Math.cos((angle * Math.PI) / 180) * 110}
            cy={150 + Math.sin((angle * Math.PI) / 180) * 110}
            r="3"
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.4, delay: 2.5 + index * 0.04, ease: 'easeOut' }}
          />
        ))}
        
        {/* Connecting arcs in outer ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <motion.path
            key={`arc-${angle}`}
            d={`M ${150 + Math.cos((angle * Math.PI) / 180) * 110} ${150 + Math.sin((angle * Math.PI) / 180) * 110}
                Q ${150 + Math.cos(((angle + 22.5) * Math.PI) / 180) * 120} ${150 + Math.sin(((angle + 22.5) * Math.PI) / 180) * 120},
                  ${150 + Math.cos(((angle + 45) * Math.PI) / 180) * 110} ${150 + Math.sin(((angle + 45) * Math.PI) / 180) * 110}`}
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 3 + index * 0.08, ease: 'easeOut' }}
          />
        ))}
        
        {/* Outer decorative square frame */}
        <motion.rect
          x="60"
          y="60"
          width="180"
          height="180"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 3.5, ease: 'easeOut' }}
        />
      </svg>
    ),
  };

  return patterns[type];
}
