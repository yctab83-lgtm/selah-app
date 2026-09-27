import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Save, Check, Sparkles, Heart, Search, Clock, ArrowRight, Edit3, X, Tag } from 'lucide-react';
import { SoapEntry, Scripture } from '../types';
import { ASSET_IMAGES } from '../data/initialData';
import { searchBibleVault, BibleVaultVerse } from '../data/bibleVault';

interface DailyVerseSoapTabProps {
  soapEntries: SoapEntry[];
  onSaveSoapEntry: (entry: SoapEntry) => void;
  onOpenScriptureSearch: () => void;
  onAttachToPrayer: (scriptureRef: string, scriptureText: string) => void;
  selectedScriptureFromModal?: Scripture | null;
}

export const DailyVerseSoapTab: React.FC<DailyVerseSoapTabProps> = ({
  soapEntries,
  onSaveSoapEntry,
  onOpenScriptureSearch,
  onAttachToPrayer,
  selectedScriptureFromModal,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [scriptureRef, setScriptureRef] = useState('Filippense 4:6-7 (1983-vertaling)');
  const [scriptureText, setScriptureText] = useState(
    'Moet oor niks besorg wees nie, maar maak in alles julle begeertes deur gebed en smeking en met danksegging aan God bekend. En die vrede van God, wat alle verstand te bowe gaan, sal oor julle harte en gedagtes die wag hou in Christus Jesus.'
  );
  const [observation, setObservation] = useState('');
  const [application, setApplication] = useState('');
  const [prayer, setPrayer] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  // Word Search state under "Soek Skrif in Bybelkluis"
  const [wordSearchQuery, setWordSearchQuery] = useState('');
  const [isWordSearchOpen, setIsWordSearchOpen] = useState(false);
  const [activeVerseNotification, setActiveVerseNotification] = useState<string | null>(null);

  // When date changes, load existing SOAP entry for that date if it exists
  useEffect(() => {
    const existing = soapEntries.find((e) => e.date === selectedDate);
    if (existing) {
      setTitle(existing.title || '');
      setScriptureRef(existing.scriptureRef);
      setScriptureText(existing.scriptureText);
      setObservation(existing.observation);
      setApplication(existing.application);
      setPrayer(existing.prayer);
    } else {
      // Pick a default scripture for the day from the vault
      setTitle('Oordenking: Filippense 4:6-7');
      setScriptureRef('Filippense 4:6-7 (1983-vertaling)');
      setScriptureText(
        'Moet oor niks besorg wees nie, maar maak in alles julle begeertes deur gebed en smeking en met danksegging aan God bekend. En die vrede van God, wat alle verstand te bowe gaan, sal oor julle harte en gedagtes die wag hou in Christus Jesus.'
      );
      setObservation('');
      setApplication('');
      setPrayer('');
    }
  }, [selectedDate, soapEntries]);

  // When a scripture is selected from Scripture Search Modal
  useEffect(() => {
    if (selectedScriptureFromModal) {
      applyScriptureToSoap(
        `${selectedScriptureFromModal.reference} (${selectedScriptureFromModal.translation})`,
        selectedScriptureFromModal.text,
        selectedScriptureFromModal.reference
      );
    }
  }, [selectedScriptureFromModal]);

  const applyScriptureToSoap = (ref: string, text: string, shortRef: string) => {
    setScriptureRef(ref);
    setScriptureText(text);
    setTitle(`Oordenking oor ${shortRef}`);
    setActiveVerseNotification(`S.O.A.P. geaktiveer vir ${shortRef}! Skryf nou jou observasie, toepassing en gebed hieronder.`);
    setTimeout(() => {
      document.getElementById('soap-editor-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setTimeout(() => setActiveVerseNotification(null), 5000);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entry: SoapEntry = {
      id: `soap-${selectedDate}`,
      date: selectedDate,
      title: title.trim() || `S.O.A.P.: ${scriptureRef}`,
      scriptureRef: scriptureRef.trim(),
      scriptureText: scriptureText.trim(),
      observation: observation.trim(),
      application: application.trim(),
      prayer: prayer.trim(),
      updatedAt: new Date().toISOString(),
    };
    onSaveSoapEntry(entry);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDateShift = (deltaDays: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + deltaDays);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00Z').toLocaleDateString('af-ZA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const filteredHistory = soapEntries.filter((e) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      e.scriptureRef.toLowerCase().includes(q) ||
      (e.title && e.title.toLowerCase().includes(q)) ||
      e.observation.toLowerCase().includes(q) ||
      e.prayer.toLowerCase().includes(q) ||
      e.date.includes(q)
    );
  });

  // Matching verses for inline word search
  const searchedVerses = useMemo(() => {
    if (!wordSearchQuery.trim()) return [];
    return searchBibleVault(wordSearchQuery);
  }, [wordSearchQuery]);

  const quickSearchWords = ['vrede', 'genesing', 'krag', 'liefde', 'geloof', 'gebed', 'genade', 'here', 'angst'];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Ocean Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-900/20 bg-[#0B253A] shadow-lg">
        <div className="absolute inset-0">
          <img
            src={ASSET_IMAGES.oceanSanctuary}
            alt="Oop Bybel met rustige seegolwe"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071927] via-[#0B253A]/80 to-[#155E75]/40" />
        </div>

        <div className="relative p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-300 font-semibold">
            <span>Daaglikse Brood</span>
            <span aria-hidden="true">·</span>
            <span>Die S.O.A.P.-Metode (Volledig Redigeerbaar)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-editorial font-medium text-white leading-tight">
            Skrif, Observasie, Toepassing &amp; Gebed
          </h1>

          <p className="text-sm sm:text-base text-cyan-100 font-sans-ui leading-relaxed max-w-2xl">
            Anker jou gemoed in die 1983/1933 Afrikaanse Bybel. Oordink God se Woord, vernuwe jou denke volgens praktiese Bybelse beginsels, en skryf jou eie persoonlike gebed.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsWordSearchOpen(!isWordSearchOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isWordSearchOpen ? 'Versteek Woordsoektog' : 'Soek Skrif in Bybelkluis (Tik Woord)'}</span>
            </button>
            <button
              onClick={onOpenScriptureSearch}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-cyan-300/30 transition-colors backdrop-blur-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Volskerm Bybelkluis</span>
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-cyan-300/30 transition-colors backdrop-blur-xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{showHistory ? 'Steek Geskiedenis Weg' : `Vorige Studies (${soapEntries.length})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SCRIPTURE WORD SEARCH SECTION (DIRECT REQUIREMENT: "under soek skrif in bybelkluis - type in a word and all verses containing that word come up, start a soap from any of those") */}
      {isWordSearchOpen && (
        <section className="p-5 sm:p-6 bg-white border border-cyan-900/15 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-900 flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B253A]">
                  Soek Skrif in Bybelkluis &amp; Begin S.O.A.P.
                </h3>
                <p className="text-xs text-slate-500">
                  Tik enige woord in Afrikaans. Alle Bybelverse wat daardie woord bevat verskyn dadelik sodat jy 'n S.O.A.P. kan begin.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWordSearchOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={wordSearchQuery}
              onChange={(e) => setWordSearchQuery(e.target.value)}
              placeholder="Tik 'n woord (bv. vrede, krag, Here, genesing, liefde, geloof, genade, rus, hart)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
              autoFocus
            />
            {wordSearchQuery && (
              <button
                onClick={() => setWordSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 px-2 py-0.5"
              >
                Maak skoon
              </button>
            )}
          </div>

          {/* Quick Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-slate-600">
            <span className="font-semibold text-[11px] text-slate-400 uppercase">Gewilde soekwoorde:</span>
            {quickSearchWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => setWordSearchQuery(word)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer capitalize font-medium ${
                  wordSearchQuery.toLowerCase() === word
                    ? 'bg-[#0B253A] text-white font-bold'
                    : 'bg-slate-100 hover:bg-cyan-50 text-slate-700'
                }`}
              >
                {word}
              </button>
            ))}
          </div>

          {/* Search Results Display */}
          {wordSearchQuery.trim() && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  <strong>{searchedVerses.length}</strong> Bybelverse bevat die woord "
                  <span className="text-cyan-950 font-semibold">{wordSearchQuery}</span>"
                </span>
                <span>Klik "Begin S.O.A.P." op enige vers</span>
              </div>

              {searchedVerses.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                  Geen verse gevind vir "{wordSearchQuery}" nie. Probeer 'n ander woord soos "vrede", "krag" of "genesing".
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                  {searchedVerses.map(({ verse, matchReasons }) => (
                    <article
                      key={verse.id}
                      className="p-3.5 bg-slate-50/70 hover:bg-cyan-50/40 border border-slate-200 hover:border-cyan-300 rounded-xl transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#0B253A]">{verse.reference}</span>
                          <span className="text-[10px] bg-cyan-100 text-cyan-900 px-1.5 py-0.2 rounded font-medium">
                            {verse.translation}
                          </span>
                          <span className="text-slate-400 text-[10px]">· {verse.theme}</span>
                        </div>
                        <p className="font-serif-editorial text-xs sm:text-sm text-slate-800 leading-relaxed">
                          “{verse.text}”
                        </p>
                      </div>

                      {/* START SOAP BUTTON */}
                      <button
                        type="button"
                        onClick={() =>
                          applyScriptureToSoap(
                            `${verse.reference} (${verse.translation})`,
                            verse.text,
                            verse.reference
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B253A] hover:bg-[#0E3452] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Begin S.O.A.P. met hierdie vers</span>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Active Verse Notification Banner */}
      {activeVerseNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-950 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{activeVerseNotification}</span>
          </div>
          <button
            onClick={() => setActiveVerseNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-2 py-1"
          >
            Sluit
          </button>
        </div>
      )}

      {/* Date Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-cyan-900/10 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDateShift(-1)}
            title="Vorige Dag"
            className="p-1.5 text-cyan-900 hover:text-cyan-950 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-700" />
            <span className="text-sm font-semibold text-slate-900 capitalize">{formattedDate}</span>
          </div>
          <button
            onClick={() => handleDateShift(1)}
            title="Volgende Dag"
            className="p-1.5 text-cyan-900 hover:text-cyan-950 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1.5 text-xs text-slate-700 bg-cyan-50/50 border border-cyan-900/20 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-600"
          />
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-2.5 py-1.5 text-xs font-semibold text-cyan-900 hover:text-cyan-950 hover:bg-cyan-100/70 rounded-md transition-colors cursor-pointer"
          >
            Vandag
          </button>
        </div>
      </div>

      {/* Past SOAP Entries History Drawer */}
      {showHistory && (
        <section className="p-5 bg-white border border-cyan-900/10 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-cyan-950">Vorige S.O.A.P.-Studies</h2>
            <input
              type="text"
              placeholder="Soek in geskiedenis..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="px-3 py-1 text-xs bg-slate-50 border border-cyan-900/20 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">Geen vorige studies gevind nie.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedDate(entry.date)}
                  className="p-3 rounded-lg border border-cyan-900/10 hover:border-cyan-600 bg-cyan-50/20 hover:bg-cyan-50/60 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-950">{entry.scriptureRef}</span>
                    <span className="text-slate-500">{entry.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{entry.observation || entry.scriptureText}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* S.O.A.P. EDITOR WORKSPACE */}
      <form id="soap-editor-section" onSubmit={handleSave} className="space-y-6">
        {/* Title bar */}
        <div className="flex items-center justify-between gap-4 p-4 bg-white border border-cyan-900/10 rounded-xl shadow-xs">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-cyan-950 uppercase tracking-wider mb-1">
              Fokus / Tema van Vandag se Oordenking
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="bv. Vrede in die storm, Die Here my Herder..."
              className="w-full text-base font-serif-editorial font-semibold text-[#0B253A] border-b border-transparent hover:border-cyan-300 focus:border-cyan-700 focus:outline-none bg-transparent py-0.5"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B253A] hover:bg-[#0E3452] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gestoor!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Stoor Studie</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* The 4 SOAP Sections */}
        <div className="space-y-6 bg-white border border-cyan-900/10 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* S - SKRIF */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-950 text-white font-serif-editorial font-bold text-sm flex items-center justify-center">
                  S
                </span>
                <div>
                  <h3 className="text-base font-semibold text-cyan-950">Skrif (Scripture)</h3>
                  <p className="text-xs text-slate-500">
                    Die Bybelse ankerteks in die 1983-vertaling of 1933-vertaling
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWordSearchOpen(!isWordSearchOpen)}
                  className="inline-flex items-center gap-1 text-xs text-cyan-800 hover:text-cyan-950 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  <Search className="w-3 h-3 text-cyan-700" />
                  <span>Soek ander vers</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-cyan-50/50 border border-cyan-900/15 rounded-xl space-y-2">
              <input
                type="text"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                placeholder="Skrifverwysing (bv. Romeine 12:2)"
                className="w-full text-sm font-bold text-[#0B253A] bg-transparent border-b border-cyan-900/20 pb-1 focus:outline-none focus:border-cyan-700"
              />
              <textarea
                rows={3}
                value={scriptureText}
                onChange={(e) => setScriptureText(e.target.value)}
                placeholder="Tik of plak die Skrifteks hier in..."
                className="w-full text-sm sm:text-base font-serif-editorial text-slate-800 leading-relaxed bg-transparent resize-y focus:outline-none"
              />
            </div>
          </div>

          {/* O - OBSERVASIE */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-cyan-800 text-white font-serif-editorial font-bold text-sm flex items-center justify-center">
                O
              </span>
              <div>
                <h3 className="text-base font-semibold text-cyan-950">Observasie (Waarneming)</h3>
                <p className="text-xs text-slate-500">
                  Wat sê hierdie teks oor God se karakter, Sy beloftes, of die toestand van my denke?
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Let op die kernwoorde, opdragte en vrymakende waarhede. Watter gedagtepatroon word aangespreek?..."
              className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
            />
          </div>

          {/* A - TOEPASSING (Praktiese Lewe) */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-950 font-serif-editorial font-bold text-sm flex items-center justify-center">
                A
              </span>
              <div>
                <h3 className="text-base font-semibold text-cyan-950">Toepassing (Praktiese Lewe)</h3>
                <p className="text-xs text-slate-500">
                  Hoe pas ek dit vandag toe in my alledaagse lewe, verhoudings, en gedagtewêreld?
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              placeholder="Wees konkreet: Vandag, wanneer ek versoek word om negatief of angstig te dink, gaan ek..."
              className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
            />
          </div>

          {/* P - GEBED */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-900 text-white font-serif-editorial font-bold text-sm flex items-center justify-center">
                  P
                </span>
                <div>
                  <h3 className="text-base font-semibold text-cyan-950">Gebed</h3>
                  <p className="text-xs text-slate-500">
                    Praat terug met God in reaksie op Sy Woord (kan ook na jou Gebedskamer gestuur word)
                  </p>
                </div>
              </div>

              {prayer.trim() && (
                <button
                  type="button"
                  onClick={() => onAttachToPrayer(scriptureRef, scriptureText)}
                  className="inline-flex items-center gap-1 text-xs text-teal-800 hover:text-teal-950 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  <Heart className="w-3 h-3 text-teal-700" />
                  <span>Stuur na Gebedskamer</span>
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              placeholder="Hemelse Vader, dankie dat U Woord lewend en kragtig is. Help my vandag om..."
              className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
            />
          </div>
        </div>

        {/* Save Bar at Bottom */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B253A] hover:bg-[#0E3452] text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Oordenking Suksesvol Gestoor!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Stoor Vandag se S.O.A.P.</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
