import React, { useState } from 'react';
import { ChevronDown, Save, FolderOpen, Database } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { Band } from '../App';

interface Preset {
  id: string;
  name: string;
  bands: Band[];
}

interface PresetSelectorProps {
  onSelect: (bands: Band[]) => void;
  currentBands: Band[];
}

const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default',
    name: '00_INIT_SYSTEM',
    bands: [
      { id: 1, type: 'lowshelf', frequency: 100, gain: 0, q: 0.7, enabled: true, color: '#FF5F5F' },
      { id: 2, type: 'peaking', frequency: 500, gain: 0, q: 1.0, enabled: true, color: '#6784A3' },
      { id: 3, type: 'peaking', frequency: 2000, gain: 0, q: 1.0, enabled: true, color: '#FFB000' },
      { id: 4, type: 'highshelf', frequency: 8000, gain: 0, q: 0.7, enabled: true, color: '#5FFF9F' },
    ]
  },
  {
    id: 'deep-kick',
    name: '01_DEEP_PULSE',
    bands: [
      { id: 1, type: 'peaking', frequency: 60, gain: 4.5, q: 1.5, enabled: true, color: '#FF5F5F' },
      { id: 2, type: 'peaking', frequency: 250, gain: -3.0, q: 2.0, enabled: true, color: '#6784A3' },
      { id: 3, type: 'peaking', frequency: 3500, gain: 2.0, q: 1.2, enabled: true, color: '#FFB000' },
      { id: 4, type: 'highcut', frequency: 12000, gain: 0, q: 0.7, enabled: true, color: '#5FFF9F' },
    ]
  },
  {
    id: 'vocal-air',
    name: '02_VOCAL_ATMOS',
    bands: [
      { id: 1, type: 'lowcut', frequency: 120, gain: 0, q: 0.7, enabled: true, color: '#FF5F5F' },
      { id: 2, type: 'peaking', frequency: 1500, gain: 1.5, q: 0.8, enabled: true, color: '#6784A3' },
      { id: 3, type: 'highshelf', frequency: 8000, gain: 4.0, q: 0.7, enabled: true, color: '#FFB000' },
      { id: 4, type: 'peaking', frequency: 3500, gain: 2.0, q: 1.0, enabled: true, color: '#5FFF9F' },
    ]
  },
  {
    id: 'mid-bite',
    name: '03_MID_DEFINITION',
    bands: [
      { id: 1, type: 'lowshelf', frequency: 200, gain: -2.0, q: 0.7, enabled: true, color: '#FF5F5F' },
      { id: 2, type: 'peaking', frequency: 800, gain: 3.5, q: 2.5, enabled: true, color: '#6784A3' },
      { id: 3, type: 'peaking', frequency: 2500, gain: 4.0, q: 1.8, enabled: true, color: '#FFB000' },
      { id: 4, type: 'highcut', frequency: 15000, gain: 0, q: 0.7, enabled: true, color: '#5FFF9F' },
    ]
  }
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelect, currentBands }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('default');

  const handleSelect = (preset: Preset) => {
    onSelect(preset.bands);
    setSelectedId(preset.id);
    setIsOpen(false);
  };

  const activePreset = DEFAULT_PRESETS.find(p => p.id === selectedId) || DEFAULT_PRESETS[0];

  return (
    <div className="relative z-[100]">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-64 h-10 px-4 bg-[#0A0C0F] border border-[#1A2026] hover:border-[#FFB000]/40 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Database size={14} className="text-[#FFB000]/60 group-hover:text-[#FFB000]" />
            <div className="flex flex-col items-start">
              <span className="text-[7px] text-[#6784A3]/40 uppercase font-bold tracking-widest leading-none mb-0.5">Active Preset</span>
              <span className="text-[11px] text-[#6784A3] font-mono tracking-tighter uppercase">{activePreset.name}</span>
            </div>
          </div>
          <ChevronDown size={14} className={`text-[#6784A3]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <button className="h-10 w-10 flex items-center justify-center bg-[#0D1117] border border-[#1A2026] text-[#6784A3]/40 hover:text-[#5FFF9F] hover:border-[#5FFF9F]/30 transition-all">
          <Save size={16} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 left-0 w-64 bg-[#0A0C0F] border-2 border-[#1A2026] shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 overflow-hidden"
            >
              <div className="p-2 border-b border-[#1A2026] bg-[#0D1117] flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#6784A3]/40">Preset Library</span>
                <FolderOpen size={10} className="text-[#6784A3]/40" />
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {DEFAULT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelect(preset)}
                    className={`w-full text-left px-4 py-3 border-b border-[#1A2026]/50 last:border-0 hover:bg-[#1A2026]/40 transition-colors flex items-center justify-between group ${
                      selectedId === preset.id ? 'bg-[#FFB000]/5' : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-xs font-mono tracking-tighter ${selectedId === preset.id ? 'text-[#FFB000]' : 'text-[#6784A3]'}`}>
                        {preset.name}
                      </span>
                      <span className="text-[8px] uppercase tracking-widest text-[#6784A3]/30">Verified Oasis Binary</span>
                    </div>
                    {selectedId === preset.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFB000] shadow-[0_0_8px_rgba(255,176,0,0.6)]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2 bg-[#050608] flex justify-center">
                <span className="text-[7px] uppercase tracking-[0.3em] text-[#6784A3]/20">End of Data Stream</span>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050608;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1A2026;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6784A3/40;
        }
      `}</style>
    </div>
  );
};
