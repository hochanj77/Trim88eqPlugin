# Trim88eqPlugin — Project Memory

## Project Overview
TR-88 EQ — A 4-band parametric EQ plugin UI built with React, Vite, Tailwind CSS v4, and Motion (Framer Motion). Dark industrial/military aesthetic ("OASIS ENGINEERING" branding). Canvas-based EQ curve display with draggable nodes.

## Architecture
- **App.tsx**: Root component. Holds band state (5 bands: 4 EQ + 1 master), selected band, header with Logo + PresetSelector, EQ display, tabbed band controls, status bar.
- **EQDisplay.tsx**: Canvas-rendered EQ visualization. Draws grid, per-band curves, combined response curve, draggable nodes. Supports mouse drag (freq/gain) and scroll wheel (Q).
- **BandControls.tsx**: Controls for selected band. Band type selector buttons (LC, PK, HC, BH, BL — LS/HS removed), enable/bypass toggle, 3 ControlKnob instances (Frequency, Gain/Master Gain, Bandwidth/Phase Offset).
- **ControlKnob.tsx**: Drag-to-adjust rotary knob with arc progress, hover tooltip, spring animations.
- **PresetSelector.tsx**: Dropdown with 4 collapsible categories (Vocals, Drums, Instruments, General) containing 26 total presets. Each preset sets 4 EQ bands.
- **Logo.tsx**, **CRTOverlay.tsx**: Branding and visual effects.

## Band Types
`BandType = 'lowcut' | 'lowshelf' | 'peaking' | 'highshelf' | 'highcut' | 'brickwalllow' | 'brickwallhigh' | 'master'`

**UI-selectable types** (in BandControls): LC, PK, HC, BH, BL (5 buttons). LS and HS were intentionally removed from the selector but still exist as types (presets can load them).

## Band Colors
- Band 1: `#FF5F5F` (red)
- Band 2: `#FFB000` (amber)
- Band 3: `#A38CF4` (purple)
- Band 4: `#6784A3` (steel blue)
- Band 5 (Master): `#5FFF9F` (green)

## Key Decisions Made
1. **"Quality" renamed to "Bandwidth"** — The third knob label for EQ bands.
2. **Knob tooltip clipping fixed** — Removed `overflow-hidden` from the control panel container in App.tsx so ControlKnob hover tooltips render above the panel.
3. **LS/HS removed from band type selector** — User preference for cleaner UI. Presets that load shelf types still function; users just can't manually switch to shelf from the buttons.
4. **Preset categories** — Accordion-style collapsible categories with animated expand/collapse via Motion. Category labels use `text-[#FFB000]` at 10px for visibility.
5. **Preset EQ curves redesigned** — All 26 presets tuned with proper audio engineering values targeting real frequency problems (see PresetSelector.tsx comments for rationale per preset).

## Preset Summary (26 total)
### Vocals (7)
- Vocal Clarity, Vocal Warmth, Vocal Presence, De-Mud, Broadcast/Podcast, Airy Vocals, Nasal Reduction

### Drums (7)
- Kick Punch, Snare Crack, Hi-Hat Shimmer, Drum Bus Glue, Toms Thump, Overhead Clean, 808 Sub

### Instruments (6)
- Electric Guitar Edge, Piano Fullness, Synth Pad Warmth, Synth Lead Cut-Through, Strings Sweetness, Brass Punch

### General (6)
- Low Cut (HPF 80), Low Cut (HPF 120), High Cut (LPF 12k), Telephone, De-Harsh, Flat/Bypass

## Tech Stack
- React 18, Vite 6.3, Tailwind CSS v4, Motion (framer-motion successor), Lucide icons, Radix UI primitives (mostly unused UI components from shadcn)
- No backend, no audio processing — pure UI/design prototype

## Development Branch
Work done on `claude/study-tr88-ui-3tVDi`
