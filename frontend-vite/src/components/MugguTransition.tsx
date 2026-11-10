import { motion } from 'motion/react';

export function MugguTransition({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Gradient background that transitions to auth screen gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: 'linear-gradient(135deg, #E3B660 0%, #E8C4A0 50%, #D59A85 100%)' }}
        animate={{ background: 'radial-gradient(circle at center, #F5F2ED 0%, #E8D5C8 40%, #C86852 100%)' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 300);
        }}
      />

      {/* Retracting muggu pattern - plays in reverse */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 1.5, opacity: 1 }}
        animate={{ scale: 0.3, opacity: 0 }}
        transition={{ duration: 2, ease: 'easeIn' }}
        style={{ color: '#C86852' }}
      >
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          {/* Outermost elements retract first */}
          
          {/* Outer decorative dots */}
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
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02, ease: 'easeIn' }}
              />
            );
          })}
          
          {/* Outer ring */}
          <motion.circle
            cx="160"
            cy="160"
            r="130"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 1, opacity: 0.8 }}
            animate={{ pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeIn' }}
          />
          
          {/* Outer geometric shapes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
            const x = 160 + Math.cos((angle * Math.PI) / 180) * 130;
            const y = 160 + Math.sin((angle * Math.PI) / 180) * 130;
            
            return (
              <motion.g key={`outer-${angle}`}>
                <motion.line
                  x1="160"
                  y1="160"
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  initial={{ pathLength: 1, opacity: 0.2 }}
                  animate={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.03, ease: 'easeIn' }}
                />
              </motion.g>
            );
          })}
          
          {/* Middle ring */}
          <motion.circle
            cx="160"
            cy="160"
            r="80"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 1, opacity: 0.6 }}
            animate={{ pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: 'easeIn' }}
          />
          
          {/* Mid-level nodes */}
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
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.02, ease: 'easeIn' }}
              />
            );
          })}
          
          {/* Inner ring */}
          {[0, 60, 120, 180, 240, 300].map((angle, index) => {
            const x = 160 + Math.cos((angle * Math.PI) / 180) * 40;
            const y = 160 + Math.sin((angle * Math.PI) / 180) * 40;
            return (
              <motion.g key={`inner-${angle}`}>
                <motion.path
                  d={`M ${x} ${y - 8} L ${x + 8} ${y} L ${x} ${y + 8} L ${x - 8} ${y} Z`}
                  fill="currentColor"
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 + index * 0.05, ease: 'easeIn' }}
                />
                <motion.line
                  x1="160"
                  y1="160"
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  initial={{ pathLength: 1, opacity: 0.3 }}
                  animate={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 + index * 0.05, ease: 'easeIn' }}
                />
              </motion.g>
            );
          })}
          
          {/* Center core - retracts last */}
          <motion.circle
            cx="160"
            cy="160"
            r="8"
            fill="currentColor"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.6, ease: 'easeIn' }}
          />
        </svg>
      </motion.div>

      {/* Subtle fade overlay for smooth transition */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(245,242,237,0.8) 100%)',
        }}
      />
    </div>
  );
}
