import React from 'react';
import { ArrowRight, Baby, Calendar, Stethoscope, Camera, Clock, Sparkles } from 'lucide-react';
import { GoldLogo } from './GoldLogo';
import { MilestoneBadge } from './MilestoneBadge';

interface HeroOverviewProps {
  onJumpToChecklist: () => void;
  onOpenEmbryoModal: () => void;
  onOpenDoctorPrep: () => void;
  onOpenMobileAPK: () => void;
  onJumpToCalendar: () => void;
  onJumpToPhotos: () => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  onJumpToChecklist,
  onOpenEmbryoModal,
  onOpenDoctorPrep,
  onOpenMobileAPK,
  onJumpToCalendar,
  onJumpToPhotos
}) => {
  return (
    <section className="bg-white border-b border-[#E8DDD0] pt-6 sm:pt-8 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Category Eyebrow & Milestone Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E2C1C]">
            <GoldLogo className="w-4 h-4" withSparkle={false} />
            <span>Patiente : <span className="font-serif-italic font-bold text-[#8C6D46]">Fatou</span></span>
          </div>
          <span aria-hidden="true" className="text-zinc-300">·</span>
          <MilestoneBadge type="immediate" size="sm" />
          <MilestoneBadge type="pgta" size="sm" />
          <MilestoneBadge type="embryo" size="sm" />
        </div>

        {/* Main headline & Executive Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-7">
            <span className="uppercase-eyebrow text-[11px] font-bold text-[#8C6D46] tracking-[0.14em] block mb-1">
              VOTRE PARCOURS FIV & PROCHAINE ÉTAPE
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#3E2C1C] font-display text-balance leading-tight">
              Protocole de FIV & Préparation au transfert
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
              Chère <span className="font-serif-italic font-bold text-[#8C6D46]">Fatou</span>, votre protocole franchit une étape charnière : l'analyse génétique PGT-A a confirmé <strong className="text-[#3E2C1C] font-bold">5 blastocystes normaux euploïdes</strong> (<strong className="text-[#8C6D46] font-bold">2 garçons et 3 filles</strong>).
              Votre intervention d'hystéroscopie (Debris Removal) est programmée pour <strong className="text-[#3E2C1C] font-black underline decoration-[#D4AF37] decoration-2 underline-offset-2">demain mercredi 28 octobre à 06h15</strong> au centre chirurgical ambulatoire.
            </p>

            {/* Quick action buttons with Light Brown styling */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onJumpToChecklist}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#BA936A] hover:bg-[#A88056] text-[#24150A] text-xs sm:text-sm font-black rounded-xl transition-all shadow-xs ring-1 ring-[#8A5F33]/40"
              >
                <span>Hystéroscopie (28 oct. 06h15)</span>
                <ArrowRight className="w-4 h-4 text-[#4A2D16]" />
              </button>
              <button
                type="button"
                onClick={onJumpToCalendar}
                className="inline-flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-[#FAF7F2] border border-[#E8DDD0] hover:border-[#8C6D46] text-[#3E2C1C] text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#F5EFEB] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#8C6D46]" />
                <span>Calendrier interactif</span>
              </button>
              <button
                type="button"
                onClick={onOpenEmbryoModal}
                className="inline-flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-white text-[#3E2C1C] border border-[#E8DDD0] hover:border-[#8C6D46] text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#FAF7F2] transition-colors"
              >
                <Baby className="w-4 h-4 text-[#8C6D46]" />
                <span>5 embryons (2G / 3F)</span>
              </button>
              <button
                type="button"
                onClick={onJumpToPhotos}
                className="inline-flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-white border border-[#E8DDD0] text-zinc-700 text-xs sm:text-sm font-medium rounded-xl hover:bg-[#FAF7F2] transition-colors"
              >
                <Camera className="w-4 h-4 text-[#8C6D46]" />
                <span>Clichés d'échographies</span>
              </button>
            </div>
          </div>

          {/* Clinical summary card in Light Brown & Cream */}
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E8DDD0] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDD0]">
              <span className="uppercase-eyebrow text-[10px] font-bold tracking-wider text-[#8C6D46] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8C6D46]" />
                VOTRE DOSSIER EN BREF
              </span>
              <span className="text-[10px] text-white font-bold bg-[#8C6D46] px-2 py-0.5 rounded-md">
                27–28 oct. 2026
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-zinc-600">Résultats PGT-A :</span>
                <span className="font-bold text-[#3E2C1C] text-right">
                  5 Normaux (2 Garçons, 3 Filles)
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-zinc-600">Prochaine étape :</span>
                <span className="font-black text-[#8C6D46] text-right">
                  Hystéroscopie 28 oct. à 06h15
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-zinc-600">Lieu d'intervention :</span>
                <span className="font-medium text-[#3E2C1C] text-right text-xs">
                  Centre chirurgical ambulatoire
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-zinc-600">Plan de décongélation :</span>
                <span className="font-semibold text-[#3E2C1C] text-right">
                  Garçon retenu (Blastocyste #1 - 5AA)
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 pt-2 border-t border-[#E8DDD0]">
                <span className="text-zinc-600">Date du transfert FET :</span>
                <span className="font-bold text-[#8C6D46] text-right text-xs">
                  Fixée après l'hystéroscopie du 28 oct.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quantitative Milestones Bar in Light Brown */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#E8DDD0]">
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DDD0] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Ovocytes prélevés</span>
            <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] tabular-nums font-display">42</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Ponction réussie (01 oct.)</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DDD0] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Fécondés par ICSI</span>
            <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] tabular-nums font-display">11</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Sur 34 ovocytes matures MII</span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DDD0] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Blastocystes vitrifiés</span>
            <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] tabular-nums font-display">8</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Biopsiés pour analyse PGT-A</span>
          </div>

          <div className="p-3 bg-[#BA936A] text-[#24150A] rounded-xl border border-[#A67E55] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#4A2D16] block">Embryons normaux</span>
            <span className="text-xl sm:text-2xl font-black text-[#24150A] tabular-nums font-display">5</span>
            <span className="text-[10px] text-[#4A2D16] font-extrabold block mt-0.5">2 Garçons · 3 Filles</span>
          </div>
        </div>
      </div>
    </section>
  );
};
