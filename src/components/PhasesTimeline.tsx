import React, { useState } from 'react';
import { PhaseEvent, PhaseInfo } from '../types/protocol';
import { Calendar, CheckCircle2, Clock, MapPin, Search, ChevronRight, MessageSquare, Save, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({
    'p2-5': "Formulaire de décongélation rempli et validé : Priorité garçon (Male).",
    'p2-8': "Excellente nouvelle le 25 oct. : 5 embryons normaux euploïdes sur les 8 biopsiés !",
    'p2-9': "Hystéroscopie programmée le mercredi 28 oct. à 06h15 au centre chirurgical ambulatoire. Être à jeun dès minuit."
  });

  const filteredEvents = events.filter((ev) => {
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
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
              <span>Chronologie du protocole</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>4 Phases médicales</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Calendrier complet des phases & étapes
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              De la stimulation initiale jusqu'à l'accouchement à terme. Touchez une étape pour afficher ses consignes en ligne.
            </p>
          </div>

          {/* View mode toggle in Light Brown */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E8DDD0] text-xs font-medium shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'timeline' ? 'bg-[#8C6D46] text-white font-bold' : 'text-zinc-600 hover:text-[#3E2C1C]'
                }`}
              >
                Vue Chronologique
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

        {/* Phase Summary Cards Banner in Light Brown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5">
          {phasesInfo.map((p) => {
            const isSelected = selectedPhase === p.id;
            const isFinished = p.status === 'Terminée';
            const isActive = p.status === 'Active';

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPhase(isSelected ? 'all' : p.id)}
                className={`text-left p-3 sm:p-4 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? 'border-[#8C6D46] bg-white ring-2 ring-[#8C6D46] shadow-xs'
                    : isActive
                    ? 'border-[#8C6D46] bg-white shadow-2xs'
                    : isFinished
                    ? 'border-[#E8DDD0] bg-white/70 hover:bg-white'
                    : 'border-[#E8DDD0] bg-white/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-zinc-500">{p.timelineLabel}</span>
                  <span
                    className={`font-bold text-[10px] uppercase px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-[#8C6D46] text-white'
                        : isFinished
                        ? 'bg-[#FAF7F2] text-[#5C4434] border border-[#E8DDD0]'
                        : 'text-zinc-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#3E2C1C] font-display">
                  {p.name}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                  {p.highlight}
                </p>
              </button>
            );
          })}
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 bg-white p-2.5 rounded-xl border border-[#E8DDD0] shadow-2xs">
          {/* Phase Filter Tabs */}
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
              Toutes ({events.length})
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
              Phase 1 : Ponction
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
              Phase 2 : FET (Active)
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

        {/* View Mode 1: Detailed Timeline with Inline Accordion */}
        {viewMode === 'timeline' && (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const isCompleted = event.status === 'completed';
              const isActive = event.status === 'active';
              const note = savedNotes[event.id];
              const isHystero = event.id === 'p2-9';
              const isExpanded = expandedEventId === event.id;

              return (
                <div
                  key={event.id}
                  onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                  className={`bg-white rounded-xl border p-3.5 sm:p-4 transition-all duration-150 cursor-pointer ${
                    isHystero
                      ? 'border-[#8C6D46] bg-[#FAF7F2]/60 ring-2 ring-[#8C6D46]/40 shadow-xs'
                      : isExpanded
                      ? 'border-[#8C6D46] shadow-2xs'
                      : isActive
                      ? 'border-[#E8DDD0] hover:border-[#8C6D46]'
                      : isCompleted
                      ? 'border-[#E8DDD0] bg-white'
                      : 'border-[#E8DDD0] bg-[#FAF7F2]/30'
                  }`}
                >
                  {/* Top Critical Path Badge on p2-9 card */}
                  {isHystero && (
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <MilestoneBadge type="critical" size="sm" />
                      <MilestoneBadge type="immediate" size="sm" />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#8C6D46]" />
                        ) : isActive ? (
                          <Clock className="w-5 h-5 text-[#8C6D46]" />
                        ) : (
                          <Calendar className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>

                      <div>
                        {/* Unboxed metadata line */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-1">
                          <span className="font-bold text-[#3E2C1C]">{event.date}</span>
                          <span aria-hidden="true" className="text-zinc-300">·</span>
                          <span className="text-[#8C6D46] font-semibold">Phase {event.phaseId}</span>
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

                        <h3 className={`text-sm sm:text-base font-bold font-display ${isHystero ? 'text-[#8C6D46]' : 'text-[#3E2C1C]'}`}>
                          {event.title}
                        </h3>

                        <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Note & Inline expand toggle */}
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

                  {/* Inline Collapsible Details (No footer jumps) */}
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

                      {/* User personal note display */}
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

        {/* View Mode 2: Table layout in Light Brown */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#3E2C1C] font-bold border-b border-[#E8DDD0]">
                  <tr>
                    <th className="py-2.5 px-3 w-28 whitespace-nowrap">Date</th>
                    <th className="py-2.5 px-3">Étape / Action à effectuer</th>
                    <th className="py-2.5 px-3 w-32">Phase</th>
                    <th className="py-2.5 px-3 w-28 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
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
                        <span
                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                            event.status === 'completed'
                              ? 'bg-[#FAF7F2] text-[#5C4434] border border-[#E8DDD0]'
                              : event.status === 'active'
                              ? 'bg-[#8C6D46] text-white'
                              : 'text-zinc-400'
                          }`}
                        >
                          {event.status === 'completed'
                            ? 'Terminée'
                            : event.status === 'active'
                            ? 'Active'
                            : 'À venir'}
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
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
