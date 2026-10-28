import React, { useState } from 'react';
import { Blastocyst } from '../types/protocol';
import { Dna, Snowflake, Baby, CheckCircle, Info, ChevronRight, HelpCircle, Sparkles, X } from 'lucide-react';
import { GoldLogo } from './GoldLogo';
import { MilestoneBadge } from './MilestoneBadge';

interface EmbryoLabSectionProps {
  blastocysts: Blastocyst[];
  onSelectEmbryoForFET?: (id: number) => void;
}

export const EmbryoLabSection: React.FC<EmbryoLabSectionProps> = ({
  blastocysts,
  onSelectEmbryoForFET
}) => {
  const [filterSex, setFilterSex] = useState<'all' | 'Male' | 'Female'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Euploïde' | 'Aneuploïde'>('all');
  const [selectedEmbryoModal, setSelectedEmbryoModal] = useState<Blastocyst | null>(null);
  const [showGradingGuide, setShowGradingGuide] = useState(false);

  const filteredEmbryos = blastocysts.filter((b) => {
    if (filterSex !== 'all' && b.sex !== filterSex) return false;
    if (filterStatus !== 'all' && b.pgtaStatus !== filterStatus) return false;
    return true;
  });

  const euploidCount = blastocysts.filter(b => b.pgtaStatus === 'Euploïde').length;
  const maleEuploidCount = blastocysts.filter(b => b.sex === 'Male' && b.pgtaStatus === 'Euploïde').length;
  const femaleEuploidCount = blastocysts.filter(b => b.sex === 'Female' && b.pgtaStatus === 'Euploïde').length;

  return (
    <section id="embryons" className="py-10 bg-white border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <MilestoneBadge type="pgta" size="sm" />
              <MilestoneBadge type="embryo" size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Rapport PGT-A : 5 embryons normaux (2 Garçons & 3 Filles)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-3xl leading-relaxed">
              Analyse génétique confirmée : 5 blastocystes normaux euploïdes sur les 8 biopsiés (2 garçons et 3 filles). Conformément à votre plan de décongélation avec préférence pour un garçon, l'embryon masculin de plus haute qualité (5AA) est priorisé pour le transfert.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGradingGuide(!showGradingGuide)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5C4434] bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl hover:bg-[#F5EFEB] transition-colors self-start md:self-auto"
          >
            <HelpCircle className="w-4 h-4 text-[#8C6D46]" />
            <span>Comprendre les scores (Gardner & PGT-A)</span>
          </button>
        </div>

        {/* Funnel overview metrics with 2 Garçons / 3 Filles in Light Brown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E8DDD0] mb-6 shadow-2xs">
          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Ovocytes prélevés</span>
            <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] tabular-nums font-display">42</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">34 Matures (MII)</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Fécondés par ICSI</span>
            <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] tabular-nums font-display">11</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Zygotes 2PN</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Blastocystes biopsiés</span>
            <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] tabular-nums font-display">8</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Vitrifiés J5/J6</span>
          </div>

          <div className="p-3 bg-[#BA936A] text-[#24150A] rounded-xl border border-[#A67E55] shadow-xs">
            <span className="text-[10px] font-bold text-[#4A2D16] uppercase block">Normaux (Euploïdes)</span>
            <span className="text-xl sm:text-2xl font-black text-[#24150A] tabular-nums font-display">5</span>
            <span className="text-[10px] text-[#4A2D16] font-extrabold block mt-0.5">2 Garçons · 3 Filles</span>
          </div>
        </div>

        {/* Gardner Grading Guide Modal */}
        {showGradingGuide && (
          <div className="mb-6 p-4 sm:p-5 bg-white border border-[#E8DDD0] rounded-2xl shadow-xs text-xs space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DDD0]">
              <h3 className="font-bold text-[#3E2C1C] text-sm font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8C6D46]" /> Guide de lecture du score Gardner (Ex: 5AA)
              </h3>
              <button
                type="button"
                onClick={() => setShowGradingGuide(false)}
                className="text-zinc-400 hover:text-[#3E2C1C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DDD0]">
                <strong className="block text-[#8C6D46] mb-0.5">1er chiffre (Degré d'expansion 1 à 6) :</strong>
                <span>Score 5 = Blastocyste en cours d'éclosion (Hatching). Stade idéal avant implantation.</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DDD0]">
                <strong className="block text-[#8C6D46] mb-0.5">1ère lettre (Masse Cellulaire Interne) :</strong>
                <span>Score A = Cellules abondantes et bien compactées destinées à former le fœtus.</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DDD0]">
                <strong className="block text-[#8C6D46] mb-0.5">2ème lettre (Trophectoderme) :</strong>
                <span>Score A = Nombreuses cellules unies en couche continue destinées au futur placenta.</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DDD0]">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-[#3E2C1C] mr-1">Filtrer par sexe :</span>
            <button
              type="button"
              onClick={() => setFilterSex('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterSex === 'all'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'bg-white text-zinc-700 border border-[#E8DDD0] hover:bg-[#F5EFEB]'
              }`}
            >
              Tous ({blastocysts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterSex('Male')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterSex === 'Male'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'bg-white text-zinc-700 border border-[#E8DDD0] hover:bg-[#F5EFEB]'
              }`}
            >
              Garçons ({maleEuploidCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterSex('Female')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterSex === 'Female'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'bg-white text-zinc-700 border border-[#E8DDD0] hover:bg-[#F5EFEB]'
              }`}
            >
              Filles ({femaleEuploidCount})
            </button>
          </div>

          <div className="text-xs text-[#8C6D46] font-bold">
            Affichage : {filteredEmbryos.length} blastocystes
          </div>
        </div>

        {/* Embryos Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredEmbryos.map((embryo) => {
            const isSelected = embryo.isSelectedForFET;
            const isEuploid = embryo.pgtaStatus === 'Euploïde';

            return (
              <div
                key={embryo.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FAF7F2] border-[#8C6D46] ring-2 ring-[#8C6D46]/50 shadow-sm'
                    : isEuploid
                    ? 'bg-white border-[#E8DDD0] hover:border-[#8C6D46] hover:shadow-2xs'
                    : 'bg-[#FAF7F2]/50 border-[#E8DDD0] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#3E2C1C]">
                      Embryon #{embryo.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isEuploid
                        ? 'bg-[#FAF7F2] text-[#8C6D46] border border-[#E8DDD0]'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {embryo.pgtaStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-[#3E2C1C] font-display">
                      {embryo.grade}
                    </span>
                    <span className="text-xs text-[#5C4434] font-semibold bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DDD0]">
                      {embryo.sex === 'Male' ? 'Garçon (XY)' : 'Fille (XX)'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                    {embryo.notes}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#E8DDD0] flex items-center justify-between">
                  {isEuploid ? (
                    <button
                      type="button"
                      onClick={() => onSelectEmbryoForFET && onSelectEmbryoForFET(embryo.id)}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'bg-[#8C6D46] text-white shadow-xs'
                          : 'bg-[#FAF7F2] text-[#3E2C1C] border border-[#E8DDD0] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      {isSelected ? '✓ Retenu pour le transfert' : 'Sélectionner pour FET'}
                    </button>
                  ) : (
                    <span className="text-[11px] text-zinc-400 italic text-center w-full">
                      Non transférable
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
