import React from 'react';
import { motion as Motion } from 'motion/react';
import { Band, BandType } from '../App';
import { ControlKnob } from './ControlKnob';
import { CheckCircle2, Circle, Settings, Activity, Gauge } from 'lucide-react';

interface BandControlsProps {
  band: Band;
  onUpdate: (updates: Partial<Band>) => void;
}

const BAND_TYPES: { type: BandType; label: string; icon: React.ReactNode }[] = [
  { 
    type: 'lowcut', 
    label: 'LC', 
    icon: (
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 12 6 12 8 8C10 4 14 2 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ) 
  },
  {
    type: 'peaking',
    label: 'PK', 
    icon: (
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10C6 10 8 10 12 2C16 10 18 10 22 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ) 
  },
  {
    type: 'highcut', 
    label: 'HC', 
    icon: (
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2C10 2 14 4 16 8C18 12 22 12 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ) 
  },
  { 
    type: 'brickwallhigh', 
    label: 'BH', 
    icon: (
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12V2H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) 
  },
  { 
    type: 'brickwalllow', 
    label: 'BL', 
    icon: (
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2H20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) 
  },
];

export const BandControls: React.FC<BandControlsProps> = ({ 
  band, 
  onUpdate 
}) => {
  const isBrickwall = band.type === 'brickwalllow' || band.type === 'brickwallhigh';

  const getBandName = (band: Band) => {
    switch (band.id) {
      case 1: return 'LOW_CUT';
      case 2: return 'LOW_MID';
      case 3: return 'HIGH_MID';
      case 4: return 'HIGH_CUT';
      default: return band.type.toUpperCase();
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="w-12 h-12 flex items-center justify-center rounded-xl border-2 font-black text-xl shadow-lg relative overflow-hidden"
            style={{ 
              color: band.color, 
              borderColor: `${band.color}44`, 
              backgroundColor: `${band.color}11` 
            }}
          >
            {band.id}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6784A3]">
                Processor Node
              </span>
              <div className="w-10 h-[1px] bg-[#6784A3]/20" />
            </div>
            <span className="text-sm text-white font-mono font-black tracking-[0.1em]">
              {getBandName(band)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#1A2026]/50 p-1.5 rounded-xl border border-[#2A3036] shadow-inner gap-1">
            {BAND_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => onUpdate({ type: bt.type })}
                className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all duration-200 ${
                  band.type === bt.type
                    ? "bg-[#6784A3] text-white shadow-lg shadow-[#6784A3]/20"
                    : "text-[#6784A3]/40 hover:text-[#6784A3]/80 hover:bg-[#1A2026]"
                }`}
              >
                <div className={`mb-1 transition-transform duration-200 ${band.type === bt.type ? 'scale-110' : 'scale-90 opacity-60'}`}>
                  {bt.icon}
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">{bt.label}</span>
              </button>
            ))}
          </div>

          <div className="w-[1px] h-10 bg-[#1A2026]" />

          <button
            onClick={() => onUpdate({ enabled: !band.enabled })}
            className={`flex items-center gap-3 px-6 py-2 rounded-lg border-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${
              band.enabled 
                ? "bg-[#5FFF9F]/5 border-[#5FFF9F]/30 text-[#5FFF9F] shadow-[#5FFF9F]/10" 
                : "bg-[#1A2026] border-[#2A3036] text-[#6784A3]/20"
            }`}
          >
            {band.enabled ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <Circle size={16} strokeWidth={2.5} />}
            {band.enabled ? 'Active' : 'Bypass'}
          </button>
        </div>
      </div>

      {/* Main Control Knobs Section */}
      <div className="flex items-center justify-center gap-16 px-10">
        <div className="flex items-center gap-24">
          <ControlKnob
            label="Frequency"
            value={band.frequency}
            min={20}
            max={20000}
            unit="Hz"
            color={band.color}
            onChange={(v) => onUpdate({ frequency: v })}
          />

          <ControlKnob
            label="Gain"
            value={band.gain}
            min={-18}
            max={18}
            unit="dB"
            color={band.color}
            onChange={(v) => onUpdate({ gain: v })}
            disabled={isBrickwall}
          />

          <ControlKnob
            label="Bandwidth"
            value={band.q}
            min={0.1}
            max={10}
            unit=""
            color={band.color}
            onChange={(v) => onUpdate({ q: v })}
            disabled={isBrickwall}
          />
        </div>
      </div>
    </div>
  );
};
