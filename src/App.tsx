import React, { useState, useEffect } from 'react';
import { Header, ProtocolThemeMode } from './components/Header';
import { HeroOverview } from './components/HeroOverview';
import { ImmediateChecklist } from './components/ImmediateChecklist';
import { CountdownToBaby } from './components/CountdownToBaby';
import { InteractiveMainCalendar } from './components/InteractiveMainCalendar';
import { PhotoDocumentManager } from './components/PhotoDocumentManager';
import { EmbryoLabSection } from './components/EmbryoLabSection';
import { PhasesTimeline } from './components/PhasesTimeline';
import { MedicationTracker } from './components/MedicationTracker';
import { DoctorQuestionsPrep } from './components/DoctorQuestionsPrep';
import { FETDueCalculator } from './components/FETDueCalculator';
import { ExportSummaryModal } from './components/ExportSummaryModal';
import { MobileAPKDownloadModal } from './components/MobileAPKDownloadModal';
import { GoldLogo } from './components/GoldLogo';
import { generateAndDownloadProtocolPDF } from './utils/pdfGenerator';
import { PinProtectionGate } from './components/PinProtectionGate';

import {
  IMMEDIATE_CHECKLIST,
  ALL_EVENTS,
  PHASES_INFO,
  INITIAL_BLASTOCYSTS,
  MEDICATIONS,
  PATIENT_NAME
} from './data/protocolData';
import { ChecklistItem, Blastocyst, PhaseEvent } from './types/protocol';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('fatou_protocol_pin_unlocked') === 'true';
  });

  const [themeMode, setThemeMode] = useState<ProtocolThemeMode>(() => {
    const saved = localStorage.getItem('fatou_fiv_protocol_theme');
    return (saved as ProtocolThemeMode) || 'light-brown';
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('fatou_fiv_checklist_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return IMMEDIATE_CHECKLIST.map(baseItem => {
          const matched = parsed.find((p: ChecklistItem) => p.id === baseItem.id);
          return matched ? { ...baseItem, status: matched.status } : baseItem;
        });
      } catch (e) {
        return IMMEDIATE_CHECKLIST;
      }
    }
    return IMMEDIATE_CHECKLIST;
  });

  const [blastocysts, setBlastocysts] = useState<Blastocyst[]>(() => {
    const saved = localStorage.getItem('fatou_fiv_blastocysts_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_BLASTOCYSTS.map(baseB => {
          const matched = parsed.find((p: Blastocyst) => p.id === baseB.id);
          return matched ? { ...baseB, isSelectedForFET: matched.isSelectedForFET } : baseB;
        });
      } catch (e) {
        return INITIAL_BLASTOCYSTS;
      }
    }
    return INITIAL_BLASTOCYSTS;
  });

  const [events] = useState<PhaseEvent[]>(ALL_EVENTS);
  const [activeSection, setActiveSection] = useState('countdown');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMobileAPKOpen, setIsMobileAPKOpen] = useState(false);

  // Persist Light Brown theme
  useEffect(() => {
    localStorage.setItem('fatou_fiv_protocol_theme', themeMode);
  }, [themeMode]);

  // Persist checklist
  useEffect(() => {
    localStorage.setItem('fatou_fiv_checklist_v4', JSON.stringify(checklist));
  }, [checklist]);

  // Persist blastocysts
  useEffect(() => {
    localStorage.setItem('fatou_fiv_blastocysts_v4', JSON.stringify(blastocysts));
  }, [blastocysts]);

  const handleToggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'done' ? 'active' : 'done' }
          : item
      )
    );
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 68;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSelectEmbryoForFET = (id: number) => {
    setBlastocysts((prev) =>
      prev.map((b) => ({
        ...b,
        isSelectedForFET: b.id === id
      }))
    );
  };

  // Direct Save as PDF handler
  const handleSaveAsPDF = () => {
    generateAndDownloadProtocolPDF();
  };

  // Synchronisation handlers: Export & Import data JSON
  const handleExportData = () => {
    const syncData = {
      patient: PATIENT_NAME,
      exportedAt: new Date().toISOString(),
      checklist,
      blastocysts
    };
    const blob = new Blob([JSON.stringify(syncData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fatou-fiv-donnees-synchro-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.checklist) {
          setChecklist(data.checklist);
        }
        if (data.blastocysts) {
          setBlastocysts(data.blastocysts);
        }
        alert('Synchronisation réussie ! Vos données ont été importées avec succès.');
      } catch (err) {
        alert('Erreur lors de la lecture du fichier de synchronisation.');
      }
    };
    reader.readAsText(file);
  };

  const getPageBgClass = () => {
    switch (themeMode) {
      case 'warm-mocha':
        return 'bg-[#F2E8DC] text-[#4A3320]';
      case 'black-gold':
        return 'bg-zinc-50 text-zinc-900';
      case 'pure-light':
        return 'bg-white text-[#4A3320]';
      case 'light-brown':
      default:
        return 'bg-[#F8F4EE] text-[#4A3320]';
    }
  };

  const getFooterBgClass = () => {
    switch (themeMode) {
      case 'warm-mocha':
        return 'bg-[#EBDDCB] border-t border-[#D5C2AB] text-[#4A3320]';
      case 'black-gold':
        return 'bg-black border-t border-[#3E2C1C] text-white';
      case 'pure-light':
        return 'bg-white border-t border-[#E8DDD0] text-[#4A3320]';
      case 'light-brown':
      default:
        return 'bg-[#F1E7DA] border-t border-[#DECDBD] text-[#4A3320]';
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('fatou_protocol_pin_unlocked', 'true');
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('fatou_protocol_pin_unlocked');
  };

  if (!isUnlocked) {
    return <PinProtectionGate onUnlock={handleUnlock} correctPin="8888" />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getPageBgClass()}`}>
      {/* Header in Light Brown Theme with Two-Line Menu & Direct PDF export */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onOpenMobileAPK={() => setIsMobileAPKOpen(true)}
        onSaveAsPDF={handleSaveAsPDF}
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        themeMode={themeMode}
        onChangeThemeMode={setThemeMode}
        onLock={handleLock}
      />

      <main className="flex-1 pt-15 sm:pt-16">
        {/* Hero & Clinical Overview in Light Brown */}
        <HeroOverview
          onJumpToChecklist={() => scrollToSection('checklist')}
          onOpenEmbryoModal={() => scrollToSection('embryons')}
          onOpenDoctorPrep={() => scrollToSection('consultation')}
          onOpenMobileAPK={() => setIsMobileAPKOpen(true)}
          onJumpToCalendar={() => scrollToSection('calendrier')}
          onJumpToPhotos={() => scrollToSection('photos')}
        />

        {/* 1. Real-Time Countdown to Baby (Positioned at TOP of home screen) */}
        <CountdownToBaby />

        {/* 2. Immediate Execution Checklist with Inline Details (No footer jumps) */}
        <ImmediateChecklist
          items={checklist}
          onToggleItem={handleToggleChecklistItem}
          onOpenEmbryos={() => scrollToSection('embryons')}
          onOpenDoctorPrep={() => scrollToSection('consultation')}
          onLogMedication={() => scrollToSection('medicaments')}
        />

        {/* 3. Interactive Clickable Main Calendar with Responsive Scaled Typography & Inline Sticky Details */}
        <InteractiveMainCalendar />

        {/* 4. Photo & Document Attachment Manager for Ultrasound Scans & Reports */}
        <PhotoDocumentManager />

        {/* 5. Embryology & PGT-A Lab Results (5 Normaux : 2 Garçons & 3 Filles) */}
        <EmbryoLabSection
          blastocysts={blastocysts}
          onSelectEmbryoForFET={handleSelectEmbryoForFET}
        />

        {/* 6. Complete 4-Phase Calendar Timeline */}
        <PhasesTimeline
          events={events}
          phasesInfo={PHASES_INFO}
        />

        {/* 7. Medication & Treatment Tracker */}
        <MedicationTracker
          medications={MEDICATIONS}
        />

        {/* 8. Doctor Consultation Preparation */}
        <DoctorQuestionsPrep />

        {/* 9. Post-FET Milestones & Due Date Projection */}
        <FETDueCalculator />
      </main>

      {/* Export / Print / Calendar Modal */}
      <ExportSummaryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Mobile APK Download & Synchronization Modal */}
      <MobileAPKDownloadModal
        isOpen={isMobileAPKOpen}
        onClose={() => setIsMobileAPKOpen(false)}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Footer in Light Brown Theme */}
      <footer className={`${getFooterBgClass()} py-8 text-xs transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <GoldLogo className="w-5 h-5" withSparkle={false} />
            <span className="font-bold text-[#3E2C1C]">
              Protocole FIV · <span className="font-serif-italic font-bold text-[#8C6D46]">{PATIENT_NAME}</span>
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="text-[#8C6D46] font-medium">Espace Sécurisé Personnel</span>
          </div>

          <div className="flex items-center gap-4 text-[#5C4434]">
            <button
              type="button"
              onClick={handleSaveAsPDF}
              className="hover:underline font-bold text-[#8C6D46] transition-colors"
            >
              Enregistrer en PDF
            </button>
            <span aria-hidden="true" className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => setIsMobileAPKOpen(true)}
              className="hover:underline font-semibold transition-colors"
            >
              Application Mobile (APK)
            </button>
            <span aria-hidden="true" className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="hover:underline font-semibold transition-colors"
            >
              Exporter Agenda (.ics)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
