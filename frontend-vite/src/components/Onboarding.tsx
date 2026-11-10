import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { ObservePattern, ReflectPattern, DiscoverPattern } from './OnboardingSlidePatterns';
import { Button } from './ui/button';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  pattern: 'observe' | 'reflect' | 'discover';
  gradient: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 'observe',
    title: 'Observe Your Meals',
    description: 'Capture what you eat.',
    pattern: 'observe',
    gradient: 'linear-gradient(135deg, #F5E6D3 0%, #E8C4A0 50%, #D59A85 100%)',
  },
  {
    id: 'reflect',
    title: 'Reflect Your Mood',
    description: 'Reflect on how you feel.',
    pattern: 'reflect',
    gradient: 'linear-gradient(135deg, #C86852 0%, #D98B6E 50%, #E3B660 100%)',
  },
  {
    id: 'discover',
    title: 'Discover Your Patterns',
    description: 'See the patterns that make you, you.',
    pattern: 'discover',
    gradient: 'linear-gradient(135deg, #E3B660 0%, #E8C4A0 50%, #D59A85 100%)',
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  
  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Final animation - pattern retracts
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      handlePrevious();
    } else if (info.offset.x < -threshold && currentIndex < slides.length - 1) {
      handleNext();
    }
  };

  const PatternComponent = {
    observe: ObservePattern,
    reflect: ReflectPattern,
    discover: DiscoverPattern,
  }[currentSlide.pattern];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{ background: currentSlide.gradient }}
        />
      </AnimatePresence>

      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          key={`glow-${currentIndex}`}
          className="w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] md:w-[700px] md:h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 65%)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-screen py-6 sm:py-8 px-4 sm:px-6 max-w-2xl w-full">
        {/* Progress indicators at top - muggu dots */}
        <div className="w-full flex justify-center pt-4">
          <div className="flex gap-4 items-center">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              const isPast = index < currentIndex;
              
              return (
                <motion.div key={slide.id} className="relative">
                  {/* Connecting line */}
                  {index < slides.length - 1 && (
                    <motion.div
                      className="absolute left-full top-1/2 h-[2px] origin-left"
                      style={{
                        width: '24px',
                        backgroundColor: '#C86852',
                        transform: 'translateY(-50%)',
                      }}
                      initial={{ scaleX: 0, opacity: 0.3 }}
                      animate={{ 
                        scaleX: isPast ? 1 : 0, 
                        opacity: isPast ? 0.6 : 0.3 
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  )}
                  
                  {/* Muggu dot */}
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <motion.circle
                      cx="10"
                      cy="10"
                      r={isActive ? "8" : "5"}
                      fill={isActive || isPast ? '#C86852' : 'transparent'}
                      stroke="#C86852"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: isActive ? [1, 1.1, 1] : 1,
                        r: isActive ? 8 : 5
                      }}
                      transition={{ 
                        scale: { duration: 0.6, repeat: isActive ? Infinity : 0, repeatType: 'reverse' },
                        r: { duration: 0.4 }
                      }}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main content - swipeable */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x, opacity }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ 
                duration: 0.6, 
                ease: 'easeOut',
                opacity: { duration: 0.4 }
              }}
              className="flex flex-col items-center w-full"
            >
              {/* Geometric pattern */}
              <div 
                className="mb-8 sm:mb-12"
                style={{ color: currentSlide.id === 'discover' ? '#C86852' : '#2D2D2D' }}
              >
                <PatternComponent className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80" />
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-3 text-center text-2xl sm:text-3xl md:text-4xl px-4"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  color: '#2D2D2D',
                  letterSpacing: '0.02em',
                }}
              >
                {currentSlide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center max-w-md px-4 text-sm sm:text-base"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  color: '#4A4A4A',
                  letterSpacing: '0.01em',
                  lineHeight: '1.6',
                }}
              >
                {currentSlide.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={handleNext}
            className="w-full h-12 sm:h-14 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #E3B660 0%, #E8C4A0 100%)',
              color: '#2D2D2D',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            }}
          >
            {/* Diagonal shimmer on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent"
              initial={{ x: '-150%', y: '-150%' }}
              whileHover={{ x: '150%', y: '150%' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <span className="relative z-10">
              {currentIndex < slides.length - 1 ? 'Continue' : 'Start My Journey'}
            </span>
          </Button>
          
          {/* Swipe hint on first slide */}
          {currentIndex === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-center mt-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#2D2D2D',
                opacity: 0.6,
              }}
            >
              Swipe to explore
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Geometric trail effect on slide transition */}
      <AnimatePresence>
        {direction !== 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.line
                  key={i}
                  x1={direction > 0 ? '0%' : '100%'}
                  y1={`${20 + i * 15}%`}
                  x2={direction > 0 ? '100%' : '0%'}
                  y2={`${20 + i * 15}%`}
                  stroke="#2D2D2D"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
