import React, { useState, useMemo } from 'react';
import { EQDisplay } from './components/EQDisplay';
import { BandControls } from './components/BandControls';
import { Logo } from './components/Logo';
import { PresetSelector } from './components/PresetSelector';
import { Power, Maximize2, Settings2, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type BandType = 'lowcut' | 'lowshelf' | 'peaking' | 'highshelf' | 'highcut' | 'master';

export interface Band {
  id: number;
  type: BandType;
  frequency: number;
  gain: number;
  q: number;
  enabled: boolean;
  color: string;
}

const INITIAL_BANDS: Band[] = [
  { id: 1, type: 'lowshelf', frequency: 100, gain: 0, q: 0.7, enabled: true, color: '#FF5F5F' },
  { id: 2, type: 'peaking', frequency: 1000, gain: 0, q: 1.0, enabled: true, color: '#A38CF4' },
  { id: 3, type: 'highshelf', frequency: 8000, gain: 0, q: 0.7, enabled: true, color: '#6784A3' },
  { id: 4, type: 'master', frequency: 0, gain: 0, q: 0, enabled: true, color: '#5FFF9F' },
];

export default function App() {
  const [bands, setBands] = useState<Band[]>(INITIAL_BANDS);
  const [selectedBandId, setSelectedBandId] = useState<number>(2);
  const [isPowerOn, setIsPowerOn] = useState(true);

  const selectedBand = useMemo(() => 
    bands.find(b => b.id === selectedBandId) || bands[0], 
  [bands, selectedBandId]);

  const updateBand = (id: number, updates: Partial<Band>) => {
    setBands(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-4 selection:bg-[#FFB000]/30">
      {/* Main Rack Chassis */}
      <div className="relative w-full max-w-6xl bg-[#0D1117] border-[3px] border-[#1A2026] rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Modern Industrial Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1A2026] bg-gradient-to-b from-[#14181E] to-[#0D1117] relative">
          {/* Subtle metal texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="flex items-center gap-8 relative z-10">
            <Logo />
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <PresetSelector 
              onSelect={(newBands) => setBands(newBands)} 
              currentBands={bands} 
            />
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-bold text-[#6784A3]/60 uppercase tracking-widest">Master System</span>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPowerOn ? 'bg-[#5FFF9F] shadow-[0_0_8px_#5FFF9F]' : 'bg-red-900'}`} />
                  <span className={`text-[11px] font-mono ${isPowerOn ? 'text-[#5FFF9F]' : 'text-red-900/60'}`}>
                    {isPowerOn ? "STABLE" : "OFFLINE"}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsPowerOn(!isPowerOn)}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 active:scale-90 ${
                  isPowerOn 
                    ? "bg-[#5FFF9F]/5 border-[#5FFF9F]/40 text-[#5FFF9F] shadow-[inset_0_0_10px_rgba(95,255,159,0.1)]" 
                    : "bg-[#1A2026] border-[#2A3036] text-[#6784A3]/20"
                }`}
              >
                <Power size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Interface Body */}
        <div className="p-8 space-y-8 bg-[#0D1117] relative">
          {/* Recessed Display Panel */}
          <div className="relative p-1 bg-[#1A2026] rounded-xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-[25/9] w-full bg-[#050608] rounded-lg border border-black overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {/* High-res Grid Lines Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#6784A3 1px, transparent 1px), linear-gradient(90deg, #6784A3 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              <EQDisplay 
                bands={bands} 
                selectedBandId={selectedBandId}
                onSelectBand={setSelectedBandId}
                onUpdateBand={updateBand}
                isPowerOn={isPowerOn}
              />
              
              {/* OLED Burn-in Simulation & Static UI */}
              <div className="absolute top-6 left-8 flex items-center gap-4 pointer-events-none opacity-40">
                <Activity size={14} className="text-[#FFB000] animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">Spectrum Analyzer</span>
                  <span className="text-[8px] font-mono text-[#6784A3] uppercase">Engaged // 64-Bit FP</span>
                </div>
              </div>

              <div className="absolute bottom-6 right-8 flex items-center gap-6 pointer-events-none opacity-30">
                <div className="flex items-center gap-2">
                  <Cpu size={12} />
                  <span className="text-[9px] font-mono">DSP LOAD: 14%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} />
                  <span className="text-[9px] font-mono">LATENCY: 0.1ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Matrix */}
          <div className="grid grid-cols-12 gap-8 items-stretch">
            {/* Vertical Band Navigation */}
            <div className="col-span-1 flex flex-col gap-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1 text-center text-[#6784A3]/40">Processor</span>
              {bands.map((band, idx) => {
                const labels = ['L', 'M', 'H', 'MSTR'];
                return (
                  <button
                    key={band.id}
                    onClick={() => setSelectedBandId(band.id)}
                    className={`h-14 w-full flex items-center justify-center rounded-lg border-2 transition-all duration-200 relative group overflow-hidden ${
                      selectedBandId === band.id 
                        ? "bg-[#1A2026] border-[#6784A3] text-white shadow-[0_5px_15px_rgba(0,0,0,0.3)]" 
                        : "bg-[#0A0C0F] border-[#1A2026] text-[#6784A3]/40 hover:border-[#6784A3]/20"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-black font-mono leading-none ${selectedBandId === band.id ? 'text-white' : 'text-inherit'}`}>
                        {labels[idx]}
                      </span>
                      <span className="text-[7px] font-bold opacity-30 mt-1">NODE_{band.id}</span>
                    </div>
                    {selectedBandId === band.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute right-0 w-1.5 h-full"
                        style={{ backgroundColor: band.color }}
                      />
                    )}
                    {/* Subtle hover glow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>

            {/* Main Processor Panel */}
            <div className="col-span-11 bg-[#0A0C0F] border border-[#1A2026] p-8 rounded-xl relative shadow-xl overflow-hidden group">
               {/* Industrial Branding Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Settings2 size={160} strokeWidth={0.5} />
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBandId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <BandControls 
                    band={selectedBand} 
                    onUpdate={(updates) => updateBand(selectedBandId, updates)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-8 py-3 bg-[#050608] border-t border-[#1A2026] flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-[#6784A3]/30">
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#6784A3]/30" /> OVERSAMPLING: 4X</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#6784A3]/30" /> ENGINE: 1.0.42_PRO</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#6784A3]/30" /> CRC: OK</span>
          </div>
          <div className="flex gap-8 items-center">
            <span className="text-[#FFB000]/40">PROPERTY OF OASIS ENGINEERING</span>
            <span>BUILD_FEB_2026</span>
          </div>
        </div>
      </div>

      <style>{`
        @font-face {
          font-family: 'Inter';
          src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}
