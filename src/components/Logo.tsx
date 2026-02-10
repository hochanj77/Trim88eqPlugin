import React from 'react';
import logoImg from 'figma:asset/451d5c602e9714e99d8ee3d240a503ec9341bed0.png';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-6 py-2 px-6 bg-[#0B0F13]/90 rounded-xl border border-[#FFB000]/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all hover:border-[#FFB000]/40">
      {/* Oasis Brand Section */}
      <div className="relative h-8 flex items-center">
        <img 
          src={logoImg} 
          alt="Oasis Logo" 
          className="relative h-full w-auto object-contain brightness-110 contrast-110"
        />
      </div>
      
      {/* Precision Vertical Divider */}
      <div className="h-8 w-[1px] bg-white/10" />
      
      {/* Integrated TR-88 EQ Branding */}
      <div className="flex flex-col items-center justify-center pt-1">
        <div className="flex items-center">
          <span className="text-2xl font-black text-white leading-none tracking-tighter uppercase whitespace-nowrap">
            TR-88 EQ
          </span>
        </div>
        {/* Signature Oasis Gold Underline */}
        <div className="h-[3px] w-full bg-[#FFB000] mt-1 shadow-[0_0_12px_rgba(255,176,0,0.6)] rounded-full" />
      </div>
    </div>
  );
};
