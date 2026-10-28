export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  dateOrWindow: string;
  status: 'done' | 'active' | 'pending';
  category: 'portail' | 'medicament' | 'clinique' | 'laboratoire' | 'consultation' | 'formulaire';
  actionLabel?: string;
  actionType?: 'view_pgta' | 'view_prep' | 'log_med' | 'call_doctor';
  details?: string;
  location?: string;
}

export interface PhaseEvent {
  id: string;
  phaseId: 1 | 2 | 3 | 4;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  category: 'suppression' | 'stimulation' | 'monitoring' | 'trigger' | 'ponction' | 'labo' | 'echo' | 'formulaire' | 'chirurgie' | 'pgta' | 'transfert' | 'bhcg' | 'obstetrique';
  icon: string;
  details?: string;
  location?: string;
  badge?: string;
  userNotes?: string;
}

export interface PhaseInfo {
  id: 1 | 2 | 3 | 4;
  name: string;
  subtitle: string;
  status: 'Terminée' | 'Active' | 'À venir';
  timelineLabel: string;
  highlight: string;
  description: string;
}

export interface Blastocyst {
  id: number;
  embryoNumber: string;
  grade: string;
  day: 'J5' | 'J6';
  sex: 'Male' | 'Female';
  pgtaStatus: 'Euploïde' | 'Aneuploïde';
  isSelectedForFET: boolean;
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  status: 'current' | 'completed' | 'upcoming';
  instructions: string;
  storage: string;
  purpose: string;
}

export interface AttachedPhotoDoc {
  id: string;
  title: string;
  category: 'échographie' | 'laboratoire' | 'ordonnance' | 'compte-rendu';
  date: string;
  dataUrl: string;
  notes?: string;
  fileName?: string;
  fileSize?: string;
}

export interface StepCountdown {
  id: string;
  title: string;
  subtitle: string;
  targetDate: string; // ISO or date string
  icon: string;
  category: string;
}
