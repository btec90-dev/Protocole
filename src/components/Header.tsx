import React, { useState } from 'react';
import { Download, Smartphone, Printer, Palette, Check, X, Calendar, Camera, Baby, Pill, Stethoscope, Clock, ShieldAlert, Lock } from 'lucide-react';
import { GoldLogo } from './GoldLogo';
import { generateAndDownloadProtocolPDF } from '../utils/pdfGenerator';
import { MilestoneBadge } from './MilestoneBadge';

export type ProtocolThemeMode = 'light-brown' | 'warm-mocha' | 'black-gold' | 'pure-light';

interface HeaderProps {
  onOpenExport: () => void;
  onOpenMobileAPK: () => void;
  onSaveAsPDF?: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  themeMode?: ProtocolThemeMode;
  onChangeThemeMode?: (mode: ProtocolThemeMode) => void;
  onLock?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onOpenMobileAPK,
  onSaveAsPDF,
  activeSection,
  setActiveSection,
  themeMode = 'light-brown',
  onChangeThemeMode,
  onLock
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    // Call reliable jsPDF generator
    const success = generateAndDownloadProtocolPDF();
    setTimeout(() => {
      setIsDownloadingPdf(false);
    }, 800);
    if (onSaveAsPDF && !success) {
      onSaveAsPDF();
    }
  };

  const navLinks = [
    { id: 'countdown', label: 'Compte à rebours', icon: <Clock className="w-4 h-4" /> },
    { id: 'checklist', label: 'Checklist', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'calendrier', label: 'Calendrier', icon: <Calendar className="w-4 h-4" /> },
    { id: 'photos', label: 'Clichés & Documents', icon: <Camera className="w-4 h-4" /> },
    { id: 'embryons', label: 'Embryons (2G / 3F)', icon: <Baby className="w-4 h-4" /> },
    { id: 'medicaments', label: 'Médicaments', icon: <Pill className="w-4 h-4" /> },
    { id: 'consultation', label: 'Consultation', icon: <Stethoscope className="w-4 h-4" /> }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
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

  const getHeaderStyles = () => {
    switch (themeMode) {
      case 'warm-mocha':
        return 'bg-[#3E2C1C]/95 border-b border-[#5C4434] text-[#FAF7F2] shadow-md';
      case 'black-gold':
        return 'bg-black/95 border-b border-[#3E2C1C] text-white shadow-md';
      case 'pure-light':
        return 'bg-white/95 border-b border-[#E8DDD0] text-[#3E2C1C] shadow-xs';
      case 'light-brown':
      default:
        return 'bg-[#EFE5D8]/95 border-b border-[#D8C7B2] text-[#4A321E] shadow-xs';
    }
  };

  const isDarkHeader = themeMode === 'warm-mocha' || themeMode === 'black-gold';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md transition-colors duration-200 ${getHeaderStyles()}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1: Wordmark with Emblem & Personal Accent */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-sm sm:text-base md:text-lg font-bold tracking-tight whitespace-nowrap shrink-0 group"
          >
            <GoldLogo className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-display leading-tight">
                Protocole FIV · <span className="font-serif-italic font-semibold text-[#8C6D46]">Fatou</span>
              </span>
              <span className="text-[10px] font-sans font-medium opacity-70 hidden sm:block">
                Hystéroscopie 28 oct. 06h15 · 5 Embryons normaux
              </span>
            </div>
          </a>

          {/* Zone 2: Desktop Horizontal Navigation */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`whitespace-nowrap transition-colors py-1 ${
                    isActive
                      ? isDarkHeader
                        ? 'text-[#D4AF37] font-extrabold border-b-2 border-[#D4AF37]'
                        : 'text-[#8C6D46] font-extrabold border-b-2 border-[#8C6D46]'
                      : isDarkHeader
                      ? 'text-zinc-300 hover:text-white'
                      : 'text-zinc-700 hover:text-[#8C6D46]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Two-Line Mobile/Desktop Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Theme Mode Picker (Light Brown default) */}
            {onChangeThemeMode && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className={`flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                    isDarkHeader
                      ? 'bg-[#2A1D13] text-[#FAF7F2] border-[#5C4434] hover:bg-[#3E2C1C]'
                      : 'bg-white text-[#3E2C1C] border-[#E8DDD0] hover:bg-[#F5EFEB]'
                  }`}
                  title="Changer la nuance de thème"
                >
                  <Palette className="w-3.5 h-3.5 text-[#8C6D46]" />
                  <span className="hidden md:inline text-[11px] font-medium">Thème</span>
                </button>

                {showThemePicker && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E8DDD0] rounded-xl shadow-2xl p-2 z-50 text-xs text-[#3E2C1C]">
                    <div className="text-[10px] uppercase font-bold text-[#8C6D46] px-2 py-1">
                      Nuances du Protocole
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeThemeMode('light-brown');
                        setShowThemePicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-[#FAF7F2] ${
                        themeMode === 'light-brown' ? 'font-bold bg-[#F5EFEB] text-[#8C6D46]' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border border-[#8C6D46]"></span>
                        <span>Brun Lumineux (Lin & Or)</span>
                      </span>
                      {themeMode === 'light-brown' && <Check className="w-3.5 h-3.5 text-[#8C6D46]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeThemeMode('warm-mocha');
                        setShowThemePicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-[#FAF7F2] ${
                        themeMode === 'warm-mocha' ? 'font-bold bg-[#F5EFEB] text-[#8C6D46]' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#3E2C1C] border border-[#C19A6B]"></span>
                        <span>Moka Chaud & Caramel</span>
                      </span>
                      {themeMode === 'warm-mocha' && <Check className="w-3.5 h-3.5 text-[#8C6D46]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeThemeMode('black-gold');
                        setShowThemePicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-[#FAF7F2] ${
                        themeMode === 'black-gold' ? 'font-bold bg-[#F5EFEB] text-[#8C6D46]' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-black border border-[#D4AF37]"></span>
                        <span>Noir & Or Royal</span>
                      </span>
                      {themeMode === 'black-gold' && <Check className="w-3.5 h-3.5 text-[#8C6D46]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeThemeMode('pure-light');
                        setShowThemePicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-[#FAF7F2] ${
                        themeMode === 'pure-light' ? 'font-bold bg-[#F5EFEB] text-[#8C6D46]' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-white border border-[#D8C8B8]"></span>
                        <span>Blanc Pur & Camel</span>
                      </span>
                      {themeMode === 'pure-light' && <Check className="w-3.5 h-3.5 text-[#8C6D46]" />}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Direct PDF Download Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 shadow-xs bg-[#8C6D46] hover:bg-[#745233] text-white"
              title="Télécharger directement le dossier en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isDownloadingPdf ? 'Génération...' : 'Télécharger PDF'}
              </span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Mobile APK modal trigger */}
            <button
              type="button"
              onClick={onOpenMobileAPK}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                isDarkHeader
                  ? 'bg-[#2A1D13] hover:bg-[#3E2C1C] text-[#FAF7F2] border-[#5C4434]'
                  : 'bg-white hover:bg-[#F5EFEB] text-[#3E2C1C] border-[#E8DDD0]'
              }`}
              title="Installer l'application mobile (APK / PWA)"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span className="hidden lg:inline">App Mobile</span>
            </button>

            {/* Export modal trigger */}
            <button
              type="button"
              onClick={onOpenExport}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                isDarkHeader
                  ? 'bg-[#2A1D13] hover:bg-[#3E2C1C] text-[#FAF7F2] border-[#5C4434]'
                  : 'bg-white hover:bg-[#F5EFEB] text-[#3E2C1C] border-[#E8DDD0]'
              }`}
              title="Exporter l'agenda et le dossier"
            >
              <Download className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span className="hidden lg:inline">Exporter</span>
            </button>

            {/* Privacy Lock button */}
            {onLock && (
              <button
                type="button"
                onClick={onLock}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                  isDarkHeader
                    ? 'bg-[#2A1D13] hover:bg-[#3E2C1C] text-[#FAF7F2] border-[#5C4434]'
                    : 'bg-white hover:bg-[#F5EFEB] text-[#3E2C1C] border-[#E8DDD0]'
                }`}
                title="Verrouiller l'accès privé (Code 8888)"
                aria-label="Verrouiller l'accès privé"
              >
                <Lock className="w-3.5 h-3.5 text-[#8C6D46]" />
                <span className="hidden md:inline text-[11px] font-medium">Verrouiller</span>
              </button>
            )}

            {/* ========================================================= */}
            {/* TWO-LINE MENU ICON (Requested minimalist luxury 2-line menu) */}
            {/* ========================================================= */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
                isDarkHeader
                  ? 'bg-[#2A1D13] border-[#5C4434] text-[#D4AF37] hover:bg-[#3E2C1C]'
                  : 'bg-white border-[#E8DDD0] text-[#3E2C1C] hover:bg-[#F5EFEB]'
              }`}
              aria-label="Ouvrir le menu de navigation"
              title="Menu de navigation"
            >
              <div className={`menu-two-lines ${isMobileMenuOpen ? 'is-active' : ''}`}>
                <span className="line-1"></span>
                <span className="line-2"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE & RESPONSIVE SLIDE-OVER NAVIGATION DRAWER                          */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DDD0] animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-[#E8DDD0] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <GoldLogo className="w-6 h-6" />
                  <span className="font-display font-bold text-sm text-[#3E2C1C]">
                    Navigation Protocole
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-[#3E2C1C] rounded-lg hover:bg-[#FAF7F2]"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Badge Banner in Drawer */}
              <div className="p-3 bg-[#F5EFEB] border-b border-[#E8DDD0]">
                <MilestoneBadge type="immediate" size="sm" className="w-full justify-center" />
                <div className="mt-2 text-center text-[11px] text-[#5C4434]">
                  Patiente : <strong>Fatou</strong> · Phase 2 (Active)
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
                {navLinks.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-[#8C6D46] text-white shadow-xs'
                          : 'text-[#3E2C1C] hover:bg-white hover:text-[#8C6D46]'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-[#8C6D46]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 bg-white border-t border-[#E8DDD0] space-y-2">
              <button
                type="button"
                onClick={() => {
                  handleDownloadPdf();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#8C6D46] hover:bg-[#745233] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Enregistrer en PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenMobileAPK();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#FAF7F2] border border-[#E8DDD0] text-[#3E2C1C] hover:bg-[#F5EFEB] rounded-xl text-xs font-semibold transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#8C6D46]" />
                <span>Installer l'App Mobile (APK)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenExport();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-[#745233] hover:underline text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter l'agenda (.ics)</span>
              </button>

              {onLock && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLock();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-[#8C6D46] hover:bg-[#FAF5EE] rounded-lg text-xs font-semibold border border-[#DBCBB7]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verrouiller l'accès privé</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
