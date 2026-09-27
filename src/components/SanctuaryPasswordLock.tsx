import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, ShieldCheck, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import {
  hasSanctuaryPassword,
  verifySanctuaryPassword,
  setSanctuaryPassword,
  setSanctuaryUnlockedInSession,
} from '../utils/sanctuaryLock';
import { GoogleUser } from '../utils/auth';

interface SanctuaryPasswordLockProps {
  onUnlocked: () => void;
  currentUser?: GoogleUser | null;
}

export const SanctuaryPasswordLock: React.FC<SanctuaryPasswordLockProps> = ({
  onUnlocked,
  currentUser,
}) => {
  const isConfigured = hasSanctuaryPassword();

  // Unlock mode state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup / Reset mode state
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setError('Voer asseblief jou wagwoord of PIN in.');
      return;
    }

    if (verifySanctuaryPassword(passwordInput)) {
      setSanctuaryUnlockedInSession(true);
      setError(null);
      onUnlocked();
    } else {
      setError('Verkeerde wagwoord of PIN. Probeer asseblief weer.');
    }
  };

  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      setError('Wagwoord moet minstens 4 karakters of syfers lank wees.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Die twee wagwoorde stem nie ooreen nie.');
      return;
    }

    setSanctuaryPassword(newPassword.trim());
    setSanctuaryUnlockedInSession(true);
    setError(null);
    onUnlocked();
  };

  const handleResetWithGoogle = () => {
    if (!currentUser) {
      setError('Meld eers aan met Google om jou wagwoord te kan herstel.');
      return;
    }
    setIsResetMode(true);
    setError(null);
  };

  // If not configured, or user is resetting:
  if (!isConfigured || isResetMode) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-cyan-900/15 rounded-3xl shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B253A] to-[#155E75] text-cyan-200 flex items-center justify-center mx-auto shadow-md">
          <KeyRound className="w-8 h-8 stroke-[1.8]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif-editorial font-bold text-[#0B253A]">
            {isResetMode ? 'Herstel Gebedskamer Wagwoord' : 'Beveilig Jou Heilige Gebedskamer'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Jou gebede, smekinge en hartsgeheime is intiem en heilig. Stel 'n wagwoord of PIN in sodat niemand sonder jou toestemming jou gebede kan lees nie.
          </p>
        </div>

        <form onSubmit={handleSetupPassword} className="space-y-4 text-left">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Nuwe Wagwoord of PIN (minstens 4 karakters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="bv. 1234 of MyGeheim7"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Bevestig Wagwoord of PIN
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Herhaal wagwoord"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0B253A] hover:bg-[#0E3452] text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            <span>Stoor Wagwoord &amp; Gaan na Gebedskamer</span>
          </button>

          {isResetMode && (
            <button
              type="button"
              onClick={() => setIsResetMode(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 underline pt-1 cursor-pointer"
            >
              Kanselleer herstel
            </button>
          )}
        </form>
      </div>
    );
  }

  // Locked Screen
  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-cyan-900/15 rounded-3xl shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/10 text-cyan-950 border border-cyan-900/10 flex items-center justify-center mx-auto shadow-inner">
        <Lock className="w-8 h-8 text-[#0B253A]" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100/70 text-cyan-950 rounded-full text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 text-cyan-800" />
          <span>Wagwoordbeskermde Ruimte</span>
        </div>
        <h2 className="text-2xl font-serif-editorial font-bold text-[#0B253A]">
          Die Gebedskamer is Gesluit
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Slegs vir jou oë en die Here. Voer jou wagwoord of PIN in om jou gebede te sien en nuwe gebede te hanteer.
        </p>
      </div>

      <form onSubmit={handleUnlock} className="space-y-4 text-left">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Wagwoord of PIN
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoFocus
              placeholder="Voer wagwoord of PIN in"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700 tracking-wider"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#0B253A] hover:bg-[#0E3452] text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Unlock className="w-4 h-4 text-cyan-300" />
          <span>Ontsluit Gebedskamer</span>
        </button>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={handleResetWithGoogle}
            className="hover:text-cyan-900 underline cursor-pointer"
          >
            Wagwoord vergeet?
          </button>
          <span>Privaat &amp; Geënkripteer</span>
        </div>
      </form>
    </div>
  );
};
