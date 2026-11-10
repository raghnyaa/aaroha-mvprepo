import { motion } from 'motion/react';

export interface MealEntry {
  id: string;
  photo: string | null;
  description: string;
  portion: 'light' | 'normal' | 'heavy';
  moods: string[];
  notes: string;
  timestamp: Date;
}

const moodLabels: Record<string, { label: string; emoji: string }> = {
  comforting: { label: 'Comforting', emoji: '🧡' },
  fresh: { label: 'Fresh', emoji: '🌿' },
  spicy: { label: 'Spicy', emoji: '🌶️' },
  heavy: { label: 'Heavy', emoji: '😮‍💨' },
  energizing: { label: 'Energizing', emoji: '⚡' },
  calm: { label: 'Calm', emoji: '😌' },
};

interface MealEntryCardProps {
  meal: MealEntry;
  index: number;
}

export function MealEntryCard({ meal, index }: MealEntryCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `Today • ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (hours < 48) {
      return `Yesterday • ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-5 rounded-2xl"
      style={{
        background: '#F5F2ED',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Faint muggu linework in corner */}
      <div className="absolute top-4 right-4 pointer-events-none" style={{ opacity: 0.1 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="15" stroke="#2D2D2D" strokeWidth="0.5" />
          <line x1="20" y1="5" x2="20" y2="35" stroke="#2D2D2D" strokeWidth="0.5" />
          <line x1="5" y1="20" x2="35" y2="20" stroke="#2D2D2D" strokeWidth="0.5" />
          {[0, 45, 90, 135].map((angle) => (
            <line
              key={angle}
              x1="20"
              y1="20"
              x2={20 + Math.cos((angle * Math.PI) / 180) * 15}
              y2={20 + Math.sin((angle * Math.PI) / 180) * 15}
              stroke="#2D2D2D"
              strokeWidth="0.3"
            />
          ))}
        </svg>
      </div>

      {/* Photo thumbnail */}
      {meal.photo ? (
        <div
          className="mb-4 rounded-xl overflow-hidden"
          style={{
            height: '200px',
            background: 'linear-gradient(135deg, rgba(200, 104, 82, 0.1) 0%, rgba(227, 182, 96, 0.1) 100%)',
          }}
        >
          <img 
            src={meal.photo} 
            alt={meal.description}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="mb-4 rounded-xl flex items-center justify-center"
          style={{
            height: '200px',
            background: 'linear-gradient(135deg, rgba(200, 104, 82, 0.08) 0%, rgba(227, 182, 96, 0.08) 100%)',
            border: '1px dashed rgba(200, 104, 82, 0.2)',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C86852" strokeWidth="1.5" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}

      {/* Time badge - positioned absolutely over photo */}
      <motion.div
        className="absolute top-8 right-8 px-3 py-1.5 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(200, 104, 82, 0.15)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        animate={{
          boxShadow: [
            '0 2px 8px rgba(0, 0, 0, 0.1)',
            '0 2px 12px rgba(227, 182, 96, 0.3)',
            '0 2px 8px rgba(0, 0, 0, 0.1)',
          ],
        }}
        transition={{ duration: 1.5, delay: 0.5, times: [0, 0.5, 1] }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: '#7A7269',
            letterSpacing: '0.01em',
          }}
        >
          {formatTime(meal.timestamp)}
        </p>
      </motion.div>

      {/* Meal title */}
      <h3
        className="mb-3"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 500,
          fontSize: '18px',
          color: '#2D2D2D',
          letterSpacing: '0.01em',
        }}
      >
        {meal.description}
      </h3>

      {/* Portion pill */}
      <div
        className="inline-block px-3 py-1 rounded-full mb-4"
        style={{
          border: '1px solid #C86852',
          background: 'rgba(200, 104, 82, 0.05)',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: '#C86852',
            textTransform: 'capitalize',
          }}
        >
          {meal.portion} portion
        </p>
      </div>

      {/* Mood chips row */}
      {meal.moods.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {meal.moods.map((moodId) => {
            const mood = moodLabels[moodId];
            if (!mood) return null;
            
            return (
              <div
                key={moodId}
                className="px-3 py-1.5 rounded-full"
                style={{
                  border: '1px solid #E3B660',
                  background: 'rgba(227, 182, 96, 0.08)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#2D2D2D',
                  }}
                >
                  {mood.emoji} {mood.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Reflection text */}
      {meal.notes && (
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#7A7269',
            lineHeight: '1.6',
            fontStyle: 'italic',
          }}
        >
          "{meal.notes}"
        </p>
      )}
    </motion.div>
  );
}
