import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { MugguLogo } from './components/MugguLogo';
import { Onboarding } from './components/Onboarding';
import { AuthScreen } from './components/AuthScreen';
import { MugguTransition } from './components/MugguTransition';
import { ExplorePatterns } from './components/ExplorePatterns';
import { HomeDashboard } from './components/HomeDashboard';

export default function App() {
  // screen flags
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showExplorePatterns, setShowExplorePatterns] = useState(false);
  const [showMain, setShowMain] = useState(false);

  // personalization
  // ⬇️ changed from single userGoal -> array of selectedGoals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('You');

  //
  // 1. Splash auto-advances to onboarding after ~4s
  //
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setShowOnboarding(true);
      }, 4000); // matches your animation timing
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  //
  // 2. When onboarding finishes, go to that MugguTransition
  //
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowTransition(true);
  };

  //
  // 3. When MugguTransition finishes, show auth screen
  //
  const handleTransitionComplete = () => {
    setShowTransition(false);
    setShowAuth(true);
  };

  //
  // 4. When auth succeeds:
  //    - Save the user's name for dashboard greeting
  //    - Move to ExplorePatterns (goal selection screen)
  //
  const handleAuthComplete = (info?: { name?: string }) => {
    if (info?.name) {
      setUserName(info.name);
    } else {
      setUserName('Raghnya'); // fallback for now
    }

    setShowAuth(false);
    setShowExplorePatterns(true);
  };

  //
  // 5. When ExplorePatterns finishes:
  //    - It gives us ALL chosen goals (array of strings)
  //    - We store the full array
  //    - Then show main dashboard
  //
  const handleExplorePatternsComplete = (chosenGoals: string[]) => {
    setSelectedGoals(chosenGoals);
    setShowExplorePatterns(false);
    setShowMain(true);
  };

  //
  // render flow using AnimatePresence for fades
  //
  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SplashScreen />
        </motion.div>
      ) : showOnboarding ? (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Onboarding onComplete={handleOnboardingComplete} />
        </motion.div>
      ) : showTransition ? (
        <motion.div
          key="transition"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MugguTransition onComplete={handleTransitionComplete} />
        </motion.div>
      ) : showAuth ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AuthScreen onAuth={handleAuthComplete} />
        </motion.div>
      ) : showExplorePatterns ? (
        <motion.div
          key="explore-patterns"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ExplorePatterns onComplete={handleExplorePatternsComplete} />
        </motion.div>
      ) : showMain ? (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* ⬇️ pass selectedGoals ARRAY + userName */}
          <HomeDashboard selectedGoals={selectedGoals} userName={userName} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* Splash Screen (unchanged) */
function SplashScreen() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Warm terracotta gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #D98B6E 0%, #C97456 50%, #B86346 100%)',
        }}
      />

      {/* Subtle radial glow behind logo */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <div
          className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
          }}
        />
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Muggu Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12"
        >
          <MugguLogo className="w-48 h-48 md:w-56 md:h-56" animate={true} />
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8, ease: 'easeOut' }}
          className="mb-4 sm:mb-6 tracking-wide text-4xl sm:text-5xl md:text-6xl"
          style={{
            color: 'white',
            letterSpacing: '0.1em',
          }}
        >
          Aaroha
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.2, ease: 'easeOut' }}
          className="text-center px-4"
        >
          <p
            className="tracking-wide text-base sm:text-lg"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.05em',
            }}
          >
            Track what you eat. Discover your patterns.
          </p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.6 }}
          className="mt-12 sm:mt-16 flex gap-2"
        >
          {[0, 1, 2].map(index => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-white"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Corner patterns */}
      <motion.div
        className="absolute top-4 left-4 sm:top-8 sm:left-8 opacity-10"
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 80 80"
          fill="none"
          className="sm:w-20 sm:h-20"
        >
          <circle cx="40" cy="40" r="35" stroke="white" strokeWidth="1" />
          <line
            x1="40"
            y1="5"
            x2="40"
            y2="75"
            stroke="white"
            strokeWidth="0.5"
          />
          <line
            x1="5"
            y1="40"
            x2="75"
            y2="40"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 opacity-10"
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ duration: 2, delay: 1.2 }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 80 80"
          fill="none"
          className="sm:w-20 sm:h-20"
        >
          <rect
            x="5"
            y="5"
            width="70"
            height="70"
            stroke="white"
            strokeWidth="1"
          />
          <line
            x1="5"
            y1="5"
            x2="75"
            y2="75"
            stroke="white"
            strokeWidth="0.5"
          />
          <line
            x1="75"
            y1="5"
            x2="5"
            y2="75"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>
    </div>
  );
}
