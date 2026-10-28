import React, { useState } from 'react';
import { ALL_EVENTS } from '../data/protocolData';
import { PhaseEvent } from '../types/protocol';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock, MapPin, X, Sparkles, ShieldAlert, FileText, Baby } from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

interface InteractiveMainCalendarProps {
  onSelectEvent?: (event: PhaseEvent) => void;
}

export const InteractiveMainCalendar: React.FC<InteractiveMainCalendarProps> = ({ onSelectEvent }) => {
  // Current view: October 2026 (or toggle to Nov 2026, Dec 2026)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ dayNum: number; dateStr: string; events: PhaseEvent[] } | null>({
    dayNum: 28,
    dateStr: "28 Octobre 2026",
    events: ALL_EVENTS.filter(e => e.id === 'p2-9')
  });

  const months = [
    { name: "Octobre 2026", year: 2026, month: 9, daysInMonth: 31, startDayOfWeek: 4 },
    { name: "Novembre 2026", year: 2026, month: 10, daysInMonth: 30, startDayOfWeek: 7 },
    { name: "Décembre 2026", year: 2026, month: 11, daysInMonth: 31, startDayOfWeek: 2 }
  ];

  const currentMonth = months[currentMonthIndex];

  // Map known dates to events
  const getEventsForDay = (dayNum: number, monthIndex: number): PhaseEvent[] => {
    if (monthIndex === 0) { // October
      if (dayNum === 1) return ALL_EVENTS.filter(e => e.id === 'p1-8'); // Ponction 42 ovocytes
      if (dayNum === 2) return ALL_EVENTS.filter(e => e.id === 'p2-1'); // ICSI
      if (dayNum === 6 || dayNum === 7 || dayNum === 8) return ALL_EVENTS.filter(e => e.id === 'p2-2'); // Culture
      if (dayNum === 9) return ALL_EVENTS.filter(e => e.id === 'p2-3'); // Vitrification 8 blastocystes
      if (dayNum === 11) return ALL_EVENTS.filter(e => e.id === 'p2-4'); // Écho de base
      if (dayNum === 13) return ALL_EVENTS.filter(e => e.id === 'p2-5'); // Plan décongélation (Garçon)
      if (dayNum === 15) return ALL_EVENTS.filter(e => e.id === 'p2-6'); // SIS 08h00
      if (dayNum === 25) return ALL_EVENTS.filter(e => e.id === 'p2-8'); // PGT-A 5 normaux (2G, 3F)
      if (dayNum === 28) return ALL_EVENTS.filter(e => e.id === 'p2-9'); // Hystéroscopie 06h15
    } else if (monthIndex === 1) { // November
      if (dayNum === 4) return ALL_EVENTS.filter(e => e.id === 'p2-10'); // FET Cible estimé
      if (dayNum >= 8 && dayNum <= 12) return ALL_EVENTS.filter(e => e.id === 'p3-1'); // Bêta-hCG
      if (dayNum === 25) return ALL_EVENTS.filter(e => e.id === 'p3-2'); // Écho cœur
    } else if (monthIndex === 2) { // December
      if (dayNum === 15) return ALL_EVENTS.filter(e => e.id === 'p3-3'); // Graduation
    }
    return [];
  };

  const handleDayClick = (dayNum: number) => {
    const events = getEventsForDay(dayNum, currentMonthIndex);
    const dateStr = `${dayNum} ${currentMonth.name}`;
    setSelectedDayEvents({ dayNum, dateStr, events });
    if (onSelectEvent && events.length > 0) {
      onSelectEvent(events[0]);
    }
  };

  return (
    <section id="calendrier" className="py-10 bg-[#FAF7F2] border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <MilestoneBadge type="immediate" size="sm" />
              <span className="text-[11px] font-sans font-medium text-[#745233]">
                · Vue calendrier responsive synchronisée
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display">
              Calendrier mensuel interactif du protocole
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Consultez les dates clés, les créneaux opératoires et les jalons cliniques. Touchez un jour pour ouvrir ses consignes sans quitter le calendrier.
            </p>
          </div>

          {/* Month switcher */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E8DDD0] shadow-2xs self-start md:self-auto">
            <button
              type="button"
              disabled={currentMonthIndex === 0}
              onClick={() => setCurrentMonthIndex(prev => prev - 1)}
              className="p-1.5 text-[#5C4434] hover:text-[#3E2C1C] disabled:opacity-30 rounded-lg hover:bg-[#FAF7F2]"
              title="Mois précédent"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-[#3E2C1C] px-2.5 min-w-28 text-center font-display">
              {currentMonth.name}
            </span>

            <button
              type="button"
              disabled={currentMonthIndex === months.length - 1}
              onClick={() => setCurrentMonthIndex(prev => prev + 1)}
              className="p-1.5 text-[#5C4434] hover:text-[#3E2C1C] disabled:opacity-30 rounded-lg hover:bg-[#FAF7F2]"
              title="Mois suivant"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout: Main Calendar Grid + Sticky Inline Details Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Calendar Grid Container (7 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8DDD0] p-2.5 sm:p-5 shadow-xs">
            {/* Day of Week Headers with responsive sizing */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-bold text-[#745233] pb-2.5 border-b border-[#E8DDD0] font-sans">
              <div>LUN</div>
              <div>MAR</div>
              <div>MER</div>
              <div>JEU</div>
              <div>VEN</div>
              <div>SAM</div>
              <div>DIM</div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 pt-2 sm:pt-3">
              {/* Blank leading days */}
              {Array.from({ length: currentMonth.startDayOfWeek - 1 }).map((_, idx) => (
                <div key={`blank-${idx}`} className="h-12 sm:h-18 md:h-20 bg-[#FAF7F2]/60 rounded-lg sm:rounded-xl" />
              ))}

              {/* Days of current month */}
              {Array.from({ length: currentMonth.daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayEvents = getEventsForDay(dayNum, currentMonthIndex);
                const hasEvents = dayEvents.length > 0;
                const isToday = currentMonthIndex === 0 && dayNum === 27;
                const isCriticalTomorrow = currentMonthIndex === 0 && dayNum === 28;
                const isSelected = selectedDayEvents?.dayNum === dayNum;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => handleDayClick(dayNum)}
                    className={`min-h-[48px] sm:min-h-[70px] md:min-h-[80px] p-1 sm:p-1.5 rounded-lg sm:rounded-xl border text-left transition-all flex flex-col justify-between group relative overflow-hidden ${
                      isCriticalTomorrow
                        ? 'bg-[#C5A077] text-[#24150A] border-2 border-[#8A5F33] shadow-md ring-1 ring-[#8A5F33]/40'
                        : isSelected
                        ? 'bg-[#FAF7F2] border-2 border-[#8C6D46] shadow-xs ring-1 ring-[#8C6D46]/30'
                        : isToday
                        ? 'bg-[#FDFBF7] border-2 border-[#8C6D46]'
                        : hasEvents
                        ? 'bg-white border-[#E8DDD0] hover:border-[#8C6D46] hover:bg-[#FAF7F2]/40 shadow-2xs cursor-pointer'
                        : 'bg-white/80 border-[#F0E8DE] hover:bg-[#FAF7F2]/30 text-zinc-400'
                    }`}
                  >
                    {/* Day number & Tag */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`calendar-day-num font-bold tabular-nums leading-none ${
                        isCriticalTomorrow
                          ? 'text-[#24150A] font-black'
                          : isSelected
                          ? 'text-[#8C6D46] font-black'
                          : isToday
                          ? 'text-[#3E2C1C] font-black'
                          : hasEvents
                          ? 'text-[#3E2C1C] font-bold'
                          : 'text-zinc-400'
                      }`}>
                        {dayNum}
                      </span>

                      {isCriticalTomorrow && (
                        <span className="text-[7px] sm:text-[9px] font-black uppercase px-1 py-0.2 bg-[#FAF5EE] text-[#4A2D16] rounded border border-[#8A5F33]">
                          06h15
                        </span>
                      )}
                      {isToday && !isCriticalTomorrow && (
                        <span className="hidden sm:inline-block text-[8px] font-bold uppercase px-1 py-0.2 bg-[#F5EFEB] text-[#8C6D46] rounded">
                          Auj.
                        </span>
                      )}
                    </div>

                    {/* Responsive Event summary badge (scales cleanly on mobile) */}
                    {hasEvents && (
                      <div className="space-y-0.5 w-full mt-0.5">
                        {dayEvents.slice(0, 1).map((ev) => (
                          <div
                            key={ev.id}
                            className={`calendar-cell-title font-semibold px-0.5 sm:px-1 py-0.5 rounded truncate ${
                              isCriticalTomorrow
                                ? 'bg-[#5C4434] text-white font-bold border border-[#C19A6B]/50'
                                : ev.id === 'p2-8'
                                ? 'bg-[#F5EFEB] text-[#5C4434] border border-[#D5C3B0]'
                                : 'bg-[#FAF7F2] text-[#3E2C1C] border border-[#E8DDD0]'
                            }`}
                          >
                            <span className="hidden sm:inline">
                              {ev.id === 'p2-9' ? 'Hystéroscopie' : ev.title}
                            </span>
                            <span className="sm:hidden">
                              {ev.id === 'p2-9' ? '06h15' : ev.id === 'p2-8' ? 'PGT-A' : 'Actif'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!hasEvents && (
                      <div className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#E8DDD0] self-center mb-0.5 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend Bar */}
            <div className="mt-4 pt-3 border-t border-[#E8DDD0] flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-zinc-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E2C1C] border border-[#D4AF37]" />
                  <span>Chemin critique (28 oct.)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D46]" />
                  <span>Jalon clinique</span>
                </span>
              </div>
              <span className="text-[#8C6D46] font-medium hidden sm:inline">
                Sélectionnez une date pour afficher ses détails ci-contre
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* INLINE STICKY DETAILS CONTAINER (Requested: No footer scroll jump!)      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E8DDD0] p-4 sm:p-5 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDD0]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#8C6D46]" />
                <span className="text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
                  Détails du jour
                </span>
              </div>
              <span className="text-xs font-bold text-[#3E2C1C] bg-[#FAF7F2] px-2.5 py-0.5 rounded-lg border border-[#E8DDD0]">
                {selectedDayEvents?.dateStr || "Sélectionnez un jour"}
              </span>
            </div>

            <div className="mt-4">
              {selectedDayEvents && selectedDayEvents.events.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayEvents.events.map((ev) => {
                    const isHystero = ev.id === 'p2-9';
                    const isPgta = ev.id === 'p2-8';

                    return (
                      <div
                        key={ev.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isHystero
                            ? 'bg-[#FAF7F2] border-[#8C6D46] ring-1 ring-[#8C6D46]/40 shadow-xs'
                            : 'bg-white border-[#E8DDD0]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          {isHystero ? (
                            <MilestoneBadge type="critical" size="sm" />
                          ) : isPgta ? (
                            <MilestoneBadge type="pgta" size="sm" />
                          ) : (
                            <span className="text-[10px] font-bold uppercase text-[#8C6D46] bg-[#FAF7F2] px-2 py-0.5 rounded">
                              Phase {ev.phaseId}
                            </span>
                          )}

                          <span className="text-[10px] font-semibold text-zinc-500">
                            {ev.date}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#3E2C1C] font-display">
                          {ev.title}
                        </h4>

                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                          {ev.description}
                        </p>

                        {ev.location && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#5C4434] bg-white p-2 rounded-lg border border-[#E8DDD0]">
                            <MapPin className="w-3.5 h-3.5 text-[#8C6D46] shrink-0" />
                            <span className="font-semibold">{ev.location}</span>
                          </div>
                        )}

                        {ev.details && (
                          <div className="mt-2 p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DDD0] text-[11px] text-[#3E2C1C] leading-relaxed">
                            <strong className="block text-[#8C6D46] font-bold mb-0.5">Instructions :</strong>
                            {ev.details}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8DDD0] p-4">
                  <CalendarIcon className="w-8 h-8 text-[#C19A6B] mx-auto mb-2 opacity-70" />
                  <p className="text-xs font-bold text-[#3E2C1C]">
                    Aucune intervention lourde ce jour-là
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
                    Maintien des prises quotidiennes de Nortrel ou du protocole d'estrogènes prescrit.
                  </p>
                </div>
              )}
            </div>

            {/* Quick reminder box */}
            <div className="mt-4 p-3 bg-[#F5EFEB] rounded-xl border border-[#D8C8B8] text-xs text-[#3E2C1C]">
              <span className="font-bold flex items-center gap-1 text-[#8C6D46] mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Note clinique :
              </span>
              <p className="text-[11px] text-[#5C4434] leading-relaxed">
                Toutes les pièces jointes, comptes-rendus opératoires et clichés sont synchronisés dans l'onglet <strong>Clichés & Documents</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
