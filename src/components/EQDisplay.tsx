import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Band } from '../App';

interface EQDisplayProps {
  bands: Band[];
  selectedBandId: number;
  onSelectBand: (id: number) => void;
  onUpdateBand: (id: number, updates: Partial<Band>) => void;
  isPowerOn: boolean;
}

const FREQ_POINTS = 300; 
const DB_MAX = 18;

export const EQDisplay: React.FC<EQDisplayProps> = ({ 
  bands, 
  selectedBandId, 
  onSelectBand, 
  onUpdateBand,
  isPowerOn 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredBandId, setHoveredBandId] = useState<number | null>(null);

  const bandsRef = useRef(bands);
  const selectedBandIdRef = useRef(selectedBandId);
  const isPowerOnRef = useRef(isPowerOn);
  const hoveredBandIdRef = useRef(hoveredBandId);

  useEffect(() => {
    bandsRef.current = bands;
    selectedBandIdRef.current = selectedBandId;
    isPowerOnRef.current = isPowerOn;
  }, [bands, selectedBandId, isPowerOn]);

  useEffect(() => {
    hoveredBandIdRef.current = hoveredBandId;
  }, [hoveredBandId]);

  const frequencies = useMemo(() => {
    const min = 20;
    const max = 20000;
    const points = [];
    for (let i = 0; i < FREQ_POINTS; i++) {
      points.push(min * Math.pow(max / min, i / (FREQ_POINTS - 1)));
    }
    return points;
  }, []);

  const getResponse = (freq: number, band: Band) => {
    if (!band.enabled) return 0;
    const f0 = band.frequency;
    const gain = band.gain;
    const q = band.q;
    
    switch (band.type) {
      case 'peaking': {
        const dist = Math.abs(Math.log10(freq / f0));
        const width = 0.5 / q;
        return gain * Math.exp(-Math.pow(dist / width, 2));
      }
      case 'lowshelf': {
        if (freq > f0 * 2) return 0;
        return gain * (1 / (1 + Math.pow(freq / f0, 2)));
      }
      case 'highshelf': {
        if (freq < f0 / 2) return 0;
        return gain * (1 / (1 + Math.pow(f0 / freq, 2)));
      }
      case 'lowcut': {
        return -60 * (1 / (1 + Math.pow(freq / (f0 * 0.5), 4)));
      }
      case 'highcut': {
        return -60 * (1 / (1 + Math.pow((f0 * 2) / freq, 4)));
      }
      case 'brickwalllow': {
        return freq > f0 ? -200 : 0;
      }
      case 'brickwallhigh': {
        return freq < f0 ? -200 : 0;
      }
      case 'master': return 0;
      default: return 0;
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    const currentBands = bandsRef.current;
    const currentSelectedId = selectedBandIdRef.current;
    const currentIsPowerOn = isPowerOnRef.current;
    const currentHoveredId = hoveredBandIdRef.current;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.lineWidth = 1;
    [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].forEach(f => {
      const x = (Math.log10(f / 20) / Math.log10(20000 / 20)) * width;
      ctx.beginPath();
      ctx.strokeStyle = '#1A2026';
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.fillStyle = '#6784A3';
      ctx.globalAlpha = 0.3;
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      const label = f >= 1000 ? `${f/1000}k` : f.toString();
      ctx.fillText(label, x, height - 10);
      ctx.globalAlpha = 1;
    });

    [-18, -12, -6, 0, 6, 12, 18].forEach(db => {
      const y = midY - (db / DB_MAX) * (height / 2);
      ctx.beginPath();
      ctx.strokeStyle = db === 0 ? '#2A3036' : '#14181E';
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.fillStyle = '#6784A3';
      ctx.globalAlpha = 0.2;
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${db > 0 ? '+' : ''}${db}dB`, 10, y - 4);
      ctx.globalAlpha = 1;
    });

    if (!currentIsPowerOn) return;

    // Analyzer
    ctx.beginPath();
    const time = Date.now() / 2000;
    for(let i = 0; i < width; i+=8) {
      const val = Math.max(0, (Math.sin(i / 100 + time * 3) * 15 + Math.sin(i / 40 - time * 5) * 8 + 40) * (1 - i/width) * 0.8);
      const grad = ctx.createLinearGradient(i, height, i, height - val);
      grad.addColorStop(0, 'rgba(103, 132, 163, 0)');
      grad.addColorStop(1, 'rgba(103, 132, 163, 0.1)');
      ctx.fillStyle = grad;
      ctx.fillRect(i, height - val - 20, 4, val);
    }

    // Individual Band Fills & Strokes
    currentBands.forEach(b => {
      if (!b.enabled || b.type === 'master') return;
      const isSelected = b.id === currentSelectedId;
      
      // Fill
      ctx.beginPath();
      frequencies.forEach((f, i) => {
        const g = getResponse(f, b);
        const x = (i / (FREQ_POINTS - 1)) * width;
        const y = midY - (g / DB_MAX) * (height / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(width, midY);
      ctx.lineTo(0, midY);
      ctx.fillStyle = isSelected ? `${b.color}44` : `${b.color}1A`;
      ctx.fill();

      // Stroke
      ctx.beginPath();
      ctx.strokeStyle = b.color;
      ctx.globalAlpha = isSelected ? 0.8 : 0.4;
      ctx.lineWidth = isSelected ? 2 : 1;
      frequencies.forEach((f, i) => {
        const g = getResponse(f, b);
        const x = (i / (FREQ_POINTS - 1)) * width;
        const y = midY - (g / DB_MAX) * (height / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Main Curve
    ctx.beginPath();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    frequencies.forEach((f, i) => {
      let totalGain = 0;
      currentBands.forEach(b => { totalGain += getResponse(f, b); });
      const x = (i / (FREQ_POINTS - 1)) * width;
      const y = midY - (totalGain / DB_MAX) * (height / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Nodes
    currentBands.forEach(b => {
      if (!b.enabled || b.type === 'master') return;
      const x = (Math.log10(b.frequency / 20) / Math.log10(20000 / 20)) * width;
      const isFixedGain = b.type === 'lowcut' || b.type === 'highcut' || b.type === 'brickwalllow' || b.type === 'brickwallhigh';
      const y = isFixedGain ? midY : midY - (b.gain / DB_MAX) * (height / 2);
      const isSelected = b.id === currentSelectedId;
      const isHovered = b.id === currentHoveredId;

      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 22 : 16, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, isSelected ? 22 : 16);
      grad.addColorStop(0, `${b.color}44`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.id.toString(), x, y);

      if (isSelected || isHovered) {
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${Math.round(b.frequency)}Hz // ${b.gain.toFixed(1)}dB`, x, y - 30);
      }
    });
  };

  useEffect(() => {
    let animationId: number;
    const render = () => { draw(); animationId = requestAnimationFrame(render); };
    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    for (const b of bands) {
      if (b.type === 'master') continue;
      const bx = (Math.log10(b.frequency / 20) / Math.log10(20000 / 20)) * canvas.width;
      const isFixedGain = b.type === 'lowcut' || b.type === 'highcut' || b.type === 'brickwalllow' || b.type === 'brickwallhigh';
      const by = isFixedGain ? (canvas.height / 2) : (canvas.height / 2) - (b.gain / DB_MAX) * (canvas.height / 2);
      if (Math.sqrt(Math.pow(x - bx, 2) + Math.pow(y - by, 2)) < 30) {
        onSelectBand(b.id);
        setIsDragging(true);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    if (isDragging) {
      const b = bands.find(b => b.id === selectedBandId);
      const isFixedGain = b?.type === 'lowcut' || b?.type === 'highcut' || b?.type === 'brickwalllow' || b?.type === 'brickwallhigh';
      
      const freq = Math.max(20, Math.min(20000, 20 * Math.pow(20000 / 20, x / canvas.width)));
      const gain = isFixedGain ? 0 : Math.max(-18, Math.min(18, ((canvas.height / 2 - y) / (canvas.height / 2)) * DB_MAX));
      onUpdateBand(selectedBandId, { frequency: freq, gain });
    }
    let found = null;
    for (const b of bands) {
      if (b.type === 'master') continue;
      const bx = (Math.log10(b.frequency / 20) / Math.log10(20000 / 20)) * canvas.width;
      const isFixedGain = b.type === 'lowcut' || b.type === 'highcut' || b.type === 'brickwalllow' || b.type === 'brickwallhigh';
      const by = isFixedGain ? (canvas.height / 2) : (canvas.height / 2) - (b.gain / DB_MAX) * (canvas.height / 2);
      if (Math.sqrt(Math.pow(x - bx, 2) + Math.pow(y - by, 2)) < 25) { found = b.id; break; }
    }
    setHoveredBandId(found);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!hoveredBandId) return;
    e.preventDefault();
    const band = bands.find(b => b.id === hoveredBandId);
    if (!band || band.type === 'master') return;
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newQ = Math.max(0.1, Math.min(10, band.q + delta));
    onUpdateBand(hoveredBandId, { q: newQ });
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative w-full h-full group">
      <canvas
        ref={canvasRef}
        width={1600}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }
          handleMouseMove(e);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredBandId(null);
        }}
        onWheel={handleWheel}
        className={`w-full h-full cursor-${hoveredBandId ? 'pointer' : isDragging ? 'grabbing' : 'crosshair'}`}
      />
      
      {/* Precision Node HUD Tooltip */}
      {(isDragging || hoveredBandId) && (
        <div 
          className="absolute pointer-events-none z-50 px-3 py-1.5 bg-[#FFB000] text-black font-black text-[10px] rounded shadow-xl flex flex-col items-center"
          style={{ 
            left: `${mousePos.x}px`, 
            top: `${mousePos.y - 45}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {(() => {
            const b = isDragging ? bands.find(b => b.id === selectedBandId) : bands.find(b => b.id === hoveredBandId);
            if (!b) return null;
            return (
              <>
                <span className="whitespace-nowrap uppercase tracking-tighter">
                  {Math.round(b.frequency)}Hz // {b.gain.toFixed(1)}dB
                </span>
                <span className="text-[8px] opacity-70 mt-0.5">
                  BW: {b.q.toFixed(2)}
                </span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FFB000] rotate-45" />
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
