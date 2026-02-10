import React from 'react';
import { Band, BandType } from '../App';
import { ControlKnob } from './ControlKnob';
import { CheckCircle2, Circle, Settings, Activity, Gauge } from 'lucide-react';

interface BandControlsProps {
  band: Band;
  onUpdate: (updates: Partial<Band>) => void;
}

const BAND_TYPES: { type: BandType; label: string; icon: React.ReactNode }[] = [
  { type: 'lowshelf', label: 'LS', icon: <Activity size={10} /> },
  { type: 'peaking', label: 'PK', icon: <Activity size={10} /> },
  { type: 'highshelf', label: 'HS', icon: <Activity size={10} /> },
  { type: 'lowcut', label: 'LC', icon: <Activity size={10} /> },
  { type: 'highcut', label: 'HC', icon: <Activity size={10} /> },
];

export const BandControls: React.FC<BandControlsProps> = ({ 
  band, 
  onUpdate 
}) => {
  const isMaster = band.type === 'master';

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
            {isMaster ? 'M' : band.id}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6784A3]">
                {isMaster ? 'Final Stage' : 'Processor Node'}
              </span>
              <div className="w-10 h-[1px] bg-[#6784A3]/20" />
            </div>
            <span className="text-sm text-white font-mono font-bold tracking-tight">
              {isMaster ? 'OASIS_MASTER_OUT // GAIN_COMP' : `OASIS_NODE_${band.id.toString().padStart(2, '0')} // TYPE_${band.type.toUpperCase()}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isMaster && (
            <div className="flex bg-[#1A2026]/50 p-1 rounded-lg border border-[#2A3036] shadow-inner">
              {BAND_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => onUpdate({ type: bt.type })}
                  className={`flex flex-col items-center justify-center w-12 h-10 rounded-md transition-all ${
                    band.type === bt.type 
                      ? "bg-[#6784A3] text-white shadow-lg shadow-[#6784A3]/20" 
                      : "text-[#6784A3]/40 hover:text-[#6784A3]/80 hover:bg-[#1A2026]"
                  }`}
                >
                  <span className="text-[8px] font-black uppercase tracking-tighter mb-0.5">{bt.label}</span>
                  {bt.icon}
                </button>
              ))}
            </div>
          )}

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
        {!isMaster ? (
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
            />

            <ControlKnob 
              label="Q / Quality" 
              value={band.q} 
              min={0.1} 
              max={10} 
              unit="" 
              color={band.color}
              onChange={(v) => onUpdate({ q: v })}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-20">
              <div className="flex flex-col items-center gap-3">
                <div className="h-32 w-6 bg-[#1A2026] rounded-full relative overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#5FFF9F] to-[#FFB000]"
                    style={{ height: `${Math.max(0, ((band.gain + 18) / 36) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none opacity-20">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[1px] w-full bg-white" />)}
                  </div>
                </div>
                <span className="text-[8px] font-black text-[#6784A3]/60 uppercase tracking-widest">L_CHAN</span>
              </div>

              <ControlKnob 
                label="Master Gain" 
                value={band.gain} 
                min={-18} 
                max={18} 
                unit="dB" 
                color="#5FFF9F"
                onChange={(v) => onUpdate({ gain: v })}
              />

              <div className="flex flex-col items-center gap-3">
                <div className="h-32 w-6 bg-[#1A2026] rounded-full relative overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#5FFF9F] to-[#FFB000]"
                    style={{ height: `${Math.max(0, ((band.gain + 18) / 36) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none opacity-20">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[1px] w-full bg-white" />)}
                  </div>
                </div>
                <span className="text-[8px] font-black text-[#6784A3]/60 uppercase tracking-widest">R_CHAN</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Precision Detail Footer */}
      <div className="flex justify-between items-center px-2 py-3 bg-black/30 rounded-lg border border-[#1A2026]/50">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-[#6784A3]/40 uppercase tracking-[0.2em]">Processing Latency</span>
            <span className="text-[10px] font-mono text-[#5FFF9F]">0.00ms // ZERO-LATENCY</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-[#6784A3]/40 uppercase tracking-[0.2em]">Phase Response</span>
            <span className="text-[10px] font-mono text-[#6784A3]/80">LINEAR_PHASE_MODE</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[#6784A3]/30">
          <span>Module_v4.2</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#6784A3]/20" />
          <span>Oasis_Core_X</span>
        </div>
      </div>
    </div>
  );
};
