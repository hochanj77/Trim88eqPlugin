import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Save, FolderOpen, Database } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { Band, BandType } from '../App';

interface Preset {
  id: string;
  name: string;
  bands: Band[];
}

interface PresetCategory {
  id: string;
  label: string;
  presets: Preset[];
}

interface PresetSelectorProps {
  onSelect: (bands: Band[]) => void;
  currentBands: Band[];
}

const BAND_COLORS = ['#FF5F5F', '#FFB000', '#A38CF4', '#6784A3'];

const b = (id: number, type: BandType, frequency: number, gain: number, q: number): Band => ({
  id,
  type,
  frequency,
  gain,
  q,
  enabled: true,
  color: BAND_COLORS[id - 1],
});

const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: 'vocals',
    label: 'VOCALS',
    presets: [
      {
        id: 'vocal-clarity',
        name: 'Vocal Clarity',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 350, -3.0, 1.0), b(3, 'peaking', 3000, 2.0, 0.8), b(4, 'highshelf', 10000, 3.0, 0.7)],
      },
      {
        id: 'vocal-warmth',
        name: 'Vocal Warmth',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 220, 3.0, 0.8), b(3, 'peaking', 2500, 0, 1.0), b(4, 'highshelf', 12000, -2.0, 0.7)],
      },
      {
        id: 'vocal-presence',
        name: 'Vocal Presence',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 300, -1.5, 1.0), b(3, 'peaking', 3500, 4.0, 0.6), b(4, 'highshelf', 10000, 1.5, 0.7)],
      },
      {
        id: 'de-mud',
        name: 'De-Mud',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 300, -4.0, 1.5), b(3, 'peaking', 5000, 1.0, 0.8), b(4, 'highshelf', 12000, 2.5, 0.7)],
      },
      {
        id: 'broadcast-podcast',
        name: 'Broadcast / Podcast',
        bands: [b(1, 'lowcut', 100, 0, 0.7), b(2, 'peaking', 180, 2.0, 0.8), b(3, 'peaking', 3000, 3.0, 0.7), b(4, 'highshelf', 10000, 1.0, 0.7)],
      },
      {
        id: 'airy-vocals',
        name: 'Airy Vocals',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 800, -2.0, 1.0), b(3, 'peaking', 5000, 1.0, 0.8), b(4, 'highshelf', 10000, 4.5, 0.7)],
      },
      {
        id: 'nasal-reduction',
        name: 'Nasal Reduction',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 1000, -4.5, 2.5), b(3, 'peaking', 3500, 1.0, 0.8), b(4, 'highshelf', 10000, 0, 0.7)],
      },
    ],
  },
  {
    id: 'drums',
    label: 'DRUMS',
    presets: [
      {
        id: 'kick-punch',
        name: 'Kick Punch',
        bands: [b(1, 'lowcut', 30, 0, 0.7), b(2, 'peaking', 70, 4.0, 1.0), b(3, 'peaking', 300, -3.5, 1.5), b(4, 'peaking', 3500, 3.5, 1.2)],
      },
      {
        id: 'snare-crack',
        name: 'Snare Crack',
        bands: [b(1, 'lowcut', 60, 0, 0.7), b(2, 'peaking', 200, 2.5, 1.0), b(3, 'peaking', 800, -2.0, 1.5), b(4, 'peaking', 3000, 4.0, 1.0)],
      },
      {
        id: 'hihat-shimmer',
        name: 'Hi-Hat Shimmer',
        bands: [b(1, 'lowcut', 300, 0, 0.7), b(2, 'peaking', 2000, 0, 1.0), b(3, 'peaking', 8000, 3.0, 0.8), b(4, 'highshelf', 12000, 2.0, 0.7)],
      },
      {
        id: 'drum-bus-glue',
        name: 'Drum Bus Glue',
        bands: [b(1, 'lowcut', 30, 0, 0.7), b(2, 'lowshelf', 80, 2.0, 0.7), b(3, 'peaking', 400, -2.0, 0.6), b(4, 'highshelf', 10000, 2.5, 0.7)],
      },
      {
        id: 'toms-thump',
        name: 'Toms Thump',
        bands: [b(1, 'lowcut', 30, 0, 0.7), b(2, 'peaking', 90, 3.5, 1.0), b(3, 'peaking', 400, -3.0, 1.5), b(4, 'peaking', 3000, 3.0, 1.0)],
      },
      {
        id: 'overhead-clean',
        name: 'Overhead Clean',
        bands: [b(1, 'lowcut', 200, 0, 0.7), b(2, 'peaking', 1000, 0, 1.0), b(3, 'peaking', 6000, 2.5, 0.8), b(4, 'highshelf', 12000, 3.0, 0.7)],
      },
      {
        id: '808-sub',
        name: '808 Sub',
        bands: [b(1, 'lowcut', 30, 0, 0.7), b(2, 'lowshelf', 50, 5.0, 0.8), b(3, 'peaking', 350, -4.0, 0.8), b(4, 'highshelf', 8000, -2.0, 0.7)],
      },
    ],
  },
  {
    id: 'instruments',
    label: 'INSTRUMENTS',
    presets: [
      {
        id: 'electric-guitar-edge',
        name: 'Electric Guitar Edge',
        bands: [b(1, 'lowcut', 100, 0, 0.7), b(2, 'peaking', 400, -2.0, 1.0), b(3, 'peaking', 2000, 3.5, 0.8), b(4, 'highshelf', 8000, 1.0, 0.7)],
      },
      {
        id: 'piano-fullness',
        name: 'Piano Fullness',
        bands: [b(1, 'lowcut', 60, 0, 0.7), b(2, 'lowshelf', 180, 2.0, 0.7), b(3, 'peaking', 4000, 2.0, 0.8), b(4, 'highshelf', 10000, 1.5, 0.7)],
      },
      {
        id: 'synth-pad-warmth',
        name: 'Synth Pad Warmth',
        bands: [b(1, 'lowcut', 40, 0, 0.7), b(2, 'lowshelf', 150, 2.5, 0.7), b(3, 'peaking', 2000, -1.0, 0.8), b(4, 'highshelf', 8000, -3.0, 0.7)],
      },
      {
        id: 'synth-lead-cut-through',
        name: 'Synth Lead Cut-Through',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 500, -2.5, 1.5), b(3, 'peaking', 3000, 4.0, 0.7), b(4, 'highshelf', 10000, 1.5, 0.7)],
      },
      {
        id: 'strings-sweetness',
        name: 'Strings Sweetness',
        bands: [b(1, 'lowcut', 60, 0, 0.7), b(2, 'peaking', 250, 1.0, 0.8), b(3, 'peaking', 2000, -2.0, 1.5), b(4, 'highshelf', 10000, 3.0, 0.7)],
      },
      {
        id: 'brass-punch',
        name: 'Brass Punch',
        bands: [b(1, 'lowcut', 100, 0, 0.7), b(2, 'peaking', 500, -1.5, 1.0), b(3, 'peaking', 2000, 3.5, 0.8), b(4, 'highshelf', 8000, 1.0, 0.7)],
      },
    ],
  },
  {
    id: 'general',
    label: 'GENERAL',
    presets: [
      {
        id: 'low-cut-80',
        name: 'Low Cut (HPF 80)',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 500, 0, 1.0), b(3, 'peaking', 3000, 0, 1.0), b(4, 'highshelf', 10000, 0, 0.7)],
      },
      {
        id: 'low-cut-120',
        name: 'Low Cut (HPF 120)',
        bands: [b(1, 'lowcut', 120, 0, 0.7), b(2, 'peaking', 500, 0, 1.0), b(3, 'peaking', 3000, 0, 1.0), b(4, 'highshelf', 10000, 0, 0.7)],
      },
      {
        id: 'high-cut-12k',
        name: 'High Cut (LPF 12k)',
        bands: [b(1, 'lowcut', 60, 0, 0.7), b(2, 'peaking', 500, 0, 1.0), b(3, 'peaking', 3000, 0, 1.0), b(4, 'highcut', 12000, 0, 0.7)],
      },
      {
        id: 'telephone',
        name: 'Telephone',
        bands: [b(1, 'lowcut', 300, 0, 0.7), b(2, 'peaking', 1000, 0, 1.0), b(3, 'peaking', 2000, 0, 1.0), b(4, 'highcut', 3500, 0, 0.7)],
      },
      {
        id: 'de-harsh',
        name: 'De-Harsh',
        bands: [b(1, 'lowcut', 30, 0, 0.7), b(2, 'peaking', 500, 0, 1.0), b(3, 'peaking', 3200, -4.0, 2.0), b(4, 'highshelf', 10000, 0, 0.7)],
      },
      {
        id: 'flat-bypass',
        name: 'Flat / Bypass',
        bands: [b(1, 'lowcut', 80, 0, 0.7), b(2, 'peaking', 500, 0, 1.0), b(3, 'peaking', 3000, 0, 1.0), b(4, 'highshelf', 10000, 0, 0.7)],
      },
    ],
  },
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelect, currentBands }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('flat-bypass');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleSelect = (preset: Preset) => {
    onSelect(preset.bands);
    setSelectedId(preset.id);
    setIsOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const activePreset = PRESET_CATEGORIES
    .flatMap(c => c.presets)
    .find(p => p.id === selectedId);

  const activePresetName = activePreset?.name || 'Flat / Bypass';

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
              <span className="text-[11px] text-[#6784A3] font-mono tracking-tighter uppercase">{activePresetName}</span>
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
              className="absolute top-12 left-0 w-72 bg-[#0A0C0F] border-2 border-[#1A2026] shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 overflow-hidden"
            >
              <div className="p-2 border-b border-[#1A2026] bg-[#0D1117] flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#6784A3]/40">Preset Library</span>
                <FolderOpen size={10} className="text-[#6784A3]/40" />
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {PRESET_CATEGORIES.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0D1117]/80 border-b border-[#1A2026]/50 hover:bg-[#1A2026]/40 transition-colors"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB000]">
                        {category.label}
                      </span>
                      <ChevronRight
                        size={12}
                        className={`text-[#6784A3]/40 transition-transform duration-200 ${
                          expandedCategory === category.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <Motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {category.presets.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => handleSelect(preset)}
                              className={`w-full text-left px-6 py-2.5 border-b border-[#1A2026]/30 last:border-0 hover:bg-[#1A2026]/40 transition-colors flex items-center justify-between group ${
                                selectedId === preset.id ? 'bg-[#FFB000]/5' : ''
                              }`}
                            >
                              <span className={`text-xs font-mono tracking-tighter ${selectedId === preset.id ? 'text-[#FFB000]' : 'text-[#6784A3]'}`}>
                                {preset.name}
                              </span>
                              {selectedId === preset.id && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FFB000] shadow-[0_0_8px_rgba(255,176,0,0.6)]" />
                              )}
                            </button>
                          ))}
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
          background: #6784A3;
        }
      `}</style>
    </div>
  );
};
