import { motion } from 'motion/react';

interface MugguLogoProps {
  className?: string;
  animate?: boolean;
}

export function MugguLogo({ className = '', animate = true }: MugguLogoProps) {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
    },
  };

  const dotVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

  const animationProps = animate
    ? {
        initial: "hidden",
        animate: "visible",
        variants: pathVariants,
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      }
    : {};

  const dotAnimationProps = animate
    ? {
        initial: "hidden",
        animate: "visible",
        variants: dotVariants,
        transition: {
          duration: 0.5,
          ease: "easeOut",
          delay: 1.8,
        },
      }
    : {};

  return (
    <svg
      className={className}
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Outer square frame */}
        <motion.rect
          x="30"
          y="30"
          width="140"
          height="140"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          {...animationProps}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0 }}
        />

        {/* Diagonal crosses creating star */}
        <motion.line
          x1="30"
          y1="30"
          x2="170"
          y2="170"
          stroke="white"
          strokeWidth="1"
          {...animationProps}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.line
          x1="170"
          y1="30"
          x2="30"
          y2="170"
          stroke="white"
          strokeWidth="1"
          {...animationProps}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
        />

        {/* Center circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="35"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          {...animationProps}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
        />

        {/* Inner geometric pattern - 8 petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <motion.line
            key={`petal-${angle}`}
            x1="100"
            y1="100"
            x2={100 + Math.cos((angle * Math.PI) / 180) * 35}
            y2={100 + Math.sin((angle * Math.PI) / 180) * 35}
            stroke="white"
            strokeWidth="1"
            {...animationProps}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.8 + index * 0.05 }}
          />
        ))}

        {/* Outer decorative dots at midpoints */}
        {[
          { x: 100, y: 30 }, // top
          { x: 170, y: 100 }, // right
          { x: 100, y: 170 }, // bottom
          { x: 30, y: 100 }, // left
        ].map((pos, index) => (
          <motion.circle
            key={`mid-dot-${index}`}
            cx={pos.x}
            cy={pos.y}
            r="3"
            fill="white"
            {...dotAnimationProps}
            transition={{ duration: 0.3, ease: "easeOut", delay: 1.8 + index * 0.1 }}
          />
        ))}

        {/* Corner decorative elements - small circles */}
        {[
          { x: 30, y: 30 },
          { x: 170, y: 30 },
          { x: 170, y: 170 },
          { x: 30, y: 170 },
        ].map((pos, index) => (
          <motion.circle
            key={`corner-${index}`}
            cx={pos.x}
            cy={pos.y}
            r="3"
            fill="white"
            {...dotAnimationProps}
            transition={{ duration: 0.3, ease: "easeOut", delay: 2 + index * 0.1 }}
          />
        ))}

        {/* Inner star points on the circle */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <motion.circle
            key={`star-dot-${angle}`}
            cx={100 + Math.cos((angle * Math.PI) / 180) * 35}
            cy={100 + Math.sin((angle * Math.PI) / 180) * 35}
            r="2.5"
            fill="white"
            {...dotAnimationProps}
            transition={{ duration: 0.3, ease: "easeOut", delay: 2.2 + index * 0.05 }}
          />
        ))}

        {/* Connecting arcs between square sides */}
        <motion.path
          d="M 30 100 Q 50 80, 100 30"
          stroke="white"
          strokeWidth="1"
          fill="none"
          {...animationProps}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 1.2 }}
        />
        <motion.path
          d="M 100 30 Q 120 50, 170 100"
          stroke="white"
          strokeWidth="1"
          fill="none"
          {...animationProps}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 1.3 }}
        />
        <motion.path
          d="M 170 100 Q 150 120, 100 170"
          stroke="white"
          strokeWidth="1"
          fill="none"
          {...animationProps}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 1.4 }}
        />
        <motion.path
          d="M 100 170 Q 80 150, 30 100"
          stroke="white"
          strokeWidth="1"
          fill="none"
          {...animationProps}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Center dot */}
        <motion.circle
          cx="100"
          cy="100"
          r="4"
          fill="white"
          {...dotAnimationProps}
          transition={{ duration: 0.4, ease: "easeOut", delay: 2.5 }}
        />
      </g>
    </svg>
  );
}
