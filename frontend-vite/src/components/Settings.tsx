import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Target, 
  CreditCard, 
  Trash2,
  Bell,
  Heart,
  Utensils,
  Moon,
  Mail,
  Shield,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Switch } from './ui/switch';
import { useState, React } from 'react';

interface SettingsProps {
  onClose: () => void;
  userName?: string;
}

export function Settings({ onClose, userName = 'Raghnya' }: SettingsProps) {
  const [mindfulMode, setMindfulMode] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, #F5F2ED 0%, #E8D5C8 50%, #C86852 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Settings Panel */}
      <motion.div
        className="absolute inset-0 flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(200, 104, 82, 0.1)',
          }}
        >
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <ArrowLeft size={24} color="#2D2D2D" />
          </button>
          
          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '20px',
              color: '#2D2D2D',
              letterSpacing: '0.01em',
            }}
          >
            Settings
          </h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Profile Section */}
            <motion.div
              className="mb-8 p-4 sm:p-5 rounded-2xl flex items-center gap-3 sm:gap-4"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(200, 104, 82, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #E3B660 0%, #C86852 100%)',
                }}
              >
                <span
                  className="text-xl sm:text-2xl"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    color: '#FFFFFF',
                  }}
                >
                  {userName[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-base sm:text-lg truncate"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    color: '#2D2D2D',
                  }}
                >
                  {userName}
                </p>
                <p
                  className="text-xs sm:text-sm"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#7A7269',
                  }}
                >
                  View and edit profile
                </p>
              </div>
              <ChevronRight size={20} color="#7A7269" className="flex-shrink-0" />
            </motion.div>

            {/* Account Section */}
            <SettingsSection title="Account" delay={0.2}>
              <SettingsItem
                icon={<User size={20} />}
                label="Profile & Goals"
                onClick={() => {}}
              />
              <SettingsItem
                icon={<CreditCard size={20} />}
                label="Subscription"
                badge="Free"
                onClick={() => {}}
              />
              <SettingsItem
                icon={<Trash2 size={20} />}
                label="Delete Account"
                destructive
                onClick={() => {}}
              />
            </SettingsSection>

            {/* Wellbeing Section */}
            <SettingsSection title="Wellbeing" delay={0.3}>
              <SettingsItem
                icon={<Bell size={20} />}
                label="Reflection reminders"
                subtitle="Daily mindful check-ins"
                onClick={() => {}}
              />
              <SettingsItem
                icon={<Utensils size={20} />}
                label="Meal preferences"
                subtitle="Dietary restrictions & goals"
                onClick={() => {}}
              />
              <SettingsItem
                icon={<Moon size={20} />}
                label="Mindful mode"
                subtitle="Calm, distraction-free experience"
                toggle
                toggleValue={mindfulMode}
                onToggle={setMindfulMode}
              />
            </SettingsSection>

            {/* Notifications Section */}
            <SettingsSection title="Notifications" delay={0.4}>
              <SettingsItem
                icon={<Bell size={20} />}
                label="Push alerts"
                subtitle="Meal logging reminders"
                toggle
                toggleValue={pushAlerts}
                onToggle={setPushAlerts}
              />
              <SettingsItem
                icon={<Mail size={20} />}
                label="Email updates"
                subtitle="Weekly insights & tips"
                toggle
                toggleValue={emailUpdates}
                onToggle={setEmailUpdates}
              />
            </SettingsSection>

            {/* Privacy Section */}
            <SettingsSection title="Privacy" delay={0.5}>
              <SettingsItem
                icon={<Shield size={20} />}
                label="Data & Permissions"
                subtitle="Manage your privacy settings"
                onClick={() => {}}
              />
              <SettingsItem
                icon={<HelpCircle size={20} />}
                label="Contact Support"
                subtitle="Get help with Aaroha"
                onClick={() => {}}
              />
            </SettingsSection>

            {/* Footer */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: '#7A7269',
                  fontStyle: 'italic',
                }}
              >
                "May your journey be mindful and nourishing"
              </p>
              <p
                className="mt-4"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#9B9B9B',
                }}
              >
                Aaroha v1.0.0
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Settings Section Component
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  delay: number;
}

function SettingsSection({ title, children, delay }: SettingsSectionProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <h2
        className="mb-3 px-2 text-sm sm:text-base"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          color: '#2D2D2D',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h2>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(200, 104, 82, 0.1)',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// Settings Item Component
interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  badge?: string;
  destructive?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onClick?: () => void;
}

function SettingsItem({
  icon,
  label,
  subtitle,
  badge,
  destructive = false,
  toggle = false,
  toggleValue = false,
  onToggle,
  onClick,
}: SettingsItemProps) {
  const handleClick = () => {
    if (toggle && onToggle) {
      onToggle(!toggleValue);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 transition-colors hover:bg-black/5 active:bg-black/10"
      style={{
        borderBottom: '1px solid rgba(200, 104, 82, 0.08)',
      }}
    >
      <div
        className="flex-shrink-0"
        style={{
          color: destructive ? '#D16B6B' : '#7A7269',
        }}
      >
        {icon}
      </div>
      
      <div className="flex-1 text-left min-w-0">
        <p
          className="text-sm sm:text-base"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            color: destructive ? '#D16B6B' : '#2D2D2D',
          }}
        >
          {label}
        </p>
        {subtitle && (
          <p
            className="text-xs sm:text-sm truncate"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#7A7269',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {badge && (
        <div
          className="px-3 py-1 rounded-full"
          style={{
            background: 'rgba(227, 182, 96, 0.15)',
            border: '1px solid #E3B660',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#C86852',
            }}
          >
            {badge}
          </span>
        </div>
      )}

      {toggle ? (
        <Switch
          checked={toggleValue}
          onCheckedChange={onToggle}
        />
      ) : (
        <ChevronRight size={20} color="#7A7269" />
      )}
    </button>
  );
}
