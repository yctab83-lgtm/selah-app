import React, { useState, useRef } from 'react';
import {
  ExternalLink,
  BookOpen,
  Search,
  Sparkles,
  Layers,
  Globe,
  Compass,
  ArrowUpRight,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ASSET_IMAGES } from '../data/initialData';

interface InterlinearTabProps {
  onSendToSoap?: (ref: string, text: string) => void;
}

interface BibleBookNav {
  nameAfrikaans: string;
  nameEnglish: string;
  bibleHubSlug: string;
  testament: 'Ou Testament (Hebreeus)' | 'Nuwe Testament (Grieks)';
  chapters: number;
}

const BIBLE_BOOKS: BibleBookNav[] = [
  // Nuwe Testament (Griekse Grondteks)
  { nameAfrikaans: 'Filippense', nameEnglish: 'Philippians', bibleHubSlug: 'philippians', testament: 'Nuwe Testament (Grieks)', chapters: 4 },
  { nameAfrikaans: 'Matteus', nameEnglish: 'Matthew', bibleHubSlug: 'matthew', testament: 'Nuwe Testament (Grieks)', chapters: 28 },
  { nameAfrikaans: 'Markus', nameEnglish: 'Mark', bibleHubSlug: 'mark', testament: 'Nuwe Testament (Grieks)', chapters: 16 },
  { nameAfrikaans: 'Lukas', nameEnglish: 'Luke', bibleHubSlug: 'luke', testament: 'Nuwe Testament (Grieks)', chapters: 24 },
  { nameAfrikaans: 'Johannes', nameEnglish: 'John', bibleHubSlug: 'john', testament: 'Nuwe Testament (Grieks)', chapters: 21 },
  { nameAfrikaans: 'Handelinge', nameEnglish: 'Acts', bibleHubSlug: 'acts', testament: 'Nuwe Testament (Grieks)', chapters: 28 },
  { nameAfrikaans: 'Romeine', nameEnglish: 'Romans', bibleHubSlug: 'romans', testament: 'Nuwe Testament (Grieks)', chapters: 16 },
  { nameAfrikaans: '1 Korintiërs', nameEnglish: '1 Corinthians', bibleHubSlug: '1_corinthians', testament: 'Nuwe Testament (Grieks)', chapters: 16 },
  { nameAfrikaans: '2 Korintiërs', nameEnglish: '2 Corinthians', bibleHubSlug: '2_corinthians', testament: 'Nuwe Testament (Grieks)', chapters: 13 },
  { nameAfrikaans: 'Galasiërs', nameEnglish: 'Galatians', bibleHubSlug: 'galatians', testament: 'Nuwe Testament (Grieks)', chapters: 6 },
  { nameAfrikaans: 'Efesiërs', nameEnglish: 'Ephesians', bibleHubSlug: 'ephesians', testament: 'Nuwe Testament (Grieks)', chapters: 6 },
  { nameAfrikaans: 'Kolossense', nameEnglish: 'Colossians', bibleHubSlug: 'colossians', testament: 'Nuwe Testament (Grieks)', chapters: 4 },
  { nameAfrikaans: '1 Tessalonisense', nameEnglish: '1 Thessalonians', bibleHubSlug: '1_thessalonians', testament: 'Nuwe Testament (Grieks)', chapters: 5 },
  { nameAfrikaans: 'Hebreërs', nameEnglish: 'Hebrews', bibleHubSlug: 'hebrews', testament: 'Nuwe Testament (Grieks)', chapters: 13 },
  { nameAfrikaans: 'Jakobus', nameEnglish: 'James', bibleHubSlug: 'james', testament: 'Nuwe Testament (Grieks)', chapters: 5 },
  { nameAfrikaans: '1 Petrus', nameEnglish: '1 Peter', bibleHubSlug: '1_peter', testament: 'Nuwe Testament (Grieks)', chapters: 5 },
  { nameAfrikaans: 'Openbaring', nameEnglish: 'Revelation', bibleHubSlug: 'revelation', testament: 'Nuwe Testament (Grieks)', chapters: 22 },

  // Ou Testament (Hebreeuse Grondteks)
  { nameAfrikaans: 'Genesis', nameEnglish: 'Genesis', bibleHubSlug: 'genesis', testament: 'Ou Testament (Hebreeus)', chapters: 50 },
  { nameAfrikaans: 'Eksodus', nameEnglish: 'Exodus', bibleHubSlug: 'exodus', testament: 'Ou Testament (Hebreeus)', chapters: 40 },
  { nameAfrikaans: 'Josua', nameEnglish: 'Joshua', bibleHubSlug: 'joshua', testament: 'Ou Testament (Hebreeus)', chapters: 24 },
  { nameAfrikaans: 'Psalms', nameEnglish: 'Psalms', bibleHubSlug: 'psalms', testament: 'Ou Testament (Hebreeus)', chapters: 150 },
  { nameAfrikaans: 'Spreuke', nameEnglish: 'Proverbs', bibleHubSlug: 'proverbs', testament: 'Ou Testament (Hebreeus)', chapters: 31 },
  { nameAfrikaans: 'Jesaja', nameEnglish: 'Isaiah', bibleHubSlug: 'isaiah', testament: 'Ou Testament (Hebreeus)', chapters: 66 },
  { nameAfrikaans: 'Jeremia', nameEnglish: 'Jeremiah', bibleHubSlug: 'jeremiah', testament: 'Ou Testament (Hebreeus)', chapters: 52 },
  { nameAfrikaans: 'Klaagliedere', nameEnglish: 'Lamentations', bibleHubSlug: 'lamentations', testament: 'Ou Testament (Hebreeus)', chapters: 5 },
];

interface WordStudyItem {
  term: string;
  original: string;
  strongs: string;
  language: 'Grieks' | 'Hebreeus';
  meaning: string;
  spiritualPerspective: string;
  joyceMeyerPerspective?: string;
  keyVerse: string;
  verseText: string;
}

const SAMPLE_WORD_STUDIES: WordStudyItem[] = [
  {
    term: 'Vrede / Heil / Heelheid',
    original: 'שָׁלוֹם (Shalom)',
    strongs: 'H7965',
    language: 'Hebreeus',
    meaning: 'Nie net die afwesigheid van konflik nie, maar volkome heelheid, rus, veiligheid en welstand in God.',
    spiritualPerspective: "Vrede is nie 'n gevoel nie; dit is 'n persoonlike posisie in Christus. Moenie toelaat dat omstandighede jou vrede steel nie!",
    keyVerse: 'Psalm 23:2',
    verseText: 'Hy bring my by waters waar daar vrede (rus) is.'
  },
  {
    term: 'Neem Gevange (Denke)',
    original: 'αἰχμαλωτίζω (Aichmalōtizō)',
    strongs: 'G163',
    language: 'Grieks',
    meaning: "Om met militêre gesag 'n vyandige gevangene te neem en onder beheer te bring.",
    spiritualPerspective: 'In die stryd van die denke moet jy jou gedagtes soos krygsgevangenes arresteer en toets aan God se lewende Woord.',
    keyVerse: '2 Korintiërs 10:5',
    verseText: '...en ons neem elke gedagte gevange om dit aan Christus gehoorsaam te maak.'
  },
  {
    term: 'Selah (Pouseer & Dink)',
    original: 'סֶלָה (Selah)',
    strongs: 'H5542',
    language: 'Hebreeus',
    meaning: "'n Musiekteken wat 'n stil pouse aandui om die pas gesonge waarheid diep in die hart te laat insak.",
    spiritualPerspective: 'Stop die gejaag. Asem in. Dink diep na oor wat God pas gesê het voor jy vorentoe hardloop.',
    keyVerse: 'Psalm 46:4, 8, 12',
    verseText: 'Die Here van die leërskare is met ons; die God van Jakob is ons toevlug. Selah.'
  },
  {
    term: 'Genade / Onverdiende Guns',
    original: 'χάρις (Charis)',
    strongs: 'G5485',
    language: 'Grieks',
    meaning: 'God se gewillige en kragdadige guns wat ons bekwaam maak om te doen wat ons nie uit eie krag kan doen nie.',
    spiritualPerspective: "Genade is nie net vergifnis nie; dit is God se krag wat jou help om jou daaglikse lewe met vreugde en oorwinning te leef.",
    keyVerse: '2 Korintiërs 12:9',
    verseText: 'My genade is vir jou genoeg, want my krag kom juis tot volle werking wanneer jy swak is.'
  }
];

export const InterlinearTab: React.FC<InterlinearTabProps> = ({ onSendToSoap }) => {
  const [selectedBook, setSelectedBook] = useState<BibleBookNav>(BIBLE_BOOKS[0]);
  const [selectedChapter, setSelectedChapter] = useState<number>(4);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isViewerExpanded, setIsViewerExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(1);

  const viewerRef = useRef<HTMLDivElement>(null);

  const bibleHubBaseUrl = 'https://biblehub.com/interlinear/';
  const safeChapter = Math.min(Math.max(1, selectedChapter), selectedBook.chapters);
  const chapterUrl = `https://biblehub.com/interlinear/${selectedBook.bibleHubSlug}/${safeChapter}.htm`;
  const [activeViewerUrl, setActiveViewerUrl] = useState<string>(chapterUrl);

  const filteredBooks = BIBLE_BOOKS.filter((b) =>
    b.nameAfrikaans.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.nameEnglish.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const copyToClipboard = async (url: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopiedUrl(url);
      showToast(`✓ Skakel gekopieer na knipbord: ${label}`);
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      showToast(`Skakel: ${url}`);
    }
  };

  // Safe link launcher that works in iframe, mobile, and sandboxed preview environments
  const handleOpenLink = (url: string, label: string) => {
    // 1. Immediately set the embedded viewer to this URL so the user sees it directly in the app
    setActiveViewerUrl(url);
    setIframeKey((prev) => prev + 1);

    // 2. Smoothly scroll to the live viewer
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 3. Attempt to open in a new tab/window as well
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        // Popups might be blocked or restricted by iframe sandbox
        copyToClipboard(url, label);
        showToast(`BibleHub is hieronder gelaai! Skakel is ook gekopieer.`);
      } else {
        showToast(`✓ BibleHub oopgemaak en hieronder gelaai.`);
      }
    } catch {
      copyToClipboard(url, label);
      showToast(`BibleHub is hieronder gelaai.`);
    }
  };

  const handleSelectBook = (book: BibleBookNav) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    const newUrl = `https://biblehub.com/interlinear/${book.bibleHubSlug}/1.htm`;
    setActiveViewerUrl(newUrl);
    setIframeKey((prev) => prev + 1);
  };

  const handleSelectChapter = (ch: number) => {
    setSelectedChapter(ch);
    const newUrl = `https://biblehub.com/interlinear/${selectedBook.bibleHubSlug}/${ch}.htm`;
    setActiveViewerUrl(newUrl);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-8 z-50 bg-[#0B253A] text-white px-4 py-3 rounded-xl shadow-2xl border border-cyan-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Mobile-optimized Ocean Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-900/20 bg-[#0B253A] shadow-lg">
        <div className="absolute inset-0">
          <img
            src={ASSET_IMAGES.oceanSanctuary}
            alt="Interliniêre Bybelstudie"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071927] via-[#0B253A]/85 to-[#155E75]/40" />
        </div>

        <div className="relative p-5 sm:p-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-300 font-semibold">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Oorspronklike Tale</span>
            <span aria-hidden="true">·</span>
            <span>Hebreeus &amp; Grieks</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-editorial font-medium text-white leading-tight">
            BibleHub Interliniêre Bybelstudie
          </h1>

          <p className="text-xs sm:text-sm text-cyan-100 font-sans-ui leading-relaxed max-w-2xl">
            Ontsluit die rykdom van die grondteks. Bestudeer Bybelverse woord-vir-woord met oorspronklike Griekse en Hebreeuse grammatika, Strong's konkordansienommers, en dieper betekenisse.
          </p>

          {/* MAIN PROMINENT ACTION: DIRECT BIBLEHUB LAUNCHER WITH EMBEDDED VIEWER GUARANTEE */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://biblehub.com/interlinear/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setActiveViewerUrl('https://biblehub.com/interlinear/');
                setIframeKey((prev) => prev + 1);
                copyToClipboard('https://biblehub.com/interlinear/', 'BibleHub Hoofblad');
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-[#071927] text-sm font-bold rounded-xl shadow-md transition-all active:scale-98 w-full sm:w-auto text-center cursor-pointer"
            >
              <span>Maak Oop: biblehub.com/interlinear</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            <a
              href={chapterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setActiveViewerUrl(chapterUrl);
                setIframeKey((prev) => prev + 1);
                copyToClipboard(chapterUrl, `${selectedBook.nameAfrikaans} ${selectedChapter}`);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-cyan-300/30 transition-all active:scale-98 w-full sm:w-auto text-center backdrop-blur-xs cursor-pointer"
            >
              <span>Gaan direk na {selectedBook.nameAfrikaans} {selectedChapter}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => copyToClipboard(chapterUrl, `${selectedBook.nameAfrikaans} ${selectedChapter}`)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 text-xs font-medium rounded-xl border border-cyan-500/20 transition-all active:scale-98 cursor-pointer"
              title="Kopieer skakel na knipbord"
            >
              {copiedUrl === chapterUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-300" />
                  <span className="text-teal-200">Gekopieer!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopieer Skakel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Android-Optimized Interactive Quick Book & Chapter Selector */}
      <section className="bg-white border border-cyan-900/10 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-serif-editorial font-semibold text-cyan-950 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-700" />
              <span>Kies Boek &amp; Hoofstuk vir BibleHub Interliniêr</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kies enige Bybelboek hieronder om dadelik na daardie hoofstuk se oorspronklike Hebreeuse of Griekse teks te gaan
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Soek boek (bv. Filippense)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-700"
            />
          </div>
        </div>

        {/* Book Selector Chips - Touch-friendly on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filteredBooks.map((book) => {
            const isSelected = selectedBook.bibleHubSlug === book.bibleHubSlug;
            return (
              <button
                key={book.bibleHubSlug}
                onClick={() => handleSelectBook(book)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B253A] text-white shadow-xs ring-2 ring-cyan-600/30'
                    : 'bg-cyan-50/60 text-cyan-950 border border-cyan-900/10 hover:bg-cyan-100/70'
                }`}
              >
                <span>{book.nameAfrikaans}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-cyan-900 text-cyan-200' : 'bg-white text-slate-500'}`}>
                  {book.testament.includes('Grieks') ? 'Grieks' : 'Hebreeus'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Chapter Picker Grid - Touch targets min 44px for Android */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-950">
              Kies Hoofstuk in {selectedBook.nameAfrikaans} ({selectedBook.testament}):
            </span>
            <span className="text-slate-500">Totaal {selectedBook.chapters} hoofstukke</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => {
              const isCurrent = ch === selectedChapter;
              return (
                <button
                  key={ch}
                  onClick={() => handleSelectChapter(ch)}
                  className={`w-10 h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-700 text-white shadow-xs font-bold'
                      : 'bg-slate-50 hover:bg-cyan-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Link Banner */}
        <div className="p-3.5 bg-gradient-to-r from-cyan-50/80 to-teal-50/80 border border-cyan-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-bold text-cyan-950 flex items-center gap-1.5 justify-center sm:justify-start">
              <span>Gereed vir Interliniêre Studie: {selectedBook.nameAfrikaans} {selectedChapter}</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-teal-100 text-teal-900 rounded font-semibold">
                {selectedBook.testament.includes('Grieks') ? 'Grieks' : 'Hebreeus'}
              </span>
            </span>
            <p className="text-[11px] text-slate-600 font-mono break-all">
              {chapterUrl}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => copyToClipboard(chapterUrl, `${selectedBook.nameAfrikaans} ${selectedChapter}`)}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-medium shadow-2xs transition-colors cursor-pointer"
              title="Kopieer skakel"
            >
              {copiedUrl === chapterUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-teal-700">Gekopieer</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopieer</span>
                </>
              )}
            </button>

            <a
              href={chapterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setActiveViewerUrl(chapterUrl);
                setIframeKey((prev) => prev + 1);
                copyToClipboard(chapterUrl, `${selectedBook.nameAfrikaans} ${selectedChapter}`);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B253A] hover:bg-[#0E3452] text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Bekyk &amp; Open BibleHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* EMBEDDED LIVE BIBLEHUB INTERLINEAR VIEWER (Ensures links always display) */}
      <section
        ref={viewerRef}
        className="bg-white border border-cyan-900/15 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all scroll-mt-20"
      >
        {/* Viewer Top Toolbar */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-[#0B253A] to-[#0E3856] text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-editorial text-base sm:text-lg font-semibold text-white">
                  Geïntegreerde BibleHub-kyker
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-400 text-slate-950 uppercase tracking-wider">
                  Regstreeks
                </span>
              </div>
              <p className="text-[11px] text-cyan-200/90 font-mono truncate max-w-xs sm:max-w-md">
                {activeViewerUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveViewerUrl('https://biblehub.com/interlinear/');
                setIframeKey((prev) => prev + 1);
                showToast('BibleHub hoofportaal gelaai.');
              }}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Laai BibleHub Hoofblad"
            >
              Hoofblad
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveViewerUrl(chapterUrl);
                setIframeKey((prev) => prev + 1);
                showToast(`${selectedBook.nameAfrikaans} ${selectedChapter} herlaai.`);
              }}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Laai huidige hoofstuk"
            >
              Huidige Hoofstuk
            </button>

            <button
              type="button"
              onClick={() => setIframeKey((prev) => prev + 1)}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title="Herlaai venster"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(activeViewerUrl, 'Huidige URL')}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title="Kopieer skakel"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsViewerExpanded(!isViewerExpanded)}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title={isViewerExpanded ? 'Verklein aansig' : 'Vergroot aansig'}
            >
              {isViewerExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <a
              href={activeViewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                copyToClipboard(activeViewerUrl, 'BibleHub Skakel');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-400 to-cyan-300 text-[#071927] hover:brightness-105 font-bold rounded-lg text-xs transition-all shadow-xs ml-1 cursor-pointer"
            >
              <span>Nuwe Venster</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div
          className={`relative w-full bg-slate-100 transition-all duration-300 ${
            isViewerExpanded ? 'h-[750px] sm:h-[900px]' : 'h-[500px] sm:h-[620px]'
          }`}
        >
          <iframe
            key={iframeKey}
            src={activeViewerUrl}
            title="BibleHub Interliniêre Bybelstudie"
            className="w-full h-full border-0 bg-white"
            loading="lazy"
            allow="fullscreen"
          />

          {/* Bottom helper bar inside iframe container */}
          <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-2 pointer-events-auto">
            <span>Probleme om die skakel te sien?</span>
            <button
              type="button"
              onClick={() => copyToClipboard(activeViewerUrl, 'BibleHub Skakel')}
              className="underline text-teal-300 hover:text-teal-200 font-semibold cursor-pointer"
            >
              Kopieer Skakel
            </button>
            <span>of</span>
            <a
              href={activeViewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-teal-300 hover:text-teal-200 font-semibold"
            >
              Maak Oop
            </a>
          </div>
        </div>
      </section>

      {/* Built-in Key Theological Word Studies (Hebrew & Greek) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif-editorial font-semibold text-cyan-950">
              Sleutelwoorde uit die Grondteks (Hebreeus &amp; Grieks)
            </h2>
            <p className="text-xs text-slate-500">
              Verdiep jou S.O.A.P.-oordenking met hierdie fundamentele teologiese terme
            </p>
          </div>
          <span className="text-xs font-semibold text-cyan-800 bg-cyan-100/70 px-2.5 py-1 rounded-full">
            Strong's Konkordansie
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_WORD_STUDIES.map((item, idx) => (
            <article
              key={idx}
              className="p-5 bg-white border border-cyan-900/10 rounded-2xl shadow-xs hover:border-cyan-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded">
                    {item.language} · {item.strongs}
                  </span>
                  <span className="font-serif-editorial text-lg text-cyan-950 font-bold">
                    {item.original}
                  </span>
                </div>

                <h3 className="font-serif-editorial text-xl font-semibold text-cyan-950">
                  {item.term}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed font-sans-ui">
                  <strong className="text-cyan-950">Grondteksbetekenis:</strong> {item.meaning}
                </p>

                <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-100 space-y-1">
                  <span className="text-[11px] font-bold text-cyan-900 uppercase tracking-wider block">
                    Geestelike Inset:
                  </span>
                  <p className="font-serif-editorial text-sm italic text-slate-800">
                    “{item.spiritualPerspective}”
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{item.keyVerse}</span>
                {onSendToSoap && (
                  <button
                    onClick={() => onSendToSoap(item.keyVerse, `${item.verseText} [Grondteksstudie: ${item.original} - ${item.meaning}]`)}
                    className="inline-flex items-center gap-1 text-cyan-900 hover:text-cyan-700 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Dra oor na S.O.A.P.</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Helpful Guidance Card for Android & Mobile users */}
      <div className="p-5 bg-gradient-to-r from-cyan-950 to-[#0B253A] text-white rounded-2xl border border-cyan-800 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Mobiele Wenk vir Android- &amp; Rekenaargebruikers</span>
        </div>
        <p className="text-xs sm:text-sm text-cyan-100 font-sans-ui leading-relaxed">
          Selah bied nou 'n <strong>volledig geïntegreerde BibleHub-kyker</strong> reg hierbo sodat jy nooit die toepassing hoef te verlaat om die Hebreeuse en Griekse grondteks te bekyk nie. As jy die webwerf in 'n afsonderlike oortjie of app wil oopmaak, gebruik die <strong>"Nuwe Venster"</strong> of <strong>"Kopieer Skakel"</strong> knoppie hierbo.
        </p>
      </div>
    </div>
  );
};
