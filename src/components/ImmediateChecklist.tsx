import React, { useState } from 'react';
import { ChecklistItem } from '../types/protocol';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Stethoscope, Pill, Dna, FileCheck, Phone, MapPin, Sparkles, Baby, FileText, ExternalLink } from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

interface ImmediateChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onOpenEmbryos: () => void;
  onOpenDoctorPrep: () => void;
  onLogMedication: () => void;
}

export const ImmediateChecklist: React.FC<ImmediateChecklistProps> = ({
  items,
  onToggleItem,
  onOpenEmbryos,
  onOpenDoctorPrep,
  onLogMedication
}) => {
  // Expanded by default on the critical path hysteroscopy item
  const [expandedId, setExpandedId] = useState<string | null>("check-hysteroscopy-28");

  const completedCount = items.filter(i => i.status === 'done').length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'formulaire':
        return <FileCheck className="w-4 h-4 text-[#8C6D46]" />;
      case 'medicament':
        return <Pill className="w-4 h-4 text-[#8C6D46]" />;
      case 'clinique':
        return <Stethoscope className="w-4 h-4 text-[#8C6D46]" />;
      case 'laboratoire':
        return <Dna className="w-4 h-4 text-[#8C6D46]" />;
      case 'consultation':
        return <Phone className="w-4 h-4 text-[#8C6D46]" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-600" />;
    }
  };

  // Toggle inline expansion WITHOUT jumping or scrolling to page footer
  const handleToggleInlineDetails = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="checklist" className="py-10 bg-[#FAF7F2] border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <MilestoneBadge type="critical" size="sm" />
              <span className="text-[11px] font-sans font-medium text-[#745233]">
                · Actions prioritaires du protocole
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display">
              Liste de contrôle d'exécution immédiate
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Toutes les consignes et pièces médicales s'ouvrent <strong>directement en ligne</strong> ci-dessous sans changer de page.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-[#E8DDD0] shadow-2xs self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-medium block">Progression</span>
              <span className="text-xs sm:text-sm font-bold text-[#3E2C1C] tabular-nums">
                {completedCount} / {items.length} validées ({progressPercent}%)
              </span>
            </div>
            <div className="w-20 sm:w-24 bg-[#E8DDD0] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#8C6D46] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EXPLICIT NEXT CRITICAL PATH STEP SPOTLIGHT BANNER                          */}
        {/* ========================================================================= */}
        <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-[#BA936A] via-[#CAAA85] to-[#DCC3A5] text-[#362212] rounded-2xl border-2 border-[#A67E55] shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <MilestoneBadge type="critical" size="sm" />
                <MilestoneBadge type="immediate" size="sm" />
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-[#2E1B0E] font-display tracking-tight leading-tight">
                Hystéroscopie (Debris Removal) — Centre chirurgical ambulatoire
              </h3>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#3D2817]">
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#8A5F33] shrink-0" />
                  Centre chirurgical ambulatoire Gramercy
                </span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="flex items-center gap-1 font-black text-[#693E1A]">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  Arrivée obligatoire à 05h45
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#422B17] leading-relaxed max-w-3xl pt-1 font-medium">
                <strong>Importance clinique :</strong> L'évacuation des débris résiduels assure un endomètre réceptif. <span className="underline decoration-[#8A5F33] underline-offset-2 font-bold">Aucune date de transfert embryonnaire (FET) ne sera arrêtée avant l'évaluation post-opératoire de cette hystéroscopie.</span>
              </p>
            </div>

            {/* Pre-Op Reminders checklist in Light Brown */}
            <div className="bg-[#FAF5EE] border-2 border-[#BFA07C] rounded-xl p-3.5 shrink-0 lg:w-80 space-y-2 text-xs text-[#362212] shadow-xs">
              <span className="font-bold text-[#8A5F33] uppercase tracking-wider block text-[10px] pb-1 border-b border-[#E3D3C0]">
                Consignes préopératoires strictes
              </span>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8A5F33] shrink-0 mt-0.5" />
                <span><strong>À jeun strict dès minuit</strong> (aucun liquide ni solide).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8A5F33] shrink-0 mt-0.5" />
                <span><strong>Arrivée requise à 05h45</strong> (30 min avant 06h15).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8A5F33] shrink-0 mt-0.5" />
                <span><strong>Accompagnateur adulte</strong> obligatoire pour la sortie.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CHECKLIST CARDS WITH INLINE STICKY DETAILS (NO FOOTER SCROLL JUMP)        */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const isDone = item.status === 'done';
            const isActive = item.status === 'active';
            const isHysteroscopy = item.id === 'check-hysteroscopy-28';
            const isPgta = item.id === 'check-pgta-results';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                  isHysteroscopy
                    ? 'border-[#8C6D46] ring-2 ring-[#8C6D46]/40 shadow-sm bg-[#FAF7F2]/40'
                    : isExpanded
                    ? 'border-[#8C6D46] shadow-xs'
                    : isActive
                    ? 'border-[#E8DDD0] hover:border-[#8C6D46]'
                    : isDone
                    ? 'border-[#E8DDD0] bg-white/70 opacity-90'
                    : 'border-[#E8DDD0] hover:border-[#8C6D46]'
                }`}
              >
                {/* Main Card Header / Clickable row */}
                <div
                  onClick={() => handleToggleInlineDetails(item.id)}
                  className="p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    {/* Toggle check button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleItem(item.id);
                      }}
                      className="mt-0.5 text-zinc-400 hover:text-[#8C6D46] transition-colors"
                      aria-label={isDone ? "Marquer comme à faire" : "Marquer comme fait"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#8C6D46] fill-[#FAF7F2]" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
                        <span className="flex items-center gap-1 font-bold text-[#3E2C1C]">
                          {getCategoryIcon(item.category)}
                          Action #{index + 1}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-bold ${isHysteroscopy ? 'text-[#8C6D46]' : isActive ? 'text-[#3E2C1C]' : ''}`}>
                          {item.dateOrWindow}
                        </span>
                        {isDone && (
                          <span className="text-[#8C6D46] font-bold bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#E8DDD0]">
                            Validé
                          </span>
                        )}
                        {isHysteroscopy && (
                          <MilestoneBadge type="immediate" size="sm" />
                        )}
                        {isPgta && (
                          <MilestoneBadge type="pgta" size="sm" />
                        )}
                      </div>

                      <h3 className={`text-sm sm:text-base font-bold font-display ${isDone ? 'line-through text-zinc-400' : 'text-[#3E2C1C]'}`}>
                        {item.title}
                      </h3>

                      <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleToggleInlineDetails(item.id, e)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        isExpanded
                          ? 'bg-[#8C6D46] text-white border-[#8C6D46]'
                          : 'bg-[#FAF7F2] text-[#3E2C1C] border-[#E8DDD0] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <span>{isExpanded ? 'Masquer détails' : 'Détails en ligne'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* INLINE EXPANDED DETAILS (Loads cleanly inline without jumping to footer!)  */}
                {/* ========================================================================= */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#E8DDD0] bg-[#FAF7F2] text-xs text-[#3E2C1C] space-y-3 animate-in fade-in duration-150">
                    {/* Medical details paragraph */}
                    {item.details && (
                      <div className="bg-white p-3.5 rounded-xl border border-[#E8DDD0] shadow-2xs leading-relaxed">
                        <span className="font-bold text-[#8C6D46] uppercase-eyebrow text-[10px] block mb-1">
                          Consignes médicales & organisation :
                        </span>
                        <p className="text-zinc-800">{item.details}</p>
                      </div>
                    )}

                    {/* Rich Inline PGT-A Embryos Snapshot (for check-pgta-results) */}
                    {isPgta && (
                      <div className="bg-white p-3.5 rounded-xl border border-[#E8DDD0] shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#3E2C1C] text-xs flex items-center gap-1.5">
                            <Baby className="w-4 h-4 text-[#8C6D46]" />
                            5 Blastocystes Normaux Validés (PGT-A)
                          </span>
                          <MilestoneBadge type="embryo" size="sm" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                          <div className="p-2 bg-[#FAF7F2] rounded-lg border-2 border-[#8C6D46]">
                            <span className="text-[10px] text-[#8C6D46] font-bold block">Sélectionné FET</span>
                            <span className="font-black text-[#3E2C1C]">#1 Garçon</span>
                            <span className="text-[10px] block text-zinc-600">5AA (Euploïde)</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-[#E8DDD0]">
                            <span className="text-[10px] text-zinc-500 font-bold block">Embryon #2</span>
                            <span className="font-bold text-[#3E2C1C]">Garçon</span>
                            <span className="text-[10px] block text-zinc-600">5AB (Euploïde)</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-[#E8DDD0]">
                            <span className="text-[10px] text-zinc-500 font-bold block">Embryon #3</span>
                            <span className="font-bold text-[#3E2C1C]">Fille</span>
                            <span className="text-[10px] block text-zinc-600">5AA (Euploïde)</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-[#E8DDD0]">
                            <span className="text-[10px] text-zinc-500 font-bold block">Embryon #4</span>
                            <span className="font-bold text-[#3E2C1C]">Fille</span>
                            <span className="text-[10px] block text-zinc-600">4AA (Euploïde)</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-[#E8DDD0]">
                            <span className="text-[10px] text-zinc-500 font-bold block">Embryon #5</span>
                            <span className="font-bold text-[#3E2C1C]">Fille</span>
                            <span className="text-[10px] block text-zinc-600">4BB (Euploïde)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location information */}
                    {item.location && (
                      <div className="flex items-center gap-2 text-xs text-[#5C4434] bg-white p-2.5 rounded-lg border border-[#E8DDD0]">
                        <MapPin className="w-4 h-4 text-[#8C6D46] shrink-0" />
                        <span><strong>Lieu de convocation :</strong> {item.location}</span>
                      </div>
                    )}

                    {/* Secondary Jump link (optional, non-intrusive) */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-500 italic">
                        Détails synchronisés en temps réel
                      </span>
                      {item.actionType === 'view_pgta' && (
                        <button
                          type="button"
                          onClick={onOpenEmbryos}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D46] hover:underline"
                        >
                          <span>Voir la fiche embryologie complète</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                      {item.actionType === 'call_doctor' && (
                        <button
                          type="button"
                          onClick={onOpenDoctorPrep}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D46] hover:underline"
                        >
                          <span>Préparer les questions médecin</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
