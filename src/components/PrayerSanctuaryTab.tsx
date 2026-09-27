import React, { useState, useMemo } from 'react';
import { Heart, Search, Plus, CheckCircle2, Calendar, BookOpen, Clock, Sparkles, Filter, Trash2, Edit3, Mic, Volume2, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { PrayerItem, Scripture } from '../types';
import { ASSET_IMAGES } from '../data/initialData';
import { SanctuaryPasswordLock } from './SanctuaryPasswordLock';
import {
  hasSanctuaryPassword,
  isSanctuaryUnlockedInSession,
  setSanctuaryUnlockedInSession,
} from '../utils/sanctuaryLock';
import { GoogleUser } from '../utils/auth';

interface PrayerSanctuaryTabProps {
  prayers: PrayerItem[];
  onAddPrayer: () => void;
  onEditPrayer: (prayer: PrayerItem) => void;
  onToggleAnswered: (prayer: PrayerItem) => void;
  onDeletePrayer: (id: string) => void;
  onOpenScriptureSearch: () => void;
  currentUser?: GoogleUser | null;
}

export const PrayerSanctuaryTab: React.FC<PrayerSanctuaryTabProps> = ({
  prayers,
  onAddPrayer,
  onEditPrayer,
  onToggleAnswered,
  onDeletePrayer,
  onOpenScriptureSearch,
  currentUser,
}) => {
  // Password protection state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isSanctuaryUnlockedInSession());
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [scriptureSearchQuery, setScriptureSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('Alle');

  const categories = ['Alle', 'Persoonlik', 'Familie', 'Genesing', 'Leiding', 'Geestelik', 'Danksegging', 'Gemeenskap', 'Ander'];

  // Counts
  const totalCount = prayers.length;
  const answeredCount = prayers.filter((p) => p.isAnswered).length;
  const activeCount = totalCount - answeredCount;

  // Filtered prayers
  const filteredPrayers = useMemo(() => {
    return prayers.filter((p) => {
      // Status
      if (statusFilter === 'active' && p.isAnswered) return false;
      if (statusFilter === 'answered' && !p.isAnswered) return false;

      // Category
      if (categoryFilter !== 'Alle' && p.category !== categoryFilter) return false;

      // SCRIPTURE SEARCH FEATURE
      if (scriptureSearchQuery.trim()) {
        const sQuery = scriptureSearchQuery.toLowerCase();
        const hasMatchingScripture =
          (p.scriptureRef && p.scriptureRef.toLowerCase().includes(sQuery)) ||
          (p.scriptureText && p.scriptureText.toLowerCase().includes(sQuery));
        if (!hasMatchingScripture) return false;
      }

      // General search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesRequest = p.request.toLowerCase().includes(q);
        const matchesNotes = p.answeredNotes?.toLowerCase().includes(q);
        const matchesScripture = p.scriptureRef?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesRequest && !matchesNotes && !matchesScripture) return false;
      }

      return true;
    });
  }, [prayers, statusFilter, categoryFilter, scriptureSearchQuery, searchQuery]);

  const calculateDaysDuration = (start: string, end?: string) => {
    const s = new Date(start).getTime();
    const e = end ? new Date(end).getTime() : new Date().getTime();
    const diff = Math.max(0, Math.floor((e - s) / (1000 * 60 * 60 * 24)));
    return diff;
  };

  const handleLockSanctuary = () => {
    setSanctuaryUnlockedInSession(false);
    setIsUnlocked(false);
  };

  // If locked, render the Sanctuary Password Lock screen
  if (!isUnlocked || isChangePasswordOpen) {
    return (
      <SanctuaryPasswordLock
        onUnlocked={() => {
          setIsUnlocked(true);
          setIsChangePasswordOpen(false);
        }}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner - Ocean Night/Morning */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-900/20 bg-[#0B253A] shadow-md">
        <div className="absolute inset-0">
          <img
            src={ASSET_IMAGES.oceanSanctuary}
            alt="Rustige oseaan en oop Bybel"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071927] via-[#0B253A]/80 to-[#155E75]/40" />
        </div>

        <div className="relative p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-300 font-semibold">
              <span>Voorbidding &amp; Smeking</span>
              <span aria-hidden="true">·</span>
              <span>Gebedskamer van Genade</span>
            </div>

            {/* Lock Status & Controls */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-400/30 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Wagwoord Ontsluit</span>
              </span>

              <button
                onClick={handleLockSanctuary}
                title="Sluit Gebedskamer dadelik"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-rose-900/60 hover:border-rose-400/40 text-cyan-100 hover:text-white rounded-lg text-xs font-medium border border-cyan-300/30 transition-all backdrop-blur-xs cursor-pointer active:scale-95"
              >
                <Lock className="w-3 h-3 text-cyan-300" />
                <span>Sluit Heiligdom</span>
              </button>

              <button
                onClick={() => setIsChangePasswordOpen(true)}
                title="Verander wagwoord of PIN"
                className="p-1.5 text-cyan-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-editorial font-medium text-white leading-tight">
            Die Altaar van Gebed &amp; Beantwoorde Trou
          </h1>

          <p className="text-sm sm:text-base text-cyan-100 font-sans-ui leading-relaxed max-w-2xl">
            Teken jou gebede aan via spraak-na-teks opname of tik dit in. Verbind elke versoek aan 'n 1983/1933-Bybelbelofte, hou die gebedsdatum en beantwoordingsdatum dop, en bou jou getuienismuur vir die <strong className="text-cyan-300">Jaaroorsig</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onAddPrayer}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Teken Nuwe Gebed Aan (Tik of Spraak)</span>
            </button>
            <button
              onClick={onOpenScriptureSearch}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-cyan-300/30 transition-colors backdrop-blur-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Soek Skrifbeloftes in Bybelkluis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-cyan-900/10 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Aktiewe Smekinge</div>
            <div className="text-2xl font-serif-editorial font-bold text-cyan-950 mt-0.5">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-cyan-700/20" />
          </div>
        </div>

        <div className="p-4 bg-white border border-cyan-900/10 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Beantwoorde Gebede</div>
            <div className="text-2xl font-serif-editorial font-bold text-emerald-700 mt-0.5">{answeredCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-cyan-900/10 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Privaatheid &amp; Wagwoord</div>
            <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Gebedskamer Beskerm</span>
            </div>
          </div>
          <button
            onClick={handleLockSanctuary}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Sluit Nou
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 bg-white border border-cyan-900/10 rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* General Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Soek volgens titel, versoek, of getuienis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-700"
            />
          </div>

          {/* Scripture Search */}
          <div className="relative">
            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-700" />
            <input
              type="text"
              placeholder="Soek gebede volgens gekoppelde Skrifteks of verwysing..."
              value={scriptureSearchQuery}
              onChange={(e) => setScriptureSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-700"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px] uppercase mr-1">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#0B253A] text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-cyan-50'
              }`}
            >
              Alle ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-cyan-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-cyan-50'
              }`}
            >
              Aktief ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('answered')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'answered'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
              }`}
            >
              Beantwoord ({answeredCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px] uppercase">Kategorie:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prayers List */}
      <div className="space-y-4">
        {filteredPrayers.length === 0 ? (
          <div className="p-12 text-center bg-white border border-cyan-900/10 rounded-2xl space-y-3">
            <Heart className="w-10 h-10 text-slate-300 mx-auto stroke-[1.2]" />
            <h3 className="text-base font-semibold text-slate-800">Geen gebede gevind nie</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Teken jou eerste gebed aan met 'n Bybelbelofte en begin jou reis van geloof en verhoring.
            </p>
            <button
              onClick={onAddPrayer}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B253A] hover:bg-[#0E3452] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuwe Gebed</span>
            </button>
          </div>
        ) : (
          filteredPrayers.map((prayer) => {
            const daysWaiting = calculateDaysDuration(prayer.prayerDate, prayer.answeredDate);
            return (
              <article
                key={prayer.id}
                className={`p-5 bg-white border rounded-2xl transition-all shadow-xs space-y-3 ${
                  prayer.isAnswered
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/20 to-white'
                    : 'border-cyan-900/10 hover:border-cyan-400/50'
                }`}
              >
                {/* Prayer Top Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-serif-editorial font-bold text-[#0B253A]">
                        {prayer.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-cyan-100/70 text-cyan-900 rounded-full">
                        {prayer.category}
                      </span>
                      {prayer.isAnswered ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Beantwoord na {daysWaiting} {daysWaiting === 1 ? 'dag' : 'dae'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{daysWaiting} {daysWaiting === 1 ? 'dag' : 'dae'} in geloof</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Gebid op: {prayer.prayerDate}</span>
                      {prayer.answeredDate && (
                        <span>· Beantwoord op: {prayer.answeredDate}</span>
                      )}
                    </div>
                  </div>

                  {/* Prayer Action Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleAnswered(prayer)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        prayer.isAnswered
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{prayer.isAnswered ? 'Beantwoord' : 'Merk as Beantwoord'}</span>
                    </button>

                    <button
                      onClick={() => onEditPrayer(prayer)}
                      title="Wysig Gebed"
                      className="p-1.5 text-slate-400 hover:text-cyan-950 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeletePrayer(prayer.id)}
                      title="Verwyder Gebed"
                      className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prayer Request Text */}
                <p className="text-sm text-slate-800 leading-relaxed font-sans-ui whitespace-pre-wrap">
                  {prayer.request}
                </p>

                {/* Attached Scripture Anchor */}
                {(prayer.scriptureRef || prayer.scriptureText) && (
                  <div className="p-3.5 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 border border-cyan-200/70 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-950">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-800" />
                      <span>Bybelbelofte: {prayer.scriptureRef || '1983-vertaling'}</span>
                    </div>
                    {prayer.scriptureText && (
                      <p className="font-serif-editorial text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                        “{prayer.scriptureText}”
                      </p>
                    )}
                  </div>
                )}

                {/* Answered Testimony / Notes */}
                {prayer.isAnswered && prayer.answeredNotes && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Getuienis van God se Verhoring:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                      {prayer.answeredNotes}
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
