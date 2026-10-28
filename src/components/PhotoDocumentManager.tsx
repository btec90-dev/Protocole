import React, { useState, useEffect, useRef } from 'react';
import { AttachedPhotoDoc } from '../types/protocol';
import { 
  Camera, Plus, Trash2, Eye, X, FileText, Upload, Sparkles, 
  Image as ImageIcon, CheckCircle2, ChevronRight, FileCheck, 
  Paperclip, ZoomIn, Calendar, FileSpreadsheet, AlertCircle
} from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

export const PhotoDocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<AttachedPhotoDoc[]>(() => {
    const saved = localStorage.getItem('fatou_attached_photos_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // Fall back to default
      }
    }
    // Also check previous storage key if present
    const oldSaved = localStorage.getItem('fatou_attached_photos');
    if (oldSaved) {
      try {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // Fall back to default
      }
    }

    return [
      {
        id: "doc-1",
        title: "Compte-rendu PGT-A : 5 embryons normaux (2G / 3F)",
        category: "laboratoire",
        date: "25 oct. 2026",
        dataUrl: "",
        fileName: "CR_Biopsie_PGTA_5_Euploides.pdf",
        fileSize: "1.4 Mo",
        notes: "Analyse génétique Igenomix confirmant 5 blastocystes normaux euploïdes sur les 8 biopsiés. Garçon #1 (J5 - Grade 4AA) prioritaire pour le transfert."
      },
      {
        id: "doc-2",
        title: "Cliché Hystérosonographie (SIS)",
        category: "échographie",
        date: "15 oct. 2026",
        dataUrl: "",
        fileName: "Echo_SIS_Cavite_15102026.png",
        fileSize: "2.1 Mo",
        notes: "Évaluation de la cavité utérine : mise en évidence d'un fragment résiduel justifiant l'hystéroscopie opératoire programmée le 28 oct."
      },
      {
        id: "doc-3",
        title: "Protocole Pré-Transfert (Estradiol & Progestérone)",
        category: "ordonnance",
        date: "18 oct. 2026",
        dataUrl: "",
        fileName: "Ordonnance_Preparation_FET.pdf",
        fileSize: "580 Ko",
        notes: "Ordonnance pour œstrogènes par voie orale/transdermique et injection de Progestérone retard avant le FET du garçon."
      },
      {
        id: "doc-4",
        title: "Compte-rendu Ponction Ovocytaire (42 ovocytes)",
        category: "compte-rendu",
        date: "01 oct. 2026",
        dataUrl: "",
        fileName: "CR_Ponction_01102026.pdf",
        fileSize: "890 Ko",
        notes: "Prélèvement réussi de 42 ovocytes sous sédation. Récupération post-opératoire normale, surveillance OHSS négative."
      }
    ];
  });

  // Active selected document for the left details panel
  const [selectedDocId, setSelectedDocId] = useState<string>(() => {
    return documents[0]?.id || "doc-1";
  });

  // Toggle between viewing details vs inline upload form in the primary left panel
  const [isAdding, setIsAdding] = useState(false);

  // Filter tabs for the right attachments library
  const [filterTab, setFilterTab] = useState<'all' | 'photos' | 'documents'>('all');

  // Fullscreen lightbox modal for photos/documents
  const [zoomModalDoc, setZoomModalDoc] = useState<AttachedPhotoDoc | null>(null);

  // Success notification banner
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'échographie' | 'laboratoire' | 'ordonnance' | 'compte-rendu'>('échographie');
  const [newNotes, setNewNotes] = useState('');
  const [newImageBase64, setNewImageBase64] = useState<string>('');
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileSize, setNewFileSize] = useState<string>('');
  const [newDate, setNewDate] = useState('2026-10-27');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('fatou_attached_photos_v2', JSON.stringify(documents));
  }, [documents]);

  // Keep a valid selected doc if list updates or deletes
  const activeDocument = documents.find(d => d.id === selectedDocId) || documents[0] || null;

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    if (filterTab === 'photos') return doc.category === 'échographie' || !!doc.dataUrl;
    if (filterTab === 'documents') return doc.category !== 'échographie' && !doc.dataUrl;
    return true;
  });

  const photoItems = documents.filter(doc => doc.category === 'échographie' || !!doc.dataUrl);
  const docItems = documents.filter(doc => doc.category !== 'échographie' && !doc.dataUrl);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier sélectionné est trop volumineux (maximum 5 Mo).");
      return;
    }

    setNewFileName(file.name);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo`
      : `${Math.round(file.size / 1024)} Ko`;
    setNewFileSize(sizeStr);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImageBase64(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewImageBase64('');
    }
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const formattedDate = new Date(newDate).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    const newDoc: AttachedPhotoDoc = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: formattedDate,
      dataUrl: newImageBase64,
      fileName: newFileName || (newCategory === 'échographie' ? `Echo_${Date.now()}.jpg` : `Document_${Date.now()}.pdf`),
      fileSize: newFileSize || '750 Ko',
      notes: newNotes.trim()
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    setSelectedDocId(newDoc.id);
    setIsAdding(false);

    // Reset fields
    setNewTitle('');
    setNewNotes('');
    setNewImageBase64('');
    setNewFileName('');
    setNewFileSize('');

    // Trigger toast
    setSuccessToast(`« ${newDoc.title} » a été ajouté avec succès à votre dossier.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Voulez-vous retirer cette pièce de votre dossier ?")) {
      const remaining = documents.filter(d => d.id !== id);
      setDocuments(remaining);
      if (selectedDocId === id) {
        if (remaining.length > 0) {
          setSelectedDocId(remaining[0].id);
        }
      }
      if (zoomModalDoc?.id === id) {
        setZoomModalDoc(null);
      }
    }
  };

  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    setIsAdding(false);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'échographie':
        return 'bg-[#F2E9DE] text-[#6E4823] border-[#BA936A]/40';
      case 'laboratoire':
        return 'bg-[#EBF3ED] text-[#2D5A38] border-[#A8CCA8]';
      case 'ordonnance':
        return 'bg-[#FAF0E6] text-[#7C4A1E] border-[#D4A373]';
      case 'compte-rendu':
      default:
        return 'bg-[#F3EFF8] text-[#55306B] border-[#C8B8DD]';
    }
  };

  return (
    <section id="photos" ref={containerRef} className="py-8 sm:py-10 bg-white border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
              <Camera className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Dossier d'Imagerie & Documents Médicaux</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>Disposition scindée et compacte</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Clichés d'échographies & Pièces jointes
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Consultez vos comptes-rendus, ordonnances et échographies sans défilement excessif. Sélectionnez un document pour afficher ses détails ou ajoutez-en un directement dans l'espace réservé.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl shadow-2xs transition-all ${
                isAdding 
                  ? 'bg-[#FAF7F2] text-[#3E2C1C] border border-[#BA936A]'
                  : 'bg-[#8C6D46] hover:bg-[#745233] text-white'
              }`}
            >
              {isAdding ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Afficher le document actif</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une pièce / photo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success alert notification */}
        {successToast && (
          <div className="mb-4 p-3 bg-[#FAF5EE] border border-[#BA936A] rounded-xl flex items-center justify-between text-xs text-[#3E2C1C] shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <span className="font-medium">{successToast}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setSuccessToast(null)} 
              className="text-zinc-400 hover:text-zinc-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-Column Cohesive Layout:
            - Left: Primary Details / Active Preview or Inline Upload Form
            - Right: Bounded Scrollable Attachments & Media Library (compact photos + chips)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: Primary Section (Form / Active Document Details) - 7 cols
             ========================================================================= */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E8DDD0] rounded-2xl p-4 sm:p-5 shadow-xs">
            {isAdding ? (
              /* --- INLINE ADD FORM (Loads right in place, no bottom-of-page jumping) --- */
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8DDD0]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#EFE5D8] text-[#8C6D46] rounded-lg">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#3E2C1C] font-display">
                        Ajouter une pièce ou un cliché
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        La pièce sera intégrée directement à votre dossier patient.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-xs text-zinc-500 hover:text-[#3E2C1C] font-semibold px-2 py-1 rounded-lg hover:bg-[#EFE5D8]"
                  >
                    Fermer
                  </button>
                </div>

                <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#3E2C1C] block mb-1">
                      Titre du document ou de l'échographie *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Échographie endomètre J12, Résultats PGT-A..."
                      className="w-full text-xs p-2.5 bg-white border border-[#DBCBB7] rounded-xl text-[#3E2C1C] focus:outline-none focus:ring-1 focus:ring-[#BA936A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#3E2C1C] block mb-1">
                        Catégorie
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full text-xs p-2.5 bg-white border border-[#DBCBB7] rounded-xl text-[#3E2C1C] focus:outline-none focus:ring-1 focus:ring-[#BA936A]"
                      >
                        <option value="échographie">Échographie (Cliché / Photo)</option>
                        <option value="laboratoire">Résultats de laboratoire</option>
                        <option value="ordonnance">Ordonnance médicale</option>
                        <option value="compte-rendu">Compte-rendu opératoire</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[#3E2C1C] block mb-1">
                        Date de l'examen / document
                      </label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-[#DBCBB7] rounded-xl text-[#3E2C1C] focus:outline-none focus:ring-1 focus:ring-[#BA936A]"
                      />
                    </div>
                  </div>

                  {/* Compact File & Photo Uploader */}
                  <div>
                    <label className="font-bold text-[#3E2C1C] block mb-1">
                      Fichier joint (Photo, Cliché ou PDF)
                    </label>
                    <div className="border-2 border-dashed border-[#DBCBB7] rounded-xl p-3 bg-white hover:bg-[#FAF5EE] transition-colors">
                      {newImageBase64 ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={newImageBase64}
                            alt="Aperçu upload"
                            className="w-16 h-16 rounded-lg object-cover border border-[#E8DDD0]"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-[#3E2C1C] block truncate">
                              {newFileName || "Image sélectionnée"}
                            </span>
                            <span className="text-[11px] text-zinc-500 block">
                              {newFileSize} · Photo prête à être enregistrée
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setNewImageBase64('');
                              setNewFileName('');
                              setNewFileSize('');
                            }}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-100"
                            title="Supprimer la sélection"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : newFileName ? (
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-[#EFE5D8] text-[#8C6D46] rounded-lg">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-[#3E2C1C] block truncate">
                              {newFileName}
                            </span>
                            <span className="text-[11px] text-zinc-500 block">
                              {newFileSize} · Document prêt à être consigné
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setNewFileName('');
                              setNewFileSize('');
                            }}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block text-center py-2">
                          <Upload className="w-5 h-5 text-[#8C6D46] mx-auto mb-1" />
                          <span className="text-xs font-bold text-[#3E2C1C] block">
                            Sélectionner une photo ou un fichier
                          </span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">
                            Formats acceptés : JPG, PNG, WEBP, PDF (Max 5 Mo)
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#3E2C1C] block mb-1">
                      Notes cliniques ou observations (optionnel)
                    </label>
                    <textarea
                      rows={2}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Ex: Mesure de l'endomètre en triple feuillet, consignes médicales..."
                      className="w-full text-xs p-2.5 bg-white border border-[#DBCBB7] rounded-xl text-[#3E2C1C] focus:outline-none focus:ring-1 focus:ring-[#BA936A]"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#E8DDD0] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-[#EFE5D8] rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#8C6D46] hover:bg-[#745233] rounded-xl shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enregistrer dans mon dossier</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : activeDocument ? (
              /* --- ACTIVE DOCUMENT DETAILS & LARGE PREVIEW --- */
              <div>
                {/* Header bar of the active document */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E8DDD0]">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadgeClass(activeDocument.category)}`}>
                      {activeDocument.category}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8C6D46]" />
                      {activeDocument.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setZoomModalDoc(activeDocument)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#8C6D46] hover:text-[#5C4434] bg-white hover:bg-[#FAF5EE] border border-[#DBCBB7] rounded-lg transition-colors shadow-2xs"
                      title="Agrandir en plein écran"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Plein écran</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(activeDocument.id)}
                      className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      title="Supprimer cette pièce"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Preview Box */}
                <div className="bg-white rounded-xl border border-[#DBCBB7] p-2.5 overflow-hidden shadow-2xs mb-3.5">
                  {activeDocument.dataUrl ? (
                    <div className="relative group rounded-lg overflow-hidden bg-black/5 flex items-center justify-center max-h-[290px]">
                      <img
                        src={activeDocument.dataUrl}
                        alt={activeDocument.title}
                        className="w-full max-h-[290px] object-contain mx-auto transition-transform duration-300 group-hover:scale-102"
                      />
                      <button
                        type="button"
                        onClick={() => setZoomModalDoc(activeDocument)}
                        className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-bold"
                      >
                        <ZoomIn className="w-5 h-5" />
                        <span>Cliquer pour zoomer</span>
                      </button>
                    </div>
                  ) : activeDocument.category === 'échographie' ? (
                    /* Stylized ultrasound placeholder canvas */
                    <div 
                      onClick={() => setZoomModalDoc(activeDocument)}
                      className="cursor-pointer relative rounded-lg overflow-hidden bg-gradient-to-b from-[#2E1B0E] via-[#3E2C1C] to-[#1C1109] text-white p-6 flex flex-col items-center justify-center text-center min-h-[220px] border border-[#5C4434]"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FAF5EE]/10 flex items-center justify-center mb-2.5 border border-[#D4AF37]/40 shadow-inner">
                        <Camera className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <span className="font-display font-bold text-sm text-[#F8F4EE]">
                        Cliché Échographique Cavité Utérine
                      </span>
                      <span className="text-[11px] text-[#DBCBB7] mt-0.5">
                        {activeDocument.fileName || "SIS_Echo_Scan.png"} · {activeDocument.fileSize || "2.1 Mo"}
                      </span>
                      <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-[#BA936A]/30 text-[#EFE5D8] rounded-md text-[10px] border border-[#BA936A]/50">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span>Cliquez pour ouvrir l'aperçu du protocole</span>
                      </div>
                    </div>
                  ) : (
                    /* Stylized medical PDF/Report Document Card */
                    <div className="rounded-lg bg-gradient-to-br from-[#FAF5EE] to-[#EFE5D8] border border-[#DBCBB7] p-5 flex flex-col sm:flex-row items-center gap-4">
                      <div className="p-4 bg-white rounded-xl shadow-xs border border-[#DBCBB7] text-[#8C6D46] shrink-0">
                        <FileCheck className="w-8 h-8 text-[#8C6D46]" />
                      </div>
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-[#8C6D46] bg-white px-2 py-0.5 rounded border border-[#DBCBB7]">
                            Document Certifié
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {activeDocument.fileSize || "1.2 Mo"}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#3E2C1C] text-sm truncate">
                          {activeDocument.fileName || activeDocument.title}
                        </h4>
                        <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">
                          Consigné dans le dossier patient de Fatou. Prêt pour la consultation.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata & Clinical Notes details */}
                <div className="space-y-2 bg-white rounded-xl p-3.5 border border-[#DBCBB7]">
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#3E2C1C]">
                      {activeDocument.title}
                    </h3>
                  </div>

                  {activeDocument.notes && (
                    <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DDD0] text-xs leading-relaxed text-[#3E2C1C]">
                      <strong className="text-[#8C6D46] block mb-0.5 font-bold">
                        Observations & Conduite à tenir :
                      </strong>
                      <p>{activeDocument.notes}</p>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 border-t border-[#E8DDD0]">
                    <span>Fichier : {activeDocument.fileName || 'Archive médicale'}</span>
                    <span className="text-[#8C6D46] font-semibold">Taille : {activeDocument.fileSize || 'Standard'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Paperclip className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-xs text-zinc-500 font-medium">Aucun document sélectionné.</p>
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="mt-3 px-3.5 py-1.5 text-xs font-bold text-white bg-[#8C6D46] rounded-lg"
                >
                  Ajouter un premier document
                </button>
              </div>
            )}
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Dedicated Bounded Media & Attachments Panel - 5 cols
              (Uses bounded max-height with scrollable list to prevent page stretching)
             ========================================================================= */}
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E8DDD0] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col">
            
            {/* Header with Counter and Filter Tabs */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8DDD0]">
              <div className="flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-[#8C6D46]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#3E2C1C] font-display">
                  Pièces du dossier ({documents.length})
                </h3>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-[#DBCBB7] text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    filterTab === 'all' 
                      ? 'bg-[#8C6D46] text-white shadow-2xs' 
                      : 'text-zinc-600 hover:text-[#3E2C1C]'
                  }`}
                >
                  Tous ({documents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('photos')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    filterTab === 'photos' 
                      ? 'bg-[#8C6D46] text-white shadow-2xs' 
                      : 'text-zinc-600 hover:text-[#3E2C1C]'
                  }`}
                >
                  Photos ({photoItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('documents')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    filterTab === 'documents' 
                      ? 'bg-[#8C6D46] text-white shadow-2xs' 
                      : 'text-zinc-600 hover:text-[#3E2C1C]'
                  }`}
                >
                  Docs ({docItems.length})
                </button>
              </div>
            </div>

            {/* Bounded Scrollable Container: max-h-[540px] with smooth scrolling */}
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              
              {/* SECTION A: Clichés d'échographies & Photos (Compact Thumbnails Grid) */}
              {(filterTab === 'all' || filterTab === 'photos') && photoItems.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D46] flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Clichés Échographiques ({photoItems.length})
                    </span>
                    <span className="text-[10px] text-zinc-400">Vignettes compactes</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {photoItems.map((item) => {
                      const isSelected = item.id === selectedDocId && !isAdding;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectDoc(item.id)}
                          className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border transition-all ${
                            isSelected 
                              ? 'border-[#BA936A] ring-2 ring-[#BA936A] ring-offset-1 shadow-xs' 
                              : 'border-[#DBCBB7] hover:border-[#BA936A]'
                          }`}
                          title={item.title}
                        >
                          {item.dataUrl ? (
                            <img
                              src={item.dataUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#BA936A] via-[#C9A983] to-[#D8BE9D] flex flex-col items-center justify-center p-1.5 text-center text-white">
                              <Camera className="w-4 h-4 mb-0.5 text-[#F8F4EE]" />
                              <span className="text-[9px] font-bold leading-tight line-clamp-2 text-white">
                                {item.title}
                              </span>
                            </div>
                          )}

                          {/* Hover action overlay with quick view and delete */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomModalDoc(item);
                              }}
                              className="p-1 bg-white/90 hover:bg-white text-[#3E2C1C] rounded-md transition-colors"
                              title="Aperçu rapide"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Active badge */}
                          {isSelected && (
                            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#BA936A] shadow-xs" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION B: Documents & Comptes-rendus (Compact Chip/Card Items) */}
              {(filterTab === 'all' || filterTab === 'documents') && docItems.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D46] flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Documents & Comptes-rendus ({docItems.length})
                    </span>
                    <span className="text-[10px] text-zinc-400">Cartes compactes</span>
                  </div>

                  <div className="space-y-2">
                    {docItems.map((item) => {
                      const isSelected = item.id === selectedDocId && !isAdding;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectDoc(item.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? 'bg-white border-[#BA936A] shadow-xs ring-1 ring-[#BA936A]'
                              : 'bg-white hover:bg-[#FAF5EE] border-[#E8DDD0] hover:border-[#BA936A]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className={`p-2 rounded-lg shrink-0 ${
                              item.category === 'laboratoire' 
                                ? 'bg-[#EBF3ED] text-[#2D5A38]' 
                                : item.category === 'ordonnance' 
                                  ? 'bg-[#FAF0E6] text-[#7C4A1E]' 
                                  : 'bg-[#EFE5D8] text-[#8C6D46]'
                            }`}>
                              <FileText className="w-4 h-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-[#3E2C1C] truncate">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                                <span>{item.date}</span>
                                <span aria-hidden="true" className="text-zinc-300">·</span>
                                <span className="bg-[#FAF7F2] text-[#8C6D46] px-1.5 py-0.2 rounded border border-[#DBCBB7]">
                                  {item.fileSize || 'Doc'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomModalDoc(item);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-[#8C6D46] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                              title="Afficher"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8 text-zinc-400">
                  <FileText className="w-7 h-7 mx-auto mb-1.5 opacity-40" />
                  <p className="text-xs">Aucun document dans cet onglet.</p>
                </div>
              )}
            </div>

            {/* Bottom Quick-Add Bar inside the media panel */}
            <div className="mt-3.5 pt-3 border-t border-[#E8DDD0] flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-500">
                Stockage sécurisé local
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D46] hover:text-[#5C4434] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau document</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal: Fullscreen Lightbox / Zoom View */}
        {zoomModalDoc && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-[#DBCBB7] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DDD0]">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadgeClass(zoomModalDoc.category)}`}>
                    {zoomModalDoc.category} · {zoomModalDoc.date}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#3E2C1C] font-display mt-1">
                    {zoomModalDoc.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setZoomModalDoc(null)}
                  className="text-zinc-400 hover:text-[#3E2C1C] p-1.5 rounded-lg hover:bg-[#FAF7F2]"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col items-center">
                {zoomModalDoc.dataUrl ? (
                  <img
                    src={zoomModalDoc.dataUrl}
                    alt={zoomModalDoc.title}
                    className="max-h-[58vh] rounded-xl object-contain border border-[#E8DDD0] shadow-xs"
                  />
                ) : zoomModalDoc.category === 'échographie' ? (
                  <div className="w-full py-12 bg-gradient-to-b from-[#2E1B0E] via-[#3E2C1C] to-[#1C1109] text-white rounded-xl flex flex-col items-center justify-center text-center p-6 border border-[#5C4434]">
                    <Camera className="w-12 h-12 text-[#D4AF37] mb-2.5" />
                    <span className="font-bold text-white text-base font-display">Cliché Échographique Enregistré</span>
                    <p className="text-xs text-[#EFE5D8] mt-1 max-w-md">
                      {zoomModalDoc.fileName || "Cliché_SIS_Octobre.png"} ({zoomModalDoc.fileSize || "2.1 Mo"})
                    </p>
                    <p className="text-[11px] text-[#BA936A] mt-2 max-w-md">
                      Consigné dans votre dossier pour le contrôle de l'hystéroscopie du 28 oct.
                    </p>
                  </div>
                ) : (
                  <div className="w-full py-10 bg-[#FAF7F2] text-[#3E2C1C] rounded-xl flex flex-col items-center justify-center text-center p-6 border border-[#DBCBB7]">
                    <FileCheck className="w-12 h-12 text-[#8C6D46] mb-2.5" />
                    <span className="font-bold text-[#3E2C1C] text-base font-display">Document Médical Officiel</span>
                    <p className="text-xs text-zinc-600 mt-1 max-w-md">
                      {zoomModalDoc.fileName || zoomModalDoc.title} ({zoomModalDoc.fileSize || "1.4 Mo"})
                    </p>
                  </div>
                )}

                {zoomModalDoc.notes && (
                  <div className="mt-4 w-full p-3.5 bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl text-xs text-[#3E2C1C] leading-relaxed">
                    <strong className="text-[#8C6D46] block mb-1 font-bold">Notes médicales :</strong>
                    {zoomModalDoc.notes}
                  </div>
                )}
              </div>

                <div className="mt-4 pt-3 border-t border-[#E8DDD0] flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  Dossier FIV · Consultation clinique
                </span>
                <button
                  type="button"
                  onClick={() => setZoomModalDoc(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#8C6D46] hover:bg-[#745233] rounded-xl transition-colors shadow-2xs"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
