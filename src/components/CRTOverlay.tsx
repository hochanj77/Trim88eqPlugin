import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Scanlines */}
      <div className="absolute inset-0 scanline-overlay opacity-30" />
      
      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
      
      {/* Corner Overlays (Industrial text) */}
      <div className="absolute top-6 right-8 text-[7px] font-mono tracking-[0.2em] text-[#FFB000]/10 uppercase pointer-events-none text-right">
        Buffer: 512 SMPL<br />
        Sample Rate: 48.0 KHZ<br />
        Engine: OASIS_CORE_3.4
      </div>
      
      {/* Static noise texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Screen Glare/Reflections */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-white/5 to-transparent skew-y-[-10deg] -translate-y-[50%]" />
      
      {/* Subtle glass glow - slowed down and smoothed */}
      <div className="absolute inset-0 bg-white/5 opacity-5 pointer-events-none" />
      
      {/* Geometric borders / Branding details */}
      <div className="absolute bottom-4 right-6 text-[8px] font-bold tracking-[0.4em] text-[#6784A3]/20 uppercase pointer-events-none select-none">
        Property of Oasis Engineering Corp // Terminal ID: 771-09-X
      </div>

      <style>{`
        @keyframes flicker {
          0% { opacity: 0.27861; }
          5% { opacity: 0.34769; }
          10% { opacity: 0.23604; }
          15% { opacity: 0.90626; }
          20% { opacity: 0.18128; }
          25% { opacity: 0.83891; }
          30% { opacity: 0.65583; }
          35% { opacity: 0.57807; }
          40% { opacity: 0.26559; }
          45% { opacity: 0.84693; }
          50% { opacity: 0.96019; }
          55% { opacity: 0.08594; }
          60% { opacity: 0.20313; }
          65% { opacity: 0.71988; }
          70% { opacity: 0.53455; }
          75% { opacity: 0.37288; }
          80% { opacity: 0.71428; }
          85% { opacity: 0.70419; }
          90% { opacity: 0.7003; }
          95% { opacity: 0.36108; }
          100% { opacity: 0.24387; }
        }
        
        .scanline-overlay {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          ), linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.06), 
            rgba(0, 255, 0, 0.02), 
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 2px, 3px 100%;
        }
      `}</style>
    </div>
  );
};
