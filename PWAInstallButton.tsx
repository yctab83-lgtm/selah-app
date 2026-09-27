import React, { useState } from 'react';
import { Download, Smartphone, Check, Share2, X, Sparkles, Monitor, Laptop } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

export const PWAInstallModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { isInstallable, install, isIOS, isAndroid } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Selah - Bybelstudie & Gebed',
          text: "'n Rustige Bybelstudie-metgesel met 1983-Afrikaanse Bybel, S.O.A.P. en Gebedskamer.",
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share failed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-cyan-900/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B253A] to-[#0E4264] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Maak toe"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-2 border border-white/20 flex items-center justify-center shrink-0">
              <img src="/icon.svg" alt="Selah" className="w-8 h-8 drop-shadow" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-xl font-semibold tracking-tight text-white">
                Installeer Selah op jou Toestel
              </h3>
              <p className="text-xs text-cyan-200/90 font-sans-ui mt-0.5">
                Volskerm, vanlyn beskikbaar &amp; vinnige toegang (Android, iPhone &amp; Rekenaar)
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-slate-700 text-sm font-sans-ui overflow-y-auto max-h-[75vh]">
          {/* Direct Browser Install Trigger if available */}
          {isInstallable && (
            <div className="bg-cyan-50/90 border border-cyan-200 p-4 rounded-xl text-center space-y-2.5">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-950 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Direkte Installasie Gereed</span>
              </div>
              <p className="text-xs text-slate-600">
                Jou blaaier ondersteun onmiddellike installasie. Klik hieronder om Selah direk by te voeg:
              </p>
              <button
                type="button"
                onClick={async () => {
                  const success = await install();
                  if (success) onClose();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0B253A] to-cyan-900 hover:from-[#0E3452] hover:to-cyan-800 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-300" />
                <span>Installeer Selah Nou</span>
              </button>
            </div>
          )}

          {/* Android Guide */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-slate-50/70 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Android (Google Chrome of Samsung Browser):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 pl-1 leading-relaxed">
              <li>
                Druk op die <strong className="text-slate-800">drie kolletjies (⋮)</strong> regs bo in jou blaaier.
              </li>
              <li>
                Kies <strong className="text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">"Installeer toep"</strong> of <strong className="text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">"Voeg by tuisskerm"</strong>.
              </li>
              <li>Die Selah-ikoon sal op jou foonskerm verskyn en soos 'n regte inheemse app oopmaak!</li>
            </ol>
          </div>

          {/* iPhone / iOS Guide */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-slate-50/70 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Share2 className="w-4 h-4 text-cyan-700" />
              <span>iPhone / iPad (Apple Safari):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 pl-1 leading-relaxed">
              <li>
                Druk onderaan die <strong>Deel-knoppie</strong> (<span className="text-slate-800 font-mono font-bold">⎋</span> vierkantjie met opwaartse pyltjie).
              </li>
              <li>
                Rol af en kies <strong className="text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">"Add to Home Screen"</strong> (Voeg by tuisskerm).
              </li>
              <li>Druk <strong>"Add"</strong> regs bo. Selah is nou op jou tuisskerm!</li>
            </ol>
          </div>

          {/* Desktop Guide */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-slate-50/70 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Monitor className="w-4 h-4 text-cyan-900" />
              <span>Rekenaar (Google Chrome &amp; Microsoft Edge):</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kyk in die adresbalk regs bo vir die klein rekenaar- of installasie-ikoon (⊕) en klik <strong className="text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">"Installeer Selah"</strong> om dit as 'n venster-toepassing op jou rekenaar te gebruik.
            </p>
          </div>

          {/* Native Share button if supported */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <div className="pt-2 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Deel Selah via WhatsApp / Boodskappe</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Maak Toe
          </button>
        </div>
      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowModal(true);
          }
        }}
        title="Installeer op jou foon of rekenaar (PWA)"
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 rounded-xl transition-all whitespace-nowrap min-h-[40px] shadow-xs active:scale-95 cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
        <span className="hidden sm:inline">Installeer op Foon</span>
        <span className="sm:hidden">Installeer</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
