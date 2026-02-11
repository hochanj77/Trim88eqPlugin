import React, { useState, useMemo } from 'react';
import { EQDisplay } from './components/EQDisplay';
import { BandControls } from './components/BandControls';
import { Logo } from './components/Logo';
import { PresetSelector } from './components/PresetSelector';
import { Power, Maximize2, Settings2, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';

export type BandType = 'lowcut' | 'lowshelf' | 'peaking' | 'highshelf' | 'highcut' | 'brickwalllow' | 'brickwallhigh' | 'master';

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
  { id: 1, type: 'lowcut', frequency: 100, gain: 0, q: 0.7, enabled: true, color: '#FF5F5F' },
  { id: 2, type: 'peaking', frequency: 500, gain: 0, q: 1.0, enabled: true, color: '#FFB000' },
  { id: 3, type: 'peaking', frequency: 2500, gain: 0, q: 1.0, enabled: true, color: '#A38CF4' },
  { id: 4, type: 'highcut', frequency: 12000, gain: 0, q: 0.7, enabled: true, color: '#6784A3' },
  { id: 5, type: 'master', frequency: 100, gain: 0, q: 0, enabled: true, color: '#5FFF9F' },
];

export default function App() {
  const [bands, setBands] = useState<Band[]>(INITIAL_BANDS);
  const [selectedBandId, setSelectedBandId] = useState<number>(2);

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
        <div className="grid grid-cols-3 items-center px-8 py-6 border-b border-[#1A2026] bg-gradient-to-b from-[#14181E] to-[#0D1117] relative">
          {/* Subtle metal texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="flex items-center gap-8 relative z-10 justify-start">
            <Logo />
          </div>

          <div className="flex items-center justify-center relative z-10">
            <PresetSelector 
              onSelect={(newBands) => setBands(newBands)} 
              currentBands={bands} 
            />
          </div>

          <div className="relative z-10 justify-self-end">
            {/* Right spacer for centering */}
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
                isPowerOn={true}
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
          <div className="w-full">
            {/* Main Processor Panel */}
            <div className="bg-[#0A0C0F] border border-[#1A2026] rounded-xl relative shadow-xl group">
               {/* Industrial Branding Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Settings2 size={160} strokeWidth={0.5} />
              </div>

              {/* Horizontal Node Tabs */}
              <div className="flex border-b border-[#1A2026] bg-[#0D1117]/50">
                {bands.map((band, idx) => {
                  const labels = ['LOW_CUT', 'LOW_MID', 'HIGH_MID', 'HIGH_CUT', 'MASTER'];
                  const isActive = selectedBandId === band.id;
                  return (
                    <button
                      key={band.id}
                      onClick={() => setSelectedBandId(band.id)}
                      className={`flex-1 py-4 flex flex-col items-center justify-center transition-all duration-300 relative group/tab ${
                        isActive 
                          ? "bg-[#1A2026] text-white" 
                          : "text-[#6784A3]/40 hover:text-[#6784A3]/70 hover:bg-[#1A2026]/30"
                      }`}
                    >
                      <span className={`text-[10px] font-black font-mono tracking-[0.2em] ${isActive ? 'text-white' : 'text-inherit'}`}>
                        {labels[idx]}
                      </span>
                      <span className="text-[6px] font-bold opacity-30 mt-1 uppercase tracking-widest">Processor_Node_0{band.id}</span>
                      
                      {isActive && (
                        <Motion.div 
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px]"
                          style={{ backgroundColor: band.color }}
                        />
                      )}
                      
                      {/* Interaction Glow */}
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/tab:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
              
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <Motion.div
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
                  </Motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-8 py-4 bg-[#050608] border-t border-[#1A2026] flex justify-center items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#FFB000] opacity-80">
            PROPERTY OF OASIS ENGINEERING
          </span>
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
