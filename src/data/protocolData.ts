import { ChecklistItem, PhaseEvent, PhaseInfo, Blastocyst, Medication, StepCountdown } from '../types/protocol';

export const PATIENT_NAME = "Fatou";

export const PHASES_INFO: PhaseInfo[] = [
  {
    id: 1,
    name: "Phase 1 : Stimulation & Ponction",
    subtitle: "Suppression, stimulation ovarienne et prélèvement d'ovocytes",
    status: "Terminée",
    timelineLabel: "19 sept. — 01 oct.",
    highlight: "42 ovocytes prélevés (Résultat exceptionnel)",
    description: "Phase de stimulation ovarienne contrôlée avec Gonal-F, Menopur et Cetrotide, culminant par le déclenchement horaire strict et la ponction ovocytaire."
  },
  {
    id: 2,
    name: "Phase 2 : Embryologie & Préparation FET",
    subtitle: "Résultats PGT-A (5 normaux : 2 garçons, 3 filles), hystéroscopie et FET",
    status: "Active",
    timelineLabel: "02 oct. — Début nov.",
    highlight: "5 embryons normaux euploïdes (2 garçons, 3 filles) · Hystéroscopie le 28 oct. à 06h15",
    description: "Analyse génétique PGT-A validée le 25 oct. (5 normaux : 2 garçons et 3 filles). Hystéroscopie (Debris Removal) le 28 oct. à 06h15. Le transfert FET sera daté après cette intervention."
  },
  {
    id: 3,
    name: "Phase 3 : Suivi de début de grossesse",
    subtitle: "Dosages Bêta-hCG sériés, échographies précoces & transition obstétricale",
    status: "À venir",
    timelineLabel: "08 nov. — Décembre (Semaines 4 à 10)",
    highlight: "Confirmation de nidation et surveillance cardiaque fœtale",
    description: "Vérification biologique de l'implantation par dosages sanguins hCG rapprochés, premières échographies de viabilité et passage vers le suivi obstétrical."
  },
  {
    id: 4,
    name: "Phase 4 : Étapes obstétricales à terme",
    subtitle: "Suivi prénatal complet, dépistages, échographies T1/T2/T3 et accouchement",
    status: "À venir",
    timelineLabel: "Semaines 06 à 41 de grossesse",
    highlight: "Développement de bébé et accueil du nouveau-né",
    description: "Parcours obstétrical complet : DPNI, échographie morphologique de niveau II, suivi de croissance fœtale et accouchement."
  }
];

export const IMMEDIATE_CHECKLIST: ChecklistItem[] = [
  {
    id: "check-hysteroscopy-28",
    title: "CHEMIN CRITIQUE : Hystéroscopie (Debris Removal) — 28 oct. à 06h15",
    description: "Prochaine étape du chemin critique : Se présenter au centre chirurgical ambulatoire le mercredi 28 oct. à 06h15 précises pour l'intervention d'ablation de débris. La date du transfert FET en dépend directement.",
    dateOrWindow: "28 oct. à 06h15 (PROCHAINE ÉTAPE DU CHEMIN CRITIQUE)",
    status: "active",
    category: "clinique",
    actionLabel: "Voir consignes préopératoires",
    actionType: "view_prep",
    location: "Centre chirurgical ambulatoire",
    details: "PROCHAINE ÉTAPE DU CHEMIN CRITIQUE : Intervention déterminante le 28 oct. à 06h15. Le transfert d'embryon congelé (FET) ne peut être programmé qu'après cette ablation de débris et la validation de la muqueuse utérine. Consignes : strict jeûne depuis minuit (ni eau ni nourriture), arrivée sur place à 05h45, accompagnée d'un adulte pour la sortie."
  },
  {
    id: "check-pgta-25",
    title: "Résultats PGT-A reçus le 25 oct. ➔ 5 embryons normaux (2 garçons, 3 filles)",
    description: "Analyse génétique officielle reçue le 25 octobre : 5 blastocystes normaux euploïdes sur les 8 biopsiés (2 garçons et 3 filles). Taux de réussite exceptionnel !",
    dateOrWindow: "25 oct. (REÇU & VALIDÉ)",
    status: "done",
    category: "laboratoire",
    actionLabel: "Consulter les 5 embryons normaux",
    actionType: "view_pgta",
    details: "Sur 8 blastocystes biopsiés, 5 sont génétiquement sains et normaux (46 chromosomes) : 2 garçons et 3 filles. Le blastocyste masculin de grade 5AA est assigné en priorité #1 pour le transfert."
  },
  {
    id: "check-thawing-13",
    title: "Plan de décongélation terminé (13 oct.)",
    description: "Soumis via le portail avec une préférence pour un garçon (Male). Le laboratoire sélectionnera le blastocyste euploïde masculin de la plus haute qualité (5AA) pour le transfert.",
    dateOrWindow: "13 oct. (Soumis & Confirmé)",
    status: "done",
    category: "formulaire",
    actionLabel: "Accusé de réception portail",
    actionType: "view_prep",
    details: "Formulaire enregistré auprès du laboratoire. Le blastocyste masculin euploïde #1 (5AA) sera décongelé en priorité dès que l'utérus sera validé post-hystéroscopie."
  },
  {
    id: "check-med-daily",
    title: "Maintien de la médication quotidienne",
    description: "Continuer la suppression ovarienne quotidienne par Nortrel comme prescrit et début du protocole d'estrogènes pour la préparation endométriale.",
    dateOrWindow: "Quotidien (En cours)",
    status: "active",
    category: "medicament",
    actionLabel: "Consigner la prise du jour",
    actionType: "log_med",
    details: "Continuer Nortrel quotidiennement à heure fixe et préparer le protocole d'estrogènes (voie orale/patchs) selon les instructions médicales."
  },
  {
    id: "check-fet-timing",
    title: "Fixation de la date du FET (Transfert d'embryon congelé)",
    description: "Pas de date fixée jusqu'à après l'hystéroscopie (Debris Removal) du 28 octobre à 06h15. L'appel de protocole confirmera la date finale.",
    dateOrWindow: "Après l'hystéroscopie du 28 oct.",
    status: "pending",
    category: "consultation",
    actionLabel: "Préparer l'appel de protocole",
    actionType: "call_doctor",
    details: "Règle stricte du protocole : aucune date définitive de FET ne sera arrêtée avant l'évaluation de la muqueuse utérine lors de l'hystéroscopie de débris du 28 oct. à 06h15."
  }
];

export const ALL_EVENTS: PhaseEvent[] = [
  // Phase 1 : Stimulation et ponction (Terminée)
  {
    id: "p1-1",
    phaseId: 1,
    date: "19 sept.",
    title: "Début de la suppression ovarienne",
    description: "Début du Nortrel quotidien pour mettre au repos les ovaires et synchroniser la cohorte folliculaire.",
    status: "completed",
    category: "suppression",
    icon: "Pill",
    badge: "1 cp / jour"
  },
  {
    id: "p1-2",
    phaseId: 1,
    date: "21 sept.",
    title: "Début de la stimulation ovarienne",
    description: "Injections quotidiennes combinées : Gonal-F 150 UI (FSH) + Menopur 150 UI (LH/FSH).",
    status: "completed",
    category: "stimulation",
    icon: "Syringe",
    badge: "Gonal-F 150 + Menopur 150"
  },
  {
    id: "p1-3",
    phaseId: 1,
    date: "23 sept.",
    title: "Visite de contrôle 1 (07h00)",
    description: "Prise de sang hormonale (Estradiol, LH, Progestérone) et échographie endovaginale pour mesurer la taille folliculaire initiale.",
    status: "completed",
    category: "monitoring",
    icon: "Activity"
  },
  {
    id: "p1-4",
    phaseId: 1,
    date: "25 sept.",
    title: "Ajout de l'antagoniste",
    description: "Introduction du Cetrotide 0,25 mg quotidien en sous-cutané pour bloquer tout pic prématuré de LH et préserver les ovocytes.",
    status: "completed",
    category: "stimulation",
    icon: "ShieldAlert",
    badge: "Cetrotide 0,25 mg"
  },
  {
    id: "p1-5",
    phaseId: 1,
    date: "27 sept.",
    title: "Visite de contrôle 2 (07h30)",
    description: "Second contrôle échographique et biologique : vérification de la maturité de la cohorte de follicules et ajustement final.",
    status: "completed",
    category: "monitoring",
    icon: "Activity"
  },
  {
    id: "p1-6",
    phaseId: 1,
    date: "29 sept.",
    title: "Injection de déclenchement (23h00 précises)",
    description: "Injection du trigger shot exécutée exactement à 23h00 pour finaliser la méiose ovocytaire 36h avant la ponction.",
    status: "completed",
    category: "trigger",
    icon: "Clock",
    badge: "Horaire critique : 23h00"
  },
  {
    id: "p1-7",
    phaseId: 1,
    date: "30 sept.",
    title: "Contrôle biologique pré-ponction (08h45)",
    description: "Bilan sanguin de contrôle pour s'assurer de l'effet hormonal du déclenchement.",
    status: "completed",
    category: "monitoring",
    icon: "TestTube"
  },
  {
    id: "p1-8",
    phaseId: 1,
    date: "01 oct.",
    title: "Ponction ovocytaire (Oocyte Retrieval)",
    description: "Aspiration folliculaire sous anesthésie douce : résultat exceptionnel avec 42 ovocytes prélevés !",
    status: "completed",
    category: "ponction",
    icon: "CheckCircle",
    badge: "42 ovocytes prélevés",
    details: "Prélèvement réalisé sans complications. Surveillance post-ponction immédiate et hydratation enrichie en électrolytes."
  },

  // Phase 2 : Embryologie et préparation au FET (Active)
  {
    id: "p2-1",
    phaseId: 2,
    date: "02 oct.",
    title: "Fécondation par ICSI",
    description: "Micro-injection intracytoplasmique : 42 ovocytes prélevés ➔ 34 matures (MII) ➔ 11 fécondés avec succès.",
    status: "completed",
    category: "labo",
    icon: "Sparkles",
    badge: "34 matures ➔ 11 fécondés"
  },
  {
    id: "p2-2",
    phaseId: 2,
    date: "06–08 oct.",
    title: "Culture blastocytaire & biopsie du trophectoderme",
    description: "Développement in vitro jusqu'aux stades J5-J6 et prélèvement délicat de cellules du trophectoderme pour analyse génétique.",
    status: "completed",
    category: "labo",
    icon: "Microscope"
  },
  {
    id: "p2-3",
    phaseId: 2,
    date: "09 oct.",
    title: "Rendement du laboratoire (Vitrification)",
    description: "8 magnifiques blastocystes ont atteint les critères de qualité stricts, biopsiés pour le PGT-A et vitrifiés par cryoconservation.",
    status: "completed",
    category: "labo",
    icon: "Snowflake",
    badge: "8 blastocystes vitrifiés"
  },
  {
    id: "p2-4",
    phaseId: 2,
    date: "11 oct.",
    title: "Échographie / Bilan de base FET (09h15)",
    description: "Examen de base et reprise du Nortrel quotidien pour réguler le cycle avant la préparation de l'endomètre.",
    status: "completed",
    category: "echo",
    icon: "Activity"
  },
  {
    id: "p2-5",
    phaseId: 2,
    date: "13 oct.",
    title: "Plan de décongélation rempli & choix du sexe",
    description: "Formulaire complété et validé via le portail avec préférence pour un garçon (Male). L'embryon euploïde masculin #1 (5AA) sera décongelé en premier.",
    status: "completed",
    category: "formulaire",
    icon: "FileCheck",
    badge: "Garçon (Male) sélectionné"
  },
  {
    id: "p2-6",
    phaseId: 2,
    date: "15 oct.",
    title: "Hystérosonographie par perfusion de sérum physiologique (SIS)",
    description: "Évaluation de la cavité utérine le jeudi 15 oct. à 08h00.",
    status: "completed",
    category: "echo",
    icon: "Stethoscope"
  },
  {
    id: "p2-7",
    phaseId: 2,
    date: "Mi-octobre",
    title: "Préparation endométriale (Début du protocole d'estrogènes)",
    description: "Début du protocole d'estrogènes par voie orale/cutanée pour préparer l'épaississement de l'endomètre.",
    status: "active",
    category: "stimulation",
    icon: "Pill",
    badge: "Estrogènes en cours"
  },
  {
    id: "p2-8",
    phaseId: 2,
    date: "25 oct.",
    title: "Résultats PGT-A reçus ➔ 5 embryons normaux (2 garçons, 3 filles)",
    description: "Résultats génétiques officiels : 5 blastocystes normaux euploïdes sur les 8 biopsiés (5 Positive Normal). Répartition : 2 garçons euploïdes et 3 filles euploïdes disponibles !",
    status: "completed",
    category: "pgta",
    icon: "Dna",
    badge: "5 Normaux : 2 Garçons, 3 Filles"
  },
  {
    id: "p2-9",
    phaseId: 2,
    date: "28 oct. (06h15)",
    title: "CHEMIN CRITIQUE : Hystéroscopie (Debris Removal)",
    description: "PROCHAINE ÉTAPE DU CHEMIN CRITIQUE : Intervention au centre chirurgical ambulatoire à 06h15 précises. Nettoyage de la cavité utérine. Le transfert d'embryon congelé (FET) ne sera programmé qu'après cette étape clé.",
    status: "active",
    category: "chirurgie",
    icon: "Stethoscope",
    badge: "PROCHAINE ÉTAPE DU CHEMIN CRITIQUE · 28 oct. 06h15",
    location: "Centre chirurgical ambulatoire",
    details: "Prochaine étape critique : arrivée à 05h45, à jeun strict depuis minuit. Accompagnateur adulte requis pour la sortie. Débloque la fixation de la date du FET."
  },
  {
    id: "p2-10",
    phaseId: 2,
    date: "Post-28 oct.",
    title: "Transfert d'embryon congelé (FET) — Date conditionnée",
    description: "Transfert d'embryon congelé : pas de date fixée jusqu'à après l'hystéroscopie (Debris Removal) du 28 octobre à 06h15. La date cible sera arrêtée dès validation de l'endomètre.",
    status: "upcoming",
    category: "transfert",
    icon: "Baby",
    badge: "Date fixée post-28 oct."
  },

  // Phase 3 : Suivi de début de grossesse (À venir)
  {
    id: "p3-1",
    phaseId: 3,
    date: "08–12 nov.",
    title: "Série de prises de sang Bêta-hCG",
    description: "Dosages quantitatifs sanguins sériés réalisés 9 à 14 jours post-FET pour valider l'implantation et s'assurer du doublement correct de la hCG toutes les 48h.",
    status: "upcoming",
    category: "bhcg",
    icon: "HeartPulse",
    badge: "9 à 14 jours post-FET"
  },
  {
    id: "p3-2",
    phaseId: 3,
    date: "Semaines 5–8",
    title: "Premières échographies & rythme cardiaque",
    description: "Échographies endovaginales hebdomadaires pour visualiser le sac gestationnel, la vésicule vitelline et l'activité cardiaque de bébé.",
    status: "upcoming",
    category: "echo",
    icon: "Heart"
  },
  {
    id: "p3-3",
    phaseId: 3,
    date: "Semaines 8–10",
    title: "Graduation du protocole de fertilité & suivi obstétrique",
    description: "Clôture du protocole de fertilité et transmission officielle vers le cabinet de suivi prénatal principal.",
    status: "upcoming",
    category: "obstetrique",
    icon: "GraduationCap",
    badge: "Graduation fertilité"
  },

  // Phase 4 : Étapes obstétricales (À venir)
  {
    id: "p4-1",
    phaseId: 4,
    date: "Semaines 06–08",
    title: "Échographie de viabilité précoce",
    description: "Confirmation de la vitalité embryonnaire, datation précise et mesure de la longueur cranio-caudale (LCC).",
    status: "upcoming",
    category: "obstetrique",
    icon: "Activity"
  },
  {
    id: "p4-2",
    phaseId: 4,
    date: "Semaines 11–13",
    title: "DPNI (NIPT), clarté nucale & dépistage T1",
    description: "Échographie du premier trimestre avec mesure de la clarté nucale et prise de sang ADN fœtal libre circulant pour dépistage des trisomies.",
    status: "upcoming",
    category: "obstetrique",
    icon: "Dna",
    badge: "Dépistage T1"
  },
  {
    id: "p4-3",
    phaseId: 4,
    date: "Semaine 12",
    title: "Premier rendez-vous officiel de suivi prénatal",
    description: "Ouverture du dossier de maternité principal, examen clinique complet, bilans sérologiques et calendrier prévisionnel des consultations.",
    status: "upcoming",
    category: "obstetrique",
    icon: "Building"
  },
  {
    id: "p4-4",
    phaseId: 4,
    date: "Semaines 18–20",
    title: "Premiers mouvements fœtaux ressentis",
    description: "Moment magique des premières bulles et légers mouvements perceptibles de bébé in utero.",
    status: "upcoming",
    category: "obstetrique",
    icon: "Sparkles"
  },
  {
    id: "p4-5",
    phaseId: 4,
    date: "Semaine 22",
    title: "Échographie morphologique détaillée de niveau II",
    description: "Examen approfondi de l'anatomie fœtale (cerveau, cœur, organes, membres), positionnement du cordon et du placenta.",
    status: "upcoming",
    category: "obstetrique",
    icon: "Monitor",
    badge: "Écho morphologique T2"
  },
  {
    id: "p4-6",
    phaseId: 4,
    date: "Semaines 24–28",
    title: "Dépistage du diabète gestationnel (HGPO)",
    description: "Test de provocation au glucose par voie orale avec prises de sang à jeun et après ingestion.",
    status: "upcoming",
    category: "obstetrique",
    icon: "Coffee"
  },
  {
    id: "p4-7",
    phaseId: 4,
    date: "Semaine 32",
    title: "Suivi de la croissance fœtale & position du placenta",
    description: "Troisième échographie systématique pour estimer le poids fœtal, la présentation céphalique et la quantité de liquide amniotique.",
    status: "upcoming",
    category: "obstetrique",
    icon: "TrendingUp",
    badge: "Écho T3"
  },
  {
    id: "p4-8",
    phaseId: 4,
    date: "Semaines 35–37",
    title: "Dépistage streptocoque du groupe B (SGB) & projet de naissance",
    description: "Prélèvement de routine pour le Streptocoque B et finalisation des souhaits pour l'accouchement avec la maternité.",
    status: "upcoming",
    category: "obstetrique",
    icon: "FileText"
  },
  {
    id: "p4-9",
    phaseId: 4,
    date: "Semaines 37–41",
    title: "Travail, accouchement & transition post-partum",
    description: "Le grand jour de la venue au monde de bébé et début des soins post-partum.",
    status: "upcoming",
    category: "obstetrique",
    icon: "Gift",
    badge: "Bienvenue à bébé !"
  }
];

// Blastocystes: Exact user distribution: 5 normaux euploïdes = 2 Garçons (Males) + 3 Filles (Females)
export const INITIAL_BLASTOCYSTS: Blastocyst[] = [
  {
    id: 1,
    embryoNumber: "Blastocyste #1",
    grade: "5AA",
    day: "J5",
    sex: "Male",
    pgtaStatus: "Euploïde",
    isSelectedForFET: true,
    notes: "Qualité exceptionnelle (Masse cellulaire interne dense A, trophectoderme régulier A). Priorité #1 pour décongélation et transfert FET (Garçon)."
  },
  {
    id: 2,
    embryoNumber: "Blastocyste #2",
    grade: "5AB",
    day: "J5",
    sex: "Male",
    pgtaStatus: "Euploïde",
    isSelectedForFET: false,
    notes: "Très haute qualité morphologique. Réserve prioritaire masculine euploïde (Garçon)."
  },
  {
    id: 3,
    embryoNumber: "Blastocyste #3",
    grade: "5BA",
    day: "J5",
    sex: "Female",
    pgtaStatus: "Euploïde",
    isSelectedForFET: false,
    notes: "Parfaite morphologie euploïde féminine cryoconservée (Fille)."
  },
  {
    id: 4,
    embryoNumber: "Blastocyste #4",
    grade: "4AA",
    day: "J6",
    sex: "Female",
    pgtaStatus: "Euploïde",
    isSelectedForFET: false,
    notes: "Excellente masse cellulaire interne dense A et trophectoderme cohésif A (Fille)."
  },
  {
    id: 5,
    embryoNumber: "Blastocyste #5",
    grade: "4AB",
    day: "J6",
    sex: "Female",
    pgtaStatus: "Euploïde",
    isSelectedForFET: false,
    notes: "Euploïde féminine de très bon pronostic cryoconservée (Fille)."
  },
  {
    id: 6,
    embryoNumber: "Blastocyste #6",
    grade: "4BB",
    day: "J6",
    sex: "Male",
    pgtaStatus: "Aneuploïde",
    isSelectedForFET: false,
    notes: "Anomalie chromosomique segmentaire identifiée – non transférable."
  },
  {
    id: 7,
    embryoNumber: "Blastocyste #7",
    grade: "3BB",
    day: "J6",
    sex: "Female",
    pgtaStatus: "Aneuploïde",
    isSelectedForFET: false,
    notes: "Anomalie numérique identifiée – non transférable."
  },
  {
    id: 8,
    embryoNumber: "Blastocyste #8",
    grade: "3BC",
    day: "J6",
    sex: "Male",
    pgtaStatus: "Aneuploïde",
    isSelectedForFET: false,
    notes: "Monosomie identifiée – non transférable."
  }
];

export const MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    name: "Nortrel 1/35 (Norethindrone/Ethinyl Estradiol)",
    dosage: "1 comprimé par jour",
    timing: "Chaque soir à 21h00",
    status: "current",
    instructions: "Prendre à heure fixe avec de l'eau. Ne pas oublier afin de maintenir la suppression ovarienne.",
    storage: "Conserver à température ambiante (15-25°C).",
    purpose: "Maintien de la suppression ovarienne et synchronisation de l'endomètre."
  },
  {
    id: "med-2",
    name: "Estradiol (Estrace / Patchs transdermiques)",
    dosage: "2 mg 3x/jour ou patchs selon protocole",
    timing: "Matin (08h00), Midi (14h00), Soir (20h00)",
    status: "current",
    instructions: "Démarrage pour faire épaissir l'endomètre.",
    storage: "Conserver au sec à température ambiante.",
    purpose: "Développement de l'épaisseur de la muqueuse utérine (cible ≥ 8mm en triple feuillet)."
  },
  {
    id: "med-3",
    name: "Progestérone en huile (PIO - Progesterone in Oil)",
    dosage: "50 mg / 1 ml par voie intramusculaire",
    timing: "Chaque matin à heure précise (ex: 08h00)",
    status: "upcoming",
    instructions: "Démarrage exactement 120 heures avant le transfert (FET). Chauffer légèrement la fiole dans les mains avant l'injection dans le quadrant supéro-externe de la fesse.",
    storage: "Température ambiante. Ne pas réfrigérer car l'huile s'épaissit.",
    purpose: "Transformation sécrétoire de l'endomètre et fenêtre d'implantation réceptive pour le blastocyste."
  },
  {
    id: "med-4",
    name: "Gonal-F 150 UI & Menopur 150 UI",
    dosage: "150 UI chacun par injection sous-cutanée",
    timing: "Tous les soirs entre 19h00 et 21h00",
    status: "completed",
    instructions: "Protocole de stimulation complété lors de la Phase 1 ayant permis le prélèvement record de 42 ovocytes.",
    storage: "Gonal-F au réfrigérateur, Menopur à température ambiante.",
    purpose: "Recrutement et maturation des follicules ovariens (Terminé)."
  },
  {
    id: "med-5",
    name: "Cetrotide 0,25 mg",
    dosage: "0,25 mg sous-cutané",
    timing: "Chaque matin",
    status: "completed",
    instructions: "Administré du 25 au 29 sept. pour empêcher l'ovulation spontanée avant la ponction.",
    storage: "Au réfrigérateur (2-8°C).",
    purpose: "Blocage de l'ovulation prématurée (Terminé)."
  }
];

export const COUNTDOWN_STEPS: StepCountdown[] = [
  {
    id: "step-1",
    title: "Hystéroscopie (Debris Removal)",
    subtitle: "Chemin critique immédiat · Centre ambulatoire",
    targetDate: "2026-10-28T06:15:00",
    icon: "Stethoscope",
    category: "Chirurgie & Préparation"
  },
  {
    id: "step-2",
    title: "Transfert d'Embryon Congelé (FET)",
    subtitle: "Transfert du blastocyste euploïde masculin #1 (5AA)",
    targetDate: "2026-11-04T10:00:00",
    icon: "Baby",
    category: "Transfert Embryonnaire"
  },
  {
    id: "step-3",
    title: "1ère Prise de sang Bêta-hCG",
    subtitle: "Confirmation d'implantation embryonnaire (10j post-FET)",
    targetDate: "2026-11-14T08:00:00",
    icon: "HeartPulse",
    category: "Test Biologique"
  },
  {
    id: "step-4",
    title: "Échographie cardiaque fœtale (~6 SA)",
    subtitle: "Première pulsation du cœur de bébé",
    targetDate: "2026-11-27T09:00:00",
    icon: "Heart",
    category: "Première Échographie"
  },
  {
    id: "step-5",
    title: "Échographie T1 & DPNI (~12 SA)",
    subtitle: "Clarté nucale et fin du premier trimestre",
    targetDate: "2027-01-08T10:30:00",
    icon: "Sparkles",
    category: "Suivi Prénatal T1"
  },
  {
    id: "step-6",
    title: "Échographie Morphologique T2 (~22 SA)",
    subtitle: "Examen anatomique détaillé complet",
    targetDate: "2027-03-19T14:00:00",
    icon: "Monitor",
    category: "Suivi Prénatal T2"
  },
  {
    id: "step-7",
    title: "Arrivée de Bébé (Terme / Accouchement)",
    subtitle: "Bienvenue à votre petit garçon !",
    targetDate: "2027-07-23T08:00:00",
    icon: "Gift",
    category: "Naissance à terme"
  }
];
