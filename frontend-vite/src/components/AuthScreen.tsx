import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MugguLogo } from './MugguLogo';
import { MugguDotGrid } from './MugguDotGrid';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';
import { loginRequest, signupRequest } from '../api/auth';
import { setToken } from '../api/auth';

interface AuthScreenProps {
  onAuth: () => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [signupName, setSignupName] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");
const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleSocialAuth = (provider: string) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onAuth();
    }, 1500);
  };

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsAuthenticating(true);
  setErrorMessage(null);

  try {
    const { accessToken, user } = await loginRequest(email, password);

    // save auth so the rest of the app can call protected endpoints
    setToken(accessToken);
    localStorage.setItem("aaroha_user", JSON.stringify(user));
console.log("LOGIN OK", { accessToken, user });
onAuth();
  } catch (err) {
    console.error(err);
    setErrorMessage("Couldn't sign in. Check your email/password.");
  } finally {
    setIsAuthenticating(false);
  }
};
  const handleCreateAccount = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsAuthenticating(true);
  setErrorMessage(null);

  try {
    const { accessToken, user } = await signupRequest(
      signupName,
      signupEmail,
      signupPassword
    );

    setToken(accessToken);
    localStorage.setItem("aaroha_user", JSON.stringify(user));

    onAuth();
  } catch (err) {
    console.error(err);
    setErrorMessage("Couldn't create account. Try a different email?");
  } finally {
    setIsAuthenticating(false);
  }
};


  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, #F5F2ED 0%, #E8D5C8 40%, #C86852 100%)',
        }}
      />

      {/* Muggu dot grid pattern */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <MugguDotGrid className="w-full h-full object-cover" />
      </div>

      {/* Blur overlay when modal is open */}
      <AnimatePresence>
        {showCreateAccount && (
          <motion.div
            className="absolute inset-0 bg-black/10"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 max-w-md w-full"
        animate={isAuthenticating ? { scale: 1.03, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Muggu Logo with pulse animation every 8s */}
        <motion.div
          className="mb-6 sm:mb-8"
          animate={{
            filter: [
              'drop-shadow(0 0 0px rgba(255,255,255,0))',
              'drop-shadow(0 0 1px rgba(255,255,255,0.6))',
              'drop-shadow(0 0 0px rgba(255,255,255,0))',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 0,
            ease: 'easeInOut',
          }}
        >
          <MugguLogo className="w-24 h-24 sm:w-32 sm:h-32" animate={true} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="text-center mb-8 sm:mb-10 text-sm sm:text-base"
          style={{
            color: '#2D2D2D',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.01em',
            lineHeight: '1.5',
          }}
        >
          Track what you eat. Discover your patterns.
        </motion.p>

        {/* Social Sign-in Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="w-full space-y-3 mb-6"
        >
          {/* Google Button */}
          <button
            onClick={() => handleSocialAuth('google')}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white rounded-xl transition-all group relative overflow-hidden"
            style={{
              border: '1.5px solid #C86852',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={{ boxShadow: '0 0 0px rgba(200, 104, 82, 0)' }}
              whileHover={{ boxShadow: '0 0 8px rgba(200, 104, 82, 0.4)' }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: 'none' }}
            />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            <span
              className="relative z-10"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                color: '#2D2D2D',
              }}
            >
              Continue with Google
            </span>
          </button>

          {/* Facebook Button */}
          <button
            onClick={() => handleSocialAuth('facebook')}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white rounded-xl transition-all group relative overflow-hidden"
            style={{
              border: '1.5px solid #1877F2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={{ boxShadow: '0 0 0px rgba(24, 119, 242, 0)' }}
              whileHover={{ boxShadow: '0 0 8px rgba(24, 119, 242, 0.4)' }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: 'none' }}
            />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" fill="#1877F2"/>
            </svg>
            <span
              className="relative z-10"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                color: '#2D2D2D',
              }}
            >
              Continue with Facebook
            </span>
          </button>
        </motion.div>

        {/* Divider with muggu dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3 }}
          className="w-full flex items-center justify-center gap-3 mb-6"
        >
          <div className="flex-1 h-[1px]" style={{ background: 'rgba(45, 45, 45, 0.2)' }} />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <svg key={i} width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" fill="#C86852" opacity="0.6" />
              </svg>
            ))}
          </div>
          <div className="flex-1 h-[1px]" style={{ background: 'rgba(45, 45, 45, 0.2)' }} />
        </motion.div>

        {/* Manual Sign In Form */}
        <motion.form
          onSubmit={handleSignIn}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="w-full space-y-4"
        >
          <div>
            <Label htmlFor="email" style={{ color: '#2D2D2D', marginBottom: '8px', display: 'block', fontSize: '14px' }}>
              Email
            </Label>
          <Input
  id="email"
  type="email"
  required
  value={email}
  onChange={e => setEmail(e.target.value)}
  className="focus-input"
  style={{
    border: '1.5px solid #E3B660',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '15px',
    background: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
  }}
/>

<Input
  id="password"
  type="password"
  required
  value={password}
  onChange={e => setPassword(e.target.value)}
  className="focus-input"
  style={{
    border: '1.5px solid #E3B660',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '15px',
    background: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
  }}
/>

          </div>

          <Button
            type="submit"
            className="w-full h-12 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #C86852 0%, #E6A962 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
          >
            {/* Diagonal shimmer on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
              initial={{ x: '-150%', y: '-150%' }}
              whileHover={{ x: '150%', y: '150%' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <span className="relative z-10">Sign In</span>
          </Button>

          {/* Create Account Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setShowCreateAccount(true)}
              className="hover:opacity-70 transition-opacity"
              style={{
                color: '#2D2D2D',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Create a new account
            </button>
          </div>
        </motion.form>
      </motion.div>

      {/* Create Account Modal */}
      <AnimatePresence>
        {showCreateAccount && (
          <motion.div
            className="fixed inset-0 flex items-end md:items-center justify-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              initial={{ scale: 1.05, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}
            >
              {/* Subtle muggu pattern overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
                  {[0, 60, 120, 180, 240, 300].map((angle) => {
                    const x = 200 + Math.cos((angle * Math.PI) / 180) * 100;
                    const y = 200 + Math.sin((angle * Math.PI) / 180) * 100;
                    return (
                      <line
                        key={angle}
                        x1="200"
                        y1="200"
                        x2={x}
                        y2={y}
                        stroke="#2D2D2D"
                        strokeWidth="1"
                      />
                    );
                  })}
                  <circle cx="200" cy="200" r="100" stroke="#2D2D2D" strokeWidth="1" />
                </svg>
              </div>

              {/* Close button with morphing animation */}
              <button
                onClick={() => setShowCreateAccount(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center group"
                style={{ zIndex: 10 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    {/* Muggu dot that contracts to reveal X */}
                    <motion.circle
                      cx="20"
                      cy="20"
                      r="3"
                      fill="#C86852"
                      initial={{ r: 3 }}
                      whileHover={{ r: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                </motion.div>
                <X
                  className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#C86852', width: '20px', height: '20px' }}
                />
              </button>

              {/* Form */}
              <form onSubmit={handleCreateAccount} className="p-8 relative z-10">
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '28px',
                    color: '#2D2D2D',
                  }}
                >
                  Create Account
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" style={{ color: '#2D2D2D', marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                      Name
                    </Label>
                    <Input
                       id="name"
  type="text"
  required
  value={signupName}
  onChange={e => setSignupName(e.target.value)}
  className="focus-input"
                      style={{
                        border: '1.5px solid #E3B660',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '15px',
                        background: 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email" style={{ color: '#2D2D2D', marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                      Email
                    </Label>
                    <Input
                    id="signup-email"
  type="email"
  required
  value={signupEmail}
  onChange={e => setSignupEmail(e.target.value)}
  className="focus-input"
                      style={{
                        border: '1.5px solid #E3B660',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '15px',
                        background: 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password" style={{ color: '#2D2D2D', marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                      Password
                    </Label>
                    <Input
                     id="signup-password"
  type="password"
  required
  value={signupPassword}
  onChange={e => setSignupPassword(e.target.value)}
  className="focus-input"
                      style={{
                        border: '1.5px solid #E3B660',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '15px',
                        background: 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-6 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #E3B660 0%, #C86852 100%)',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '15px',
                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                  }}
                >
                
                  {/* Diagonal shimmer on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
                    initial={{ x: '-150%', y: '-150%' }}
                    whileHover={{ x: '150%', y: '150%' }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                  <span className="relative z-10">Begin My Pattern</span>
                </Button>

                {/* Back to Sign In Link */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateAccount(false)}
                    className="hover:opacity-70 transition-opacity"
                    style={{
                      color: '#2D2D2D',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for focus glow effect with radial emission */}
      <style>{`
        .focus-input:focus {
          outline: none;
          border-color: #E3B660;
          box-shadow: 0 0 0 3px rgba(227, 182, 96, 0.2), 0 0 12px rgba(227, 182, 96, 0.3);
          animation: focusGlow 0.6s ease-out;
        }
        
        @keyframes focusGlow {
          0% {
            box-shadow: 0 0 0 0px rgba(227, 182, 96, 0.4), 0 0 0px rgba(227, 182, 96, 0.6);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(227, 182, 96, 0), 0 0 20px rgba(227, 182, 96, 0.2);
          }
          100% {
            box-shadow: 0 0 0 3px rgba(227, 182, 96, 0.2), 0 0 12px rgba(227, 182, 96, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
