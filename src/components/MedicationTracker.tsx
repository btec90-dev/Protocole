import React, { useState } from 'react';
import { Medication } from '../types/protocol';
import { Pill, Clock, CheckCircle2, AlertCircle, Info, CalendarCheck } from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

interface MedicationTrackerProps {
  medications: Medication[];
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({ medications }) => {
  const [filter, setFilter] = useState<'all' | 'current' | 'upcoming' | 'completed'>('current');
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>({
    'med-1': true
  });

  const toggleTaken = (id: string) => {
    setTakenToday(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredMeds = medications.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  return (
    <section id="medicaments" className="py-10 bg-white border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
              <Pill className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Traitement & Pharmacologie</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>Suppression & Préparation FET</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Gestionnaire de médication quotidienne
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Suivi rigoureux des posologies, horaires de prise et consignes de conservation de la pharmacie.
            </p>
          </div>

          {/* Segmented Filter in Light Brown */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] rounded-xl text-xs font-medium border border-[#E8DDD0] self-start md:self-auto">
            <button
              type="button"
              onClick={() => setFilter('current')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'current'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-[#3E2C1C] hover:bg-[#F5EFEB]'
              }`}
            >
              En cours
            </button>
            <button
              type="button"
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'upcoming'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-[#3E2C1C] hover:bg-[#F5EFEB]'
              }`}
            >
              À venir
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'completed'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-[#3E2C1C] hover:bg-[#F5EFEB]'
              }`}
            >
              Terminés
            </button>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-[#8C6D46] text-white font-bold'
                  : 'text-[#3E2C1C] hover:bg-[#F5EFEB]'
              }`}
            >
              Tous
            </button>
          </div>
        </div>

        {/* Medication Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredMeds.map((med) => {
            const isTaken = takenToday[med.id];
            const isCurrent = med.status === 'current';

            return (
              <div
                key={med.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#FAF7F2] border-[#8C6D46] ring-1 ring-[#8C6D46]/40 shadow-xs'
                    : 'bg-white border-[#E8DDD0] hover:border-[#8C6D46]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-[#8C6D46] bg-white px-2 py-0.5 rounded border border-[#E8DDD0]">
                      {med.storage || 'Conservation standard'}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      {med.status === 'current' ? 'Actif' : med.status === 'upcoming' ? 'À venir' : 'Terminé'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#3E2C1C] font-display">
                    {med.name}
                  </h3>

                  <div className="mt-1 flex items-baseline gap-2 text-xs">
                    <span className="font-bold text-[#8C6D46]">{med.dosage}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-zinc-600">{med.timing}</span>
                  </div>

                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    {med.purpose}
                  </p>

                  {med.instructions && (
                    <div className="mt-3 p-2.5 bg-white rounded-lg border border-[#E8DDD0] text-[11px] text-[#3E2C1C] leading-relaxed">
                      <strong className="block text-[#8C6D46] mb-0.5">Instructions :</strong>
                      {med.instructions}
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-4 pt-3 border-t border-[#E8DDD0] flex items-center justify-between">
                  {isCurrent ? (
                    <button
                      type="button"
                      onClick={() => toggleTaken(med.id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isTaken
                          ? 'bg-[#8C6D46] text-white shadow-2xs'
                          : 'bg-white text-[#3E2C1C] border border-[#E8DDD0] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isTaken ? 'Prise validée aujourd’hui' : 'Valider la prise du jour'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-medium italic">
                      {med.status === 'completed' ? 'Traitement clôturé' : 'Démarrage post-opératoire'}
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
