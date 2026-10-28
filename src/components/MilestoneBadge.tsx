import React from 'react';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert, Sparkles, Heart, Stethoscope, Baby } from 'lucide-react';

export type MilestoneType = 
  | 'critical' 
  | 'immediate' 
  | 'surgery' 
  | 'pgta' 
  | 'embryo' 
  | 'fet' 
  | 'completed'
  | 'preop';

interface MilestoneBadgeProps {
  type: MilestoneType;
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MilestoneBadge: React.FC<MilestoneBadgeProps> = ({
  type,
  label,
  sublabel,
  size = 'md',
  className = ''
}) => {
  const getConfig = () => {
    switch (type) {
      case 'critical':
        return {
          defaultLabel: 'Chemin Critique Immédiat',
          icon: <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#8C6239]" />,
          classes: 'bg-[#EBDDCB] text-[#4A321E] border border-[#CCA77E] shadow-2xs font-bold'
        };
      case 'immediate':
        return {
          defaultLabel: 'J-0 · Mercredi 28 Oct. 06h15',
          icon: <Clock className="w-3.5 h-3.5 shrink-0 text-[#8C6239]" />,
          classes: 'bg-[#F2E5D4] text-[#422C19] border border-[#D1B18C] shadow-2xs font-extrabold'
        };
      case 'surgery':
        return {
          defaultLabel: 'Hystéroscopie (Debris Removal)',
          icon: <Stethoscope className="w-3.5 h-3.5 shrink-0 text-white" />,
          classes: 'bg-[#B58E65] text-white border border-[#9A744C]'
        };
      case 'pgta':
        return {
          defaultLabel: 'PGT-A : 5 Normaux (2G / 3F)',
          icon: <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#9E774E]" />,
          classes: 'bg-[#F7EFE4] text-[#543821] border border-[#D9C4AB] font-semibold'
        };
      case 'embryo':
        return {
          defaultLabel: 'Garçon Sélectionné (5AA)',
          icon: <Baby className="w-3.5 h-3.5 shrink-0 text-[#9E774E]" />,
          classes: 'bg-[#EFE2D2] text-[#4A321E] border border-[#CCA77E]'
        };
      case 'fet':
        return {
          defaultLabel: 'Transfert FET en Préparation',
          icon: <Heart className="w-3.5 h-3.5 shrink-0 text-[#9E774E]" />,
          classes: 'bg-[#FBF7F0] text-[#543821] border border-[#E3D3C0]'
        };
      case 'preop':
        return {
          defaultLabel: 'À Jeun Strict dès Minuit',
          icon: <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#9C5D28]" />,
          classes: 'bg-[#FBEEDC] text-[#693B14] border border-[#E5C19A]'
        };
      case 'completed':
      default:
        return {
          defaultLabel: 'Jalon Validé',
          icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#8C6239]" />,
          classes: 'bg-[#F4ECE0] text-[#543821] border border-[#DCCBB8]'
        };
    }
  };

  const config = getConfig();
  const text = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2 font-bold'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-lg font-bold tracking-tight uppercase-eyebrow transition-all ${sizeClasses} ${config.classes} ${className}`}
    >
      {config.icon}
      <span>{text}</span>
      {sublabel && (
        <span className="opacity-80 font-normal lowercase tracking-normal pl-1 border-l border-current/30">
          {sublabel}
        </span>
      )}
    </span>
  );
};
