import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ControlKnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
  color: string;
  step?: number;
}

export const ControlKnob: React.FC<ControlKnobProps> = ({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  color,
  step = 0.1
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);

  // Map value to rotation (-135 to 135 degrees)
  // -135deg is approx 7:30 o'clock, 135deg is approx 4:30 o'clock
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ns-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    const deltaY = startYRef.current - e.clientY;
    const range = max - min;
    const sensitivity = 0.005; 
    const newValue = Math.min(max, Math.max(min, startValueRef.current + deltaY * range * sensitivity));
    onChange(Number(newValue.toFixed(2)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, []);

  // Arc path calculation
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    // We swap start and end in the command because SVG arcs draw clockwise
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none group">
      {/* Precision Label */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#6784A3]/60 group-hover:text-[#6784A3] transition-colors duration-300">
          {label}
        </span>
      </div>

      <div 
        className="relative size-24 flex items-center justify-center cursor-ns-resize"
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Progress Display Arcs */}
        <svg className="absolute inset-0 size-full pointer-events-none" viewBox="0 0 100 100">
          {/* Background Track */}
          <path
            d={describeArc(50, 50, 42, -135, 135)}
            fill="none"
            stroke="#1A2026"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Active Progress */}
          <motion.path
            d={describeArc(50, 50, 42, -135, rotation)}
            fill="none"
            stroke={isDragging ? "#FFB000" : color}
            strokeWidth="4"
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(255,176,0,0.3)]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </svg>

        {/* Value Tooltip (HUD) - Matches Image */}
        <AnimatePresence>
          {(isHovered || isDragging) && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute -top-10 px-3 py-1.5 bg-[#FFB000] rounded-lg pointer-events-none z-[100] shadow-[0_10px_20px_rgba(0,0,0,0.4)] flex flex-col items-center"
            >
              <span className="text-[11px] font-black text-black tracking-tight whitespace-nowrap">
                {value.toFixed(1)}{unit}
              </span>
              {/* Tooltip Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#FFB000]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Knob */}
        <div className="relative size-[68px] flex items-center justify-center">
          {/* Deep Outer Casting */}
          <div className="absolute inset-[-2px] rounded-full bg-black/50 blur-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]" />
          
          {/* Hardware Base */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#2A3036] to-[#111418] border border-white/5" />
          
          {/* Main Knob Body */}
          <motion.div 
            className="relative size-[56px] rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden"
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
          >
            {/* Brushed Texture Layer */}
            <div className="absolute inset-0 bg-[#1A2026]" />
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1) 25%, transparent 50%, rgba(255,255,255,0.1) 75%, transparent)`,
              }}
            />
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Inner Recess Detail */}
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#2A3036] to-[#090C0F] border border-white/[0.04]" />

            {/* Precision Indicator Notch */}
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[3px] h-[10px] rounded-full bg-[#FFB000] shadow-[0_0_12px_#FFB000]" />
          </motion.div>
        </div>
      </div>

      {/* Static Precision Readout */}
      <div className="flex flex-col items-center gap-0.5 min-w-[70px]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[14px] font-mono font-black text-white tracking-tighter">
            {value > 999 ? (value/1000).toFixed(2) : Math.round(value)}
          </span>
          <span className="text-[9px] font-black text-[#6784A3] uppercase opacity-60">
            {value > 999 ? 'k' : ''}{unit}
          </span>
        </div>
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FFB000]/20 to-transparent" />
      </div>
    </div>
  );
};
