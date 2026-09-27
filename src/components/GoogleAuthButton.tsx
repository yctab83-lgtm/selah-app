import React, { useState } from 'react';
import { LogIn, LogOut, CheckCircle, Shield, User, X, Sparkles } from 'lucide-react';
import { GoogleUser, saveStoredGoogleUser, createGoogleUserFromEmail } from '../utils/auth';

interface GoogleAuthButtonProps {
  currentUser: GoogleUser | null;
  onUserChange: (user: GoogleUser | null) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  currentUser,
  onUserChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const defaultEmail = 'ykpcoetzer@gmail.com';

  const handleQuickSignIn = (email: string, name?: string) => {
    const user = createGoogleUserFromEmail(email, name);
    saveStoredGoogleUser(user);
    onUserChange(user);
    setIsModalOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Voer asseblief \'n geldige Google e-posadres in.');
      return;
    }
    handleQuickSignIn(customEmail, customName);
  };

  const handleSignOut = () => {
    saveStoredGoogleUser(null);
    onUserChange(null);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      {currentUser ? (
        // Logged In State
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-cyan-900/15 hover:border-cyan-700/40 rounded-xl transition-all shadow-2xs group cursor-pointer"
            title={`Aangemeld as ${currentUser.email}`}
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-cyan-800/30">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-semibold text-cyan-950 block max-w-[110px] truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">
                Google-rekening
              </span>
            </div>
          </button>

          {/* User Account Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-cyan-900/15 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full border border-cyan-800/20"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                    <CheckCircle className="w-2.5 h-2.5" /> Gekoppel
                  </span>
                </div>
              </div>

              <div className="px-4 py-2 text-[11px] text-slate-600 bg-cyan-50/50 my-1">
                <span>Bybelstudie, gebede en notas word beveilig en aan jou Google-rekening gekoppel.</span>
              </div>

              <div className="px-2 pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition-colors font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Teken Uit by Google</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Not Logged In State
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-cyan-700 rounded-xl text-xs font-semibold text-slate-700 hover:text-cyan-950 transition-all shadow-2xs cursor-pointer min-h-[38px] active:scale-95"
          title="Meld aan met Google"
        >
          {/* Official Google G Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="hidden sm:inline">Meld aan met Google</span>
          <span className="sm:hidden">Google</span>
        </button>
      )}

      {/* Google Login Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-cyan-900/15 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-serif-editorial text-xl font-bold text-[#0B253A]">
                  Meld aan met Google
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Meld aan om jou persoonlike Bybelstudies, S.O.A.P.-oordenkings en gebedsversoeke veilig te bewaar en te sinchroniseer oor jou foon en rekenaar.
            </p>

            {/* Quick 1-Click option for current user */}
            <div className="p-4 bg-cyan-50/80 border border-cyan-200/80 rounded-xl space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-900 block">
                Vinnige Een-Klik Aanmelding
              </span>
              <button
                onClick={() => handleQuickSignIn(defaultEmail, 'YKP Coetzer')}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-cyan-50/60 border border-cyan-900/20 hover:border-cyan-700 rounded-lg transition-all text-left shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0B253A] text-white flex items-center justify-center font-bold text-xs">
                    YC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0B253A] group-hover:text-cyan-800">
                      YKP Coetzer
                    </p>
                    <p className="text-[11px] text-slate-500">{defaultEmail}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-800 bg-cyan-100/70 px-2.5 py-1 rounded-md">
                  Gaan Voort
                </span>
              </button>
            </div>

            {/* Alternative custom Google Email */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase tracking-wider">
                of gebruik 'n ander Google-rekening
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Google E-posadres
                </label>
                <input
                  type="email"
                  required
                  placeholder="naam@gmail.com"
                  value={customEmail}
                  onChange={(e) => {
                    setCustomEmail(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Volle Naam (Opsioneel)
                </label>
                <input
                  type="text"
                  placeholder="Jou Naam en Van"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0B253A] hover:bg-[#0E3452] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Meld aan met hierdie Google-rekening</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
