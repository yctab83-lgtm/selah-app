import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, BookOpen, Heart, Copy, Check, Sparkles, ArrowRight, BookMarked, Tag } from 'lucide-react';
import { COMPREHENSIVE_BIBLE_VAULT, searchBibleVault, BibleVaultVerse } from '../data/bibleVault';
import { Scripture } from '../types';

interface ScriptureSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForSoap?: (scripture: Scripture) => void;
  onSelectForPrayer?: (scripture: Scripture) => void;
  onSelectForJournal?: (scripture: Scripture) => void;
  prayerContext?: {
    title?: string;
    request?: string;
    category?: string;
  } | null;
  initialSearchQuery?: string;
}

export const ScriptureSearchModal: React.FC<ScriptureSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectForSoap,
  onSelectForPrayer,
  onSelectForJournal,
  prayerContext,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTheme, setSelectedTheme] = useState<string>('Alle');
  const [selectedTranslation, setSelectedTranslation] = useState<string>('Alle');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync initial search query or prayer context when opened
  useEffect(() => {
    if (isOpen) {
      if (initialSearchQuery) {
        setSearchQuery(initialSearchQuery);
      } else {
        setSearchQuery('');
      }
      setSelectedTheme('Alle');
      setSelectedTranslation('Alle');
    }
  }, [isOpen, initialSearchQuery]);

  const themes = useMemo(() => {
    const set = new Set<string>();
    COMPREHENSIVE_BIBLE_VAULT.forEach((s) => set.add(s.theme));
    return ['Alle', ...Array.from(set)];
  }, []);

  const searchResults = useMemo(() => {
    return searchBibleVault(searchQuery, {
      prayerContext: prayerContext || undefined,
      theme: selectedTheme,
      translation: selectedTranslation,
    });
  }, [searchQuery, selectedTheme, selectedTranslation, prayerContext]);

  const handleCopy = (scripture: Scripture) => {
    const textToCopy = `"${scripture.text}" — ${scripture.reference} (${scripture.translation})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(scripture.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to highlight matching terms
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const words = query.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200/80 text-cyan-950 font-semibold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity overscroll-contain">
      <div
        className="relative w-full max-w-4xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[90dvh] flex flex-col bg-[#F8FBFC] rounded-none sm:rounded-3xl border border-cyan-900/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scripture-search-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-900/10 bg-gradient-to-r from-[#0B253A] to-[#155E75] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-200 shrink-0">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 id="scripture-search-title" className="text-lg sm:text-xl font-serif-editorial font-semibold tracking-tight text-white">
                Bybelkluis &amp; Skrifsoektog (1983 / 1933 Vertaling)
              </h2>
              <div className="flex items-center gap-2 text-xs text-cyan-200/90 font-sans-ui">
                <span>Soek enige woord in die hele Bybel</span>
                <span aria-hidden="true">·</span>
                <span>Begin 'n S.O.A.P. of koppel aan Gebed</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-cyan-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Sluit Bybelsoektog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prayer Context Banner (when searching for a prayer written down) */}
        {prayerContext && (prayerContext.request || prayerContext.title) && (
          <div className="px-5 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-cyan-900/10 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                  Relevante Skrifte vir jou aangetekende gebed:
                </span>
                {prayerContext.category && (
                  <span className="text-[10px] bg-teal-100 text-teal-900 px-2 py-0.2 rounded-full font-semibold">
                    {prayerContext.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-950 font-serif-editorial italic truncate">
                "{prayerContext.title ? `${prayerContext.title}: ` : ''}{prayerContext.request}"
              </p>
              <p className="text-[11px] text-teal-700">
                Die Bybelkluis het verse uitgesoek wat direk ooreenstem met jou gebedsbehoefte.
              </p>
            </div>
          </div>
        )}

        {/* Search Controls */}
        <div className="p-4 sm:p-5 border-b border-cyan-900/10 bg-white space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tik enige woord om die Bybel te deursoek (bv. vrede, krag, angs, siekte, liefde, kinders, hoop, Here)..."
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 px-2 py-1 bg-slate-200/70 hover:bg-slate-300 rounded-md cursor-pointer"
              >
                Maak skoon
              </button>
            )}
          </div>

          {/* Quick Filter Buttons & Translations */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            {/* Theme Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <span className="text-slate-400 font-semibold text-[11px] uppercase mr-1">Onderwerp:</span>
              {themes.slice(0, 8).map((theme) => {
                const isActive = selectedTheme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer text-xs ${
                      isActive
                        ? 'bg-[#0B253A] text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-cyan-50 hover:text-cyan-950 font-medium'
                    }`}
                  >
                    {theme}
                  </button>
                );
              })}
            </div>

            {/* Translation toggle */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
              <span>Vertaling:</span>
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 focus:outline-none"
              >
                <option value="Alle">Albei vertalings</option>
                <option value="1983">1983-vertaling</option>
                <option value="1933">1933/53-vertaling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {searchResults.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto stroke-[1.2]" />
              <p className="text-slate-700 font-serif-editorial text-lg">
                Geen skrifgedeeltes gevind vir "{searchQuery}" nie
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Probeer 'n ander Afrikaanse woord soos "vrede", "krag", "here", "god", "liefde", "gebed", "genesing", "genade" of kies 'n tema hierbo.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-1.5 bg-cyan-900 text-white rounded-lg text-xs font-semibold hover:bg-cyan-950 cursor-pointer"
                >
                  Wys alle verse in Bybelkluis
                </button>
              )}
            </div>
          ) : (
            searchResults.map(({ verse, matchReasons }) => {
              const isCopied = copiedId === verse.id;
              return (
                <article
                  key={verse.id}
                  className="bg-white border border-cyan-900/15 hover:border-cyan-500/60 rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[#0B253A] font-bold text-sm">
                          {highlightMatch(verse.reference, searchQuery)}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="bg-cyan-50 text-cyan-900 px-2 py-0.5 rounded font-medium text-[11px]">
                          {verse.translation}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500 font-normal text-[11px]">
                          {verse.theme}
                        </span>
                        {matchReasons.length > 0 && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                            {matchReasons[0]}
                          </span>
                        )}
                      </div>

                      <p className="font-serif-editorial text-base sm:text-lg text-slate-800 leading-relaxed pr-2 pt-0.5">
                        “{highlightMatch(verse.text, searchQuery)}”
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(verse)}
                      title="Kopieer vers"
                      className="p-1.5 text-slate-400 hover:text-cyan-950 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Action Buttons: START SOAP / ATTACH TO PRAYER / JOURNAL */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                    {onSelectForSoap && (
                      <button
                        onClick={() => {
                          onSelectForSoap(verse);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-white bg-[#0B253A] hover:bg-[#0E3452] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Begin S.O.A.P. met hierdie vers</span>
                      </button>
                    )}

                    {onSelectForPrayer && (
                      <button
                        onClick={() => {
                          onSelectForPrayer(verse);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-teal-900 bg-teal-100 hover:bg-teal-200/80 border border-teal-300/60 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Heart className="w-3.5 h-3.5 text-teal-700" />
                        <span>Koppel aan Gebed</span>
                      </button>
                    )}

                    {onSelectForJournal && (
                      <button
                        onClick={() => {
                          onSelectForJournal(verse);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Voeg by Joernaal</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="sticky bottom-0 px-4 sm:px-5 py-3 border-t border-cyan-900/10 bg-cyan-50/95 backdrop-blur-sm text-xs text-slate-600 flex items-center justify-between gap-3 z-10">
          <button type="button" onClick={onClose} className="sm:hidden inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#0B253A] text-white font-semibold min-h-[44px]">Klaar / Sluit</button>
          <span className="font-medium">
            {searchResults.length} Bybelverse gevind in biblioteek (1983 &amp; 1933/53)
          </span>
          <span className="hidden sm:inline text-slate-400">
            Klik "Begin S.O.A.P." of "Koppel aan Gebed" om dadelik te begin
          </span>
        </div>
      </div>
    </div>
  );
};
