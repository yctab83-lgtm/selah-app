import React, { useState, useMemo } from 'react';
import { Sparkles, Heart, CheckCircle2, Calendar, BookOpen, Printer, Download, Clock, Waves } from 'lucide-react';
import { PrayerItem, JournalEntry, SoapEntry } from '../types';
import { exportAllDataAfrikaans } from '../utils/storage';

interface YearInReviewTabProps {
  prayers: PrayerItem[];
  journalEntries: JournalEntry[];
  soapEntries: SoapEntry[];
}

export const YearInReviewTab: React.FC<YearInReviewTabProps> = ({
  prayers,
  journalEntries,
  soapEntries,
}) => {
  const currentYear = new Date().getFullYear().toString(); // '2026'
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [activeReviewSection, setActiveReviewSection] = useState<'all' | 'prayers' | 'gratitude'>('all');

  // Available years from entries
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    years.add('2026');
    years.add('2025');
    prayers.forEach((p) => {
      years.add(p.prayerDate.substring(0, 4));
      if (p.answeredDate) years.add(p.answeredDate.substring(0, 4));
    });
    journalEntries.forEach((j) => years.add(j.date.substring(0, 4)));
    soapEntries.forEach((s) => years.add(s.date.substring(0, 4)));
    return Array.from(years).sort().reverse();
  }, [prayers, journalEntries, soapEntries]);

  // Answered Prayers for Selected Year
  const yearAnsweredPrayers = useMemo(() => {
    return prayers.filter((p) => {
      if (!p.isAnswered) return false;
      const ansYear = p.answeredDate ? p.answeredDate.substring(0, 4) : p.prayerDate.substring(0, 4);
      return selectedYear === 'all' || ansYear === selectedYear;
    });
  }, [prayers, selectedYear]);

  // All Prayers Prayed in Selected Year
  const yearPrayersCreated = useMemo(() => {
    return prayers.filter((p) => selectedYear === 'all' || p.prayerDate.substring(0, 4) === selectedYear);
  }, [prayers, selectedYear]);

  // Average days to answered prayer
  const averageDaysToAnswer = useMemo(() => {
    const answeredWithDates = yearAnsweredPrayers.filter((p) => p.prayerDate && p.answeredDate);
    if (answeredWithDates.length === 0) return 0;
    const totalDays = answeredWithDates.reduce((acc, p) => {
      const s = new Date(p.prayerDate).getTime();
      const e = new Date(p.answeredDate!).getTime();
      const days = Math.max(0, Math.floor((e - s) / (1000 * 60 * 60 * 24)));
      return acc + days;
    }, 0);
    return Math.round(totalDays / answeredWithDates.length);
  }, [yearAnsweredPrayers]);

  // Gratitude Items for Selected Year (flowed from Journal Tab dedicated gratitude)
  const yearJournalEntries = useMemo(() => {
    return journalEntries.filter((j) => selectedYear === 'all' || j.date.substring(0, 4) === selectedYear);
  }, [journalEntries, selectedYear]);

  const allGratitudesForYear = useMemo(() => {
    const list: { gratitude: string; date: string; title: string }[] = [];
    yearJournalEntries.forEach((j) => {
      j.gratitudes.forEach((g) => {
        if (g.trim()) {
          list.push({ gratitude: g, date: j.date, title: j.title });
        }
      });
    });
    return list;
  }, [yearJournalEntries]);

  // Gratitude by Month breakdown
  const gratitudesByMonth = useMemo(() => {
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 0, 'Mrt': 0, 'Apr': 0, 'Mei': 0, 'Jun': 0,
      'Jul': 0, 'Aug': 0, 'Sep': 0, 'Okt': 0, 'Nov': 0, 'Des': 0,
    };
    const monthNames = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    allGratitudesForYear.forEach((item) => {
      const mIdx = new Date(item.date + 'T12:00:00Z').getMonth();
      const mName = monthNames[mIdx];
      if (months[mName] !== undefined) months[mName]++;
    });
    return months;
  }, [allGratitudesForYear]);

  // SOAP entries count for the year
  const yearSoapEntries = useMemo(() => {
    return soapEntries.filter((s) => selectedYear === 'all' || s.date.substring(0, 4) === selectedYear);
  }, [soapEntries, selectedYear]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header and Year Switcher */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-cyan-900/10 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-900">
            <span>Geestelike Oorsig</span>
            <span aria-hidden="true">·</span>
            <span>Ebenhaeser: Tot Hiertoe het die Here Gehelp</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial font-medium text-cyan-950 mt-1">
            Jaaroorsig: {selectedYear === 'all' ? 'Alle Tye' : selectedYear}
          </h1>
          <p className="text-sm text-slate-600 font-sans-ui mt-1 max-w-2xl">
            Kyk terug na God se troue verhorings in jou Gebedskamer en die seëninge wat jy daagliks in jou Dankbaarheidsjoernaal vasgelê het.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Year Selector */}
          <div className="flex items-center gap-1 p-1 bg-cyan-950/5 rounded-xl border border-cyan-900/10">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedYear === yr
                    ? 'bg-white text-cyan-950 shadow-xs'
                    : 'text-slate-600 hover:text-cyan-950'
                }`}
              >
                {yr}
              </button>
            ))}
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedYear === 'all'
                  ? 'bg-white text-cyan-950 shadow-xs'
                  : 'text-slate-600 hover:text-cyan-950'
              }`}
            >
              Alle Tye
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Druk of stoor as PDF"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-cyan-950 bg-white border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Druk Oorsig</span>
          </button>

          <button
            onClick={exportAllDataAfrikaans}
            title="Laai alle data as rugsteun af (JSON)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-cyan-950 bg-white border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Rugsteun</span>
          </button>
        </div>
      </div>

      {/* High-Level Milestone Scoreboard in Ocean Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Answered Prayers Count */}
        <div className="p-5 bg-white border border-cyan-900/10 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Beantwoorde Gebede</span>
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-3xl font-serif-editorial font-bold text-teal-900">
            {yearAnsweredPrayers.length}
          </div>
          <div className="text-xs text-teal-800 font-medium">
            van {yearPrayersCreated.length} aangetekende versoeke
          </div>
        </div>

        {/* Gratitude Blessings Count */}
        <div className="p-5 bg-white border border-cyan-900/10 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Dankbaarhede Aangeteken</span>
            <Heart className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-3xl font-serif-editorial font-bold text-cyan-950">
            {allGratitudesForYear.length}
          </div>
          <div className="text-xs text-slate-500">
            oor {yearJournalEntries.length} joernaal-oordenkings
          </div>
        </div>

        {/* Avg Days to Answered Prayer */}
        <div className="p-5 bg-white border border-cyan-900/10 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Gem. Tyd in Gebed</span>
            <Clock className="w-4 h-4 text-cyan-800" />
          </div>
          <div className="text-3xl font-serif-editorial font-bold text-cyan-950">
            {averageDaysToAnswer} <span className="text-base font-normal text-slate-500">dae</span>
          </div>
          <div className="text-xs text-slate-500">
            van gebedsdatum tot verhoring
          </div>
        </div>

        {/* Daily S.O.A.P. Meditations */}
        <div className="p-5 bg-white border border-cyan-900/10 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>S.O.A.P.-Studies</span>
            <BookOpen className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-serif-editorial font-bold text-slate-900">
            {yearSoapEntries.length}
          </div>
          <div className="text-xs text-slate-500">
            1983-Bybelgedeeltes deurdink
          </div>
        </div>
      </div>

      {/* Sub-filter tabs */}
      <div className="flex items-center gap-2 border-b border-cyan-900/10 pb-3 no-print">
        <button
          onClick={() => setActiveReviewSection('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeReviewSection === 'all'
              ? 'bg-[#0B253A] text-white'
              : 'text-slate-600 hover:text-cyan-950 hover:bg-cyan-50'
          }`}
        >
          Volledige Jaaroorsig
        </button>
        <button
          onClick={() => setActiveReviewSection('prayers')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeReviewSection === 'prayers'
              ? 'bg-[#0B253A] text-white'
              : 'text-slate-600 hover:text-cyan-950 hover:bg-cyan-50'
          }`}
        >
          Muur van Beantwoorde Gebede ({yearAnsweredPrayers.length})
        </button>
        <button
          onClick={() => setActiveReviewSection('gratitude')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeReviewSection === 'gratitude'
              ? 'bg-[#0B253A] text-white'
              : 'text-slate-600 hover:text-cyan-950 hover:bg-cyan-50'
          }`}
        >
          Dankbaarheidsoorsig ({allGratitudesForYear.length})
        </button>
      </div>

      {/* PILLAR 1: ANSWERED PRAYERS RETROSPECTIVE (Explicit Requirement) */}
      {(activeReviewSection === 'all' || activeReviewSection === 'prayers') && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Die Altaar van Getuienisse</span>
              </div>
              <h2 className="text-2xl font-serif-editorial font-semibold text-cyan-950 mt-0.5">
                Beantwoorde Gebede van {selectedYear === 'all' ? 'Alle Tye' : selectedYear}
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {yearAnsweredPrayers.length} Getuienisse van God se Getrouheid
            </span>
          </div>

          {yearAnsweredPrayers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-cyan-900/10">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-serif-editorial text-lg text-slate-800">Geen beantwoorde gebede aangeteken vir {selectedYear} nie</p>
              <p className="text-xs text-slate-500 mt-1">
                Merk gebede in jou Gebedskamer as "Beantwoord" om jou jaarlikse getuienismuur te bou.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yearAnsweredPrayers.map((prayer) => {
                const sDate = new Date(prayer.prayerDate).getTime();
                const aDate = prayer.answeredDate ? new Date(prayer.answeredDate).getTime() : sDate;
                const durationDays = Math.max(0, Math.floor((aDate - sDate) / (1000 * 60 * 60 * 24)));

                return (
                  <article
                    key={prayer.id}
                    className="p-5 bg-white border border-teal-200/90 rounded-2xl shadow-xs space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded">
                        {prayer.category}
                      </span>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Gebid {prayer.prayerDate}</span>
                        <span aria-hidden="true">→</span>
                        <span className="text-teal-800 font-bold">Beantwoord {prayer.answeredDate}</span>
                      </div>
                    </div>

                    <h3 className="font-serif-editorial text-xl font-semibold text-cyan-950">
                      {prayer.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      <strong className="text-slate-800">Oorspronklike Versoek:</strong> {prayer.request}
                    </p>

                    {/* Scripture anchor */}
                    {prayer.scriptureRef && (
                      <div className="p-2.5 bg-cyan-50/50 border border-cyan-200/60 rounded text-xs text-slate-800">
                        <span className="font-semibold text-cyan-950">{prayer.scriptureRef}: </span>
                        <span className="font-serif-editorial italic">
                          {prayer.scriptureText || 'Bybelbelofte in geloof opgeëis'}
                        </span>
                      </div>
                    )}

                    {/* Answered Testimony */}
                    {prayer.answeredNotes && (
                      <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-teal-700" />
                          <span>Hoe God Geantwoord Het ({durationDays === 0 ? 'Dieselfde Dag' : `${durationDays} Dae Later`}):</span>
                        </span>
                        <p className="font-serif-editorial text-sm italic text-slate-900 leading-relaxed">
                          “{prayer.answeredNotes}”
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* PILLAR 2: GRATITUDE RETROSPECTIVE (Explicit Requirement: "gratitude, which should be included in the year in review option") */}
      {(activeReviewSection === 'all' || activeReviewSection === 'gratitude') && (
        <section className="space-y-4 pt-4 border-t border-cyan-900/10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-900">
                <Heart className="w-3.5 h-3.5 text-cyan-700" />
                <span>Oes van Dankbaarheid</span>
              </div>
              <h2 className="text-2xl font-serif-editorial font-semibold text-cyan-950 mt-0.5">
                Dankbaarheidsoorsig: {selectedYear === 'all' ? 'Alle Tye' : selectedYear}
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {allGratitudesForYear.length} Daaglikse Seëninge Bewaar
            </span>
          </div>

          {/* Month-by-month cadence strip */}
          <div className="p-4 bg-white border border-cyan-900/10 rounded-2xl shadow-xs space-y-2">
            <span className="text-xs font-medium text-slate-600 block">Maandelikse Dankbaarheidsritme ({selectedYear})</span>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center text-xs">
              {Object.entries(gratitudesByMonth).map(([month, count]) => (
                <div key={month} className="p-2 rounded-xl bg-cyan-50/40 border border-cyan-100">
                  <div className="text-[11px] text-slate-500">{month}</div>
                  <div className={`font-serif-editorial text-base font-bold ${count > 0 ? 'text-cyan-900' : 'text-slate-300'}`}>
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gratitude Cards Mosaic */}
          {allGratitudesForYear.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-cyan-900/10">
              <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-serif-editorial text-lg text-slate-800">Geen dankbaarheidsinskrywings vir {selectedYear} nie</p>
              <p className="text-xs text-slate-500 mt-1">
                Gebruik die toegewyde Dankbaarheidsruimte in jou Joernaal om daaglikse seëninge vas te lê.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allGratitudesForYear.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-cyan-50/30 border border-cyan-200/60 rounded-xl shadow-xs flex flex-col justify-between space-y-2 hover:border-cyan-300 transition-colors"
                >
                  <p className="font-serif-editorial text-base text-slate-900 leading-snug">
                    “{item.gratitude}”
                  </p>

                  <div className="pt-2 border-t border-cyan-200/40 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[150px]">{item.title}</span>
                    <span className="font-semibold text-cyan-900">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Encouragement Footer */}
      <div className="p-6 bg-[#0B253A] text-cyan-100 rounded-2xl border border-cyan-900 space-y-2 text-center max-w-2xl mx-auto shadow-md">
        <Sparkles className="w-5 h-5 text-cyan-300 mx-auto" />
        <h3 className="text-lg font-serif-editorial font-medium text-white">
          “Loof die Here, o my siel, en vergeet geeneen van sy weldade nie” (Psalm 103:2)
        </h3>
        <p className="text-xs sm:text-sm text-cyan-200 font-sans-ui max-w-xl mx-auto leading-relaxed">
          Hierdie jaaroorsig is jou geestelike anker. Wanneer môre se slagveld van die denke hewig woed, kyk terug na hierdie tekens van God se trou en weet: Hy wat begin het, sal dit volbring!
        </p>
      </div>
    </div>
  );
};
