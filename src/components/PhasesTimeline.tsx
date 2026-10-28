import React, { useState, useEffect } from 'react';
import { PhaseEvent, PhaseInfo } from '../types/protocol';
import { 
  Calendar, CheckCircle2, Clock, MapPin, Search, ChevronRight, 
  MessageSquare, Save, Sparkles, Filter, ChevronDown, ChevronUp, 
  ArrowUpRight, Baby, HeartPulse, Heart, ShieldAlert, Gift, 
  Check, ArrowDown, Activity, RefreshCw
} from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

interface PhasesTimelineProps {
  events: PhaseEvent[];
  phasesInfo: PhaseInfo[];
  onUpdateEventNote?: (eventId: string, note: string) => void;
}

export const PhasesTimeline: React.FC<PhasesTimelineProps> = ({
  events,
  phasesInfo,
  onUpdateEventNote
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>('p2-9');
  const [activeNoteEventId, setActiveNoteEventId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [isPastSectionOpen, setIsPastSectionOpen] = useState(true);
  
  // Real-time ticking clock for countdowns
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({
    'p2-5': "Formulaire de décongélation rempli et validé : Priorité garçon (Male).",
    'p2-8': "Excellente nouvelle le 25 oct. : 5 embryons normaux euploïdes sur les 8 biopsiés !",
    'p2-9': "Hystéroscopie programmée le mercredi 28 oct. à 06h15 au centre chirurgical ambulatoire. Être à jeun dès minuit."
  });

  // Map event IDs to exact target date/times for real-time countdown
  const getEventTargetDate = (ev: PhaseEvent): string => {
    switch (ev.id) {
      case 'p2-9': return '2026-10-28T06:15:00';
      case 'p2-7': return '2026-10-27T22:00:00';
      case 'p2-10': return '2026-11-04T10:00:00';
      case 'p3-1': return '2026-11-14T08:00:00';
      case 'p3-2': return '2026-11-27T09:00:00';
      case 'p3-3': return '2026-12-15T14:00:00';
      case 'p4-1': return '2026-12-28T10:00:00';
      case 'p4-2': return '2027-01-08T10:30:00';
      case 'p4-3': return '2027-01-20T11:00:00';
      case 'p4-4': return '2027-02-15T10:00:00';
      case 'p4-5': return '2027-03-19T14:00:00';
      case 'p4-6': return '2027-04-15T09:00:00';
      case 'p4-7': return '2027-05-20T14:00:00';
      case 'p4-8': return '2027-06-25T11:00:00';
      case 'p4-9': return '2027-07-23T08:00:00';
      default: return '';
    }
  };

  // Helper to calculate exact countdown
  const getCountdown = (targetDateStr: string) => {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr).getTime();
    const diff = target - currentTime;

    if (diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, formatted: "En cours / Aujourd'hui" };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let formatted = '';
    if (days > 0) {
      formatted = `Dans ${days}j ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      formatted = `Dans ${hours}h ${minutes}m ${seconds}s`;
    } else {
      formatted = `Dans ${minutes}m ${seconds}s`;
    }

    return { total: diff, days, hours, minutes, seconds, isPast: false, formatted };
  };

  // Immediate next critical step countdown
  const immediateTarget = '2026-10-28T06:15:00';
  const immediateCountdown = getCountdown(immediateTarget);

  // Key upcoming milestones for the countdown ticker row
  const upcomingMilestonesCountdown = [
    { label: "Transfert FET (Garçon)", dateStr: "2026-11-04T10:00:00", displayDate: "04 nov. 10:00", icon: <Baby className="w-3.5 h-3.5 text-[#8C6D46]" /> },
    { label: "1ère Prise de sang Bêta-hCG", dateStr: "2026-11-14T08:00:00", displayDate: "14 nov. 08:00", icon: <HeartPulse className="w-3.5 h-3.5 text-[#8C6D46]" /> },
    { label: "Écho cardiaque (~6 SA)", dateStr: "2026-11-27T09:00:00", displayDate: "27 nov. 09:00", icon: <Heart className="w-3.5 h-3.5 text-[#8C6D46]" /> },
    { label: "Accouchement (Terme)", dateStr: "2027-07-23T08:00:00", displayDate: "23 juil. 2027", icon: <Gift className="w-3.5 h-3.5 text-[#8C6D46]" /> },
  ];

  // Separate and dynamically sort:
  // UPCOMING (top): active or upcoming steps, ordered from nearest future to furthest
  // PAST (bottom): completed steps, ordered from most recent completed down to initial
  const allFiltered = events.filter((ev) => {
    if (selectedPhase !== 'all' && ev.phaseId !== selectedPhase) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchDesc = ev.description.toLowerCase().includes(q);
      const matchDate = ev.date.toLowerCase().includes(q);
      const matchLoc = ev.location ? ev.location.toLowerCase().includes(q) : false;
      return matchTitle || matchDesc || matchDate || matchLoc;
    }
    return true;
  });

  // Upcoming steps (sorted chronologically into the future)
  const upcomingEvents = allFiltered
    .filter(ev => ev.status === 'active' || ev.status === 'upcoming')
    .sort((a, b) => {
      // Prioritize the critical immediate step p2-9
      if (a.id === 'p2-9') return -1;
      if (b.id === 'p2-9') return 1;
      const targetA = getEventTargetDate(a);
      const targetB = getEventTargetDate(b);
      if (targetA && targetB) {
        return new Date(targetA).getTime() - new Date(targetB).getTime();
      }
      return 0;
    });

  // Past / completed steps (sorted reverse-chronologically so latest accomplishments come first in archive)
  const completedEvents = allFiltered
    .filter(ev => ev.status === 'completed')
    .reverse();

  // Progress metrics
  const totalEventsCount = events.length;
  const completedCount = events.filter(e => e.status === 'completed').length;
  const upcomingCount = totalEventsCount - completedCount;
  const progressPercent = Math.round((completedCount / totalEventsCount) * 100);

  const handleOpenNote = (ev: PhaseEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveNoteEventId(ev.id);
    setNoteDraft(savedNotes[ev.id] || '');
  };

  const handleSaveNote = (eventId: string) => {
    setSavedNotes((prev) => ({
      ...prev,
      [eventId]: noteDraft
    }));
    if (onUpdateEventNote) {
      onUpdateEventNote(eventId, noteDraft);
    }
    setActiveNoteEventId(null);
  };

  return (
    <section id="phases" className="py-10 bg-[#FAF7F2] border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* TOP OF PAGE: HERO COUNTDOWN & INVERTED JOURNEY HEADER                     */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Disposition Inversée du Parcours</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span className="text-[#3E2C1C] font-semibold">Prochaines Étapes en Tête</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Chronologie Inversée : Du Présent vers l'Accouchement
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Toutes les étapes futures et comptes à rebours sont désormais positionnés au sommet pour un suivi immédiat. Vos jalons passés et validés sont regroupés en bas de page.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E8DDD0] text-xs font-medium shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'timeline' ? 'bg-[#8C6D46] text-white font-bold' : 'text-zinc-600 hover:text-[#3E2C1C]'
                }`}
              >
                Vue Inversée
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-[#8C6D46] text-white font-bold' : 'text-zinc-600 hover:text-[#3E2C1C]'
                }`}
              >
                Tableau Clinique
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REAL-TIME COUNTDOWN AT VERY TOP OF TIMELINE                               */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#BA936A] via-[#C5A077] to-[#8C6D46] rounded-2xl p-4 sm:p-6 text-white shadow-md mb-6 border border-[#BA936A]/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-[#FAF5EE]/95 text-[#3E2C1C] text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#D4AF37]/50 shadow-2xs">
                  Prochaine étape du chemin critique
                </span>
                <span className="text-xs text-[#FAF5EE]/90 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Mercredi 28 oct. 2026 à 06h15 précises</span>
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold font-display text-white">
                Hystéroscopie (Debris Removal) · Centre ambulatoire
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF5EE]/90 mt-1 max-w-xl">
                Arrivée requise à 05h45. À jeun strict dès minuit. Cette étape débloque immédiatement la fixation de la date définitive du transfert embryonnaire (FET).
              </p>
            </div>

            {/* Live Ticking Countdown Box */}
            <div className="bg-[#FAF5EE] rounded-xl p-3 sm:p-4 text-[#3E2C1C] shadow-inner border border-[#D4AF37]/40 shrink-0">
              <span className="text-[10px] font-bold text-[#8C6D46] uppercase-eyebrow block text-center mb-1.5">
                Compte à rebours en direct
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white rounded-lg p-2 border border-[#E8DDD0] min-w-12">
                  <span className="text-lg sm:text-xl font-bold font-mono text-[#3E2C1C] block leading-none">
                    {immediateCountdown ? String(immediateCountdown.days).padStart(2, '0') : '00'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-zinc-500 mt-0.5 block">Jours</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-[#E8DDD0] min-w-12">
                  <span className="text-lg sm:text-xl font-bold font-mono text-[#3E2C1C] block leading-none">
                    {immediateCountdown ? String(immediateCountdown.hours).padStart(2, '0') : '00'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-zinc-500 mt-0.5 block">Heures</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-[#E8DDD0] min-w-12">
                  <span className="text-lg sm:text-xl font-bold font-mono text-[#3E2C1C] block leading-none">
                    {immediateCountdown ? String(immediateCountdown.minutes).padStart(2, '0') : '00'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-zinc-500 mt-0.5 block">Min</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-[#E8DDD0] min-w-12">
                  <span className="text-lg sm:text-xl font-bold font-mono text-[#8C6D46] block leading-none">
                    {immediateCountdown ? String(immediateCountdown.seconds).padStart(2, '0') : '00'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-zinc-500 mt-0.5 block">Sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick capsules for future steps countdown */}
          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {upcomingMilestonesCountdown.map((m, idx) => {
              const cd = getCountdown(m.dateStr);
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/15">
                  <div className="flex items-center gap-1.5 text-xs text-[#FAF5EE] font-semibold">
                    {m.icon}
                    <span className="truncate">{m.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-white/90 mt-1">
                    <span className="text-[10px] text-white/70">{m.displayDate}</span>
                    <span className="font-bold text-[#FAF5EE] bg-black/20 px-1.5 py-0.2 rounded">
                      {cd ? cd.formatted : 'À venir'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROGRESS TRACKING RIBBON (Inverted View: Future ahead, Past behind)        */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DDD0] shadow-2xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-2">
            <div>
              <span className="font-bold text-[#3E2C1C]">Progression du Protocole : </span>
              <strong className="text-[#8C6D46] font-bold">{completedCount} jalons validés</strong>
              <span className="text-zinc-400 mx-1.5">/</span>
              <span className="text-zinc-600 font-semibold">{totalEventsCount} étapes au total</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#8C6D46] font-bold bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E8DDD0]">
                {upcomingCount} étapes restantes jusqu'au terme
              </span>
              <span className="font-bold text-[#3E2C1C]">{progressPercent}% complété</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#FAF7F2] h-2.5 rounded-full overflow-hidden border border-[#E8DDD0]">
            <div 
              className="bg-gradient-to-r from-[#8C6D46] to-[#BA936A] h-full rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Phase Filter Tabs and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-2.5 rounded-xl border border-[#E8DDD0] shadow-2xs">
          <div className="flex flex-wrap items-center gap-1 text-xs font-medium w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedPhase('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPhase === 'all'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-zinc-600 hover:text-[#3E2C1C] hover:bg-[#FAF7F2]'
              }`}
            >
              Toutes les phases ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhase(2)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPhase === 2
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-zinc-600 hover:text-[#3E2C1C] hover:bg-[#FAF7F2]'
              }`}
            >
              Phase 2 : FET (En cours)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhase(3)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPhase === 3
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-zinc-600 hover:text-[#3E2C1C] hover:bg-[#FAF7F2]'
              }`}
            >
              Phase 3 : Grossesse
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhase(4)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPhase === 4
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-zinc-600 hover:text-[#3E2C1C] hover:bg-[#FAF7F2]'
              }`}
            >
              Phase 4 : Obstétrique
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhase(1)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPhase === 1
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-zinc-600 hover:text-[#3E2C1C] hover:bg-[#FAF7F2]'
              }`}
            >
              Phase 1 : Ponction (Passée)
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher étape, date..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DDD0] rounded-lg text-[#3E2C1C] placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: TIMELINE CARDS (UPCOMING FIRST, COMPLETED AT BOTTOM)         */}
        {/* ========================================================================= */}
        {viewMode === 'timeline' && (
          <div className="space-y-8">
            
            {/* --------------------------------------------------------------------- */}
            {/* PART A: UPCOMING STEPS & FUTURE MILESTONES (AT VERY TOP)              */}
            {/* --------------------------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#8C6D46]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#8C6D46] text-white rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#3E2C1C] font-display flex items-center gap-2">
                      <span>Prochaines Étapes & Jalons à Venir</span>
                      <span className="text-[11px] font-sans font-bold bg-[#8C6D46] text-white px-2 py-0.5 rounded-full">
                        {upcomingEvents.length} étapes
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Triées par ordre d'échéance immédiate (du 28 octobre jusqu'au terme obstétrical).
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-[#8C6D46] bg-white px-2.5 py-1 rounded-lg border border-[#E8DDD0] hidden sm:block">
                  En tête de liste
                </span>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-[#E8DDD0]">
                  <p className="text-xs text-zinc-500">Aucune étape à venir correspondant à votre recherche.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const isHystero = event.id === 'p2-9';
                    const isExpanded = expandedEventId === event.id;
                    const note = savedNotes[event.id];
                    const targetDateStr = getEventTargetDate(event);
                    const countdown = getCountdown(targetDateStr);

                    return (
                      <div
                        key={event.id}
                        onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                        className={`bg-white rounded-xl border p-3.5 sm:p-4 transition-all duration-150 cursor-pointer ${
                          isHystero
                            ? 'border-[#8C6D46] bg-[#FAF7F2]/80 ring-2 ring-[#8C6D46]/40 shadow-xs'
                            : isExpanded
                            ? 'border-[#8C6D46] shadow-2xs'
                            : 'border-[#E8DDD0] hover:border-[#8C6D46]'
                        }`}
                      >
                        {/* Top Critical Path Badge on p2-9 */}
                        {isHystero && (
                          <div className="mb-2.5 flex flex-wrap items-center gap-2">
                            <MilestoneBadge type="critical" size="sm" />
                            <MilestoneBadge type="immediate" size="sm" />
                            <span className="bg-[#FAF5EE] text-[#4A2D16] text-[10px] font-bold px-2 py-0.5 rounded border border-[#BA936A]">
                              Action Requise Demain 06h15
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {isHystero ? (
                                <div className="p-1.5 bg-[#8C6D46] text-white rounded-lg">
                                  <Clock className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="p-1.5 bg-[#FAF7F2] text-[#8C6D46] rounded-lg border border-[#E8DDD0]">
                                  <Calendar className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            <div>
                              {/* Metadata line with Countdown tag */}
                              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-1">
                                <span className="font-bold text-[#3E2C1C]">{event.date}</span>
                                <span aria-hidden="true" className="text-zinc-300">·</span>
                                <span className="text-[#8C6D46] font-semibold">Phase {event.phaseId}</span>
                                
                                {/* Real-time Countdown Chip */}
                                {countdown && (
                                  <>
                                    <span aria-hidden="true" className="text-zinc-300">·</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border flex items-center gap-1 ${
                                      isHystero 
                                        ? 'bg-[#FAF5EE] text-[#6E4823] border-[#BA936A]' 
                                        : 'bg-[#FAF7F2] text-[#8C6D46] border-[#DBCBB7]'
                                    }`}>
                                      <Clock className="w-2.5 h-2.5" />
                                      {countdown.formatted}
                                    </span>
                                  </>
                                )}

                                {event.badge && !isHystero && (
                                  <>
                                    <span aria-hidden="true" className="text-zinc-300">·</span>
                                    <span className="font-bold text-[#5C4434]">{event.badge}</span>
                                  </>
                                )}

                                {event.location && (
                                  <>
                                    <span aria-hidden="true" className="text-zinc-300">·</span>
                                    <span className="flex items-center gap-1 font-semibold text-[#5C4434]">
                                      <MapPin className="w-3.5 h-3.5 text-[#8C6D46]" />
                                      {event.location}
                                    </span>
                                  </>
                                )}
                              </div>

                              <h4 className={`text-sm sm:text-base font-bold font-display ${isHystero ? 'text-[#8C6D46]' : 'text-[#3E2C1C]'}`}>
                                {event.title}
                              </h4>

                              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                          </div>

                          {/* Actions: Note & expand icon */}
                          <div className="shrink-0 flex items-center justify-end gap-2 pt-2 sm:pt-0">
                            <button
                              type="button"
                              onClick={(e) => handleOpenNote(event, e)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#5C4434] bg-[#FAF7F2] border border-[#E8DDD0] rounded-lg hover:bg-[#F5EFEB] transition-colors"
                            >
                              <MessageSquare className="w-3 h-3 text-[#8C6D46]" />
                              <span>{note ? 'Note' : '+ Note'}</span>
                            </button>

                            <div className="text-zinc-400 p-1">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-[#8C6D46]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#E8DDD0] text-xs space-y-2 animate-in fade-in duration-150">
                            {event.details && (
                              <div className={`p-3 rounded-lg leading-relaxed ${
                                isHystero
                                  ? 'bg-[#FAF7F2] border border-[#E8DDD0] text-[#3E2C1C] font-medium'
                                  : 'bg-[#FAF7F2]/60 border border-[#E8DDD0] text-zinc-700'
                              }`}>
                                <strong className="block text-[#8C6D46] mb-0.5 font-bold">Consignes cliniques :</strong>
                                {event.details}
                              </div>
                            )}

                            {/* User note */}
                            {note && (
                              <div className="p-3 bg-white border border-[#E8DDD0] rounded-lg text-xs text-[#3E2C1C] flex items-start gap-2 shadow-2xs">
                                <MessageSquare className="w-3.5 h-3.5 text-[#8C6D46] shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-[#8C6D46] block mb-0.5">Note personnelle de Fatou :</span>
                                  <p className="leading-relaxed">{note}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* PART B: PAST STEPS & COMPLETED MILESTONES (MOVED TO BOTTOM)           */}
            {/* --------------------------------------------------------------------- */}
            <div className="pt-4 border-t-2 border-[#E8DDD0]">
              <div className="flex items-center justify-between pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#FAF7F2] text-[#8C6D46] rounded-lg border border-[#E8DDD0]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#3E2C1C] font-display flex items-center gap-2">
                      <span>Étapes Passées & Jalons Franchis avec Succès</span>
                      <span className="text-[11px] font-sans font-bold bg-[#FAF7F2] text-[#5C4434] border border-[#E8DDD0] px-2 py-0.5 rounded-full">
                        {completedEvents.length} validées
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Archive des étapes médicales franchies (Ponction, Fécondation ICSI, Résultats PGT-A).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPastSectionOpen(!isPastSectionOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5C4434] bg-white hover:bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl transition-colors shadow-2xs"
                >
                  <span>{isPastSectionOpen ? 'Masquer' : 'Afficher'}</span>
                  {isPastSectionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {isPastSectionOpen && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  {completedEvents.map((event) => {
                    const isExpanded = expandedEventId === event.id;
                    const note = savedNotes[event.id];

                    return (
                      <div
                        key={event.id}
                        onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                        className="bg-white/80 hover:bg-white rounded-xl border border-[#E8DDD0] p-3 sm:p-3.5 transition-all duration-150 cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#8C6D46] shrink-0 mt-0.5" />

                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500 mb-0.5">
                                <span className="font-bold text-[#3E2C1C]">{event.date}</span>
                                <span aria-hidden="true" className="text-zinc-300">·</span>
                                <span className="text-[#8C6D46] font-semibold">Phase {event.phaseId}</span>
                                {event.badge && (
                                  <>
                                    <span aria-hidden="true" className="text-zinc-300">·</span>
                                    <span className="font-semibold text-[#5C4434] bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#E8DDD0]">
                                      {event.badge}
                                    </span>
                                  </>
                                )}
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-[#3E2C1C]">
                                {event.title}
                              </h4>

                              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center justify-end gap-2 pt-1 sm:pt-0">
                            <span className="text-[10px] font-bold text-[#5C4434] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DDD0]">
                              Validé ✓
                            </span>
                            <div className="text-zinc-400 p-0.5">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="mt-2.5 pt-2.5 border-t border-[#E8DDD0] text-xs space-y-2">
                            {event.details && (
                              <div className="p-2.5 bg-[#FAF7F2]/70 border border-[#E8DDD0] rounded-lg text-zinc-700 leading-relaxed">
                                <strong className="block text-[#8C6D46] mb-0.5 font-bold">Consignes :</strong>
                                {event.details}
                              </div>
                            )}

                            {note && (
                              <div className="p-2.5 bg-white border border-[#E8DDD0] rounded-lg text-xs text-[#3E2C1C] flex items-start gap-2 shadow-2xs">
                                <MessageSquare className="w-3.5 h-3.5 text-[#8C6D46] shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-[#8C6D46] block mb-0.5">Note de Fatou :</span>
                                  <p>{note}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: TABLE LAYOUT INVERTED (UPCOMING FIRST, COMPLETED BELOW)      */}
        {/* ========================================================================= */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#3E2C1C] font-bold border-b border-[#E8DDD0]">
                  <tr>
                    <th className="py-2.5 px-3 w-32 whitespace-nowrap">Date / Échéance</th>
                    <th className="py-2.5 px-3">Étape / Consignes</th>
                    <th className="py-2.5 px-3 w-28">Phase</th>
                    <th className="py-2.5 px-3 w-36 text-right">Statut / Compte à rebours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]">
                  {/* Category Header: Upcoming */}
                  <tr className="bg-[#FAF5EE]">
                    <td colSpan={4} className="py-2 px-3 font-bold text-[#8C6D46] uppercase tracking-wider text-[11px]">
                      ▲ Prochaines Étapes & Jalons à Venir ({upcomingEvents.length})
                    </td>
                  </tr>
                  {upcomingEvents.map((event) => {
                    const cd = getCountdown(getEventTargetDate(event));
                    return (
                      <tr key={event.id} className="hover:bg-[#FAF7F2]/50 transition-colors bg-white">
                        <td className="py-2.5 px-3 font-bold text-[#3E2C1C] whitespace-nowrap">
                          {event.date}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[#3E2C1C]">{event.title}</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">{event.description}</div>
                          {event.location && (
                            <div className="text-[11px] text-[#8C6D46] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#8C6D46]" />
                              {event.location}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-zinc-600 whitespace-nowrap">
                          Phase {event.phaseId}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex flex-col items-end gap-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#8C6D46] text-white">
                              {event.status === 'active' ? 'Active / Imminente' : 'À venir'}
                            </span>
                            {cd && (
                              <span className="text-[10px] font-mono text-[#8C6D46] font-bold">
                                {cd.formatted}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Category Header: Past / Completed */}
                  <tr className="bg-[#FAF5EE]">
                    <td colSpan={4} className="py-2 px-3 font-bold text-zinc-500 uppercase tracking-wider text-[11px]">
                      ▼ Étapes Passées & Validées ({completedEvents.length})
                    </td>
                  </tr>
                  {completedEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-[#FAF7F2]/50 transition-colors bg-white/70">
                      <td className="py-2.5 px-3 font-bold text-zinc-600 whitespace-nowrap">
                        {event.date}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-zinc-800">{event.title}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{event.description}</div>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-zinc-600 whitespace-nowrap">
                        Phase {event.phaseId}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#5C4434] border border-[#E8DDD0]">
                          Terminée ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Note Editing Modal */}
        {activeNoteEventId && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-[#E8DDD0] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DDD0]">
                <h3 className="text-sm font-bold text-[#3E2C1C] font-display">
                  Ajouter une note personnelle
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveNoteEventId(null)}
                  className="text-zinc-400 hover:text-[#3E2C1C]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3">
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Note ou question pour l'équipe médicale :
                </label>
                <textarea
                  rows={4}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Ex: Ressenti, questions à l'équipe médicale..."
                  className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl text-[#3E2C1C] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8DDD0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNoteEventId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-[#FAF7F2] rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveNote(activeNoteEventId)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#8C6D46] hover:bg-[#745233] rounded-lg shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
