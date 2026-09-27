import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Heart, BookOpen, Calendar, CheckCircle2, Sparkles, Mic, MicOff, Volume2, Type, Search, ArrowRight, Check } from 'lucide-react';
import { PrayerItem, Scripture } from '../types';
import { searchBibleVault, BibleVaultVerse } from '../data/bibleVault';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prayer: PrayerItem) => void;
  initialPrayer?: PrayerItem | null;
  onOpenScriptureSearch?: (context?: { title: string; request: string; category?: string }) => void;
  attachedScripture?: Scripture | null;
}

export const PrayerModal: React.FC<PrayerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPrayer,
  onOpenScriptureSearch,
  attachedScripture,
}) => {
  const [title, setTitle] = useState('');
  const [request, setRequest] = useState('');
  const [scriptureRef, setScriptureRef] = useState('');
  const [scriptureText, setScriptureText] = useState('');
  const [category, setCategory] = useState<PrayerItem['category']>('Persoonlik');
  const [prayerDate, setPrayerDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answeredDate, setAnsweredDate] = useState('');
  const [answeredNotes, setAnsweredNotes] = useState('');

  // Scripture Search inside Prayer Modal
  const [isBibleSearchOpen, setIsBibleSearchOpen] = useState(false);
  const [bibleSearchQuery, setBibleSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Speech-to-Text state
  const [isListening, setIsListening] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [inputMode, setInputMode] = useState<'type' | 'voice'>('type');

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (initialPrayer) {
      setTitle(initialPrayer.title);
      setRequest(initialPrayer.request);
      setScriptureRef(initialPrayer.scriptureRef || '');
      setScriptureText(initialPrayer.scriptureText || '');
      setCategory(initialPrayer.category);
      setPrayerDate(initialPrayer.prayerDate);
      setIsAnswered(initialPrayer.isAnswered);
      setAnsweredDate(initialPrayer.answeredDate || (initialPrayer.isAnswered ? new Date().toISOString().split('T')[0] : ''));
      setAnsweredNotes(initialPrayer.answeredNotes || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setRequest('');
      setCategory('Persoonlik');
      setPrayerDate(today);
      setIsAnswered(false);
      setAnsweredDate('');
      setAnsweredNotes('');
      if (attachedScripture) {
        setScriptureRef(attachedScripture.reference);
        setScriptureText(attachedScripture.text);
      } else {
        setScriptureRef('');
        setScriptureText('');
      }
    }
    setSpeechError(null);
    setIsListening(false);
    setRecordingSeconds(0);
    setIsBibleSearchOpen(false);
    setBibleSearchQuery('');
  }, [initialPrayer, isOpen, attachedScripture]);

  useEffect(() => {
    if (attachedScripture) {
      setScriptureRef(attachedScripture.reference);
      setScriptureText(attachedScripture.text);
    }
  }, [attachedScripture]);

  // Handle Speech-to-text recording
  const startListening = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Jou webblaaier ondersteun nie regstreekse spraakherkenning nie. Jy kan steeds jou gebed hieronder intik.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'af-ZA'; // Afrikaans (South Africa); Chrome may fall back to its available speech service

      recognition.onstart = () => {
        setIsListening(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setRequest((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Spraakherkenning fout:', event.error, event.message || '');
        const error = event.error;
        if (error === 'not-allowed' || error === 'service-not-allowed') {
          setSpeechError('Chrome laat nie spraakherkenning toe nie. Mikrofoontoegang alleen is nie altyd genoeg nie: die webblad moet HTTPS wees en Chrome se spraakdiens moet beskikbaar wees.');
        } else if (error === 'audio-capture') {
          setSpeechError('Chrome kan nie die mikrofoon bereik nie. Maak seker geen ander app gebruik die mikrofoon nie en probeer weer.');
        } else if (error === 'network') {
          setSpeechError('Chrome se spraakdiens kon nie bereik word nie. Maak seker jy is aan die internet gekoppel en probeer weer.');
        } else if (error === 'no-speech') {
          // Chrome can stop after silence; do not show this as a permission error.
        } else {
          setSpeechError(`Spraakfout: ${error}. Jy kan steeds jou gebed intik.`);
        }
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Kon nie spraakherkenning begin nie:', err);
      setSpeechError(`Kon nie spraakherkenning begin nie${err?.message ? `: ${err.message}` : '.'} Probeer weer of tik jou gebed.`);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleToggleAnswered = (checked: boolean) => {
    setIsAnswered(checked);
    if (checked && !answeredDate) {
      setAnsweredDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) stopListening();

    const prayer: PrayerItem = {
      id: initialPrayer?.id || `prayer-${Date.now()}`,
      title: title.trim() || 'Persoonlike Gebed',
      request: request.trim(),
      scriptureRef: scriptureRef.trim() || undefined,
      scriptureText: scriptureText.trim() || undefined,
      category,
      prayerDate,
      isAnswered,
      answeredDate: isAnswered ? answeredDate || new Date().toISOString().split('T')[0] : undefined,
      answeredNotes: isAnswered ? answeredNotes.trim() : undefined,
      createdAt: initialPrayer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(prayer);
    onClose();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Compute Bible verses matching the prayer text and/or search query
  const relevantVerses = useMemo(() => {
    return searchBibleVault(bibleSearchQuery, {
      prayerContext: {
        title,
        request,
        category,
      },
    });
  }, [bibleSearchQuery, title, request, category]);

  const handleSelectVerseForPrayer = (verse: BibleVaultVerse) => {
    setScriptureRef(`${verse.reference} (${verse.translation})`);
    setScriptureText(verse.text);
    setIsBibleSearchOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity overscroll-contain">
      <div 
        className="relative w-full max-w-2xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] flex flex-col bg-white rounded-none sm:rounded-3xl border border-cyan-900/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prayer-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-900/10 bg-gradient-to-r from-[#0B253A] to-[#155E75] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-cyan-200 shrink-0">
              <Heart className="w-5 h-5 fill-cyan-300/30 text-cyan-200" />
            </div>
            <div>
              <h2 id="prayer-modal-title" className="text-lg sm:text-xl font-serif-editorial font-bold text-white">
                {initialPrayer ? 'Wysig Gebedsversoek' : 'Teken Nuwe Gebed Aan'}
              </h2>
              <p className="text-xs text-cyan-200/90 font-sans-ui">
                Heiligdom van Voorbidding, Smeking en Danksegging
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isListening) stopListening();
              onClose();
            }}
            className="p-1.5 text-cyan-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Sluit Gebed Venster"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Input Method Switch: Typing vs Voice-to-Text */}
          <div className="p-3 bg-cyan-950/5 border border-cyan-900/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-950">
              <span>Invoermetode:</span>
              <div className="inline-flex p-0.5 bg-white border border-cyan-900/15 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (isListening) stopListening();
                    setInputMode('type');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                    inputMode === 'type' ? 'bg-[#0B253A] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Tik Gebed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('voice')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                    inputMode === 'voice' ? 'bg-[#0B253A] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Praat Gebed (Stem-na-Teks)</span>
                </button>
              </div>
            </div>

            {inputMode === 'voice' && (
              <div>
                {!isListening ? (
                  <button
                    type="button"
                    onClick={startListening}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs animate-pulse cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Begin Praat</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopListening}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Stop Opname ({formatTimer(recordingSeconds)})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {speechError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <span className="font-bold">Let Wel:</span>
              <span>{speechError}</span>
            </div>
          )}

          {/* Title and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-cyan-950">
                Gebedstitel of Oopstelling *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="bv. Genesing vir Mamma, Vrede in die Werkplek, Wysheid..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-cyan-900/20 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cyan-950">
                Kategorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-cyan-900/20 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
              >
                <option value="Persoonlik">Persoonlik</option>
                <option value="Familie">Familie</option>
                <option value="Genesing">Genesing</option>
                <option value="Leiding">Leiding</option>
                <option value="Geestelik">Geestelik</option>
                <option value="Danksegging">Danksegging</option>
                <option value="Gemeenskap">Gemeenskap</option>
                <option value="Ander">Ander</option>
              </select>
            </div>
          </div>

          {/* Dates: Prayer Date and Answered Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-cyan-950/5 rounded-xl border border-cyan-900/15">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-cyan-950">
                <Calendar className="w-3.5 h-3.5 text-cyan-700" />
                <span>Datum Gebid (Prayer Date) *</span>
              </label>
              <input
                type="date"
                required
                value={prayerDate}
                onChange={(e) => setPrayerDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-cyan-900/20 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-600"
              />
              <span className="text-[11px] text-slate-500">Wanneer hierdie gebed die eerste keer uitgespreek is</span>
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs font-semibold text-cyan-950">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isAnswered ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>Datum Beantwoord</span>
                </span>
                <label className="inline-flex items-center gap-1 text-[11px] font-normal cursor-pointer text-cyan-900 font-medium">
                  <input
                    type="checkbox"
                    checked={isAnswered}
                    onChange={(e) => handleToggleAnswered(e.target.checked)}
                    className="rounded text-cyan-700 focus:ring-cyan-600/20"
                  />
                  <span>Merk as Beantwoord</span>
                </label>
              </label>
              <input
                type="date"
                disabled={!isAnswered}
                value={answeredDate}
                onChange={(e) => setAnsweredDate(e.target.value)}
                className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                  isAnswered
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                    : 'bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              />
              <span className="text-[11px] text-slate-500">
                {isAnswered ? 'Aangetekende datum van God se verhoring' : 'Merk "Merk as Beantwoord" om datum in te vul'}
              </span>
            </div>
          </div>

          {/* Prayer Request Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-cyan-950">
                Gebedsversoek &amp; Hartsbegeerte *
              </label>
              {inputMode === 'voice' && isListening && (
                <span className="text-xs text-rose-600 font-semibold animate-pulse flex items-center gap-1">
                  ● Neem tans spraak op...
                </span>
              )}
            </div>
            <textarea
              required
              rows={4}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Skryf of praat jou spesifieke hartsbegeerte, mense betrokke, en waarvoor jy God in geloof vertrou..."
              className="w-full px-3.5 py-2.5 bg-white border border-cyan-900/20 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
            />
          </div>

          {/* SCRIPTURE BELOFTE & BYBELKLUIS SOEKTOG */}
          <div className="space-y-3 p-4 bg-gradient-to-r from-cyan-50/90 to-blue-50/90 rounded-2xl border border-cyan-200/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-950">
                <BookOpen className="w-3.5 h-3.5 text-cyan-800" />
                <span>Bybelbelofte waarop jy staan (1983/1933-vertaling)</span>
              </div>

              {/* Toggle Inline Bible Vault Search */}
              <button
                type="button"
                onClick={() => setIsBibleSearchOpen(!isBibleSearchOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-800 hover:bg-cyan-900 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <Search className="w-3 h-3 text-cyan-200" />
                <span>{isBibleSearchOpen ? 'Versteek Bybelsoektog' : 'Soek in Bybelkluis vir hierdie Gebed'}</span>
              </button>
            </div>

            {/* Input boxes for reference and verse text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-1">
                <input
                  type="text"
                  value={scriptureRef}
                  onChange={(e) => setScriptureRef(e.target.value)}
                  placeholder="bv. Filippense 4:6-7"
                  className="w-full px-3 py-2 bg-white border border-cyan-900/20 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-700 font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={scriptureText}
                  onChange={(e) => setScriptureText(e.target.value)}
                  placeholder="Die Bybelvers se teks in Afrikaans..."
                  className="w-full px-3 py-2 bg-white border border-cyan-900/20 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-700"
                />
              </div>
            </div>

            {/* INLINE BIBLE VAULT SEARCH (Allows searching entire Bible + Automatic prayer relevance) */}
            {isBibleSearchOpen && (
              <div className="mt-3 pt-3 border-t border-cyan-200/80 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Deursoek die hele Bybel vir jou gebed:</span>
                  </span>
                  {onOpenScriptureSearch && (
                    <button
                      type="button"
                      onClick={() => onOpenScriptureSearch({ title, request, category })}
                      className="text-[11px] text-cyan-800 hover:text-cyan-950 underline font-semibold cursor-pointer"
                    >
                      Maak Volskerm Bybelkluis oop
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={bibleSearchQuery}
                    onChange={(e) => setBibleSearchQuery(e.target.value)}
                    placeholder="Tik enige woord (bv. genesing, vrede, angs, krag, familie, Here)..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-cyan-900/20 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
                  />
                </div>

                {/* Relevant & Searched Verses List */}
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {relevantVerses.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">
                      Geen verse gevind nie. Probeer 'n ander woord soos "vrede", "krag" of "genesing".
                    </div>
                  ) : (
                    relevantVerses.slice(0, 6).map(({ verse, matchReasons }) => (
                      <div
                        key={verse.id}
                        className="p-3 bg-white/95 border border-cyan-900/10 hover:border-cyan-600/50 rounded-xl shadow-2xs space-y-1.5 transition-all text-left"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0B253A]">{verse.reference}</span>
                            <span className="text-[10px] bg-cyan-100 text-cyan-900 px-1.5 py-0.2 rounded font-medium">
                              {verse.translation}
                            </span>
                            {matchReasons.length > 0 && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.2 rounded font-medium hidden sm:inline">
                                {matchReasons[0]}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectVerseForPrayer(verse)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-800 hover:bg-cyan-900 text-white rounded-md text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                          >
                            <Check className="w-3 h-3 text-cyan-200" />
                            <span>Koppel aan hierdie gebed</span>
                          </button>
                        </div>
                        <p className="font-serif-editorial text-xs sm:text-sm text-slate-800 italic leading-snug">
                          “{verse.text}”
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Answered Testimony / Notes */}
          {isAnswered && (
            <div className="space-y-1.5 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 animate-in fade-in duration-200">
              <label className="flex items-center justify-between text-xs font-semibold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Getuienis: Hoe God Geantwoord Het</span>
                </span>
                <span className="text-[11px] font-medium text-emerald-700">Deel van die Jaaroorsig</span>
              </label>
              <textarea
                rows={3}
                value={answeredNotes}
                onChange={(e) => setAnsweredNotes(e.target.value)}
                placeholder="Beskryf hoe God ingegryp het, wat gebeur het, en woorde van lof..."
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:pt-4 sm:pb-0 border-t border-cyan-900/10 bg-white/95 backdrop-blur-sm flex items-center justify-between z-10">
            <button
              type="button"
              onClick={() => {
                if (isListening) stopListening();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Kanselleer
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0B253A] hover:bg-[#0E3452] rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {initialPrayer ? 'Dateer Gebed Op' : 'Stoor Gebed in Heiligdom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
