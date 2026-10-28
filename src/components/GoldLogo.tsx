import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface GoldLogoProps {
  className?: string;
  size?: number;
  withSparkle?: boolean;
  alt?: string;
}

export const GoldLogo: React.FC<GoldLogoProps> = ({
  className = 'w-9 h-9',
  size,
  withSparkle = true,
  alt = 'Protocole FIV - Fatou'
}) => {
  const [imageError, setImageError] = useState(false);
  const logoSrc = "/assets/aistudio/Gemini_Generated_Image_g594exg594exg594_Original_3_254b0a7d.JPG";

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Outer Bronze & Gold Medallion Rim */}
      <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-br from-[#E5C378] via-[#BA936A] to-[#6E4924] shadow-sm flex items-center justify-center overflow-hidden">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#3E2C1C] flex items-center justify-center">
          {!imageError ? (
            <img
              src={logoSrc}
              alt={alt}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-[50%_35%] rounded-full select-none transform transition-transform duration-300 group-hover:scale-105"
              loading="eager"
            />
          ) : (
            <span className="font-display font-black text-xs text-[#FAF7F2]">F</span>
          )}
        </div>
      </div>

      {/* Subtle Golden Glow / Sparkle */}
      {withSparkle && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center pointer-events-none">
          <Sparkles className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37] drop-shadow-xs" />
        </span>
      )}
    </div>
  );
};
