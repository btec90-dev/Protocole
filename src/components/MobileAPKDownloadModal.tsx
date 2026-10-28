import React, { useState } from 'react';
import { Smartphone, Download, QrCode, RefreshCw, Check, Copy, HelpCircle, X, ShieldCheck, ArrowRight, Laptop } from 'lucide-react';
import { GoldLogo } from './GoldLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileAPKDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MobileAPKDownloadModal: React.FC<MobileAPKDownloadModalProps> = ({
  isOpen,
  onClose,
  onExportData,
  onImportData
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'sync' | 'ai_prompt'>('install');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const sampleAiPrompt = `Mets à jour mon protocole FIV pour Fatou avec les nouvelles informations suivantes :
- Hystéroscopie (Debris Removal) du 28 octobre à 06h15 terminée avec succès au centre chirurgical ambulatoire.
- Épaisseur de l'endomètre validée par l'équipe médicale.
- Date confirmée du transfert d'embryon congelé (FET) : [Indiquer la date retenue].
- Début des injections de progestérone (PIO) : [Indiquer la date].`;

  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(sampleAiPrompt);
    setCopiedAiPrompt(true);
    setTimeout(() => setCopiedAiPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-zinc-300 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header in Light Brown */}
        <div className="p-4 sm:p-5 bg-[#3E2C1C] text-white flex items-center justify-between border-b border-[#5C4434]">
          <div className="flex items-center gap-3">
            <GoldLogo className="w-8 h-8 sm:w-10 sm:h-10" />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                <span>Application Mobile Native & Synchronisation</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                Installer l'App Mobile (APK / PWA) & Synchro
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#E8DDD0] bg-[#FAF7F2] px-4 sm:px-5 pt-3 gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'install'
                ? 'border-[#8C6D46] text-[#8C6D46] font-bold'
                : 'border-transparent text-zinc-600 hover:text-[#3E2C1C]'
            }`}
          >
            1. Installer l'App Mobile (APK)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'sync'
                ? 'border-[#8C6D46] text-[#8C6D46] font-bold'
                : 'border-transparent text-zinc-600 hover:text-[#3E2C1C]'
            }`}
          >
            2. Synchronisation Mobile ↔ PC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai_prompt')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'ai_prompt'
                ? 'border-[#8C6D46] text-[#8C6D46] font-bold'
                : 'border-transparent text-zinc-600 hover:text-[#3E2C1C]'
            }`}
          >
            3. Guide de mise à jour
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-700 flex-1">
          {/* TAB 1: INSTALL APK / PWA */}
          {activeTab === 'install' && (
            <div className="space-y-5">
              {/* Direct APK installation card */}
              <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-black text-white rounded-xl shadow-xs mt-0.5">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-950">
                      Application Mobile Autonome pour Fatou
                    </h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      L'application s'installe directement sur l'écran d'accueil de votre smartphone avec son emblème dédié, sans passer par un store, et fonctionne même sans connexion Internet.
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isInstallable ? (
                    <button
                      type="button"
                      onClick={() => install()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-black hover:bg-zinc-800 rounded-xl shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Installer l'App (APK direct)</span>
                    </button>
                  ) : isInstalled ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 rounded-lg border border-zinc-300">
                      <Check className="w-4 h-4 text-black" /> App déjà installée
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl border border-zinc-300 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedUrl ? 'Lien copié !' : 'Copier le lien mobile'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions per device type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Android / APK Instructions */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                    <Smartphone className="w-4 h-4 text-black" />
                    <span>Sur Téléphone Android (Chrome / Samsung)</span>
                  </div>
                  <ol className="text-xs text-zinc-600 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Ouvrez ce site dans <strong>Google Chrome</strong> sur votre téléphone.</li>
                    <li>Appuyez sur les <strong>3 petits points verticaux</strong> (Menu en haut à droite).</li>
                    <li>Sélectionnez <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.</li>
                    <li>Android génère et télécharge le package APK natif (WebAPK) instantanément !</li>
                  </ol>
                </div>

                {/* iPhone / iOS Instructions */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                    <Smartphone className="w-4 h-4 text-black" />
                    <span>Sur iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-zinc-600 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Ouvrez ce lien dans le navigateur <strong>Safari</strong>.</li>
                    <li>Appuyez sur le bouton <strong>Partager</strong> (icône carré avec flèche vers le haut au centre en bas).</li>
                    <li>Faites défiler vers le bas et touchez <strong>"Sur l'écran d'accueil"</strong>.</li>
                    <li>L'icône s'ajoute à votre écran comme n'importe quelle application native.</li>
                  </ol>
                </div>
              </div>

              {/* Quick Link bar */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-500 truncate">URL : {currentUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="shrink-0 flex items-center gap-1 font-semibold text-black hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrl ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SYNC BETWEEN MOBILE AND COMPUTER */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-950">
                  Comment synchroniser l'application mobile et l'ordinateur ?
                </h4>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  L'application conserve vos coches, vos prises de médicaments et vos notes personnelles. Pour avoir exactement les mêmes informations sur votre smartphone et sur votre ordinateur :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200 hover:border-black transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block mb-1">Étape A (Depuis l'ordinateur)</span>
                    <h5 className="font-bold text-zinc-950 text-sm">Sauvegarder mes données</h5>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      Télécharge un petit fichier sécurisé (.json) contenant l'état de votre checklist, vos blastocystes et vos notes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onExportData}
                    className="mt-3 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-black hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger ma sauvegarde</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200 hover:border-black transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block mb-1">Étape B (Sur le mobile ou PC)</span>
                    <h5 className="font-bold text-zinc-950 text-sm">Restaurer / Synchroniser</h5>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      Chargez le fichier pour retrouver instantanément toutes vos données à jour sur votre mobile.
                    </p>
                  </div>
                  <label className="mt-3 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer transition-colors border border-zinc-300">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sélectionner le fichier</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-800 leading-relaxed">
                <strong>Astuce permanente :</strong> Toutes les mises à jour de contenu (comme les résultats du 25 oct. et l'hystéroscopie du 28 oct.) sont inscrites directement dans le code du site, donc l'App Mobile et le site web affichent automatiquement les mêmes dates officielles dès l'ouverture !
              </div>
            </div>
          )}

          {/* TAB 3: GUIDE HOW TO ASK AI STUDIO */}
          {activeTab === 'ai_prompt' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-950">
                  Comment demander à AI Studio de mettre à jour le site & l'application ?
                </h4>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Lorsque vous recevez un nouveau compte-rendu médical (par exemple après l'hystéroscopie de demain à 06h15 ou pour caler la date exacte du FET), copiez simplement un message clair avec vos dates clés :
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                  <span className="text-xs font-bold text-zinc-700">Modèle de prompt prêt à l'emploi</span>
                  <button
                    type="button"
                    onClick={handleCopyAiPrompt}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:underline"
                  >
                    {copiedAiPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        <span className="text-black">Prompt copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier le texte</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs text-zinc-800 whitespace-pre-wrap font-sans bg-zinc-50 p-3 rounded-lg border border-zinc-200 leading-relaxed">
                  {sampleAiPrompt}
                </pre>
              </div>

              <div className="space-y-2 text-xs text-zinc-600 leading-relaxed">
                <h5 className="font-bold text-zinc-900">Conseils pour que la synchronisation soit parfaite :</h5>
                <p>1. <strong>Précisez toujours la date et l'heure exacte</strong> (ex : "28 octobre à 06h15").</p>
                <p>2. <strong>Mentionnez le statut</strong> (ex : "Terminé avec succès", "En attente", "Confirmé").</p>
                <p>3. AI Studio met à jour simultanément le site Web et l'application mobile APK, vous garantissant des données 100% synchronisées sans aucune manipulation technique de votre part.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
