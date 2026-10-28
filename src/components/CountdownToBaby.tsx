import React, { useState, useEffect } from 'react';
import { COUNTDOWN_STEPS } from '../data/protocolData';
import { StepCountdown } from '../types/protocol';
import { Clock, Baby, HeartPulse, Heart, Sparkles, Monitor, Gift, Stethoscope, ChevronRight } from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

export const CountdownToBaby: React.FC = () => {
  const [steps] = useState<StepCountdown[]>(() => {
    const saved = localStorage.getItem('fatou_countdown_steps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return COUNTDOWN_STEPS;
      }
    }
    return COUNTDOWN_STEPS;
  });

  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const diff = target - currentTime;

    if (diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { total: diff, days, hours, minutes, seconds, isPast: false };
  };

  const nextStep = steps[0]; // Immediate next step: Hysteroscopy Oct 28 at 6:15 AM
  const nextTime = nextStep ? getRemainingTime(nextStep.targetDate) : null;
  const finalStep = steps[steps.length - 1]; // Baby birth
  const finalTime = finalStep ? getRemainingTime(finalStep.targetDate) : null;

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-4 h-4 text-[#8C6D46]" />;
      case 'Baby':
        return <Baby className="w-4 h-4 text-[#8C6D46]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-[#8C6D46]" />;
      case 'Heart':
        return <Heart className="w-4 h-4 text-[#8C6D46]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#8C6D46]" />;
      case 'Monitor':
        return <Monitor className="w-4 h-4 text-[#8C6D46]" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-[#8C6D46]" />;
      default:
        return <Clock className="w-4 h-4 text-[#8C6D46]" />;
    }
  };

  const formatDateFr = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section id="countdown" className="py-10 bg-white border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
              <Clock className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Compte à rebours en temps réel</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span className="text-zinc-500 font-normal normal-case">Du premier geste jusqu'à la naissance</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Les étapes restantes vers l'arrivée de bébé
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Suivez l'écoulement des heures et des jours pour chaque étape clé de votre protocole jusqu'au terme.
            </p>
          </div>

          {/* Baby overall days estimated badge in Light Brown */}
          {finalTime && (
            <div className="bg-[#FAF7F2] border border-[#E8DDD0] p-3 rounded-2xl shadow-2xs flex items-center gap-3 self-start md:self-auto">
              <div className="p-2.5 bg-[#8C6D46] rounded-xl text-white">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#745233] font-bold uppercase tracking-wider block">
                  Temps estimé jusqu'à l'accouchement
                </span>
                <span className="text-base sm:text-lg font-black text-[#3E2C1C] tabular-nums font-display">
                  ~{finalTime.days} jours restants
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live dynamic ticker for NEXT IMMEDIATE CRITICAL STEP in Light Brown */}
        {nextStep && nextTime && (
          <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-[#BA936A] via-[#CAAA85] to-[#DCC3A5] text-[#362212] rounded-2xl border-2 border-[#A67E55] shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#8A5F33] animate-ping" />
                  <span className="uppercase-eyebrow text-[10px] font-black tracking-wider text-[#4A2D16] bg-[#FAF5EE]/90 px-2.5 py-0.5 rounded-full border border-[#BFA07C]">
                    Prochaine étape immédiate
                  </span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span className="text-xs font-bold text-[#362212]">
                    mer. 28 oct. 2026, 06:15
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-[#2E1B0E] font-display leading-tight">
                  {nextStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A321E] font-medium">
                  Chemin critique immédiat · Centre ambulatoire Gramercy
                </p>
              </div>

              {/* Live dynamic timer boxes in light brown */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 text-center shrink-0">
                <div className="bg-[#FAF5EE] border-2 border-[#BFA07C] px-2.5 sm:px-3.5 py-2 rounded-xl min-w-14 sm:min-w-18 shadow-xs">
                  <span className="text-xl sm:text-2xl font-black text-[#362212] tabular-nums block font-mono">
                    {nextTime.days}
                  </span>
                  <span className="text-[9px] font-bold text-[#8A5F33] uppercase">Jours</span>
                </div>

                <span className="text-[#8A5F33] font-bold text-lg">:</span>

                <div className="bg-[#FAF5EE] border-2 border-[#BFA07C] px-2.5 sm:px-3.5 py-2 rounded-xl min-w-14 sm:min-w-18 shadow-xs">
                  <span className="text-xl sm:text-2xl font-black text-[#362212] tabular-nums block font-mono">
                    {String(nextTime.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-bold text-[#8A5F33] uppercase">Heures</span>
                </div>

                <span className="text-[#8A5F33] font-bold text-lg">:</span>

                <div className="bg-[#FAF5EE] border-2 border-[#BFA07C] px-2.5 sm:px-3.5 py-2 rounded-xl min-w-14 sm:min-w-18 shadow-xs">
                  <span className="text-xl sm:text-2xl font-black text-[#362212] tabular-nums block font-mono">
                    {String(nextTime.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-bold text-[#8A5F33] uppercase">Min</span>
                </div>

                <span className="text-[#8A5F33] font-bold text-lg">:</span>

                <div className="bg-[#FAF5EE] border-2 border-[#BFA07C] px-2.5 sm:px-3.5 py-2 rounded-xl min-w-14 sm:min-w-18 shadow-xs">
                  <span className="text-xl sm:text-2xl font-black text-[#362212] tabular-nums block font-mono">
                    {String(nextTime.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-bold text-[#8A5F33] uppercase">Sec</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Countdown Grid for ALL Remaining Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {steps.map((step, index) => {
            const time = getRemainingTime(step.targetDate);
            const isImmediate = index === 0;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isImmediate
                    ? 'bg-[#FAF7F2] border-[#8C6D46] ring-1 ring-[#8C6D46]/40 shadow-xs'
                    : 'bg-white border-[#E8DDD0] hover:border-[#8C6D46] hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                    <span className="font-bold text-[#8C6D46] uppercase-eyebrow text-[10px]">
                      Étape #{index + 1} · {step.category}
                    </span>
                    <span className="font-semibold text-zinc-600">
                      {new Date(step.targetDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 mt-1">
                    <div className="p-2 bg-[#FAF7F2] rounded-lg shrink-0 border border-[#E8DDD0]">
                      {getStepIcon(step.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3E2C1C] font-display">
                        {step.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Countdown pill in Light Brown */}
                <div className="mt-3.5 pt-2.5 border-t border-[#E8DDD0] flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Temps restant :</span>
                  <span className={`text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md ${
                    isImmediate
                      ? 'bg-[#8C6D46] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] text-[#3E2C1C] border border-[#E8DDD0]'
                  }`}>
                    {time.days > 0 ? `J-${time.days} (${time.hours}h)` : `${time.hours}h ${time.minutes}m ${time.seconds}s`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
