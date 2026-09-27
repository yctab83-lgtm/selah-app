import React, { useState } from 'react';
import { Plus, Heart, Trash2, Calendar, BookOpen, Tag, Sparkles, Check, ArrowRight, Search, Pin, ExternalLink, Brain, Loader2, RefreshCw, Send, Copy } from 'lucide-react';
import { JournalEntry, PinnedItem, BrainDumpEntry, BrainDumpAnalysis, Scripture } from '../types';
import { ASSET_IMAGES } from '../data/initialData';

interface JournalTabProps {
  journalEntries: JournalEntry[];
  pinnedItems: PinnedItem[];
  brainDumps: BrainDumpEntry[];
  onSaveJournalEntry: (entry: JournalEntry) => void;
  onDeleteJournalEntry: (id: string) => void;
  onSavePinnedItem: (item: PinnedItem) => void;
  onDeletePinnedItem: (id: string) => void;
  onSaveBrainDump: (entry: BrainDumpEntry) => void;
  onOpenScriptureSearch: () => void;
  onSendToSoap?: (ref: string, text: string) => void;
  onSendToPrayer?: (title: string, request: string, scriptureRef?: string) => void;
  selectedScriptureFromModal?: Scripture | null;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  journalEntries,
  pinnedItems,
  brainDumps,
  onSaveJournalEntry,
  onDeleteJournalEntry,
  onSavePinnedItem,
  onDeletePinnedItem,
  onSaveBrainDump,
  onOpenScriptureSearch,
  onSendToSoap,
  onSendToPrayer,
  selectedScriptureFromModal,
}) => {
  // Sub-tabs within Journal
  const [activeSection, setActiveSection] = useState<'journal' | 'brain-dump' | 'pinterest'>('journal');

  // Journal Editor State
  const [isCreatingJournal, setIsCreatingJournal] = useState(false);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [journalDate, setJournalDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalReflection, setJournalReflection] = useState('');
  const [gratitudes, setGratitudes] = useState<string[]>(['', '', '']);
  const [journalScriptureRef, setJournalScriptureRef] = useState('');
  const [journalTagsInput, setJournalTagsInput] = useState('');
  const [journalSaveSuccess, setJournalSaveSuccess] = useState(false);
  const [journalSearchQuery, setJournalSearchQuery] = useState('');

  // Brain Dump State
  const [brainDumpText, setBrainDumpText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<BrainDumpAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Pin / Moodboard State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinTitle, setPinTitle] = useState('');
  const [pinImageUrl, setPinImageUrl] = useState('');
  const [pinSourceUrl, setPinSourceUrl] = useState('');
  const [pinCaption, setPinCaption] = useState('');
  const [pinCategory, setPinCategory] = useState<PinnedItem['category']>('Pinterest Inspirasie');
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);

  const handleOpenPinUrl = (url: string, id: string) => {
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        navigator.clipboard?.writeText(url);
        setCopiedPinId(id);
        setTimeout(() => setCopiedPinId(null), 2500);
      }
    } catch {
      navigator.clipboard?.writeText(url);
      setCopiedPinId(id);
      setTimeout(() => setCopiedPinId(null), 2500);
    }
  };

  // Pre-fill scripture from modal if available
  React.useEffect(() => {
    if (selectedScriptureFromModal) {
      setJournalScriptureRef(`${selectedScriptureFromModal.reference} (${selectedScriptureFromModal.translation})`);
    }
  }, [selectedScriptureFromModal]);

  // Handle Journal Entry
  const startNewJournalEntry = () => {
    setEditingJournalId(null);
    setJournalDate(new Date().toISOString().split('T')[0]);
    setJournalTitle('');
    setJournalReflection('');
    setGratitudes(['', '', '']);
    setJournalScriptureRef(selectedScriptureFromModal?.reference || '');
    setJournalTagsInput('');
    setIsCreatingJournal(true);
    setActiveSection('journal');
  };

  const startEditJournalEntry = (entry: JournalEntry) => {
    setEditingJournalId(entry.id);
    setJournalDate(entry.date);
    setJournalTitle(entry.title);
    setJournalReflection(entry.reflection);
    setGratitudes(entry.gratitudes.length > 0 ? entry.gratitudes : ['', '', '']);
    setJournalScriptureRef(entry.scriptureRef || '');
    setJournalTagsInput(entry.tags ? entry.tags.join(', ') : '');
    setIsCreatingJournal(true);
    setActiveSection('journal');
  };

  const handleGratitudeChange = (index: number, val: string) => {
    const updated = [...gratitudes];
    updated[index] = val;
    setGratitudes(updated);
  };

  const addGratitudeLine = () => {
    setGratitudes([...gratitudes, '']);
  };

  const removeGratitudeLine = (index: number) => {
    if (gratitudes.length <= 1) return;
    setGratitudes(gratitudes.filter((_, i) => i !== index));
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalReflection.trim() && gratitudes.every((g) => !g.trim())) return;

    const cleanedGratitudes = gratitudes.map((g) => g.trim()).filter(Boolean);
    const cleanedTags = journalTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const entry: JournalEntry = {
      id: editingJournalId || `joernaal-${Date.now()}`,
      date: journalDate,
      title: journalTitle.trim() || `Oordenking: ${new Date(journalDate + 'T12:00:00Z').toLocaleDateString('af-ZA', { month: 'short', day: 'numeric' })}`,
      reflection: journalReflection.trim(),
      gratitudes: cleanedGratitudes,
      scriptureRef: journalScriptureRef.trim() || undefined,
      tags: cleanedTags.length > 0 ? cleanedTags : undefined,
      createdAt: editingJournalId
        ? journalEntries.find((j) => j.id === editingJournalId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    onSaveJournalEntry(entry);
    setJournalSaveSuccess(true);
    setTimeout(() => {
      setJournalSaveSuccess(false);
      setIsCreatingJournal(false);
    }, 1200);
  };

  // Handle Brain Dump AI Analysis
  const handleAnalyzeBrainDump = async () => {
    if (!brainDumpText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brainDumpText: brainDumpText.trim() }),
      });

      if (!response.ok) {
        throw new Error('Kon nie ontleding voltooi nie');
      }

      const data: BrainDumpAnalysis = await response.json();
      setCurrentAnalysis(data);

      // Save to history
      const newDump: BrainDumpEntry = {
        id: `breinstorting-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        rawText: brainDumpText.trim(),
        analysis: data,
        createdAt: new Date().toISOString(),
      };
      onSaveBrainDump(newDump);
    } catch (err: any) {
      console.error(err);
      setAnalysisError('Kon nie ontleding uitvoer nie. Probeer asseblief weer.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Pin Submit
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinTitle.trim() || !pinImageUrl.trim()) return;

    const newPin: PinnedItem = {
      id: `pin-${Date.now()}`,
      title: pinTitle.trim(),
      imageUrl: pinImageUrl.trim(),
      sourceUrl: pinSourceUrl.trim() || undefined,
      caption: pinCaption.trim() || undefined,
      category: pinCategory,
      createdAt: new Date().toISOString(),
    };

    onSavePinnedItem(newPin);
    setIsPinModalOpen(false);
    setPinTitle('');
    setPinImageUrl('');
    setPinSourceUrl('');
    setPinCaption('');
  };

  // Filtered Journal Entries
  const filteredJournalEntries = journalEntries.filter((j) => {
    if (!journalSearchQuery.trim()) return true;
    const q = journalSearchQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.reflection.toLowerCase().includes(q) ||
      j.gratitudes.some((g) => g.toLowerCase().includes(q)) ||
      (j.scriptureRef && j.scriptureRef.toLowerCase().includes(q)) ||
      (j.tags && j.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const totalGratitudesCount = journalEntries.reduce((acc, curr) => acc + curr.gratitudes.length, 0);

  return (
    <div className="space-y-8">
      {/* Ocean Editorial Header */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-900/20 bg-[#0B253A] shadow-md">
        <div className="absolute inset-0">
          <img
            src={ASSET_IMAGES.oceanWaves}
            alt="Kalm blou oseaangolwe"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071927] via-[#0B253A]/80 to-[#155E75]/40" />
        </div>

        <div className="relative p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-300 font-semibold">
            <span>Stilte &amp; Visie</span>
            <span aria-hidden="true">·</span>
            <span>Joernaal, Dankbaarheid, Visiebord &amp; Breinstorting</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-editorial font-medium text-white leading-tight">
            Die Joernaal van Dankbare Herinnering
          </h1>

          <p className="text-sm sm:text-base text-cyan-100 font-sans-ui leading-relaxed max-w-2xl">
            Teken jou daaglikse dankbaarheid aan (wat direk na jou <strong className="text-cyan-300">Jaaroorsig</strong> vloei), speld inspirasie vanaf Pinterest en die internet vas, en stort jou denke uit vir KI-ontleding met 1983-Bybelterugvoer.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={startNewJournalEntry}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Skryf Oordenking &amp; Dankbaarheid</span>
            </button>
            <button
              onClick={() => setActiveSection('brain-dump')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E7490] hover:bg-[#0C627A] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Brain className="w-4 h-4 text-cyan-200" />
              <span>Gedagte-uitstorting (Brain Dump)</span>
            </button>
            <div className="px-3 py-1.5 bg-white/10 text-cyan-200 text-xs rounded-lg border border-cyan-300/30">
              <span className="font-bold text-white">{totalGratitudesCount}</span> Dankseggings in 2026
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-900/10 pb-3">
        <div className="flex items-center gap-2 p-1 bg-cyan-950/5 rounded-xl border border-cyan-900/10">
          <button
            onClick={() => setActiveSection('journal')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSection === 'journal'
                ? 'bg-white text-cyan-950 shadow-xs'
                : 'text-slate-600 hover:text-cyan-950'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-cyan-700" />
            <span>Oordenking &amp; Dankbaarheid ({journalEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('brain-dump')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSection === 'brain-dump'
                ? 'bg-white text-cyan-950 shadow-xs'
                : 'text-slate-600 hover:text-cyan-950'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-cyan-700" />
            <span>Breinstorting &amp; KI-Skrifontleding</span>
          </button>

          <button
            onClick={() => setActiveSection('pinterest')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSection === 'pinterest'
                ? 'bg-white text-cyan-950 shadow-xs'
                : 'text-slate-600 hover:text-cyan-950'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-cyan-700" />
            <span>Pinterest &amp; Internet Visiebord ({pinnedItems.length})</span>
          </button>
        </div>

        {activeSection === 'pinterest' && (
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B253A] hover:bg-[#0E3452] rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Speld Nuwe Item Vas</span>
          </button>
        )}
      </div>

      {/* SECTION 1: REFLECTION & GRATITUDE */}
      {activeSection === 'journal' && (
        <div className="space-y-6">
          {/* Create / Edit Form */}
          {isCreatingJournal && (
            <form
              onSubmit={handleSaveJournal}
              className="p-6 sm:p-8 bg-white border border-cyan-900/10 rounded-2xl shadow-md space-y-6 animate-in fade-in duration-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-900/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-900">
                    <span>{editingJournalId ? 'Wysig Inskrywing' : 'Nuwe Joernaalinskrywing'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500">{journalDate}</span>
                  </div>
                  <input
                    type="text"
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    placeholder="Gee hierdie oordenking 'n titel (bv. Oggendvrede by die See)..."
                    className="mt-1 text-2xl font-serif-editorial font-medium text-cyan-950 bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full placeholder:text-slate-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={journalDate}
                    onChange={(e) => setJournalDate(e.target.value)}
                    className="px-2.5 py-1.5 text-xs text-slate-700 bg-cyan-50/50 border border-cyan-900/20 rounded-md focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCreatingJournal(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Kanselleer
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0B253A] hover:bg-[#0E3452] rounded-lg transition-colors shadow-xs"
                  >
                    {journalSaveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{journalSaveSuccess ? 'Gestoor!' : 'Stoor Inskrywing'}</span>
                  </button>
                </div>
              </div>

              {/* DEDICATED GRATITUDE SPACE (Explicit User Requirement) */}
              <div className="p-5 bg-gradient-to-r from-cyan-50/60 to-teal-50/60 border border-cyan-200/80 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-cyan-800" />
                    <h3 className="text-sm font-bold text-cyan-950">
                      Toegewyde Dankbaarheidsruimte
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-900 bg-white/80 px-2.5 py-0.5 rounded-full border border-cyan-200">
                    ★ Vloei outomaties na Jaaroorsig
                  </span>
                </div>

                <p className="text-xs text-cyan-900 leading-relaxed font-sans-ui">
                  Noem 3 of meer konkrete seëninge, mense, oomblikke van genade of voorsiening uit vandag:
                </p>

                <div className="space-y-2">
                  {gratitudes.map((gratitude, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-800 w-5 text-center shrink-0">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        value={gratitude}
                        onChange={(e) => handleGratitudeChange(index, e.target.value)}
                        placeholder={
                          index === 0
                            ? 'bv. Die stil sonsopkoms oor die see met warm koffie...'
                            : index === 1
                            ? 'bv. Bemoedigende oproep van my suster...'
                            : 'bv. Onverwagse finansiële voorsiening...'
                        }
                        className="flex-1 px-3 py-2 bg-white border border-cyan-900/20 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-700"
                      />
                      {gratitudes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGratitudeLine(index)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Verwyder lyn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addGratitudeLine}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-900 hover:text-cyan-950 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Voeg nog \'n dankbaarheidspunt by</span>
                </button>
              </div>

              {/* Personal Reflection Prose */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cyan-950">
                  Persoonlike Oordenking &amp; Geestelike Reis
                </label>
                <textarea
                  rows={6}
                  value={journalReflection}
                  onChange={(e) => setJournalReflection(e.target.value)}
                  placeholder="Wat het God vandag aan jou hart gewys? Watter gedagtes het jy gevange geneem? Skryf vrylik..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm sm:text-base font-serif-editorial text-slate-900 leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
                />
              </div>

              {/* Scripture Anchor & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-cyan-950">
                    <span>Skrifanker (1983-vertaling)</span>
                    <button
                      type="button"
                      onClick={onOpenScriptureSearch}
                      className="text-cyan-800 hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Blaai in Kluis</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={journalScriptureRef}
                    onChange={(e) => setJournalScriptureRef(e.target.value)}
                    placeholder="bv. Filippense 4:6-7 (1983-vertaling)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-cyan-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-950">Etikette (deur kommas geskei)</label>
                  <input
                    type="text"
                    value={journalTagsInput}
                    onChange={(e) => setJournalTagsInput(e.target.value)}
                    placeholder="bv. Vrede, Familie, Voorsiening, Slagveld van die Denke"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-cyan-700"
                  />
                </div>
              </div>
            </form>
          )}

          {/* Timeline and Search */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif-editorial font-semibold text-cyan-950">
                  Joernaal Tydlyn
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{journalEntries.length} Oordenkings</span>
                  <span aria-hidden="true">·</span>
                  <span>{totalGratitudesCount} Dankbaarhede Aangeteken</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={journalSearchQuery}
                    onChange={(e) => setJournalSearchQuery(e.target.value)}
                    placeholder="Soek oordenkings & dankbaarheid..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-64 focus:outline-none focus:border-cyan-700"
                  />
                </div>
                {!isCreatingJournal && (
                  <button
                    onClick={startNewJournalEntry}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#0B253A] text-white rounded-lg hover:bg-[#0E3452] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuwe Inskrywing</span>
                  </button>
                )}
              </div>
            </div>

            {/* Entry Cards */}
            {filteredJournalEntries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-cyan-900/10 p-6 space-y-3">
                <Heart className="w-8 h-8 text-cyan-300 mx-auto" />
                <p className="text-slate-800 font-serif-editorial text-lg">Geen joernaalinskrywings gevind nie</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Begin deur jou eerste oordenking te skryf en jou daaglikse dankbaarheid neer te pen.
                </p>
                <button
                  onClick={startNewJournalEntry}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#0B253A] text-white rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Begin Jou Joernaal</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJournalEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className="p-6 bg-white border border-cyan-900/10 rounded-2xl shadow-xs hover:border-cyan-300 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-cyan-950">
                            {new Date(entry.date + 'T12:00:00Z').toLocaleDateString('af-ZA', {
                              weekday: 'short',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          {entry.scriptureRef && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-cyan-800 font-medium">{entry.scriptureRef}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif-editorial text-xl font-semibold text-cyan-950">
                          {entry.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditJournalEntry(entry)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-cyan-950 hover:bg-cyan-50 rounded transition-colors"
                        >
                          Wysig
                        </button>
                        <button
                          onClick={() => onDeleteJournalEntry(entry.id)}
                          className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          title="Verwyder inskrywing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Gratitude List Preview */}
                    {entry.gratitudes.length > 0 && (
                      <div className="p-3.5 bg-gradient-to-r from-cyan-50/50 to-teal-50/50 border border-cyan-200/60 rounded-xl space-y-1.5">
                        <span className="text-[11px] font-bold text-cyan-950 uppercase tracking-wider flex items-center gap-1">
                          <Heart className="w-3 h-3 text-cyan-700" />
                          <span>Dankbaarheid &amp; Seëninge (Gekoppel aan Jaaroorsig)</span>
                        </span>
                        <ul className="space-y-1 text-xs text-slate-800">
                          {entry.gratitudes.map((g, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-cyan-700 font-bold">•</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Reflection Narrative */}
                    {entry.reflection && (
                      <p className="font-serif-editorial text-base text-slate-800 leading-relaxed">
                        {entry.reflection}
                      </p>
                    )}

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-500">
                        <Tag className="w-3 h-3 text-cyan-700" />
                        {entry.tags.map((tag, idx) => (
                          <span key={idx} className="hover:text-cyan-900">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: BRAIN DUMP & AI SCRIPTURE FEEDBACK (Explicit User Requirement) */}
      {activeSection === 'brain-dump' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 bg-white border border-cyan-900/10 rounded-2xl shadow-xs space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-900">
                <Brain className="w-4 h-4 text-cyan-700" />
                <span>Gedagte-uitstorting (Brain Dump) &amp; KI-Skrifontleding</span>
              </div>
              <h2 className="text-2xl font-serif-editorial font-semibold text-cyan-950">
                Maak Jou Gemoed Skoon en Ontvang Goddelike Perspektief
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans-ui max-w-2xl leading-relaxed">
                Stort al jou rou gedagtes, bekommernisse, take, en onrusige gevoelens hier uit sonder filters. Ons KI ontleed jou gedagtes met Bybelse beginsels vir die vernuwing van jou denke en gee jou direkte 1983-Bybelverse en praktiese stappe.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                rows={7}
                value={brainDumpText}
                onChange={(e) => setBrainDumpText(e.target.value)}
                placeholder="Skryf alles wat in jou kop maal... bv. 'Ek voel oorweldig deur werk, bekommerd oor die toekoms, sukkel om te rus in die aande, en wonder of ek genoeg doen...'"
                className="w-full px-4 py-3.5 bg-cyan-50/20 border border-cyan-900/20 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-700"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-slate-500">
                {brainDumpText.length} karakters geskryf
              </span>

              <div className="flex items-center gap-2">
                {brainDumpText && (
                  <button
                    type="button"
                    onClick={() => {
                      setBrainDumpText('');
                      setCurrentAnalysis(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Maak Skoon
                  </button>
                )}
                <button
                  type="button"
                  disabled={!brainDumpText.trim() || isAnalyzing}
                  onClick={handleAnalyzeBrainDump}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#0B253A] to-[#155E75] hover:opacity-95 rounded-xl shadow-xs disabled:opacity-50 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                      <span>Ontleed Tans Gedagtes...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>Ontleed met KI &amp; Skrif-terugvoer</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {analysisError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-lg">
                {analysisError}
              </div>
            )}
          </div>

          {/* AI Feedback Display Card */}
          {currentAnalysis && (
            <div className="p-6 sm:p-8 bg-gradient-to-br from-cyan-900 to-[#071E2E] text-white border border-cyan-500/30 rounded-2xl shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                  <h3 className="text-lg font-serif-editorial font-bold text-white tracking-wide">
                    Bybelse Perspektief &amp; Geestelike Bemoediging
                  </h3>
                </div>
                <span className="text-xs bg-cyan-500/20 text-cyan-200 px-2.5 py-1 rounded-full border border-cyan-400/30">
                  1983-Bybelvertaling
                </span>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Gemoedsoorsig:</span>
                <p className="text-sm font-sans-ui text-cyan-100 leading-relaxed">
                  {currentAnalysis.summary}
                </p>
              </div>

              {/* Spiritual Encouragement */}
              <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2 backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <span>Vernuwing van die Denke Bemoediging:</span>
                </span>
                <p className="font-serif-editorial text-base sm:text-lg text-white leading-relaxed italic">
                  “{currentAnalysis.encouragingMessage}”
                </p>
                {currentAnalysis.spiritualInsight && (
                  <p className="text-xs text-cyan-200 font-sans-ui pt-1 border-t border-white/10">
                    <strong className="text-white">Praktiese Aksie:</strong> {currentAnalysis.spiritualInsight}
                  </p>
                )}
              </div>

              {/* Recommended 1983 Scriptures */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Voorgeskrewe Skrifbeloftes om Oor Jou Situasie uit te Praat:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentAnalysis.recommendedScriptures.map((scrip, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 border border-cyan-400/20 rounded-xl space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-cyan-300">{scrip.reference}</span>
                          <span className="text-[10px] text-cyan-200/70">1983-Bybel</span>
                        </div>
                        <p className="font-serif-editorial text-sm text-cyan-50 italic">
                          “{scrip.text}”
                        </p>
                        <p className="text-xs text-cyan-200 font-sans-ui pt-1">
                          <strong className="text-white">Toepassing:</strong> {scrip.practicalApplication}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs">
                        {onSendToSoap && (
                          <button
                            onClick={() => onSendToSoap(scrip.reference, scrip.text)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-white"
                          >
                            <span>Stuur na S.O.A.P.</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {onSendToPrayer && (
                          <button
                            onClick={() => onSendToPrayer(`Gebed oor: ${scrip.reference}`, `Here, ek bring my gedagtestryd en staan op ${scrip.reference}: "${scrip.text}"`, scrip.reference)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-white ml-auto"
                          >
                            <Heart className="w-3 h-3 text-cyan-300" />
                            <span>Maak \'n Gebed</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Past Brain Dumps History */}
          {brainDumps.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-cyan-900/10">
              <h3 className="text-base font-serif-editorial font-semibold text-cyan-950">
                Vorige Gedagte-uitstortings ({brainDumps.length})
              </h3>
              <div className="space-y-2">
                {brainDumps.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setBrainDumpText(item.rawText);
                      if (item.analysis) setCurrentAnalysis(item.analysis);
                    }}
                    className="p-3.5 bg-white border border-cyan-900/10 rounded-xl hover:border-cyan-300 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-cyan-950">{item.date}</span>
                      <span className="text-cyan-700 font-medium">Klik om te herlaai</span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2">
                      {item.rawText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: PINTEREST & INTERNET MOODBOARD (Explicit User Requirement) */}
      {activeSection === 'pinterest' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-cyan-900/10 rounded-xl shadow-xs">
            <div>
              <h2 className="text-lg font-serif-editorial font-semibold text-cyan-950">
                Geestelike Visiebord &amp; Vasgepende Inspirasie
              </h2>
              <p className="text-xs text-slate-500">
                Speld Bybelstudie-estetika, Pinterest-aanhalings, en natuurtonele vas om jou gemoed te inspireer
              </p>
            </div>

            <button
              onClick={() => setIsPinModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B253A] hover:bg-[#0E3452] rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Speld Nuwe Item Vas</span>
            </button>
          </div>

          {/* Masonry-Style Pinned Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedItems.map((pin) => (
              <article
                key={pin.id}
                className="group bg-white border border-cyan-900/15 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={pin.imageUrl}
                      alt={pin.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {pin.sourceUrl && (
                        <button
                          type="button"
                          onClick={() => pin.sourceUrl && handleOpenPinUrl(pin.sourceUrl, pin.id)}
                          className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
                          title={copiedPinId === pin.id ? 'Skakel gekopieer!' : 'Open of kopieer skakel'}
                        >
                          {copiedPinId === pin.id ? (
                            <Check className="w-3.5 h-3.5 text-teal-300" />
                          ) : (
                            <ExternalLink className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => onDeletePinnedItem(pin.id)}
                        className="p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg backdrop-blur-xs transition-colors"
                        title="Verwyder speld"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                        {pin.category}
                      </span>
                    </div>

                    <h3 className="font-serif-editorial text-lg font-semibold text-cyan-950 leading-snug">
                      {pin.title}
                    </h3>

                    {pin.caption && (
                      <p className="text-xs text-slate-600 leading-relaxed font-sans-ui">
                        {pin.caption}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
                  <span>Vasgespeld</span>
                  <span>{new Date(pin.createdAt).toLocaleDateString('af-ZA')}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Modal to Pin from Internet or Pinterest */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs overscroll-contain">
          <div className="relative w-full max-w-lg max-h-[100dvh] sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl border border-cyan-900/20 shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/10">
              <div className="flex items-center gap-2">
                <Pin className="w-5 h-5 text-cyan-700" />
                <h3 className="text-lg font-serif-editorial font-bold text-cyan-950">
                  Speld Item Vas van Pinterest of Internet
                </h3>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePin} className="space-y-3 text-xs overflow-y-auto overscroll-contain flex-1 min-h-0">
              <div className="space-y-1">
                <label className="font-semibold text-cyan-950">Titel / Aanhaling *</label>
                <input
                  type="text"
                  required
                  value={pinTitle}
                  onChange={(e) => setPinTitle(e.target.value)}
                  placeholder="bv. Slagveld van die Denke Belofte..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-cyan-950">Prent URL *</label>
                <input
                  type="url"
                  required
                  value={pinImageUrl}
                  onChange={(e) => setPinImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... of Pinterest prentskakel"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-700"
                />
                <span className="text-[10px] text-slate-400">Plak enige direkte prent-URL of Pinterest-prentskakel</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-cyan-950">Bron URL / Pinterest Skakel (Opsioneel)</label>
                <input
                  type="url"
                  value={pinSourceUrl}
                  onChange={(e) => setPinSourceUrl(e.target.value)}
                  placeholder="https://pinterest.com/pin/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-cyan-950">Kategorie</label>
                <select
                  value={pinCategory}
                  onChange={(e) => setPinCategory(e.target.value as PinnedItem['category'])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-700"
                >
                  <option value="Pinterest Inspirasie">Pinterest Inspirasie</option>
                  <option value="Aanhaling">Aanhaling</option>
                  <option value="Skrifkunswerk">Skrifkunswerk</option>
                  <option value="Gebedsmotivering">Gebedsmotivering</option>
                  <option value="Gemoedsbord">Gemoedsbord</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-cyan-950">Nota / Onderskrif (Opsioneel)</label>
                <textarea
                  rows={2}
                  value={pinCaption}
                  onChange={(e) => setPinCaption(e.target.value)}
                  placeholder="Wat beteken hierdie beeld of aanhaling vir jou gees?..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-700"
                />
              </div>

              <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:pt-3 sm:pb-0 bg-white/95 backdrop-blur-sm border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900"
                >
                  Kanselleer
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#0B253A] hover:bg-[#0E3452] rounded-lg shadow-xs"
                >
                  Speld Vas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
