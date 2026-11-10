import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, User } from 'lucide-react';
import { Button } from './ui/button';
import { MealLogFlow, MealData } from './MealLogFlow';
import { MealEntryCard, MealEntry } from './MealEntryCard';
import { Settings } from './Settings';

interface HomeDashboardProps {
  selectedGoals: string[]; // ['mindful-awareness', 'nutrition-macros']
  userName?: string;
}

export function HomeDashboard({
  selectedGoals,
  userName = 'Raghnya',
}: HomeDashboardProps) {
  // fallback so nothing crashes if array is empty
  const effectiveGoals =
    selectedGoals && selectedGoals.length > 0
      ? selectedGoals
      : ['mindful-awareness'];

  const isMindful = effectiveGoals.includes('mindful-awareness');
  const isNutrition = effectiveGoals.includes('nutrition-macros');
  const isHabit = effectiveGoals.includes('habit-building');

  const [showMealLog, setShowMealLog] = useState(false);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const handleMealLogComplete = (mealData: MealData) => {
    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      photo: mealData.photo,
      description: mealData.description,
      portion: mealData.portion ?? 'normal',
      moods: mealData.moods,
      notes: mealData.notes,
      timestamp: new Date(),
      // if your MealEntry type has extra fields you can pass quantityText, etc here later
    };

    setMeals(prev => [newMeal, ...prev]);
    setShowMealLog(false);
  };

  // if user is currently logging a meal, show the logging flow instead of dashboard
  if (showMealLog) {
    return (
      <MealLogFlow
        selectedGoals={effectiveGoals}
        onComplete={handleMealLogComplete}
        onBack={() => setShowMealLog(false)}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Warm gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at top center, #F5F2ED 0%, #E8D5C8 50%, #C86852 100%)',
          }}
        />

        {/* Faint muggu line pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.04 }}
        >
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern
                id="home-muggu-grid"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="2" fill="#2D2D2D" />
                <line
                  x1="30"
                  y1="0"
                  x2="30"
                  y2="60"
                  stroke="#2D2D2D"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1="30"
                  x2="60"
                  y2="30"
                  stroke="#2D2D2D"
                  strokeWidth="0.5"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="20"
                  stroke="#2D2D2D"
                  strokeWidth="0.3"
                  fill="none"
                />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#home-muggu-grid)" />
          </svg>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-start justify-between"
          >
            {/* left side text */}
            <div className="flex-1">
              <h1
                className="mb-2 text-2xl sm:text-3xl md:text-4xl"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  color: '#2D2D2D',
                  letterSpacing: '0.01em',
                }}
              >
                Hi {userName} 👋
              </h1>

              <p
                className="text-sm sm:text-base"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  color: '#7A7269',
                  letterSpacing: '0.01em',
                  lineHeight: '1.6',
                }}
              >
                Here&apos;s your mindful space for today.
              </p>
            </div>

            {/* right side profile button */}
            <motion.button
              onClick={() => setShowSettings(true)}
              className="flex-shrink-0 ml-4 p-3 rounded-full transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(200, 104, 82, 0.2)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={20} color="#C86852" />
            </motion.button>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <Button
              onClick={() => setShowMealLog(true)}
              className="w-full md:w-auto h-14 px-8 relative overflow-hidden group"
              style={{
                background:
                  'linear-gradient(135deg, #C86852 0%, #E3B660 100%)',
                color: '#FFFFFF',
                borderRadius: '16px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                clipPath:
                  'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
                initial={{ x: '-150%', y: '-150%' }}
                whileHover={{ x: '150%', y: '150%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />

              <Plus className="w-5 h-5 mr-2 relative z-10" />

              <span className="relative z-10">
                Log your meal or reflection
              </span>
            </Button>
          </motion.div>

          {/* Dynamic modules based on goals */}
          <div className="mb-12 space-y-6">
            {isMindful && <MindfulAwarenessModule mealsCount={meals.length} />}
            {isNutrition && <NutritionMacrosModule mealsCount={meals.length} />}
            {isHabit && <HabitBuildingModule mealsCount={meals.length} />}
          </div>

          {/* Patterns section */}
      <YourPatternsSection meals={meals} goals={effectiveGoals} />


          {/* Meal Entries */}
          {meals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <h2
                className="mb-6"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#2D2D2D',
                  letterSpacing: '0.01em',
                }}
              >
                Recent Meals
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal, index) => (
                  <div key={meal.id}>
                    <MealEntryCard meal={meal} index={index} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* SETTINGS OVERLAY */}
      <AnimatePresence>
        {showSettings && (
          <Settings onClose={() => setShowSettings(false)} userName={userName} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ----------------- Goal modules ----------------- */
/* (everything below this stays exactly the same as your file) */
/* ... MindfulAwarenessModule, NutritionMacrosModule, HabitBuildingModule, YourPatternsSection ... */



/* ----------------- Goal modules ----------------- */

function MindfulAwarenessModule({
  mealsCount = 0,
}: {
  mealsCount?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative p-8 rounded-3xl"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(227, 182, 96, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        clipPath:
          'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
      }}
    >
      {/* animated rings bg */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl"
        style={{ opacity: 0.1 }}
      >
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '100px',
                height: '100px',
                border: '2px solid #9CAF88',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">🪷</div>
          <div className="flex-1">
            <h3
              className="mb-2"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                color: '#2D2D2D',
                letterSpacing: '0.01em',
              }}
            >
              Mindful Awareness
            </h3>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                color: '#7A7269',
                lineHeight: '1.6',
              }}
            >
              Your journey begins with observation.
            </p>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl mb-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(156, 175, 136, 0.15) 0%, rgba(156, 175, 136, 0.05) 100%)',
            border: '1px solid rgba(156, 175, 136, 0.2)',
          }}
        >
          <p
            className="mb-3"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '13px',
              color: '#9CAF88',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Today's Reflection
          </p>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2D2D2D',
              lineHeight: '1.6',
              fontStyle: 'italic',
            }}
          >
            "Begin by noticing, not judging. Each meal is a moment to pause."
          </p>
        </div>

        <div className="text-center py-4">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              color: '#7A7269',
            }}
          >
            {mealsCount === 0
              ? 'No meals logged yet today. Ready to begin?'
              : `${mealsCount} ${
                  mealsCount === 1 ? 'meal' : 'meals'
                } logged today. Keep observing.`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function NutritionMacrosModule({
  mealsCount = 0,
}: {
  mealsCount?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative p-8 rounded-3xl"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(227, 182, 96, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        clipPath:
          'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 0px rgba(227, 182, 96, 0)',
            '0 0 20px rgba(227, 182, 96, 0.15)',
            '0 0 0px rgba(227, 182, 96, 0)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">🍽️</div>
          <div className="flex-1">
            <h3
              className="mb-2"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                color: '#2D2D2D',
                letterSpacing: '0.01em',
              }}
            >
              Nutrition & Macros
            </h3>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                color: '#7A7269',
                lineHeight: '1.6',
              }}
            >
              Understanding what fuels you.
            </p>
          </div>
        </div>

        {/* Macro Ring Placeholder */}
        <div className="flex flex-col items-center justify-center py-8">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="mb-6"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#E8E4DF"
              strokeWidth="20"
            />

            <text
              x="100"
              y="95"
              textAnchor="middle"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '36px',
                fill: '#2D2D2D',
              }}
            >
              {mealsCount}
            </text>

            <text
              x="100"
              y="115"
              textAnchor="middle"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fill: '#7A7269',
              }}
            >
              {mealsCount === 1 ? 'meal today' : 'meals today'}
            </text>
          </svg>

          <div className="grid grid-cols-3 gap-6 w-full max-w-md">
            {[
              { label: 'Protein', value: '0g', color: '#C86852' },
              { label: 'Carbs', value: '0g', color: '#E3B660' },
              { label: 'Fat', value: '0g', color: '#9CAF88' },
            ].map((macro, index) => (
              <motion.div
                key={macro.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: macro.color }}
                />
                <p
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '20px',
                    color: '#2D2D2D',
                    marginBottom: '4px',
                  }}
                >
                  {macro.value}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: '#7A7269',
                  }}
                >
                  {macro.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center py-4">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              color: '#7A7269',
            }}
          >
            {mealsCount === 0
              ? 'Log your first meal to start tracking.'
              : 'Your nutrition overview is building.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HabitBuildingModule({
  mealsCount = 0,
}: {
  mealsCount?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative p-8 rounded-3xl"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(227, 182, 96, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        clipPath:
          'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
      }}
    >
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">🔁</div>
          <div className="flex-1">
            <h3
              className="mb-2"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                color: '#2D2D2D',
                letterSpacing: '0.01em',
              }}
            >
              Habit Building
            </h3>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                color: '#7A7269',
                lineHeight: '1.6',
              }}
            >
              Building your mindful rhythm.
            </p>
          </div>
        </div>

        {/* streak */}
        <div
          className="p-6 rounded-2xl mb-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(200, 104, 82, 0.1) 0%, rgba(227, 182, 96, 0.05) 100%)',
            border: '1px solid rgba(200, 104, 82, 0.15)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                color: '#C86852',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Current Streak
            </p>
            <div className="text-2xl">🔥</div>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '48px',
                color: '#2D2D2D',
              }}
            >
              {mealsCount > 0 ? 1 : 0}
            </span>

            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                color: '#7A7269',
              }}
            >
              {mealsCount > 0 && mealsCount === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        {/* weekly progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                color: '#2D2D2D',
              }}
            >
              This Week's Progress
            </p>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: '#7A7269',
              }}
            >
              {mealsCount > 0 ? 1 : 0}/7 days
            </p>
          </div>

          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: '#E8E4DF' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, #C86852 0%, #E3B660 100%)',
              }}
              initial={{ width: '0%' }}
              animate={{
                width: mealsCount > 0 ? '14.3%' : '0%',
              }}
              transition={{
                duration: 1,
                ease: 'easeOut',
                delay: 0.3,
              }}
            />
          </div>
        </div>

        <div className="text-center py-4">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              color: '#2D2D2D',
              lineHeight: '1.6',
              fontStyle: 'italic',
            }}
          >
            {mealsCount === 0
              ? '"Every journey begins with a single step. Log your first meal to start building your rhythm."'
              : '"Beautiful! You\'ve started your mindful rhythm. Keep going."'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------- Patterns section ----------------- */
/* ----------------- Patterns section ----------------- */
type PatternsProps = {
  meals: MealEntry[];
  goals: string[];
};


// tiny helper: classify time of day
function getTimeOfDay(date: Date): 'breakfast' | 'lunch' | 'dinner' | 'late-night' {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'breakfast';
  if (h >= 11 && h < 16) return 'lunch';
  if (h >= 16 && h < 22) return 'dinner';
  return 'late-night';
}

// summarize “mindful” side
function computeMindfulPatterns(meals: MealEntry[]) {
  if (meals.length === 0) {
    return {
      commonTime: null as string | null,
      dominantPortion: null as string | null,
      topMoods: [] as string[],
    };
  }

  const moodCounts: Record<string, number> = {};
  const portionCounts: Record<string, number> = {};
  const timeCounts: Record<string, number> = {};

  for (const meal of meals) {
    // moods
    (meal.moods || []).forEach((m) => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });

    // portion
    if (meal.portion) {
      portionCounts[meal.portion] = (portionCounts[meal.portion] || 0) + 1;
    }

    // time of day
    if (meal.timestamp) {
      const t = getTimeOfDay(new Date(meal.timestamp));
      timeCounts[t] = (timeCounts[t] || 0) + 1;
    }
  }

  const sortedMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([m]) => m);

  const sortedPortions = Object.entries(portionCounts).sort((a, b) => b[1] - a[1]);
  const sortedTimes = Object.entries(timeCounts).sort((a, b) => b[1] - a[1]);

  return {
    commonTime: sortedTimes[0]?.[0] ?? null,
    dominantPortion: sortedPortions[0]?.[0] ?? null,
    topMoods: sortedMoods.slice(0, 2), // top 2 moods
  };
}

// super-simple nutrition classifier just for demo
function classifyNutritionTrend(meals: MealEntry[]): {
  headline: string;
  tag: string;
} | null {
  if (meals.length === 0) return null;

  const text = (meals[0].description || '').toLowerCase(); // look at most recent meal

  const carbWords = ['rice', 'roti', 'naan', 'bread', 'biryani', 'pasta', 'noodle', 'idli', 'dosa', 'poha'];
  const proteinWords = ['egg', 'paneer', 'chicken', 'fish', 'dal', 'lentil', 'tofu', 'chana', 'rajma'];
  const vegWords = ['salad', 'sabzi', 'vegetable', 'greens', 'bhindi', 'palak'];

  const has = (words: string[]) => words.some((w) => text.includes(w));

  if (has(carbWords) && !has(proteinWords)) {
    return {
      headline: 'This meal looked carb-forward.',
      tag: 'Carb-heavy · full, cozy fuel',
    };
  }

  if (has(proteinWords) && !has(carbWords)) {
    return {
      headline: 'This meal focused on protein.',
      tag: 'Protein-forward · steady energy',
    };
  }

  if (has(vegWords)) {
    return {
      headline: 'This meal had a good veggie base.',
      tag: 'Veg-rich · gentle on digestion',
    };
  }

  return {
    headline: 'This meal looked fairly balanced.',
    tag: 'Balanced plate · everyday fuel',
  };
}

function prettyTimeLabel(t: string | null): string {
  if (!t) return 'all over the day';
  if (t === 'late-night') return 'late at night';
  return `mostly around ${t}`;
}

function prettyPortionLabel(p: string | null): string {
  if (!p) return 'mixed portions';
  if (p === 'light') return 'lighter plates';
  if (p === 'heavy') return 'heavier, more filling plates';
  return 'comfortable, everyday portions';
}

function YourPatternsSection({ meals, goals }: PatternsProps) {
  const hasMindful = goals.includes('mindful-awareness');
  const hasNutrition = goals.includes('nutrition-macros');

  const hasMeals = meals.length > 0;
  const recentMeals = meals.slice(0, 10);

  // ---------- tiny helpers ----------
  const getDaypart = (d: Date) => {
    const h = d.getHours();
    if (h < 11) return 'breakfast';
    if (h < 16) return 'lunch';
    if (h < 21) return 'dinner';
    return 'late-night';
  };

  const mostCommon = <T,>(items: T[]): T | null => {
    if (!items.length) return null;
    const map = new Map<T, number>();
    items.forEach(i => map.set(i, (map.get(i) || 0) + 1));
    let best: T | null = null;
    let bestCount = 0;
    for (const [k, v] of map.entries()) {
      if (v > bestCount) {
        best = k;
        bestCount = v;
      }
    }
    return best;
  };

  const dayparts = recentMeals.map(m => getDaypart(m.timestamp));
  const dominantDaypart = mostCommon(dayparts);

  const allMoods = recentMeals.flatMap(m => m.moods || []);
  const dominantMood = mostCommon(allMoods);

  const portions = recentMeals.map(m => m.portion);
  const dominantPortion = mostCommon(portions);

  const descriptionText = recentMeals[0]?.description || '';

  // very simple nutrition hint based on keywords
  const dText = descriptionText.toLowerCase();
  let nutritionTag: 'carb-heavy' | 'protein-forward' | 'rich' | 'balanced' = 'balanced';
  let nutritionLabel = 'Balanced plate';
  let nutritionLine = 'This looks like a pretty balanced meal overall.';

  const carbWords = ['rice', 'roti', 'chapati', 'bread', 'naan', 'pasta', 'noodle', 'biryani', 'poori', 'idli', 'dosa'];
  const proteinWords = ['dal', 'lentil', 'paneer', 'chicken', 'egg', 'fish', 'tofu', 'chana', 'rajma', 'curd', 'yogurt'];
  const richWords = ['fried', 'oil', 'butter', 'ghee', 'cheese', 'cream', 'halwa', 'dessert', 'sweet'];

  const hasCarb = carbWords.some(w => dText.includes(w));
  const hasProtein = proteinWords.some(w => dText.includes(w));
  const hasRich = richWords.some(w => dText.includes(w));

  if (hasCarb && !hasProtein && !hasRich) {
    nutritionTag = 'carb-heavy';
    nutritionLabel = 'Mostly carbs';
    nutritionLine = 'This meal leans more on comforting carbs. Great for energy, but pair with protein or veggies next time.';
  } else if (hasProtein && !hasCarb && !hasRich) {
    nutritionTag = 'protein-forward';
    nutritionLabel = 'Protein-forward';
    nutritionLine = 'Nice! This looks more protein-centered, helpful for staying full and supporting recovery.';
  } else if (hasRich) {
    nutritionTag = 'rich';
    nutritionLabel = 'Richer / indulgent';
    nutritionLine = 'This one feels more indulgent or rich. Lovely when enjoyed mindfully and not too often.';
  }

  // copy on mindful summary
  const daypartText =
    dominantDaypart === 'breakfast'
      ? 'mornings'
      : dominantDaypart === 'lunch'
      ? 'around lunch'
      : dominantDaypart === 'dinner'
      ? 'around dinner'
      : dominantDaypart === 'late-night'
      ? 'later in the night'
      : 'across the day';

  const portionText =
    dominantPortion === 'light'
      ? 'lighter, gentle portions'
      : dominantPortion === 'heavy'
      ? 'heartier, heavier plates'
      : 'comfortable, everyday portions';

  const moodLabel =
    dominantMood === 'comforting'
      ? 'comforted'
      : dominantMood === 'fresh'
      ? 'fresh and clear'
      : dominantMood === 'spicy'
      ? 'spiced-up and awake'
      : dominantMood === 'heavy'
      ? 'a bit weighed down'
      : dominantMood === 'energizing'
      ? 'energised'
      : dominantMood === 'calm'
      ? 'calm and grounded'
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative mb-4"
    >
      <h2
        className="mb-4"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '24px',
          color: '#2D2D2D',
          letterSpacing: '0.01em',
        }}
      >
        Your Patterns
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Mindful card */}
        {hasMindful && (
          <motion.div
            className="relative p-5 rounded-3xl overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249, 240, 228, 0.95) 100%)',
              border: '1px solid rgba(227, 182, 96, 0.35)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* tiny muggu-ish dots */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 0 0, #C86852 1px, transparent 0), radial-gradient(circle at 20px 20px, #E3B660 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative z-10">
              <p
                className="uppercase tracking-[0.18em] text-[10px] mb-1"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#C86852',
                  fontWeight: 600,
                }}
              >
                MINDFUL JOURNEY
              </p>

              {hasMeals ? (
                <>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#2D2D2D',
                    }}
                  >
                    You’ve been choosing{' '}
                    <span style={{ textDecoration: 'underline' }}>
                      {portionText}
                    </span>{' '}
                    mostly{' '}
                    <span style={{ textDecoration: 'underline' }}>
                      {daypartText}
                    </span>
                    .
                  </p>

                  <p
                    className="mb-3 text-xs leading-relaxed"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#7A7269',
                    }}
                  >
                    {moodLabel
                      ? `Meals most often leave you feeling ${moodLabel}. Aaroha will keep nudging you towards what actually supports you.`
                      : 'As you log more entries, Aaroha will show how your meals and moods dance together.'}
                  </p>

                  {dominantMood && (
                    <div
                      className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-xs"
                      style={{
                        background: 'rgba(250, 244, 236, 0.9)',
                        border: '1px solid rgba(227,182,96,0.7)',
                        fontFamily: 'Inter, sans-serif',
                        color: '#7A7269',
                      }}
                    >
                      <span>✨</span>
                      <span>
                        Feels{' '}
                        {dominantMood === 'comforting'
                          ? 'comforting'
                          : dominantMood}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#2D2D2D',
                      marginBottom: '4px',
                    }}
                  >
                    Your mindful patterns will appear here.
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#7A7269',
                    }}
                  >
                    Log a few meals with how they felt, and Aaroha will start
                    reflecting back your most comforting, energising, and grounding
                    meals.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Nutrition card */}
        {hasNutrition && (
          <motion.div
            className="relative p-5 rounded-3xl overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245, 235, 217, 0.95) 100%)',
              border: '1px solid rgba(156, 175, 136, 0.4)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* subtle ring decoration */}
            <div className="absolute -right-6 -bottom-8 opacity-20 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  stroke="#9CAF88"
                  strokeWidth="2"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="26"
                  fill="none"
                  stroke="#C86852"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="relative z-10">
              <p
                className="uppercase tracking-[0.18em] text-[10px] mb-1"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#7A7269',
                  fontWeight: 600,
                }}
              >
                NUTRITION SNAPSHOT
              </p>

              {hasMeals ? (
                <>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#2D2D2D',
                    }}
                  >
                    Your last meal looked{' '}
                    <span style={{ textDecoration: 'underline' }}>
                      {nutritionLabel.toLowerCase()}
                    </span>
                    .
                  </p>

                  <p
                    className="mb-3 text-xs leading-relaxed"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#7A7269',
                    }}
                  >
                    {nutritionLine}
                  </p>

                  <p
                    className="mt-2 text-[11px]"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#9B8C7A',
                    }}
                  >
                    In the full version, this area will show **calorie
                    estimates, macros, and swap ideas**. For now, it gives a
                    gentle hint about whether your plate leans towards carbs,
                    protein, or an indulgent treat.
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px]"
                    style={{
                      background: 'rgba(248, 244, 236, 0.9)',
                      border: '1px dashed rgba(227,182,96,0.7)',
                      fontFamily: 'Inter, sans-serif',
                      color: '#7A7269',
                    }}
                  >
                    <span>
                      {nutritionTag === 'carb-heavy'
                        ? '🍚'
                        : nutritionTag === 'protein-forward'
                        ? '🥚'
                        : nutritionTag === 'rich'
                        ? '🍰'
                        : '🥗'}
                    </span>
                    <span>
                      {nutritionTag === 'carb-heavy'
                        ? 'Carb-comforting plate'
                        : nutritionTag === 'protein-forward'
                        ? 'Protein-supportive plate'
                        : nutritionTag === 'rich'
                        ? 'Richer / treat-style plate'
                        : 'Balanced-feeling plate'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#2D2D2D',
                      marginBottom: '4px',
                    }}
                  >
                    Your nutrition hints will show here.
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#7A7269',
                    }}
                  >
                    As you log meals with portions and rough quantities, Aaroha
                    will gently highlight whether you’re leaning more towards
                    carbs, protein, or richer treats.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}



export default HomeDashboard;
