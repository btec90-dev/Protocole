import React, { useState } from 'react';
import { Calendar, Sparkles, Heart, Baby, Clock, ArrowRight, Info } from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

export const FETDueCalculator: React.FC = () => {
  // Target FET date estimate (default late Oct / early Nov, to be finalized post-hysteroscopy)
  const [transferDateStr, setTransferDateStr] = useState('2026-11-04');

  const calculateMilestones = (dateStr: string) => {
    const tDate = new Date(dateStr);
    if (isNaN(tDate.getTime())) return null;

    // Day 5 blastocyst calculations
    const dueDate = new Date(tDate);
    dueDate.setDate(dueDate.getDate() + 261);

    const betaDate = new Date(tDate);
    betaDate.setDate(betaDate.getDate() + 10);

    const beta2Date = new Date(tDate);
    beta2Date.setDate(beta2Date.getDate() + 12);

    const echo6wDate = new Date(tDate);
    echo6wDate.setDate(echo6wDate.getDate() + 23);

    const graduationDate = new Date(tDate);
    graduationDate.setDate(graduationDate.getDate() + 37);

    const t12wDate = new Date(tDate);
    t12wDate.setDate(t12wDate.getDate() + 65);

    const morphoDate = new Date(tDate);
    morphoDate.setDate(morphoDate.getDate() + 135);

    const formatDate = (d: Date) => {
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    return {
      dueDate: formatDate(dueDate),
      betaDate: formatDate(betaDate),
      beta2Date: formatDate(beta2Date),
      echo6wDate: formatDate(echo6wDate),
      graduationDate: formatDate(graduationDate),
      t12wDate: formatDate(t12wDate),
      morphoDate: formatDate(morphoDate)
    };
  };

  const milestones = calculateMilestones(transferDateStr);

  return (
    <section id="calculateur" className="py-10 bg-white border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Projection & Échéancier Post-FET</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>Calculateur obstétrical</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Calculateur de terme & Jalons après transfert
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Pour un blastocyste à J5, simulez la date prévisionnelle d'accouchement et les échéances clés à partir de votre date de transfert.
            </p>
          </div>

          {/* Transfer Date Selector */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#E8DDD0] self-start md:self-auto">
            <Calendar className="w-4 h-4 text-[#8C6D46]" />
            <label className="text-xs font-bold text-[#3E2C1C]">Date FET simulée :</label>
            <input
              type="date"
              value={transferDateStr}
              onChange={(e) => setTransferDateStr(e.target.value)}
              className="text-xs font-bold text-[#3E2C1C] bg-white border border-[#E8DDD0] px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
            />
          </div>
        </div>

        {milestones && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Delivery banner in Light Brown */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#BA936A] via-[#CAAA85] to-[#D8BE9D] text-[#362212] rounded-2xl p-5 border-2 border-[#A67E55] shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-[#4A2D16] bg-[#FAF5EE]/90 px-2.5 py-1 rounded-full border border-[#BFA07C] w-fit mb-2">
                  <Baby className="w-4 h-4 text-[#8A5F33]" />
                  <span>Date prévisionnelle d'accouchement (Terme 40 SA)</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#2E1B0E] mt-1">
                  {milestones.dueDate}
                </div>
                <p className="text-xs text-[#422B17] mt-2 leading-relaxed font-medium">
                  Calcul médical basé sur le transfert d'un blastocyste de J5 (Blastocyste euploïde masculin #1 - 5AA).
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#BFA07C] text-xs text-[#362212] font-semibold flex items-center justify-between">
                <span>1er test Bêta-hCG estimé :</span>
                <span className="font-bold text-[#2E1B0E] bg-[#FAF5EE] px-2 py-0.5 rounded border border-[#BFA07C]">{milestones.betaDate}</span>
              </div>
            </div>

            {/* Milestones grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8DDD0]">
                <span className="text-[10px] uppercase font-bold text-[#8C6D46] block">Test de grossesse sanguin</span>
                <span className="text-sm font-bold text-[#3E2C1C] block mt-0.5">{milestones.betaDate}</span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">1er dosage Bêta-hCG quantitatif</span>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8DDD0]">
                <span className="text-[10px] uppercase font-bold text-[#8C6D46] block">Échographie cardiaque (6 SA)</span>
                <span className="text-sm font-bold text-[#3E2C1C] block mt-0.5">{milestones.echo6wDate}</span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">1er battement de cœur visible</span>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8DDD0]">
                <span className="text-[10px] uppercase font-bold text-[#8C6D46] block">Graduation PMA (8-10 SA)</span>
                <span className="text-sm font-bold text-[#3E2C1C] block mt-0.5">{milestones.graduationDate}</span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Transfert vers votre obstétricien</span>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8DDD0]">
                <span className="text-[10px] uppercase font-bold text-[#8C6D46] block">Échographie morphologique T2</span>
                <span className="text-sm font-bold text-[#3E2C1C] block mt-0.5">{milestones.morphoDate}</span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Bilan morphologique approfondi</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
