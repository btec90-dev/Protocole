import { jsPDF } from 'jspdf';
import { PATIENT_NAME, ALL_EVENTS, MEDICATIONS } from '../data/protocolData';

export function generateAndDownloadProtocolPDF(): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    // Header banner with sophisticated brown (#3E2C1C) and gold border
    doc.setFillColor(62, 44, 28); // #3E2C1C
    doc.rect(margin, y, contentWidth, 24, 'F');

    // Gold accent line
    doc.setFillColor(212, 175, 55); // #D4AF37
    doc.rect(margin, y + 23.2, contentWidth, 0.8, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`PROTOCOLE DE FERTILITE & FIV - ${PATIENT_NAME.toUpperCase()}`, margin + 6, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(244, 238, 220);
    doc.text(`Dossier Personnel Sécurisé · Édité le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin + 6, y + 17);

    y += 32;

    // SECTION 1: PROCHAINE ETAPE CRITIQUE IMMEDIATE (Spotlight Box)
    doc.setFillColor(248, 244, 238); // warm cream
    doc.setDrawColor(140, 109, 70); // brown border
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

    doc.setFillColor(140, 109, 70);
    doc.rect(margin, y, 3, 34, 'F'); // Left accent strip

    doc.setTextColor(62, 44, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text("CHEMIN CRITIQUE IMMEDIAT : HYSTEROSCOPIE (DEBRIS REMOVAL)", margin + 7, y + 7);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(193, 154, 107);
    doc.text("Date & Heure : Mercredi 28 octobre 2026 a 06h15  (Arrivee requise : 05h45)", margin + 7, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text("Lieu : Centre chirurgical ambulatoire", margin + 7, y + 18);
    doc.text("Consignes : A JEUN STRICT des minuit (aucun liquide ni solide). Accompagnateur adulte obligatoire.", margin + 7, y + 23);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.text("* La date definitive du transfert (FET) sera fixee lors de la consultation post-hysteroscopie.", margin + 7, y + 29);

    y += 40;

    // SECTION 2: BILAN EMBRYOLOGIE & RESULTATS PGT-A
    doc.setTextColor(62, 44, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("1. RESULTATS EMBRYOLOGIE & GENETIQUE (PGT-A)", margin, y);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 1.5, margin + 85, y + 1.5);

    y += 7;

    // Stat cards row
    const statBoxWidth = (contentWidth - 6) / 4;
    const stats = [
      { label: "Ovocytes", val: "42", sub: "Ponction 01 oct." },
      { label: "Fécondés ICSI", val: "11", sub: "Sur 34 MII" },
      { label: "Blastocystes", val: "8", sub: "Vitrifiés J5/J6" },
      { label: "PGT-A Normaux", val: "5", sub: "2 Garçons · 3 Filles" }
    ];

    stats.forEach((st, i) => {
      const bx = margin + i * (statBoxWidth + 2);
      doc.setFillColor(252, 250, 246);
      doc.setDrawColor(216, 200, 184);
      doc.roundedRect(bx, y, statBoxWidth, 16, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(110, 100, 90);
      doc.text(st.label, bx + 3, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(62, 44, 28);
      doc.text(st.val, bx + 3, y + 10.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(140, 109, 70);
      doc.text(st.sub, bx + 3, y + 14);
    });

    y += 22;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(62, 44, 28);
    doc.text("Plan de décongélation validé :", margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text("Garçon sélectionné prioritairement (Blastocyste euploïde #1 - Score 5AA).", margin + 50, y);

    y += 9;

    // SECTION 3: CALENDRIER DES 4 PHASES
    doc.setTextColor(62, 44, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("2. CHRONOLOGIE DES ETAPES CLES DU PROTOCOLE", margin, y);
    doc.line(margin, y + 1.5, margin + 90, y + 1.5);

    y += 6;

    const timelineData = [
      { date: "01 oct. 2026", step: "Ponction ovocytaire : 42 ovocytes prélevés sous sédation", status: "Terminé" },
      { date: "02 oct. 2026", step: "Fécondation ICSI : 34 matures MII -> 11 zygotes fécondés", status: "Terminé" },
      { date: "09 oct. 2026", step: "Vitrification : 8 blastocystes biopsiés pour analyse PGT-A", status: "Terminé" },
      { date: "15 oct. 2026", step: "Hystérosonographie par perfusion de sérum (SIS)", status: "Terminé" },
      { date: "25 oct. 2026", step: "Résultats PGT-A reçus : 5 embryons normaux euploïdes", status: "Terminé" },
      { date: "28 oct. 2026 (06:15)", step: "Hystéroscopie (Debris Removal) au centre chirurgical", status: "IMMEDIAT" },
      { date: "Fin oct. / Nov.", step: "Appel de protocole FET & Début préparation endométriale", status: "Actif" },
      { date: "Novembre 2026", step: "Transfert d'embryon congelé (FET - 1 blastocyste masculin)", status: "Prévu" },
      { date: "J+9 à J+14 FET", step: "Dosage quantitatif Bêta-hCG sanguin (test d'implantation)", status: "À venir" },
      { date: "Semaines 6-8", step: "Échographies de viabilité précoce et battement cardiaque", status: "À venir" }
    ];

    timelineData.forEach((row, idx) => {
      const isCritical = row.status === 'IMMEDIAT';
      const rowY = y + idx * 7.5;

      if (isCritical) {
        doc.setFillColor(245, 235, 224);
        doc.rect(margin, rowY - 3.8, contentWidth, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(140, 109, 70);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
      }

      doc.setFontSize(8);
      doc.text(row.date, margin + 2, rowY);
      doc.text(row.step, margin + 45, rowY);

      doc.setFont('helvetica', isCritical ? 'bold' : 'normal');
      doc.text(row.status, margin + contentWidth - 20, rowY);
    });

    y += timelineData.length * 7.5 + 4;

    // SECTION 4: MEDICATIONS ET RECOMMANDATIONS
    doc.setTextColor(62, 44, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("3. MEDICATIONS & CONSIGNES EN COURS", margin, y);
    doc.line(margin, y + 1.5, margin + 78, y + 1.5);

    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text("• Nortrel (1 comprimé/jour) : Poursuite de la suppression ovarienne selon prescription médicale.", margin + 2, y);
    y += 5;
    doc.text("• Protocole Estrogènes / Progestérone : Démarrage post-opératoire selon consignes de l'équipe FIV.", margin + 2, y);
    y += 5;
    doc.text("• Documents à apporter : Pièce d'identité, dossier médical FIV et résultats d'analyses sanguines.", margin + 2, y);

    // Footer signature
    y = 282;
    doc.setDrawColor(220, 210, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 109, 70);
    doc.text("Document médical personnel généré automatiquement depuis le Portail Protocole FIV Fatou.", margin, y + 4.5);
    doc.text("Page 1 / 1", margin + contentWidth - 15, y + 4.5);

    // Save PDF directly to user download folder
    const filename = `Protocole_FIV_Fatou_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
    return true;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    // Fallback to window.print if jsPDF fails
    window.print();
    return false;
  }
}
