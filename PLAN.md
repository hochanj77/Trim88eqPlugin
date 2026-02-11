# OASIS TR-88 EQ — JUCE Plugin Implementation Plan

## Overview

Build a fully functional parametric EQ VST3/AU/Standalone plugin using JUCE + CMake.
The React prototype in this repo serves as the **exact visual reference** — every color,
layout, interaction, and knob behavior is replicated in native JUCE C++ graphics.

---

## Phase 1: Project Scaffold & CMake Setup

### Goal: A plugin that compiles, loads in a DAW, and shows a blank dark window.

**Files to create:**
```
CMakeLists.txt
Source/
  PluginProcessor.h
  PluginProcessor.cpp
  PluginEditor.h
  PluginEditor.cpp
```

**CMakeLists.txt:**
- `cmake_minimum_required(VERSION 3.22)`
- JUCE path set via a variable (defaulting to `../JUCE` for portability, overridable with `-DJUCE_PATH=...`)
- `juce_add_plugin(TR88_EQ ...)` with VST3, AU, Standalone formats
- Company: "Oasis Creative Labs", codes: `Oasi` / `Tr88`
- Link `juce::juce_audio_utils` and `juce::juce_dsp`
- Compile defs: disable web browser, curl, splash screen, VST2 compat

**PluginProcessor:**
- Inherit `juce::AudioProcessor`
- Create `AudioProcessorValueTreeState` (APVTS) with all parameters:
  - Per band (x3): `band{N}_freq`, `band{N}_gain`, `band{N}_q`, `band{N}_type`, `band{N}_enabled`
  - Global: `master_gain`, `power`
- Parameter ranges:
  - freq: `NormalisableRange<float>(20.f, 20000.f, 1.f, 0.25f)` (skewed for log)
  - gain: `NormalisableRange<float>(-18.f, 18.f, 0.01f)`
  - q: `NormalisableRange<float>(0.1f, 10.f, 0.01f, 0.5f)` (skewed)
  - type: `StringArray{"lowshelf","peaking","highshelf","lowcut","highcut"}`
  - enabled/power: bool
- Default frequencies: Band1=100Hz, Band2=1000Hz, Band3=8000Hz
- Stub `prepareToPlay()`, `processBlock()`, `getStateInformation()`/`setStateInformation()`
- Support mono (1in/1out) and stereo (2in/2out) bus layouts

**PluginEditor:**
- Inherit `juce::AudioProcessorEditor`
- Set initial size to 1100x700 (approximately matching the React prototype's proportions)
- Fill background with `#0D1117`
- Just enough to verify the plugin loads

**Validation:** Plugin compiles, loads in standalone host, shows dark window.

---

## Phase 2: DSP Engine

### Goal: All 5 filter types processing audio correctly with parameter control.

**Files to modify/create:**
```
Source/PluginProcessor.h/cpp  (expand)
```

**Architecture:**
- Use `juce::dsp::ProcessorChain` or manual per-band processing
- Each band is a struct holding:
  - `juce::dsp::IIR::Filter<float>` (stereo: one per channel, or use `ProcessorDuplicator`)
  - For low/high cut: cascade 2 filters for 24dB/oct (4th order)
- Processing flow in `processBlock()`:
  1. Check `power` parameter — if off, pass audio through unchanged
  2. For each enabled band, apply its filter
  3. Apply master gain at the end
  4. Process in `float` (JUCE IIR filters work in float; 64-bit not directly supported by `IIR::Filter<float>` but we use `double` coefficients)
- Coefficient update:
  - On parameter change, recalculate coefficients using:
    - `makeLowShelf(sampleRate, freq, q, Decibels::decibelsToGain(gain))`
    - `makePeakFilter(sampleRate, freq, q, Decibels::decibelsToGain(gain))`
    - `makeHighShelf(sampleRate, freq, q, Decibels::decibelsToGain(gain))`
    - `makeHighPass(sampleRate, freq, q)` for lowcut
    - `makeLowPass(sampleRate, freq, q)` for highcut
  - Update coefficients in `processBlock()` or via a listener, NOT in the audio callback at high frequency — use atomic flags

**FIFO for Spectrum Analyzer (set up now, render later):**
- Circular buffer (ring buffer) to push samples from `processBlock()`
- `juce::AbstractFifo` or simple atomic-index ring buffer
- FFT order 12 (4096 points) for good low-frequency resolution
- `juce::dsp::FFT` instance + `juce::dsp::WindowingFunction<float>` (Hann)
- Push post-EQ samples into the FIFO

**Validation:** Load in DAW, process audio through a known signal, verify EQ is applied (use a spectrum analyzer plugin after TR-88 to confirm).

---

## Phase 3: Custom LookAndFeel

### Goal: A `juce::LookAndFeel_V4` subclass that defines the entire visual theme.

**Files to create:**
```
Source/LookAndFeel.h
Source/LookAndFeel.cpp
```

**Theme Constants (matching React prototype):**
```cpp
namespace Colours {
    const juce::Colour bgDeepest    { 0xFF050608 };  // Outermost background
    const juce::Colour bgChassis    { 0xFF0D1117 };  // Main panel body
    const juce::Colour bgControls   { 0xFF0A0C0F };  // Controls panel bg
    const juce::Colour bgHeader     { 0xFF14181E };  // Header gradient start
    const juce::Colour border       { 0xFF1A2026 };  // Panel borders
    const juce::Colour borderLight  { 0xFF2A3036 };  // Lighter dividers
    const juce::Colour textSecondary{ 0xFF6784A3 };  // Labels, muted text
    const juce::Colour gold         { 0xFFFFB000 };  // Primary accent
    const juce::Colour green        { 0xFF5FFF9F };  // Active/power state
    const juce::Colour white        { 0xFFFFFFFF };
    const juce::Colour band1       { 0xFFFF5F5F };  // Low band — red
    const juce::Colour band2       { 0xFFA38CF4 };  // Mid band — purple
    const juce::Colour band3       { 0xFF6784A3 };  // High band — blue-gray
    const juce::Colour master      { 0xFF5FFF9F };  // Master — green
}
```

**Typography:**
- Primary font: Inter (bundled as BinaryData) or system sans-serif fallback
- Monospace: system mono for readouts
- Weight classes: Black (900), Bold (700), Normal (400)
- Sizes matching React: 7px–14px for labels, 11px for values, 2xl for "TR-88 EQ" title

**LookAndFeel overrides:**
- `drawRotarySlider()` — custom knob matching ControlKnob.tsx
- `drawLabel()` — custom styling for readouts
- `drawComboBox()` / `drawPopupMenuItem()` — for preset selector
- `drawToggleButton()` — for enable/bypass and power
- Background drawing helpers for recessed panels, borders, shadows

**Validation:** Apply LookAndFeel to editor, verify background colors and basic element styling.

---

## Phase 4: ControlKnob Component

### Goal: Custom rotary knob matching ControlKnob.tsx exactly.

**Files to create:**
```
Source/ControlKnob.h
Source/ControlKnob.cpp
```

**Visual Design (from ControlKnob.tsx):**
- **Outer size:** 96x96px (size-24 = 6rem)
- **Arc track:** 270° sweep (-135° to +135°), 4px stroke, bg `#1A2026`, active stroke in band color (gold `#FFB000` when dragging)
- **Knob body:** 68px outer ring (gradient `#2A3036` to `#111418`), 56px inner (brushed `#1A2026` with conic gradient texture), inner recess 6px inset
- **Indicator notch:** 3x10px rounded gold bar at top, with glow shadow
- **Rotation:** Spring-animated in React; in JUCE use `juce::ComponentAnimator` or just smooth interpolation via timer
- **Tooltip:** Gold `#FFB000` pill with value text, appears on hover/drag, positioned above knob with downward arrow
- **Value readout below:** 14px mono bold white value + 9px unit label, with gold gradient underline

**Interaction:**
- Vertical drag to adjust (drag up = increase, down = decrease)
- Sensitivity: 0.005 * range per pixel (matching React)
- Cursor changes to `ns-resize` during drag
- Attach to APVTS parameter via `juce::SliderParameterAttachment`

**Implementation:**
- Subclass `juce::Slider` with `RotaryVerticalDrag` style
- Override `paint()` entirely via LookAndFeel or direct in component
- Override `mouseEnter`/`mouseExit` for hover state
- Use `juce::Path` for arc drawing, `juce::AffineTransform::rotation` for knob body

**Validation:** Knob renders correctly, drag changes value, tooltip appears, readout updates.

---

## Phase 5: BandControls Panel

### Goal: The lower control panel matching BandControls.tsx.

**Files to create:**
```
Source/BandControls.h
Source/BandControls.cpp
```

**Layout (from BandControls.tsx):**
- **Left column (1/12):** 4 vertical band selector buttons (L, M, H, MSTR)
  - Each 56px tall, full width, rounded-lg, border-2
  - Selected: bg `#1A2026`, border `#6784A3`, white text, colored right-edge indicator bar
  - Unselected: bg `#0A0C0F`, border `#1A2026`, muted text
  - Labels: `L`, `M`, `H`, `MSTR` in mono bold + tiny `NODE_{id}` sublabel
- **Right panel (11/12):** Content for selected band
  - **Header row:**
    - Band ID badge (colored border + tinted bg)
    - "Processor Node" label + `OASIS_NODE_0{N} // TYPE_{type}` mono text
    - Filter type selector: row of 5 buttons (LS/PK/HS/LC/HC), selected = filled `#6784A3`
    - Enable/Bypass toggle button (green active, muted bypassed)
  - **Knobs row (centered):**
    - For EQ bands: 3 ControlKnobs — Frequency, Gain, Q/Quality — spaced gap-24 (96px)
    - For Master: L/R channel meters + single Master Gain knob
  - **Footer row:**
    - "Processing Latency: 0.00ms // ZERO-LATENCY"
    - "Phase Response: LINEAR_PHASE_MODE" (decorative)
    - "Module_v4.2 / Oasis_Core_X"

**Master band view:**
- Vertical meter bars: 32px tall, 6px wide, rounded-full, gradient green-to-gold
- Fill height driven by master gain parameter mapped to 0-100%
- Labels: `L_CHAN`, `R_CHAN`

**Interaction:**
- Click band button → switch selected band (with crossfade animation if feasible)
- Filter type buttons → update `band{N}_type` parameter
- Enable toggle → update `band{N}_enabled` parameter

**Validation:** Switching bands updates knobs, type selector works, enable/bypass toggles.

---

## Phase 6: EQ Curve Display

### Goal: The main EQ display matching EQDisplay.tsx response rendering.

**Files to create:**
```
Source/EQDisplay.h
Source/EQDisplay.cpp
```

**Display area:**
- Recessed panel: outer `#1A2026` bg with inset shadow, inner `#050608` bg
- Aspect ratio approximately 25:9 (match React)
- Grid overlay: vertical lines at 20,50,100,200,500,1k,2k,5k,10k,20kHz with frequency labels
- Horizontal lines at -18,-12,-6,0,+6,+12,+18dB with dB labels
- 0dB line slightly brighter (`#2A3036`) than others (`#14181E`)

**Frequency response curves:**
- Calculate actual magnitude response from the JUCE IIR coefficients (not the approximate React math)
- Use `juce::dsp::IIR::Coefficients::getMagnitudeForFrequencyArray()` for each band
- Multiply responses (in linear domain) to get composite
- Convert to dB for display
- **Per-band curves:** filled region (band color at low alpha) + stroke (band color, selected=0.8 opacity/2px, unselected=0.4/1px)
- **Composite curve:** white, 3px, with glow shadow

**Coordinate mapping:**
- X axis: log-frequency `x = log10(f/20) / log10(20000/20) * width`
- Y axis: linear dB `y = midY - (dB / 18) * (height / 2)`

**HUD overlays (decorative, matching React):**
- Top-left: "Spectrum Analyzer" / "Engaged // 64-Bit FP" (Activity icon pulse)
- Bottom-right: "DSP LOAD: {actual}%" / "LATENCY: 0.1ms"

**Rendering:**
- Use `juce::Component::paint()` with `juce::Graphics`
- Repaint on timer (30-60fps) for spectrum analyzer updates
- Use `juce::Path` for smooth curves, `juce::PathStrokeType` for strokes
- Use `juce::ColourGradient` for fills

**Validation:** Curves render correctly, match actual DSP filter response, update when parameters change.

---

## Phase 7: Spectrum Analyzer

### Goal: Real-time FFT spectrum display behind the EQ curves.

**Implementation (in PluginProcessor + EQDisplay):**

**PluginProcessor (data collection):**
- FIFO ring buffer sized to FFT size (4096)
- In `processBlock()`: push post-EQ mono-summed samples into FIFO
- Atomic flag `fftDataReady` signals new data available

**EQDisplay (rendering):**
- Timer callback (30-60fps): check if new FFT data available
- Apply Hann window to FIFO data
- Perform forward FFT
- Convert complex output to magnitude (dB)
- Map to log-frequency x-axis positions
- Apply smoothing: `displayed[i] = max(displayed[i] * decayRate, newValue[i])`
  - `decayRate` ~0.85–0.93 for smooth falloff
- Render as filled vertical bars or smooth path
- Style: gradient from `#6784A3` at 0% opacity (bottom) to 10% opacity (top), matching React's fake analyzer but with real data

**Validation:** Load audio, see real-time spectrum moving behind curves. Verify low-frequency resolution and smoothing.

---

## Phase 8: Draggable Nodes (FabFilter-style)

### Goal: Interactive band nodes on the EQ display.

**Implementation (in EQDisplay):**

**Node rendering:**
- Each enabled non-master band gets a circular node at (freq_x, gain_y)
- Outer glow: radial gradient, 22px radius selected / 16px unselected
- Inner circle: 10px radius, filled with band color, white 2px stroke
- Center label: band number in white bold 11px
- Hover/selected tooltip: `"{freq}Hz // {gain}dB"` above node

**Interaction:**
- `mouseDown`: hit-test nodes (30px radius), select band
- `mouseDrag`: update frequency (x-axis → log freq) and gain (y-axis → dB)
- `mouseWheelMove`: adjust Q of selected/hovered band (scroll up = higher Q = narrower)
- `mouseDoubleClick` on empty space: could add a new band (future expansion) or reset band to default
- `mouseDoubleClick` on node: reset that band to 0dB gain
- Cursor: crosshair default, pointer on hover over node, grabbing while dragging

**Parameter updates:**
- During drag, update APVTS parameters for the selected band's freq and gain
- Q scroll updates Q parameter
- All changes are undo-able via APVTS

**Validation:** Drag nodes, verify parameter changes reflect in DAW automation, Q scroll works.

---

## Phase 9: Preset System

### Goal: Preset load/save matching PresetSelector.tsx factory presets.

**Files to create:**
```
Source/PresetManager.h
Source/PresetManager.cpp
```

**Factory Presets (normalized to 3 bands + master):**
```
00_INIT_SYSTEM:   LS@100Hz/0dB/0.7Q, PK@1000Hz/0dB/1.0Q, HS@8000Hz/0dB/0.7Q, master=0dB
01_DEEP_PULSE:    PK@60Hz/+4.5dB/1.5Q, PK@250Hz/-3dB/2.0Q, PK@3500Hz/+2dB/1.2Q, master=0dB
02_VOCAL_ATMOS:   LC@120Hz/0dB/0.7Q, PK@1500Hz/+1.5dB/0.8Q, HS@8000Hz/+4dB/0.7Q, master=0dB
03_MID_DEFINITION: LS@200Hz/-2dB/0.7Q, PK@800Hz/+3.5dB/2.5Q, PK@2500Hz/+4dB/1.8Q, master=0dB
```

**User Presets:**
- Save directory: `juce::File::getSpecialLocation(userApplicationDataDirectory) / "Oasis Creative Labs" / "TR-88 EQ" / "Presets"`
- Format: XML files using APVTS `copyState().createXml()`
- Load: `APVTS::replaceState()` from parsed XML

**UI (in PluginEditor header):**
- Preset dropdown (ComboBox or custom popup) matching PresetSelector.tsx styling
- Save button (floppy icon) — opens save dialog or saves to current name
- Previous/Next navigation arrows (optional polish)

**Validation:** Load factory presets, verify all parameters update. Save user preset, close/reopen plugin, load it back.

---

## Phase 10: Header, Status Bar & Final Polish

### Goal: Complete the UI shell matching App.tsx layout.

**Header bar:**
- Left: Logo — "TR-88 EQ" text in 2xl bold white with gold underline bar
  - (Oasis logo image can be embedded as BinaryData PNG, or simplified to text)
- Right: Preset selector + Power button with STABLE/OFFLINE indicator

**Status bar (bottom):**
- Left: `OVERSAMPLING: 4X` / `ENGINE: 1.0.42_PRO` / `CRC: OK`
- Right: `PROPERTY OF OASIS ENGINEERING` / `BUILD_FEB_2026`
- Style: 9px bold uppercase, tracking 0.4em, `#6784A3` at 30% opacity

**CRT Overlay (subtle):**
- Optional scanline effect on EQ display (very low opacity)
- Vignette shadow on display edges

**Animation polish:**
- Smooth parameter interpolation for knob rotation
- Crossfade when switching bands (if feasible without excessive complexity)

**Final checks:**
- Verify all parameter automation works in DAW
- Verify state save/restore (getStateInformation/setStateInformation)
- Test mono and stereo bus layouts
- Ensure no Windows-specific APIs (cross-platform compatible)
- Verify AU format loads on macOS (code-level only; actual build on separate machine)

---

## File Creation Order

| Step | Files | Phase |
|------|-------|-------|
| 1 | `CMakeLists.txt` | 1 |
| 2 | `Source/PluginProcessor.h`, `Source/PluginProcessor.cpp` | 1+2 |
| 3 | `Source/PluginEditor.h`, `Source/PluginEditor.cpp` | 1 |
| 4 | `Source/LookAndFeel.h`, `Source/LookAndFeel.cpp` | 3 |
| 5 | `Source/ControlKnob.h`, `Source/ControlKnob.cpp` | 4 |
| 6 | `Source/BandControls.h`, `Source/BandControls.cpp` | 5 |
| 7 | `Source/EQDisplay.h`, `Source/EQDisplay.cpp` | 6+7+8 |
| 8 | `Source/PresetManager.h`, `Source/PresetManager.cpp` | 9 |

Total: 15 new C++ files + 1 CMakeLists.txt

---

## Key Design Decisions

1. **Master gain is a standalone parameter**, not a band — eliminates the React prototype's preset inconsistency.
2. **Magnitude response from actual IIR coefficients** — not the approximate Gaussian math from the React prototype. Uses `getMagnitudeForFrequencyArray()` for pixel-perfect accuracy.
3. **APVTS for all parameters** — enables DAW automation, undo, and state persistence for free.
4. **JUCE_PATH is configurable** — defaults to `../JUCE` but overridable via `-DJUCE_PATH=...` for portability across machines.
5. **No platform-specific code** — all source files are cross-platform C++.
6. **3 fixed bands for V1** — architecture supports expansion but parameter tree is fixed at 3 bands + master to keep APVTS simple.
