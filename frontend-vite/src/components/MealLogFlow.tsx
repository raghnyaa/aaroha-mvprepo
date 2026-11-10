import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { getToken } from '../api/auth';

/* -----------------------------
   Types
------------------------------ */

export interface MealData {
  photo: string | null;
  description: string;
  portion: 'light' | 'normal' | 'heavy' | null;
  moods: string[];
  notes: string;
  quantityText: string;
}

interface MealLogFlowProps {
  onComplete: (mealData: MealData) => void;
  onBack: () => void;
  selectedGoals: string[]; // ['mindful-awareness', 'nutrition-macros']
}

const moods = [
  { id: 'comforting', label: 'Comforting', emoji: '🧡' },
  { id: 'fresh',      label: 'Fresh',      emoji: '🌿' },
  { id: 'spicy',      label: 'Spicy',      emoji: '🌶️' },
  { id: 'heavy',      label: 'Heavy',      emoji: '😮‍💨' },
  { id: 'energizing', label: 'Energizing', emoji: '⚡' },
  { id: 'calm',       label: 'Calm',       emoji: '😌' },
];

// tiny demo calorie heuristic
function estimateCaloriesFromQuantity(q: string | undefined | null): number | null {
  if (!q) return null;
  const text = q.toLowerCase();

  if (text.includes('large')) return 500;
  if (text.includes('medium') || text.includes('regular')) return 380;
  if (text.includes('small')) return 250;
  if (text.includes('2')) return 450;
  if (text.includes('1')) return 250;

  return null;
}

/* -----------------------------
   Root flow
------------------------------ */

export function MealLogFlow({
  onComplete,
  onBack,
  selectedGoals,
}: MealLogFlowProps) {
  const isMindful   = selectedGoals.includes('mindful-awareness');
  const isNutrition = selectedGoals.includes('nutrition-macros');

  const modeLabel =
    isMindful && isNutrition
      ? 'Mindful + Nutrition'
      : isMindful
      ? 'Mindful Eating'
      : 'Nutrition & Macros';

  // top-level screen: capture vs reflect
  const [screen, setScreen] = useState<'capture' | 'reflect'>('capture');

  const [mealData, setMealData] = useState<MealData>({
    photo: null,
    description: '',
    portion: null,
    moods: [],
    notes: '',
    quantityText: '',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // when true: show "What did you eat?" + portion

  /* ------------------ Save to backend (with soft fallback) ------------------ */

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!mealData.portion) {
        alert('Pick a portion size before saving.');
        setIsSaving(false);
        return;
      }

      const payload = {
        description: mealData.description?.trim() ?? '',
        notes: mealData.notes ?? '',
        moods: mealData.moods ?? [],
        portion: mealData.portion,
        photo: mealData.photo,
        quantityText: mealData.quantityText,
        timestampMeal: new Date().toISOString(),
        modes: {
          mindful: isMindful,
          nutrition: isNutrition,
        },
      };

      const token = getToken();

      const resp = await fetch('http://127.0.0.1:4000/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      console.log('[Save] status/text:', resp.status, text);

      if (resp.status === 401) {
        console.warn('[Save] unauthorized, falling back to local only');
        alert(
          "Looks like you're not logged in, so this meal won't be saved to the server.\n\n" +
          'But Aaroha will still remember it locally for this session 💛'
        );
        onComplete({ ...mealData });
        return;
      }

      if (!resp.ok) {
        throw new Error(`Save failed ${resp.status}: ${text}`);
      }

      onComplete({ ...mealData });
    } catch (err: any) {
      console.error('[Save] error:', err);
      alert(err?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  /* ------------------ YOLO analyze call ------------------ */

  async function runAnalyzeOnServer(file: File) {
    setIsAnalyzing(true);
    setShowDetails(false);
    try {
      const form = new FormData();
      form.append('file', file);
      const token = getToken();

      const resp = await fetch('http://127.0.0.1:4000/api/meals/analyze', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      const data = await resp.json();
      console.log('[Analyze] result:', data);
      setAnalyzeResult(data);

      if (data?.detections?.length > 0) {
        const guessList = data.detections
          .map((d: any) => d.class_name || d.label)
          .join(', ');

        setMealData(prev => ({
          ...prev,
          description: prev.description || guessList,
        }));
      }

      // Once YOLO has looked at it, reveal the rest of the form
      setShowDetails(true);
    } catch (err) {
      console.error('analyze failed', err);
      alert('We could not analyze this photo, but you can still log your meal.');
      setShowDetails(true); // still let user continue
    } finally {
      setIsAnalyzing(false);
    }
  }

  /* ------------------ Render ------------------ */

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top center, #F5F2ED 0%, #E8D5C8 55%, #C86852 105%)',
        }}
      />

      {/* Faint muggu grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.06 }}
      >
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern
              id="meal-log-grid"
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
          <rect width="100%" height="100%" fill="url(#meal-log-grid)" />
        </svg>
      </div>

      {/* Content column */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header row */}
        <div className="px-6 py-6 flex items-center justify-between">
          <button
            onClick={screen === 'capture' ? onBack : () => setScreen('capture')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{
              color: '#2D2D2D',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {/* step indicator */}
            <div
              className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(200,104,82,0.25)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#7A7269',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '999px',
                  background:
                    screen === 'capture'
                      ? 'linear-gradient(135deg, #C86852 0%, #E3B660 100%)'
                      : '#E8E4DF',
                }}
              />
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '999px',
                  background:
                    screen === 'reflect'
                      ? 'linear-gradient(135deg, #C86852 0%, #E3B660 100%)'
                      : '#E8E4DF',
                }}
              />
              <span>
                {screen === 'capture' ? 'Step 1 · Capture' : 'Step 2 · Reflect'}
              </span>
            </div>

            {/* mode pill */}
            <span
              className="text-xs sm:text-sm px-3 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(200,104,82,0.25)',
                fontFamily: 'Inter, sans-serif',
                color: '#7A7269',
              }}
            >
              Mode: {modeLabel}
            </span>
          </div>
        </div>

        {/* Screen body */}
        <div className="flex-1 px-6 pb-10">
          <AnimatePresence mode="wait">
            {screen === 'capture' ? (
              <motion.div
                key="capture-screen"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <MealCaptureStep
                  mealData={mealData}
                  setMealData={setMealData}
                  isAnalyzing={isAnalyzing}
                  showDetails={showDetails}
                  setPhotoFile={setPhotoFile}
                  runAnalyze={runAnalyzeOnServer}
                  onNext={() => setScreen('reflect')}
                  isMindful={isMindful}
                  isNutrition={isNutrition}
                />
              </motion.div>
            ) : (
              <motion.div
                key="reflect-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <MealReflectStep
                  mealData={mealData}
                  setMealData={setMealData}
                  toggleMood={id =>
                    setMealData(prev => ({
                      ...prev,
                      moods: prev.moods.includes(id)
                        ? prev.moods.filter(m => m !== id)
                        : [...prev.moods, id],
                    }))
                  }
                  onSave={handleSave}
                  isSaving={isSaving}
                  isMindful={isMindful}
                  isNutrition={isNutrition}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Saving transition */}
      {isSaving && <MugguBloomTransition />}
    </div>
  );
}

/* -----------------------------
   Step 1: Capture (photo + details)
------------------------------ */

interface CaptureProps {
  mealData: MealData;
  setMealData: React.Dispatch<React.SetStateAction<MealData>>;
  isAnalyzing: boolean;
  showDetails: boolean;
  setPhotoFile: (f: File | null) => void;
  runAnalyze: (file: File) => Promise<void>;
  onNext: () => void;
  isMindful: boolean;
  isNutrition: boolean;
}

function MealCaptureStep({
  mealData,
  setMealData,
  isAnalyzing,
  showDetails,
  setPhotoFile,
  runAnalyze,
  onNext,
  isMindful,
  isNutrition,
}: CaptureProps) {
  const [isReadingFile, setIsReadingFile] = useState(false);

  const handleFileToBase64 = (file: File) => {
    setIsReadingFile(true);
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = async () => {
      setMealData(prev => ({ ...prev, photo: reader.result as string }));
      setIsReadingFile(false);
      await runAnalyze(file);
    };
    reader.readAsDataURL(file);
  };

  const canProceed =
    showDetails &&
    mealData.description.trim() !== '' &&
    mealData.portion !== null &&
    !isReadingFile &&
    !isAnalyzing;

  let title = 'Log Your Meal';
  if (isMindful && !isNutrition) title = 'Log Your Meal (Mindful)';
  if (isNutrition && !isMindful) title = 'Log Your Meal (Nutrition)';

  return (
    <div className="max-w-2xl mx-auto">
      <h1
        className="mb-4 sm:mb-6 text-center sm:text-left"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '28px',
          color: '#2D2D2D',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h1>

      <p
        className="mb-6 text-sm sm:text-base"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#7A7269',
          lineHeight: 1.5,
        }}
      >
        Start with a quick snap. Aaroha will recognize your meal, then guide you
        through just a few questions.
      </p>

      {/* Photo card */}
      <motion.div
        className="mb-7 relative rounded-[24px] overflow-hidden group"
        style={{
          minHeight: '320px',
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '2px dashed rgba(200, 104, 82, 0.35)',
          position: 'relative',
        }}
        animate={{
          boxShadow: [
            '0 0 0px rgba(200,104,82,0)',
            '0 0 16px rgba(200,104,82,0.18)',
            '0 0 0px rgba(200,104,82,0)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {mealData.photo ? (
          <>
            <img
              src={mealData.photo}
              alt="Meal preview"
              className="w-full h-full object-cover"
            />

            {/* gradient overlay bottom controls */}
            <div
              className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-t from-black/55 via-black/35 to-transparent"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <label className="flex-1 cursor-pointer py-2 px-3 rounded-lg text-center text-white text-sm font-medium border border-white/40 bg-white/15">
                Replace Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileToBase64(file);
                  }}
                />
              </label>

              <button
                onClick={() => {
                  setMealData(prev => ({
                    ...prev,
                    photo: null,
                    description: '',
                  }));
                  setPhotoFile(null);
                }}
                className="flex-1 py-2 px-3 rounded-lg text-center text-white text-sm font-medium border border-white/40 bg-transparent hover:bg-white/10 transition"
              >
                Remove
              </button>
            </div>

            {/* analyze overlay */}
            <AnimatePresence>
              {(isReadingFile || isAnalyzing) && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full border-2 border-white/60 border-t-transparent mb-3"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                  />
                  <p
                    className="text-sm sm:text-base text-white"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {isReadingFile
                      ? 'Loading photo…'
                      : 'Aaroha is studying your meal…'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <Camera
              className="mb-3"
              style={{
                width: '48px',
                height: '48px',
                color: '#C86852',
                opacity: 0.6,
              }}
            />
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: '#7A7269',
                lineHeight: 1.4,
              }}
            >
              Add a photo of your meal
              <br />
              <span className="text-sm">
                Aaroha will try to guess what&apos;s on your plate.
              </span>
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <label
                className="flex-1 cursor-pointer py-3 px-4 rounded-xl text-center transition-all"
                style={{
                  background:
                    'linear-gradient(135deg, #C86852 0%, #E3B660 100%)',
                  color: '#FFFFFF',
                  border: '2px solid #E3B660',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '15px',
                }}
              >
                Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileToBase64(file);
                  }}
                />
              </label>

              <label
                className="flex-1 cursor-pointer py-3 px-4 rounded-xl text-center transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  color: '#2D2D2D',
                  border: '2px solid rgba(200,104,82,0.2)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '15px',
                }}
              >
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileToBase64(file);
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </motion.div>

      {/* subtle hint row */}
      {!showDetails && (
        <p
          className="mb-6 text-sm text-center sm:text-left"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#7A7269',
          }}
        >
          Once Aaroha recognizes your meal, we&apos;ll ask what you ate and how
          much. You can edit anything before continuing.
        </p>
      )}

      {/* Details appear only after YOLO step */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {/* What did you eat? */}
            <div className="mb-6">
              <Label
                htmlFor="meal-description"
                style={{
                  color: '#2D2D2D',
                  marginBottom: '8px',
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                What did you eat?
              </Label>
              <Input
                id="meal-description"
                type="text"
                placeholder="e.g., gajar ka halwa + a small bowl of rice"
                value={mealData.description}
                onChange={e =>
                  setMealData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="focus-input"
                style={{
                  border: '1.5px solid #E3B660',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  fontSize: '16px',
                  background: 'rgba(255,255,255,0.8)',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {/* Portion */}
            <div className="mb-8">
              <Label
                style={{
                  color: '#2D2D2D',
                  marginBottom: '12px',
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                Portion size
              </Label>
              <div className="flex gap-3">
                {(['light', 'normal', 'heavy'] as const).map(portion => (
                  <button
                    key={portion}
                    onClick={() =>
                      setMealData(prev => ({ ...prev, portion }))
                    }
                    className="flex-1 py-3 px-4 rounded-xl transition-all"
                    style={{
                      background:
                        mealData.portion === portion
                          ? 'linear-gradient(135deg, #C86852 0%, #E3B660 100%)'
                          : 'rgba(255, 255, 255, 0.8)',
                      color:
                        mealData.portion === portion
                          ? '#FFFFFF'
                          : '#2D2D2D',
                      border:
                        mealData.portion === portion
                          ? '2px solid #E3B660'
                          : '2px solid rgba(200, 104, 82, 0.2)',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '15px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {portion}
                  </button>
                ))}
              </div>
            </div>

            {/* Next button */}
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="w-full h-14 relative overflow-hidden group disabled:opacity-55 disabled:cursor-not-allowed"
              style={{
                background: canProceed
                  ? 'linear-gradient(135deg, #C86852 0%, #E3B660 100%)'
                  : '#E8E4DF',
                color: canProceed ? '#FFFFFF' : '#7A7269',
                borderRadius: '16px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                clipPath:
                  'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
              }}
            >
              {canProceed && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
                  initial={{ x: '-150%', y: '-150%' }}
                  whileHover={{ x: '150%', y: '150%' }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              )}

              <motion.span
                className="relative z-10 flex items-center justify-center gap-2"
                whileTap={canProceed ? { scale: 0.98 } : {}}
                transition={{ duration: 0.1 }}
              >
                Next → Reflect
              </motion.span>
            </Button>

            <style>{`
              .focus-input:focus {
                outline: none;
                border-color: #E3B660;
                box-shadow:
                  0 0 0 3px rgba(227, 182, 96, 0.2),
                  0 0 12px rgba(227, 182, 96, 0.3);
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -----------------------------
   Step 2: Reflect / Nutrition
------------------------------ */

interface ReflectProps {
  mealData: MealData;
  setMealData: React.Dispatch<React.SetStateAction<MealData>>;
  toggleMood: (moodId: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isMindful: boolean;
  isNutrition: boolean;
}

function MealReflectStep({
  mealData,
  setMealData,
  toggleMood,
  onSave,
  isSaving,
  isMindful,
  isNutrition,
}: ReflectProps) {
  const calories = estimateCaloriesFromQuantity(mealData.quantityText);

  let title = 'How did this meal feel?';
  if (isNutrition && !isMindful) title = "Let's capture the details";
  if (isMindful && isNutrition)
    title = 'How did it feel — and how much?';

  return (
    <div className="max-w-2xl mx-auto">
      <h1
        className="mb-6 text-center sm:text-left"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '28px',
          color: '#2D2D2D',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h1>

      {/* Mindful block */}
      {isMindful && (
        <>
          <div className="mb-6">
            <Label
              style={{
                color: '#2D2D2D',
                marginBottom: '12px',
                display: 'block',
                fontSize: '15px',
                fontWeight: 500,
              }}
            >
              Select all that apply
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moods.map((mood, index) => (
                <div key={mood.id}>
                  <MoodChip
                    mood={mood}
                    isSelected={mealData.moods.includes(mood.id)}
                    onToggle={() => toggleMood(mood.id)}
                    delay={index * 0.05}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={isNutrition ? 'mb-6' : 'mb-8'}>
            <Label
              htmlFor="meal-notes"
              style={{
                color: '#2D2D2D',
                marginBottom: '8px',
                display: 'block',
                fontSize: '15px',
                fontWeight: 500,
              }}
            >
              Notes (optional)
            </Label>
            <Textarea
              id="meal-notes"
              placeholder="e.g., I felt full but grounded."
              value={mealData.notes}
              onChange={e =>
                setMealData(prev => ({ ...prev, notes: e.target.value }))
              }
              rows={4}
              className="focus-input"
              style={{
                border: '1.5px solid #E3B660',
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.8)',
                transition: 'all 0.3s ease',
                resize: 'none',
              }}
            />
          </div>
        </>
      )}

      {/* Nutrition block */}
      {isNutrition && (
        <div className="mb-8">
          <Label
            style={{
              color: '#2D2D2D',
              marginBottom: '8px',
              display: 'block',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            For macros, roughly how much did you have?
          </Label>
          <p
            className="mb-3 text-sm"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#7A7269',
            }}
          >
            For this demo, try something like “1 small bowl of gajar ka
            halwa” or “2 rotis”.
          </p>
          <Input
            type="text"
            placeholder="e.g., 1 small bowl / ~200g"
            value={mealData.quantityText}
            onChange={e =>
              setMealData(prev => ({
                ...prev,
                quantityText: e.target.value,
              }))
            }
            className="focus-input"
            style={{
              border: '1.5px solid #E3B660',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '15px',
              background: 'rgba(255,255,255,0.8)',
              transition: 'all 0.3s ease',
            }}
          />

          <div className="mt-4 text-sm">
            {calories ? (
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#2D2D2D',
                }}
              >
                ⭐ For this portion, Aaroha estimates around{' '}
                <strong>{calories} kcal</strong>.
              </p>
            ) : (
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#7A7269',
                }}
              >
                In the full version, Aaroha will break this down into calories
                & macros for you.
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={onSave}
        disabled={isSaving}
        className="w-full h-14 relative overflow-hidden group disabled:opacity-70"
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
        {!isSaving && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
            initial={{ x: '-150%', y: '-150%' }}
            whileHover={{ x: '150%', y: '150%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        )}

        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          whileTap={!isSaving ? { scale: 0.98 } : {}}
          transition={{ duration: 0.1 }}
        >
          {isSaving ? 'Saving...' : (<><Check className="w-5 h-5" />Save Meal</>)}
        </motion.span>
      </Button>
    </div>
  );
}

/* -----------------------------
   MoodChip
------------------------------ */

interface MoodChipProps {
  mood: { id: string; label: string; emoji: string };
  isSelected: boolean;
  onToggle: () => void;
  delay: number;
}

function MoodChip({ mood, isSelected, onToggle, delay }: MoodChipProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative py-3 px-4 rounded-full transition-all w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, #E3B660 0%, #C86852 100%)'
          : 'rgba(255, 255, 255, 0.8)',
        color: isSelected ? '#FFFFFF' : '#2D2D2D',
        border: isSelected
          ? '2px solid #E3B660'
          : '2px solid rgba(200, 104, 82, 0.2)',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: '15px',
      }}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ boxShadow: '0 0 0px rgba(227, 182, 96, 0)' }}
            animate={{
              boxShadow: [
                '0 0 0px rgba(227,182,96,0)',
                '0 0 20px rgba(227,182,96,0.8)',
                '0 0 8px rgba(227,182,96,0.3)',
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10 flex items-center justify-center gap-2">
        <span>{mood.emoji}</span>
        <span>{mood.label}</span>
      </span>
    </motion.button>
  );
}

/* -----------------------------
   MugguBloomTransition
------------------------------ */

function MugguBloomTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 12, opacity: 0.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ color: '#E3B660' }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: '#F5F2ED' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
    </motion.div>
  );
}
