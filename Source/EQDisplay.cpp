#include "EQDisplay.h"

EQDisplay::EQDisplay (TR88EQProcessor& processor)
    : processorRef (processor)
{
    // Pre-compute log-spaced frequency points for curve rendering
    for (int i = 0; i < numFreqPoints; ++i)
    {
        double t = (double) i / (double) (numFreqPoints - 1);
        freqPoints[(size_t) i] = minFreq * std::pow ((double) maxFreq / minFreq, t);
    }

    fftDisplayData.resize ((size_t) TR88EQProcessor::fftSize / 2, 0.0f);

    setMouseCursor (juce::MouseCursor::CrosshairCursor);
    startTimerHz (30);
}

EQDisplay::~EQDisplay()
{
    stopTimer();
}

void EQDisplay::timerCallback()
{
    repaint();
}

// --- Coordinate Mapping ---

float EQDisplay::freqToX (float freq) const
{
    auto w = (float) getWidth();
    return (std::log10 (freq / minFreq) / std::log10 (maxFreq / minFreq)) * w;
}

float EQDisplay::xToFreq (float x) const
{
    auto w = (float) getWidth();
    return minFreq * std::pow (maxFreq / minFreq, x / w);
}

float EQDisplay::dbToY (float db) const
{
    auto h = (float) getHeight();
    auto midY = h / 2.0f;
    return midY - (db / maxDb) * (h / 2.0f);
}

float EQDisplay::yToDb (float y) const
{
    auto h = (float) getHeight();
    auto midY = h / 2.0f;
    return (midY - y) / (h / 2.0f) * maxDb;
}

// --- Drawing ---

void EQDisplay::paint (juce::Graphics& g)
{
    g.fillAll (TR88Colours::bgDeepest);

    drawGrid (g);
    drawSpectrumAnalyzer (g);
    drawBandCurves (g);
    drawCompositeCurve (g);
    drawNodes (g);
    drawHUD (g);
    drawScanlines (g);
}

void EQDisplay::resized()
{
}

void EQDisplay::drawGrid (juce::Graphics& g)
{
    auto w = (float) getWidth();
    auto h = (float) getHeight();

    // Vertical frequency lines
    const float freqs[] = { 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000 };

    for (auto f : freqs)
    {
        auto x = freqToX (f);
        g.setColour (TR88Colours::border);
        g.drawVerticalLine ((int) x, 0.0f, h);

        // Label
        g.setColour (TR88Colours::textSecondary.withAlpha (0.3f));
        g.setFont (juce::Font (10.0f, juce::Font::bold));
        juce::String label = f >= 1000.0f ? juce::String (f / 1000.0f, 0) + "k" : juce::String ((int) f);
        g.drawText (label, (int) x - 20, (int) h - 22, 40, 16, juce::Justification::centred);
    }

    // Horizontal dB lines
    const float dbs[] = { -18, -12, -6, 0, 6, 12, 18 };

    for (auto db : dbs)
    {
        auto y = dbToY (db);
        g.setColour (db == 0.0f ? TR88Colours::borderLight : TR88Colours::gridDark);
        g.drawHorizontalLine ((int) y, 0.0f, w);

        // Label
        g.setColour (TR88Colours::textSecondary.withAlpha (0.2f));
        g.setFont (juce::Font (9.0f, juce::Font::bold));
        juce::String label = (db > 0 ? "+" : "") + juce::String ((int) db) + "dB";
        g.drawText (label, 8, (int) y - 12, 50, 16, juce::Justification::centredLeft);
    }
}

void EQDisplay::drawSpectrumAnalyzer (juce::Graphics& g)
{
    processorRef.getFFTData (fftDisplayData.data(), (int) fftDisplayData.size());

    auto w = (float) getWidth();
    auto h = (float) getHeight();
    auto sr = processorRef.getCurrentSampleRate();
    auto numBins = (int) fftDisplayData.size();

    juce::Path spectrumPath;
    bool started = false;

    for (int i = 1; i < numBins; ++i)
    {
        auto freq = (float) i * (float) sr / (float) (numBins * 2);
        if (freq < minFreq || freq > maxFreq) continue;

        auto x = freqToX (freq);
        auto magnitude = fftDisplayData[(size_t) i];
        auto y = juce::jmap (magnitude, 0.0f, 1.0f, h, h * 0.15f);

        if (! started)
        {
            spectrumPath.startNewSubPath (x, h);
            spectrumPath.lineTo (x, y);
            started = true;
        }
        else
        {
            spectrumPath.lineTo (x, y);
        }
    }

    if (started)
    {
        spectrumPath.lineTo (w, h);
        spectrumPath.closeSubPath();

        juce::ColourGradient grad (TR88Colours::textSecondary.withAlpha (0.0f), 0.0f, h,
                                    TR88Colours::textSecondary.withAlpha (0.1f), 0.0f, h * 0.3f, false);
        g.setGradientFill (grad);
        g.fillPath (spectrumPath);
    }
}

void EQDisplay::drawBandCurves (juce::Graphics& g)
{
    auto w = (float) getWidth();
    auto h = (float) getHeight();
    auto midY = h / 2.0f;

    std::vector<double> magnitudes ((size_t) numFreqPoints);

    for (int b = 0; b < 3; ++b)
    {
        auto bp = processorRef.getBandParameters (b);
        if (bp.enabled->load() < 0.5f) continue;

        processorRef.getMagnitudeResponseForBand (b, freqPoints.data(), magnitudes.data(), numFreqPoints);

        auto bandColour = TR88Colours::getBandColour (b);
        bool isSelected = (b == selectedBand);

        // Fill
        juce::Path fillPath;
        for (int i = 0; i < numFreqPoints; ++i)
        {
            auto x = (float) i / (float) (numFreqPoints - 1) * w;
            auto db = (float) juce::Decibels::gainToDecibels (magnitudes[(size_t) i]);
            db = juce::jlimit (-maxDb, maxDb, db);
            auto y = dbToY (db);

            if (i == 0) fillPath.startNewSubPath (x, y);
            else fillPath.lineTo (x, y);
        }
        fillPath.lineTo (w, midY);
        fillPath.lineTo (0.0f, midY);
        fillPath.closeSubPath();

        g.setColour (bandColour.withAlpha (isSelected ? 0.15f : 0.06f));
        g.fillPath (fillPath);

        // Stroke
        juce::Path strokePath;
        for (int i = 0; i < numFreqPoints; ++i)
        {
            auto x = (float) i / (float) (numFreqPoints - 1) * w;
            auto db = (float) juce::Decibels::gainToDecibels (magnitudes[(size_t) i]);
            db = juce::jlimit (-maxDb, maxDb, db);
            auto y = dbToY (db);

            if (i == 0) strokePath.startNewSubPath (x, y);
            else strokePath.lineTo (x, y);
        }

        g.setColour (bandColour.withAlpha (isSelected ? 0.8f : 0.4f));
        g.strokePath (strokePath, juce::PathStrokeType (isSelected ? 2.0f : 1.0f));
    }
}

void EQDisplay::drawCompositeCurve (juce::Graphics& g)
{
    auto w = (float) getWidth();

    std::vector<double> magnitudes ((size_t) numFreqPoints);
    processorRef.getCompositeMagnitudeResponse (freqPoints.data(), magnitudes.data(), numFreqPoints);

    juce::Path curvePath;
    for (int i = 0; i < numFreqPoints; ++i)
    {
        auto x = (float) i / (float) (numFreqPoints - 1) * w;
        auto db = (float) juce::Decibels::gainToDecibels (magnitudes[(size_t) i]);
        db = juce::jlimit (-maxDb, maxDb, db);
        auto y = dbToY (db);

        if (i == 0) curvePath.startNewSubPath (x, y);
        else curvePath.lineTo (x, y);
    }

    // Glow
    g.setColour (juce::Colours::white.withAlpha (0.15f));
    g.strokePath (curvePath, juce::PathStrokeType (6.0f));

    // Main white curve
    g.setColour (juce::Colours::white);
    g.strokePath (curvePath, juce::PathStrokeType (3.0f, juce::PathStrokeType::curved,
                                                    juce::PathStrokeType::rounded));
}

void EQDisplay::drawNodes (juce::Graphics& g)
{
    for (int b = 0; b < 3; ++b)
    {
        auto bp = processorRef.getBandParameters (b);
        if (bp.enabled->load() < 0.5f) continue;

        auto pos = getNodePosition (b);
        auto bandColour = TR88Colours::getBandColour (b);
        bool isSelected = (b == selectedBand);
        bool isHovered = (b == hoveredBand);

        // Outer glow
        {
            auto glowRadius = isSelected ? 22.0f : 16.0f;
            juce::ColourGradient grad (bandColour.withAlpha (0.25f), pos.x, pos.y,
                                        juce::Colours::transparentBlack, pos.x + glowRadius, pos.y, true);
            g.setGradientFill (grad);
            g.fillEllipse (pos.x - glowRadius, pos.y - glowRadius,
                           glowRadius * 2.0f, glowRadius * 2.0f);
        }

        // Inner circle
        auto nodeRadius = 10.0f;
        g.setColour (bandColour);
        g.fillEllipse (pos.x - nodeRadius, pos.y - nodeRadius,
                       nodeRadius * 2.0f, nodeRadius * 2.0f);

        // White border
        g.setColour (juce::Colours::white);
        g.drawEllipse (pos.x - nodeRadius, pos.y - nodeRadius,
                       nodeRadius * 2.0f, nodeRadius * 2.0f, 2.0f);

        // Label
        g.setFont (juce::Font (11.0f, juce::Font::bold));
        g.setColour (juce::Colours::white);
        g.drawText (juce::String (b + 1), (int) (pos.x - 8), (int) (pos.y - 7), 16, 14,
                    juce::Justification::centred);

        // Tooltip on hover/selected
        if (isSelected || isHovered)
        {
            auto freq = bp.freq->load();
            auto gain = bp.gain->load();
            juce::String tooltip = juce::String ((int) freq) + "Hz // "
                                    + juce::String (gain, 1) + "dB";

            g.setFont (juce::Font (12.0f, juce::Font::bold));
            g.setColour (juce::Colours::white);
            g.drawText (tooltip, (int) (pos.x - 60), (int) (pos.y - 38), 120, 16,
                        juce::Justification::centred);
        }
    }
}

void EQDisplay::drawHUD (juce::Graphics& g)
{
    // Top-left HUD
    g.setColour (TR88Colours::gold.withAlpha (0.4f));
    g.fillEllipse (24.0f, 22.0f, 6.0f, 6.0f); // Pulsing dot simulation

    g.setColour (juce::Colours::white.withAlpha (0.4f));
    g.setFont (juce::Font (10.0f, juce::Font::bold));
    g.drawText ("SPECTRUM ANALYZER", 38, 18, 200, 14, juce::Justification::centredLeft);

    g.setColour (TR88Colours::textSecondary.withAlpha (0.4f));
    g.setFont (juce::Font (8.0f));
    g.drawText ("ENGAGED // 64-BIT FP", 38, 30, 200, 12, juce::Justification::centredLeft);

    // Bottom-right HUD
    auto w = getWidth();
    auto h = getHeight();

    g.setColour (juce::Colours::white.withAlpha (0.3f));
    g.setFont (juce::Font (9.0f));
    g.drawText ("DSP LOAD: 14%", w - 250, h - 28, 110, 14, juce::Justification::centredRight);
    g.drawText ("LATENCY: 0.1ms", w - 130, h - 28, 120, 14, juce::Justification::centredRight);
}

void EQDisplay::drawScanlines (juce::Graphics& g)
{
    auto h = (float) getHeight();
    auto w = (float) getWidth();

    // Subtle scanline effect
    g.setColour (juce::Colours::black.withAlpha (0.05f));
    for (float y = 0.0f; y < h; y += 2.0f)
        g.fillRect (0.0f, y, w, 1.0f);

    // Vignette
    {
        juce::ColourGradient vignette (juce::Colours::transparentBlack, w / 2.0f, h / 2.0f,
                                        juce::Colours::black.withAlpha (0.4f), 0.0f, 0.0f, true);
        g.setGradientFill (vignette);
        g.fillRect (getLocalBounds());
    }
}

// --- Node Interaction ---

juce::Point<float> EQDisplay::getNodePosition (int bandIndex) const
{
    auto bp = processorRef.getBandParameters (bandIndex);
    auto freq = bp.freq->load();
    auto gain = bp.gain->load();
    int type = (int) bp.type->load();

    auto x = freqToX (freq);
    // Cut filters show node at 0dB line
    auto y = (type == 3 || type == 4) ? dbToY (0.0f) : dbToY (gain);

    return { x, y };
}

int EQDisplay::hitTestNode (juce::Point<float> pos) const
{
    for (int b = 0; b < 3; ++b)
    {
        auto bp = processorRef.getBandParameters (b);
        if (bp.enabled->load() < 0.5f) continue;

        auto nodePos = getNodePosition (b);
        if (pos.getDistanceFrom (nodePos) < 25.0f)
            return b;
    }
    return -1;
}

void EQDisplay::mouseDown (const juce::MouseEvent& e)
{
    auto pos = e.position;
    auto hit = hitTestNode (pos);

    if (hit >= 0)
    {
        selectedBand = hit;
        isDragging = true;
        setMouseCursor (juce::MouseCursor::DraggingHandCursor);

        if (onBandSelected)
            onBandSelected (hit);
    }
}

void EQDisplay::mouseDrag (const juce::MouseEvent& e)
{
    if (! isDragging || selectedBand < 0) return;

    auto freq = juce::jlimit (minFreq, maxFreq, xToFreq (e.position.x));
    auto gain = juce::jlimit (-maxDb, maxDb, yToDb (e.position.y));

    auto idx = juce::String (selectedBand + 1);
    if (auto* p = processorRef.apvts.getParameter ("band" + idx + "_freq"))
        p->setValueNotifyingHost (p->convertTo0to1 (freq));
    if (auto* p = processorRef.apvts.getParameter ("band" + idx + "_gain"))
        p->setValueNotifyingHost (p->convertTo0to1 (gain));
}

void EQDisplay::mouseUp (const juce::MouseEvent&)
{
    isDragging = false;
    setMouseCursor (hoveredBand >= 0 ? juce::MouseCursor::PointingHandCursor
                                      : juce::MouseCursor::CrosshairCursor);
}

void EQDisplay::mouseMove (const juce::MouseEvent& e)
{
    auto hit = hitTestNode (e.position);
    if (hit != hoveredBand)
    {
        hoveredBand = hit;
        setMouseCursor (hit >= 0 ? juce::MouseCursor::PointingHandCursor
                                  : juce::MouseCursor::CrosshairCursor);
        repaint();
    }
}

void EQDisplay::mouseWheelMove (const juce::MouseEvent& e, const juce::MouseWheelDetails& wheel)
{
    // Scroll adjusts Q on hovered/selected band
    int targetBand = hoveredBand >= 0 ? hoveredBand : selectedBand;
    if (targetBand < 0 || targetBand >= 3) return;

    auto idx = juce::String (targetBand + 1);
    if (auto* p = processorRef.apvts.getParameter ("band" + idx + "_q"))
    {
        auto currentVal = p->convertFrom0to1 (p->getValue());
        auto delta = wheel.deltaY * 0.5f;
        auto newVal = juce::jlimit (0.1f, 10.0f, currentVal + delta);
        p->setValueNotifyingHost (p->convertTo0to1 (newVal));
    }
}

void EQDisplay::mouseDoubleClick (const juce::MouseEvent& e)
{
    auto hit = hitTestNode (e.position);
    if (hit >= 0)
    {
        // Reset gain to 0dB
        auto idx = juce::String (hit + 1);
        if (auto* p = processorRef.apvts.getParameter ("band" + idx + "_gain"))
            p->setValueNotifyingHost (p->convertTo0to1 (0.0f));
    }
}
