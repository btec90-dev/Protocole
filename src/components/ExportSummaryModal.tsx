import React, { useState } from 'react';
import { Download, Printer, X, Calendar, CheckCircle2 } from 'lucide-react';
import { PATIENT_NAME, ALL_EVENTS, MEDICATIONS } from '../data/protocolData';
import { GoldLogo } from './GoldLogo';
import { generateAndDownloadProtocolPDF } from '../utils/pdfGenerator';
import { MilestoneBadge } from './MilestoneBadge';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadICS = () => {
    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FIV Protocole//Fatou//FR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    const upcomingEvents = [
      {
        title: "Hystéroscopie (Debris Removal) - Centre Ambulatoire",
        desc: "Intervention à 06h15 précises. À jeun strict depuis minuit. Accompagnateur obligatoire pour le retour.",
        dtstart: "20261028T101500Z",
        dtend: "20261028T123000Z",
        loc: "Centre chirurgical ambulatoire"
      },
      {
        title: "Appel de Protocole FET - Fixation de la date de transfert",
        desc: "Validation post-opératoire de la muqueuse et fixation de la date du transfert d'embryon congelé (FET).",
        dtstart: "20261029T140000Z",
        dtend: "20261029T143000Z",
        loc: "Consultation"
      },
      {
        title: "Dosage sanguin Bêta-hCG (1er contrôle post-FET)",
        desc: "Dosage quantitatif d'implantation post-FET.",
        dtstart: "20261114T120000Z",
        dtend: "20261114T123000Z",
        loc: "Laboratoire d'analyses"
      }
    ];

    upcomingEvents.forEach((ev, idx) => {
      icsContent.push(
        "BEGIN:VEVENT",
        `UID:fiv-fatou-${idx}-${Date.now()}@protocol.patient.com`,
        `SUMMARY:${ev.title}`,
        `DESCRIPTION:${ev.desc}`,
        `LOCATION:${ev.loc}`,
        `DTSTART:${ev.dtstart}`,
        `DTEND:${ev.dtend}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "protocole-fiv-fatou-rendezvous.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const success = generateAndDownloadProtocolPDF();
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8DDD0] animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header with Emblem */}
        <div className="p-4 sm:p-5 border-b border-[#E8DDD0] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <GoldLogo className="w-7 h-7 sm:w-8 sm:h-8" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#3E2C1C] font-display">
                Exporter le dossier & Télécharger en PDF
              </h3>
              <p className="text-xs text-zinc-500">
                Protocole de Fertilité · <span className="font-serif-italic font-bold text-[#8C6D46]">{PATIENT_NAME}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-[#3E2C1C] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body in Light Brown */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#3E2C1C]">
          {/* Quick sync options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="p-4 bg-[#FAF7F2] border border-[#E8DDD0] hover:border-[#8C6D46] rounded-xl text-left transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              <div>
                <Printer className="w-5 h-5 text-[#8C6D46] mb-2" />
                <h4 className="font-bold text-[#3E2C1C] text-sm group-hover:text-[#8C6D46] transition-colors">
                  Télécharger le Dossier en PDF
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Génère et télécharge immédiatement le fichier PDF complet avec toutes les étapes clés du protocole.
                </p>
              </div>
              <span className="mt-3 text-xs font-bold text-[#8C6D46] flex items-center gap-1">
                {downloadSuccess ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Téléchargement réussi !
                  </span>
                ) : (
                  <>
                    <Printer className="w-3.5 h-3.5" /> Télécharger .PDF
                  </>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadICS}
              className="p-4 bg-[#FAF7F2] border border-[#E8DDD0] hover:border-[#8C6D46] rounded-xl text-left transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              <div>
                <Calendar className="w-5 h-5 text-[#8C6D46] mb-2" />
                <h4 className="font-bold text-[#3E2C1C] text-sm group-hover:text-[#8C6D46] transition-colors">
                  Synchroniser l'agenda (.ics)
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Ajoute l'hystéroscopie du 28 oct. à 06h15 et les prochains jalons dans votre calendrier smartphone ou ordinateur.
                </p>
              </div>
              <span className="mt-3 text-xs font-bold text-[#8C6D46] flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Télécharger .ics
              </span>
            </button>
          </div>

          {/* Printable Preview Section in Light Brown */}
          <div className="border border-[#E8DDD0] rounded-xl p-4 sm:p-5 bg-[#FAF7F2] text-xs space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E8DDD0]">
              <div>
                <span className="font-bold text-xs sm:text-sm text-[#3E2C1C]">SYNTHÈSE DE PROTOCOLE FIV & TRANSFERT (FET)</span>
                <p className="text-zinc-500">Patiente : {PATIENT_NAME}</p>
              </div>
              <MilestoneBadge type="immediate" size="sm" />
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#8C6D46] block uppercase tracking-wider text-[11px]">
                1. Résultats PGT-A & Statut Utérin
              </span>
              <p className="text-zinc-700 leading-relaxed text-xs">
                • <strong>Résultats PGT-A reçus le 25 octobre :</strong> 5 embryons normaux euploïdes (2 garçons et 3 filles).<br />
                • <strong>Plan de décongélation :</strong> Garçon (Male) sélectionné (Blastocyste #1 - 5AA prioritaire).<br />
                • <strong>28 octobre à 06h15 :</strong> Hystéroscopie (Debris Removal) au centre chirurgical ambulatoire.<br />
                • <strong>Date FET :</strong> Fixée après l'évaluation post-opératoire de l'hystéroscopie.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#E8DDD0]">
              <span className="font-bold text-[#8C6D46] block uppercase tracking-wider text-[11px]">
                2. Rendement de laboratoire
              </span>
              <p className="text-zinc-700 leading-relaxed text-xs">
                42 ovocytes prélevés ➔ 34 matures MII ➔ 11 fécondés par ICSI ➔ 8 blastocystes vitrifiés ➔ <strong>5 normaux euploïdes (2 Garçons, 3 Filles)</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E8DDD0] flex justify-end bg-[#FAF7F2]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#5C4434] bg-white border border-[#E8DDD0] hover:bg-[#F5EFEB] rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
