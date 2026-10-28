import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Delete, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoldLogo } from './GoldLogo';

interface PinProtectionGateProps {
  onUnlock: () => void;
  correctPin?: string;
}

export const PinProtectionGate: React.FC<PinProtectionGateProps> = ({
  onUnlock,
  correctPin = "8888"
}) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  // Handle number click
  const handleDigit = (digit: string) => {
    if (pin.length >= 4 || isSuccess) return;
    const newPin = pin + digit;
    setPin(newPin);
    setIsError(false);

    if (newPin.length === 4) {
      validatePin(newPin);
    }
  };

  // Backspace
  const handleBackspace = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin(pin.slice(0, -1));
      setIsError(false);
    }
  };

  // Clear
  const handleClear = () => {
    if (!isSuccess) {
      setPin('');
      setIsError(false);
    }
  };

  // Validate PIN
  const validatePin = (inputPin: string) => {
    if (inputPin === correctPin) {
      setIsSuccess(true);
      setIsError(false);
      setTimeout(() => {
        onUnlock();
      }, 500);
    } else {
      setIsError(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        setPin('');
      }, 700);
    }
  };

  // Hardware keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess]);

  const dialButtons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F4EE] via-[#EFE5D8] to-[#E5D5C2] flex flex-col items-center justify-start pt-6 sm:pt-10 p-4 selection:bg-[#BA936A] selection:text-white">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Portrait Medallion */}
        <div className="mb-4 relative">
          <div className="p-1 rounded-full bg-white shadow-lg border border-[#DBCBB7]">
            <GoldLogo className="w-20 h-20 sm:w-22 sm:h-22" withSparkle={true} />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#8C6D46] text-white rounded-full shadow-md border-2 border-white">
            {isSuccess ? (
              <Unlock className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Lock className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-[#DBCBB7] rounded-full text-[10px] font-bold text-[#8C6D46] uppercase-eyebrow mb-2 shadow-2xs">
            <Shield className="w-3 h-3 text-[#8C6D46]" />
            <span>Espace Médical Confidentiel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display">
            Protocole FIV · <span className="font-serif-italic text-[#8C6D46]">Fatou</span>
          </h1>
          <p className="text-xs text-zinc-600 mt-1 max-w-xs">
            Veuillez saisir votre code PIN à 4 chiffres pour accéder à votre dossier sécurisé.
          </p>
        </div>

        {/* Hidden PIN Masked Dots Indicator (No one can see digits) */}
        <div className={`flex items-center justify-center gap-4 my-3 p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#DBCBB7] shadow-xs ${isError ? 'animate-shake border-rose-400 bg-rose-50/70' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isSuccess
                    ? 'bg-emerald-600 scale-110 shadow-xs'
                    : isError
                    ? 'bg-rose-500 scale-105'
                    : isFilled
                    ? 'bg-[#8C6D46] scale-110 shadow-xs ring-2 ring-[#BA936A]/40'
                    : 'bg-white border-2 border-[#C9B59D]'
                }`}
              >
                {/* Always hidden for privacy */}
                {isFilled && !isSuccess && !isError && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FAF7F2]"></span>
                )}
                {isSuccess && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        <div className="h-6 flex items-center justify-center mb-4 text-xs font-semibold">
          {isSuccess ? (
            <span className="text-emerald-700 flex items-center gap-1 font-bold animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Code validé, déverrouillage...
            </span>
          ) : isError ? (
            <span className="text-rose-600 flex items-center gap-1 font-bold animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5" /> Code PIN incorrect
            </span>
          ) : (
            <span className="text-zinc-500 text-[11px]">
              Saisie confidentielle masquée (••••)
            </span>
          )}
        </div>

        {/* Dial Pad Grid (3 Columns) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-3.5 w-full max-w-[280px]">
          {dialButtons.map((btn) => (
            <button
              key={btn.num}
              type="button"
              onClick={() => handleDigit(btn.num)}
              disabled={isSuccess}
              className="h-16 rounded-2xl bg-white hover:bg-[#FAF5EE] active:bg-[#EFE5D8] border border-[#DBCBB7] active:border-[#8C6D46] shadow-xs active:scale-95 transition-all flex flex-col items-center justify-center group"
            >
              <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] font-display group-hover:text-[#8C6D46] transition-colors leading-none">
                {btn.num}
              </span>
              {btn.letters ? (
                <span className="text-[9px] font-bold text-zinc-400 group-hover:text-[#8C6D46] tracking-widest mt-0.5">
                  {btn.letters}
                </span>
              ) : (
                <span className="h-2"></span>
              )}
            </button>
          ))}

          {/* Bottom Row: Clear, 0, Backspace */}
          <button
            type="button"
            onClick={handleClear}
            disabled={isSuccess || pin.length === 0}
            className="h-16 rounded-2xl bg-white/70 hover:bg-white active:bg-[#FAF5EE] border border-[#DBCBB7] disabled:opacity-30 disabled:pointer-events-none shadow-xs active:scale-95 transition-all flex items-center justify-center text-xs font-bold text-zinc-600 hover:text-[#3E2C1C]"
          >
            Effacer
          </button>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            disabled={isSuccess}
            className="h-16 rounded-2xl bg-white hover:bg-[#FAF5EE] active:bg-[#EFE5D8] border border-[#DBCBB7] active:border-[#8C6D46] shadow-xs active:scale-95 transition-all flex flex-col items-center justify-center group"
          >
            <span className="text-xl sm:text-2xl font-bold text-[#3E2C1C] font-display group-hover:text-[#8C6D46] transition-colors leading-none">
              0
            </span>
            <span className="text-[9px] font-bold text-zinc-400 group-hover:text-[#8C6D46] tracking-widest mt-0.5">
              +
            </span>
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            disabled={isSuccess || pin.length === 0}
            className="h-16 rounded-2xl bg-white/70 hover:bg-white active:bg-[#FAF5EE] border border-[#DBCBB7] disabled:opacity-30 disabled:pointer-events-none shadow-xs active:scale-95 transition-all flex items-center justify-center text-zinc-600 hover:text-rose-600"
            title="Effacer le dernier chiffre"
            aria-label="Effacer le dernier chiffre"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Security Note */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-zinc-500">
            Dossier médical crypté · Protection des données de santé
          </p>
        </div>

      </div>
    </div>
  );
};
