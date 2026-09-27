import React, { useState } from 'react';
import { BookOpen, CheckCircle, Circle, ArrowRight, Sparkles, Check, ChevronRight, Compass } from 'lucide-react';
import { ReadingPlan, ReadingProgress, Scripture } from '../types';
import { READING_PLANS } from '../data/initialData';

interface ReadingPlansTabProps {
  progressMap: Record<string, ReadingProgress>;
  onToggleDayCompleted: (planId: string, dayNum: number) => void;
  onSendToSoap: (passageRef: string, passageText: string) => void;
  onOpenScriptureSearch: () => void;
}

export const ReadingPlansTab: React.FC<ReadingPlansTabProps> = ({
  progressMap,
  onToggleDayCompleted,
  onSendToSoap,
  onOpenScriptureSearch,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(READING_PLANS[0].id);
  const [activeDayNum, setActiveDayNum] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');

  const selectedPlan = READING_PLANS.find((p) => p.id === selectedPlanId) || READING_PLANS[0];
  const activeDay = selectedPlan.days.find((d) => d.day === activeDayNum) || selectedPlan.days[0];

  const planProgress = progressMap[selectedPlan.id] || {
    planId: selectedPlan.id,
    completedDays: [],
    startedAt: new Date().toISOString(),
    lastReadAt: new Date().toISOString(),
  };

  const isCurrentDayCompleted = planProgress.completedDays.includes(activeDay.day);
  const completionPercent = Math.round((planProgress.completedDays.length / selectedPlan.days.length) * 100);

  const categories = ['Alle', 'Slagveld van die Denke', 'Begin Jou Dag Reg'];
  const filteredPlans = READING_PLANS.filter((p) => selectedCategory === 'Alle' || p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header Introduction */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-cyan-900/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-900">
            <span>Gestruktureerde Oordenkings</span>
            <span aria-hidden="true">·</span>
            <span>Praktiese Oordenkings &amp; 1983-Bybel</span>
          </div>
          <h1 className="text-3xl font-serif-editorial font-medium text-cyan-950 mt-1">
            Daaglikse Leesplanne vir Jou Gees
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-sans-ui">
            Geestelike groeipaaie gefokus op die vernuwing van jou denke, vrede bo angs, en daaglikse oorwinning. Kies \'n plan hieronder om te lees en direk na S.O.A.P. oor te dra.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-cyan-950/5 rounded-xl border border-cyan-900/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-cyan-950 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-cyan-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlans.map((plan) => {
          const prog = progressMap[plan.id]?.completedDays?.length || 0;
          const isSelected = plan.id === selectedPlanId;
          const pct = Math.round((prog / plan.days.length) * 100);

          return (
            <div
              key={plan.id}
              onClick={() => {
                setSelectedPlanId(plan.id);
                setActiveDayNum(1);
              }}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-cyan-700 shadow-md ring-2 ring-cyan-700/20'
                  : 'bg-white/80 border-cyan-900/10 hover:border-cyan-400 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                  {plan.category}
                </span>
                <span>{plan.days.length} Dae</span>
              </div>

              <h3 className="font-serif-editorial font-semibold text-xl text-cyan-950 leading-snug mb-1">
                {plan.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed font-sans-ui">
                {plan.subtitle}
              </p>
              <p className="text-[11px] text-cyan-700 font-medium mb-4">
                ★ {plan.authorNote}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Vordering</span>
                  <span className="font-semibold text-cyan-950">{prog} van {plan.days.length} dae ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-cyan-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-teal-500 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Plan Detail & Day Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Days Outline Rail (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-cyan-900/10 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-900/10">
            <div>
              <h2 className="font-serif-editorial text-base font-semibold text-cyan-950">
                Plan-rooster
              </h2>
              <span className="text-xs text-slate-500">{completionPercent}% voltooi</span>
            </div>
            <span className="text-xs font-bold text-cyan-950 bg-cyan-100 px-2.5 py-0.5 rounded-md">
              {planProgress.completedDays.length}/{selectedPlan.days.length} Dae
            </span>
          </div>

          <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
            {selectedPlan.days.map((day) => {
              const isSelected = day.day === activeDayNum;
              const isCompleted = planProgress.completedDays.includes(day.day);

              return (
                <div
                  key={day.day}
                  onClick={() => setActiveDayNum(day.day)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#0B253A] text-white shadow-xs'
                      : 'hover:bg-cyan-50/60 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleDayCompleted(selectedPlan.id, day.day);
                      }}
                      className="shrink-0 focus:outline-none"
                    >
                      {isCompleted ? (
                        <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-teal-600'}`} />
                      ) : (
                        <Circle className={`w-4 h-4 ${isSelected ? 'text-cyan-600' : 'text-slate-300'}`} />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">
                        Dag {day.day}: {day.passageRef}
                      </div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-cyan-200' : 'text-slate-500'}`}>
                        {day.title}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Daily Passage & Devotional View (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-cyan-900/10 rounded-2xl shadow-xs overflow-hidden">
          {/* Reader Top Bar */}
          <div className="p-6 border-b border-cyan-900/10 bg-gradient-to-r from-cyan-50/60 to-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-900">
                <span>Dag {activeDay.day} van {selectedPlan.days.length}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600">{activeDay.passageRef}</span>
              </div>
              <h2 className="text-2xl font-serif-editorial font-semibold text-cyan-950 mt-1">
                {activeDay.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleDayCompleted(selectedPlan.id, activeDay.day)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isCurrentDayCompleted
                    ? 'bg-teal-100 text-teal-900 hover:bg-teal-200'
                    : 'bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
                }`}
              >
                {isCurrentDayCompleted ? <Check className="w-4 h-4 text-teal-700" /> : <Circle className="w-4 h-4" />}
                <span>{isCurrentDayCompleted ? 'Gelees ✓' : 'Merk as Gelees'}</span>
              </button>

              <button
                onClick={() => onSendToSoap(activeDay.passageRef, activeDay.passageText)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#0B253A] hover:bg-[#0E3452] text-white rounded-lg transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Begin S.O.A.P. met hierdie Vers</span>
              </button>
            </div>
          </div>

          {/* Reader Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Scripture Passage Block (1983-vertaling) */}
            <div className="p-6 bg-cyan-50/50 border border-cyan-200/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="font-serif-editorial font-bold text-base text-cyan-950">{activeDay.passageRef}</span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-cyan-200 font-semibold text-cyan-900">
                  1983-vertaling
                </span>
              </div>
              <p className="font-serif-editorial text-lg text-slate-900 leading-relaxed italic first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-cyan-900">
                {activeDay.passageText}
              </p>
            </div>

            {/* Devotional Commentary */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-cyan-900 font-sans-ui">
                <Compass className="w-3.5 h-3.5 text-cyan-700" />
                <span>Oordenking &amp; Praktiese Lering (Geestelike Inset)</span>
              </div>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans-ui">
                {activeDay.devotionalNote}
              </p>
            </div>

            {/* Heart Reflection Question */}
            <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">Hartsbemoediging</span>
              <p className="text-slate-800 font-serif-editorial text-base italic">
                “{activeDay.reflectionQuestion}”
              </p>
            </div>

            {/* Positive Faith Declaration */}
            {activeDay.declaration && (
              <div className="p-4 bg-gradient-to-r from-cyan-900 to-[#0B253A] text-white rounded-xl space-y-1 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Geloofsbelydenis vir Vandag (Sê dit hardop):</span>
                <p className="text-sm font-sans-ui text-cyan-100 font-medium">
                  “{activeDay.declaration}”
                </p>
              </div>
            )}
          </div>

          {/* Next / Previous Day Footer */}
          <div className="p-4 bg-cyan-50/30 border-t border-cyan-900/10 flex items-center justify-between">
            <button
              disabled={activeDayNum <= 1}
              onClick={() => setActiveDayNum((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-950 hover:text-cyan-800 disabled:opacity-30"
            >
              ← Vorige Dag
            </button>

            <span className="text-xs text-slate-400">
              Dag {activeDayNum} van {selectedPlan.days.length}
            </span>

            <button
              disabled={activeDayNum >= selectedPlan.days.length}
              onClick={() => setActiveDayNum((prev) => Math.min(selectedPlan.days.length, prev + 1))}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-950 hover:text-cyan-800 disabled:opacity-30"
            >
              Volgende Dag →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
