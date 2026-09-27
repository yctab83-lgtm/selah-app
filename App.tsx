import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Sparkles, Plus, Search, Brain, Pin, Waves, Layers, Compass, Calendar, CheckCircle2 } from 'lucide-react';
import { ActiveTab, SoapEntry, JournalEntry, PrayerItem, ReadingProgress, Scripture, PinnedItem, BrainDumpEntry } from './types';
import {
  getStoredSoapEntries,
  saveStoredSoapEntries,
  getStoredJournalEntries,
  saveStoredJournalEntries,
  getStoredPrayers,
  saveStoredPrayers,
  getStoredReadingProgress,
  saveStoredReadingProgress,
  getStoredPinnedItems,
  saveStoredPinnedItems,
  getStoredBrainDumps,
  saveStoredBrainDumps,
} from './utils/storage';
import { InterlinearTab } from './components/InterlinearTab';
import { DailyVerseSoapTab } from './components/DailyVerseSoapTab';
import { ReadingPlansTab } from './components/ReadingPlansTab';
import { JournalTab } from './components/JournalTab';
import { PrayerSanctuaryTab } from './components/PrayerSanctuaryTab';
import { YearInReviewTab } from './components/YearInReviewTab';
import { ScriptureSearchModal } from './components/ScriptureSearchModal';
import { PrayerModal } from './components/PrayerModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GoogleAuthButton } from './components/GoogleAuthButton';
import { getStoredGoogleUser, GoogleUser } from './utils/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('soap');

  // Core Data States
  const [soapEntries, setSoapEntries] = useState<SoapEntry[]>(() => getStoredSoapEntries());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => getStoredJournalEntries());
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => getStoredPrayers());
  const [readingProgress, setReadingProgress] = useState<Record<string, ReadingProgress>>(() => getStoredReadingProgress());
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(() => getStoredPinnedItems());
  const [brainDumps, setBrainDumps] = useState<BrainDumpEntry[]>(() => getStoredBrainDumps());

  // Modal States
  const [isScriptureSearchOpen, setIsScriptureSearchOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerItem | null>(null);
  const [attachedScriptureForPrayer, setAttachedScriptureForPrayer] = useState<Scripture | null>(null);
  const [selectedScriptureForSoap, setSelectedScriptureForSoap] = useState<Scripture | null>(null);
  const [selectedScriptureForJournal, setSelectedScriptureForJournal] = useState<Scripture | null>(null);
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(() => getStoredGoogleUser());
  const [scriptureSearchPrayerContext, setScriptureSearchPrayerContext] = useState<{
    title?: string;
    request?: string;
    category?: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredSoapEntries(soapEntries);
  }, [soapEntries]);

  useEffect(() => {
    saveStoredJournalEntries(journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    saveStoredPrayers(prayers);
  }, [prayers]);

  useEffect(() => {
    saveStoredReadingProgress(readingProgress);
  }, [readingProgress]);

  useEffect(() => {
    saveStoredPinnedItems(pinnedItems);
  }, [pinnedItems]);

  useEffect(() => {
    saveStoredBrainDumps(brainDumps);
  }, [brainDumps]);

  // Handlers for SOAP
  const handleSaveSoapEntry = (entry: SoapEntry) => {
    setSoapEntries((prev) => {
      const idx = prev.findIndex((e) => e.date === entry.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [entry, ...prev];
    });
  };

  // Handlers for Reading Plans
  const handleToggleReadingDay = (planId: string, dayNum: number) => {
    setReadingProgress((prev) => {
      const current = prev[planId] || {
        planId,
        completedDays: [],
        startedAt: new Date().toISOString(),
        lastReadAt: new Date().toISOString(),
      };
      const isDone = current.completedDays.includes(dayNum);
      const updatedDays = isDone
        ? current.completedDays.filter((d) => d !== dayNum)
        : [...current.completedDays, dayNum];

      return {
        ...prev,
        [planId]: {
          ...current,
          completedDays: updatedDays,
          lastReadAt: new Date().toISOString(),
        },
      };
    });
  };

  const handleSendReadingPassageToSoap = (passageRef: string, passageText: string) => {
    setSelectedScriptureForSoap({
      id: `skrif-${Date.now()}`,
      reference: passageRef,
      book: passageRef.split(' ')[0],
      chapter: 1,
      verse: '1',
      text: passageText,
      translation: '1983-vertaling',
      theme: 'Leesplan',
      testament: 'Nuwe Testament',
    });
    setActiveTab('soap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for Journal
  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => {
      const idx = prev.findIndex((j) => j.id === entry.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [entry, ...prev];
    });
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
  };

  // Handlers for Pinned Items
  const handleSavePinnedItem = (item: PinnedItem) => {
    setPinnedItems((prev) => [item, ...prev]);
  };

  const handleDeletePinnedItem = (id: string) => {
    setPinnedItems((prev) => prev.filter((p) => p.id !== id));
  };

  // Handlers for Brain Dump
  const handleSaveBrainDump = (entry: BrainDumpEntry) => {
    setBrainDumps((prev) => [entry, ...prev]);
  };

  // Handlers for Prayers
  const handleSavePrayer = (prayer: PrayerItem) => {
    setPrayers((prev) => {
      const idx = prev.findIndex((p) => p.id === prayer.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = prayer;
        return copy;
      }
      return [prayer, ...prev];
    });
  };

  const handleDeletePrayer = (id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleAnswered = (prayer: PrayerItem) => {
    if (!prayer.isAnswered) {
      setEditingPrayer({
        ...prayer,
        isAnswered: true,
        answeredDate: new Date().toISOString().split('T')[0],
      });
      setIsPrayerModalOpen(true);
    } else {
      handleSavePrayer({
        ...prayer,
        isAnswered: false,
        answeredDate: undefined,
      });
    }
  };

  const handleOpenAddPrayer = (initialScriptureRef?: string, initialScriptureText?: string, initialTitle?: string) => {
    setEditingPrayer(null);
    if (initialScriptureRef) {
      setAttachedScriptureForPrayer({
        id: `gebed-ref-${Date.now()}`,
        reference: initialScriptureRef,
        book: initialScriptureRef.split(' ')[0],
        chapter: 1,
        verse: '1',
        text: initialScriptureText || '',
        translation: '1983-vertaling',
        theme: 'Smeking',
        testament: 'Nuwe Testament',
      });
    } else {
      setAttachedScriptureForPrayer(null);
    }
    setIsPrayerModalOpen(true);
  };

  const handleEditPrayer = (prayer: PrayerItem) => {
    setEditingPrayer(prayer);
    setIsPrayerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-slate-900 flex flex-col font-sans-ui selection:bg-cyan-100 selection:text-cyan-950 overscroll-y-contain">
      {/* 
        HEADER / APP BAR (Responsive & Android-optimised)
      */}
      <header className="sticky top-0 z-40 bg-[#F4F8FA]/95 backdrop-blur-md border-b border-cyan-900/10 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('soap')}
            className="font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#0B253A] hover:text-cyan-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer text-left"
          >
            <span>Selah</span>
          </button>

          {/* Desktop Navigation Links - WITH INTERLINEAR BEFORE SOAP */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-semibold uppercase tracking-wider">
            {/* 1. INTERLINEAR TAB (BEFORE SOAP) */}
            <button
              onClick={() => setActiveTab('interlinear')}
              className={`pb-1 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'interlinear'
                  ? 'text-cyan-900 border-b-2 border-cyan-700 font-bold'
                  : 'text-slate-500 hover:text-cyan-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-700" />
              <span>Interliniêr (BibleHub)</span>
            </button>

            {/* 2. DAAGLIKSE S.O.A.P. */}
            <button
              onClick={() => setActiveTab('soap')}
              className={`pb-1 whitespace-nowrap transition-colors ${
                activeTab === 'soap'
                  ? 'text-[#0B253A] border-b-2 border-cyan-700 font-bold'
                  : 'text-slate-500 hover:text-cyan-950'
              }`}
            >
              Daaglikse S.O.A.P.
            </button>

            {/* 3. LEESPLANNE */}
            <button
              onClick={() => setActiveTab('reading-plans')}
              className={`pb-1 whitespace-nowrap transition-colors ${
                activeTab === 'reading-plans'
                  ? 'text-[#0B253A] border-b-2 border-cyan-700 font-bold'
                  : 'text-slate-500 hover:text-cyan-950'
              }`}
            >
              Leesplanne
            </button>

            {/* 4. JOERNAAL & VISIEBORD */}
            <button
              onClick={() => setActiveTab('journal')}
              className={`pb-1 whitespace-nowrap transition-colors ${
                activeTab === 'journal'
                  ? 'text-[#0B253A] border-b-2 border-cyan-700 font-bold'
                  : 'text-slate-500 hover:text-cyan-950'
              }`}
            >
              Joernaal &amp; Visiebord
            </button>

            {/* 5. GEBEDSKAMER */}
            <button
              onClick={() => setActiveTab('prayers')}
              className={`pb-1 whitespace-nowrap transition-colors ${
                activeTab === 'prayers'
                  ? 'text-[#0B253A] border-b-2 border-cyan-700 font-bold'
                  : 'text-slate-500 hover:text-cyan-950'
              }`}
            >
              Gebedskamer
            </button>

            {/* 6. JAAROORSIG */}
            <button
              onClick={() => setActiveTab('year-in-review')}
              className={`pb-1 whitespace-nowrap transition-colors ${
                activeTab === 'year-in-review'
                  ? 'text-cyan-900 border-b-2 border-cyan-800 font-bold'
                  : 'text-slate-500 hover:text-cyan-950'
              }`}
            >
              Jaaroorsig
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Google Login with User Profile */}
            <GoogleAuthButton currentUser={currentUser} onUserChange={setCurrentUser} />

            {/* PWA Install Button for Mobile/Desktop */}
            <PWAInstallButton />

            <button
              onClick={() => {
                setScriptureSearchPrayerContext(null);
                setIsScriptureSearchOpen(true);
              }}
              title="Soek in 1983/1933 Bybelkluis"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-900 hover:text-cyan-950 hover:bg-cyan-50 rounded-xl border border-cyan-900/15 transition-colors whitespace-nowrap min-h-[40px] active:scale-95 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-700" />
              <span className="hidden sm:inline">Bybelkluis</span>
            </button>

            <button
              onClick={() => handleOpenAddPrayer()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B253A] hover:bg-[#0E3452] rounded-xl transition-colors shadow-xs whitespace-nowrap min-h-[40px] active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuwe Gebed</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Strip (Touch-friendly on Android) */}
        <div className="lg:hidden flex items-center overflow-x-auto px-3 py-2 border-t border-cyan-900/10 bg-cyan-950/5 text-xs font-medium scrollbar-none gap-2">
          {/* Interlinear placed BEFORE SOAP */}
          <button
            onClick={() => setActiveTab('interlinear')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all min-h-[38px] active:scale-95 ${
              activeTab === 'interlinear'
                ? 'bg-gradient-to-r from-cyan-800 to-teal-700 text-white font-bold shadow-xs'
                : 'text-cyan-950 bg-white/70 border border-cyan-900/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interliniêr (BibleHub)</span>
          </button>

          <button
            onClick={() => setActiveTab('soap')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-all min-h-[38px] active:scale-95 ${
              activeTab === 'soap'
                ? 'bg-[#0B253A] text-white font-bold shadow-xs'
                : 'text-slate-700 bg-white/70 border border-slate-200'
            }`}
          >
            S.O.A.P.
          </button>

          <button
            onClick={() => setActiveTab('reading-plans')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-all min-h-[38px] active:scale-95 ${
              activeTab === 'reading-plans'
                ? 'bg-[#0B253A] text-white font-bold shadow-xs'
                : 'text-slate-700 bg-white/70 border border-slate-200'
            }`}
          >
            Leesplanne
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-all min-h-[38px] active:scale-95 ${
              activeTab === 'journal'
                ? 'bg-[#0B253A] text-white font-bold shadow-xs'
                : 'text-slate-700 bg-white/70 border border-slate-200'
            }`}
          >
            Joernaal &amp; Visie
          </button>

          <button
            onClick={() => setActiveTab('prayers')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-all min-h-[38px] active:scale-95 ${
              activeTab === 'prayers'
                ? 'bg-[#0B253A] text-white font-bold shadow-xs'
                : 'text-slate-700 bg-white/70 border border-slate-200'
            }`}
          >
            Gebedskamer
          </button>

          <button
            onClick={() => setActiveTab('year-in-review')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-all min-h-[38px] active:scale-95 ${
              activeTab === 'year-in-review'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 bg-white/70 border border-slate-200'
            }`}
          >
            Jaaroorsig
          </button>
        </div>
      </header>

      {/* Main Content Viewport (extra bottom padding pb-24 for Android bottom navigation bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-12">
        {/* 1. INTERLINEAR TAB (BEFORE SOAP) */}
        {activeTab === 'interlinear' && (
          <InterlinearTab onSendToSoap={handleSendReadingPassageToSoap} />
        )}

        {/* 2. DAAGLIKSE S.O.A.P. */}
        {activeTab === 'soap' && (
          <DailyVerseSoapTab
            soapEntries={soapEntries}
            onSaveSoapEntry={handleSaveSoapEntry}
            onOpenScriptureSearch={() => setIsScriptureSearchOpen(true)}
            onAttachToPrayer={(ref, text) => handleOpenAddPrayer(ref, text)}
            selectedScriptureFromModal={selectedScriptureForSoap}
          />
        )}

        {/* 3. LEESPLANNE */}
        {activeTab === 'reading-plans' && (
          <ReadingPlansTab
            progressMap={readingProgress}
            onToggleDayCompleted={handleToggleReadingDay}
            onSendToSoap={handleSendReadingPassageToSoap}
            onOpenScriptureSearch={() => setIsScriptureSearchOpen(true)}
          />
        )}

        {/* 4. JOERNAAL & VISIEBORD */}
        {activeTab === 'journal' && (
          <JournalTab
            journalEntries={journalEntries}
            pinnedItems={pinnedItems}
            brainDumps={brainDumps}
            onSaveJournalEntry={handleSaveJournalEntry}
            onDeleteJournalEntry={handleDeleteJournalEntry}
            onSavePinnedItem={handleSavePinnedItem}
            onDeletePinnedItem={handleDeletePinnedItem}
            onSaveBrainDump={handleSaveBrainDump}
            onOpenScriptureSearch={() => setIsScriptureSearchOpen(true)}
            onSendToSoap={(ref, text) => {
              handleSendReadingPassageToSoap(ref, text);
            }}
            onSendToPrayer={(title, request, ref) => {
              handleOpenAddPrayer(ref, request, title);
            }}
            selectedScriptureFromModal={selectedScriptureForJournal}
          />
        )}

        {/* 5. GEBEDSKAMER */}
        {activeTab === 'prayers' && (
          <PrayerSanctuaryTab
            prayers={prayers}
            onAddPrayer={() => handleOpenAddPrayer()}
            onEditPrayer={handleEditPrayer}
            onToggleAnswered={handleToggleAnswered}
            onDeletePrayer={handleDeletePrayer}
            onOpenScriptureSearch={() => {
              setScriptureSearchPrayerContext(null);
              setIsScriptureSearchOpen(true);
            }}
            currentUser={currentUser}
          />
        )}

        {/* 6. JAAROORSIG */}
        {activeTab === 'year-in-review' && (
          <YearInReviewTab
            prayers={prayers}
            journalEntries={journalEntries}
            soapEntries={soapEntries}
          />
        )}
      </main>

      {/* 
        ANDROID MOBILE BOTTOM NAVIGATION BAR
        Thumb-friendly 48dp+ tap targets for optimal mobile and Android experience
      */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cyan-900/15 py-1.5 px-2 shadow-lg flex items-center justify-around no-print"
        aria-label="Mobiele navigasie vir Android"
      >
        <button
          onClick={() => {
            setActiveTab('interlinear');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[50px] min-h-[48px] active:scale-95 transition-all ${
            activeTab === 'interlinear'
              ? 'text-cyan-900 font-bold bg-cyan-50'
              : 'text-slate-500 hover:text-cyan-950'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Interliniêr</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('soap');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[50px] min-h-[48px] active:scale-95 transition-all ${
            activeTab === 'soap'
              ? 'text-cyan-900 font-bold bg-cyan-50'
              : 'text-slate-500 hover:text-cyan-950'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">S.O.A.P.</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('reading-plans');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[50px] min-h-[48px] active:scale-95 transition-all ${
            activeTab === 'reading-plans'
              ? 'text-cyan-900 font-bold bg-cyan-50'
              : 'text-slate-500 hover:text-cyan-950'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Planne</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('journal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[50px] min-h-[48px] active:scale-95 transition-all ${
            activeTab === 'journal'
              ? 'text-cyan-900 font-bold bg-cyan-50'
              : 'text-slate-500 hover:text-cyan-950'
          }`}
        >
          <Brain className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Joernaal</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('prayers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[50px] min-h-[48px] active:scale-95 transition-all ${
            activeTab === 'prayers'
              ? 'text-cyan-900 font-bold bg-cyan-50'
              : 'text-slate-500 hover:text-cyan-950'
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Gebede</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('year-in-review');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[50px] min-h-[48px] active:scale-95 transition-all ${
            activeTab === 'year-in-review'
              ? 'text-cyan-900 font-bold bg-cyan-50'
              : 'text-slate-500 hover:text-cyan-950'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Oorsig</span>
        </button>
      </nav>

      {/* Modals & Dialogs */}
      <ScriptureSearchModal
        isOpen={isScriptureSearchOpen}
        onClose={() => {
          setIsScriptureSearchOpen(false);
          setScriptureSearchPrayerContext(null);
        }}
        prayerContext={scriptureSearchPrayerContext}
        onSelectForSoap={(s) => {
          setSelectedScriptureForSoap(s);
          setActiveTab('soap');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectForPrayer={(s) => {
          setAttachedScriptureForPrayer(s);
          setIsPrayerModalOpen(true);
        }}
        onSelectForJournal={(s) => {
          setSelectedScriptureForJournal(s);
          setActiveTab('journal');
        }}
      />

      <PrayerModal
        isOpen={isPrayerModalOpen}
        onClose={() => {
          setIsPrayerModalOpen(false);
          setEditingPrayer(null);
          setAttachedScriptureForPrayer(null);
          setScriptureSearchPrayerContext(null);
        }}
        onSave={handleSavePrayer}
        initialPrayer={editingPrayer}
        onOpenScriptureSearch={(ctx) => {
          setScriptureSearchPrayerContext(ctx || null);
          setIsScriptureSearchOpen(true);
        }}
        attachedScripture={attachedScriptureForPrayer}
      />

      {/* Editorial Footer - Ocean Shades */}
      <footer className="mt-auto border-t border-cyan-900/10 py-8 bg-cyan-950/5 text-slate-500 text-xs no-print hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif-editorial font-semibold text-[#0B253A] text-base">Selah</span>
            <span aria-hidden="true" className="text-cyan-700">·</span>
            <span>BibleHub Interliniêr · 1983-Bybel · Geestelike Oordenkings · Gebedskamer &amp; Visiebord</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('interlinear')}
              className="hover:text-cyan-950 transition-colors"
            >
              BibleHub Interliniêr
            </button>
            <span aria-hidden="true" className="text-cyan-700">·</span>
            <button
              onClick={() => setActiveTab('year-in-review')}
              className="hover:text-cyan-950 transition-colors"
            >
              Jaaroorsig
            </button>
            <span aria-hidden="true" className="text-cyan-700">·</span>
            <button
              onClick={() => setIsScriptureSearchOpen(true)}
              className="hover:text-cyan-950 transition-colors"
            >
              Bybelkluis
            </button>
          </div>
        </div>
      </footer>
      {/* Offline Connectivity Toast */}
      <OfflineIndicator />
    </div>
  );
}
