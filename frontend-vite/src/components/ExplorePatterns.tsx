import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

/**
 * Mode Selection
 * - Two modes only: Reflect & Nourish
 * - Single-select (not multi-select)
 * - Always advances the UI (onComplete called immediately)
 * - Tries to persist to backend only if auth exists
 * - No emojis; icons are minimal inline SVGs
 */

type ModeId = 'reflect' | 'nourish';

interface Mode {
  id: ModeId;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const modes: Mode[] = [
  {
    id: 'reflect',
    title: 'Reflect',
    description: 'Notice how this meal made you feel.',
    Icon: ReflectEyeIcon,
  },
  {
    id: 'nourish',
    title: 'Nourish',
    description: 'See what this meal provides.',
    Icon: NourishPlateIcon,
  },
];

interface ExplorePatternsProps {
  onComplete: (chosenMode: ModeId) => void;
}

export function ExplorePatterns({ onComplete }: ExplorePatternsProps) {
  const [selectedMode, setSelectedMode] = useState<ModeId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedMode) return;

    setIsSubmitting(true);

    // ✅ Always move forward (dev-friendly + resilient UX)
    onComplete(selectedMode);

    // Best-effort save (only if auth exists)
    try {
      const token = localStorage.getItem('aaroha_token');
      const rawUser = localStorage.getItem('aaroha_user');
      const user = rawUser ? JSON.parse(rawUser) : null;

      if (!token || !user) {
        // Not logged in yet — skip saving
        return;
      }

      await fetch('http://localhost:4000/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          mode: selectedMode, // 👈 store mode (preferred)
          goals: [selectedMode], // 👈 keep compatibility if backend expects "goals"
        }),
      });
    } catch (err) {
      console.error('Failed to save mode', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Warm background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, #F5F2ED 0%, #E8D5C8 50%, #C86852 100%)',
        }}
      />

      {/* Subtle grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ opacity: 0.05 }}
      >
        <svg width="100%" height="100%" className="w-full h-full" aria-hidden>
          <defs>
            <pattern
              id="muggu-grid"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="1.5" fill="#2D2D2D" />
              <line
                x1="20"
                y1="0"
                x2="20"
                y2="40"
                stroke="#2D2D2D"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="20"
                x2="40"
                y2="20"
                stroke="#2D2D2D"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#muggu-grid)" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <h1
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              color: '#2D2D2D',
              letterSpacing: '0.02em',
            }}
          >
            Choose your lens
          </h1>
          <p
            className="text-sm sm:text-base px-4"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              color: '#7A7269',
              letterSpacing: '0.01em',
              lineHeight: '1.6',
            }}
          >
            How would you like to meet this meal?
          </p>
        </motion.div>

        {/* Mode cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto justify-items-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {modes.map((mode, index) => (
            <div key={mode.id} className="w-full flex justify-center">
              <ModeCard
                mode={mode}
                isSelected={selectedMode === mode.id}
                onSelect={() => setSelectedMode(mode.id)}
                delay={index * 0.12}
              />
            </div>
          ))}
        </motion.div>

        {/* Continue */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedMode || isSubmitting}
            className="w-full max-w-md h-12 sm:h-14 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                selectedMode
                  ? 'linear-gradient(135deg, #C86852 0%, #E3B660 100%)'
                  : '#E8E4DF',
              color: selectedMode ? '#FFFFFF' : '#7A7269',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
              clipPath:
                'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            }}
          >
            {selectedMode && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
                initial={{ x: '-150%', y: '-150%' }}
                whileHover={{ x: '150%', y: '150%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            )}

            <motion.span
              className="relative z-10"
              whileTap={selectedMode ? { scale: 0.98 } : {}}
              transition={{ duration: 0.1 }}
            >
              {isSubmitting ? 'Setting things up...' : 'Continue'}
            </motion.span>
          </Button>
        </motion.div>

        {/* Tiny helper text */}
        <div className="mt-4 text-center">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              color: '#7A7269',
              letterSpacing: '0.01em',
            }}
          >
            You can switch this anytime later.
          </p>
        </div>
      </div>
    </div>
  );
}

/* --- Mode Card --- */
function ModeCard({
  mode,
  isSelected,
  onSelect,
  delay,
}: {
  mode: Mode;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}) {
  const Icon = mode.Icon;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="relative p-5 sm:p-7 rounded-2xl text-left transition-all group w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      style={{
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: isSelected ? '2px solid #E3B660' : '2px solid transparent',
        boxShadow: isSelected
          ? '0 8px 26px rgba(227, 182, 96, 0.28), 0 0 14px rgba(227, 182, 96, 0.18)'
          : '0 4px 12px rgba(0, 0, 0, 0.06)',
        clipPath:
          'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
      }}
      aria-pressed={isSelected}
    >
      {/* soft glow when selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '16px',
            clipPath:
              'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              boxShadow: [
                '0 0 0px rgba(227, 182, 96, 0)',
                '0 0 8px rgba(227, 182, 96, 0.55)',
                '0 0 0px rgba(227, 182, 96, 0)',
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}

      {/* content */}
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{
              background: isSelected
                ? 'rgba(227, 182, 96, 0.18)'
                : 'rgba(45, 45, 45, 0.05)',
              border: isSelected
                ? '1px solid rgba(227, 182, 96, 0.45)'
                : '1px solid rgba(45, 45, 45, 0.08)',
            }}
          >
            <Icon className="h-6 w-6" />
          </div>

          <h3
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              color: '#2D2D2D',
              letterSpacing: '0.01em',
            }}
          >
            {mode.title}
          </h3>
        </div>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#7A7269',
            letterSpacing: '0.01em',
            lineHeight: '1.55',
          }}
        >
          {mode.description}
        </p>
      </div>
    </motion.button>
  );
}

/* --- Custom SVG Icons (minimal, matching set) --- */

function ReflectEyeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M2.5 12s3.4-6.5 9.5-6.5S21.5 12 21.5 12s-3.4 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.6a2.6 2.6 0 1 0 0-5.2a2.6 2.6 0 0 0 0 5.2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NourishPlateIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Plate */}
      <path
        d="M12 20.5c4.7 0 8.5-3.8 8.5-8.5S16.7 3.5 12 3.5 3.5 7.3 3.5 12s3.8 8.5 8.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Macro segments (subtle) */}
      <path
        d="M12 12V4.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12l6.2 3.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12H4.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
