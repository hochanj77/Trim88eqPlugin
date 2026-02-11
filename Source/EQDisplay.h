#pragma once
#include <juce_gui_basics/juce_gui_basics.h>
#include <juce_dsp/juce_dsp.h>
#include "PluginProcessor.h"
#include "LookAndFeel.h"

class EQDisplay : public juce::Component, private juce::Timer
{
public:
    EQDisplay (TR88EQProcessor& processor);
    ~EQDisplay() override;

    void paint (juce::Graphics& g) override;
    void resized() override;

    void mouseDown (const juce::MouseEvent& e) override;
    void mouseDrag (const juce::MouseEvent& e) override;
    void mouseUp (const juce::MouseEvent& e) override;
    void mouseMove (const juce::MouseEvent& e) override;
    void mouseWheelMove (const juce::MouseEvent& e, const juce::MouseWheelDetails& wheel) override;
    void mouseDoubleClick (const juce::MouseEvent& e) override;

    int getSelectedBand() const { return selectedBand; }
    void setSelectedBand (int band) { selectedBand = band; repaint(); }

    std::function<void (int)> onBandSelected;

private:
    void timerCallback() override;

    TR88EQProcessor& processorRef;

    int selectedBand = 1;   // 0-2 for EQ bands, -1 for none
    int hoveredBand = -1;
    bool isDragging = false;

    // Coordinate mapping
    float freqToX (float freq) const;
    float xToFreq (float x) const;
    float dbToY (float db) const;
    float yToDb (float y) const;

    // Drawing
    void drawGrid (juce::Graphics& g);
    void drawSpectrumAnalyzer (juce::Graphics& g);
    void drawBandCurves (juce::Graphics& g);
    void drawCompositeCurve (juce::Graphics& g);
    void drawNodes (juce::Graphics& g);
    void drawHUD (juce::Graphics& g);
    void drawScanlines (juce::Graphics& g);

    // Node hit testing
    int hitTestNode (juce::Point<float> pos) const;
    juce::Point<float> getNodePosition (int bandIndex) const;

    // Frequency points for curve drawing
    static constexpr int numFreqPoints = 512;
    std::array<double, numFreqPoints> freqPoints {};

    // FFT display data
    std::vector<float> fftDisplayData;

    static constexpr float minFreq = 20.0f;
    static constexpr float maxFreq = 20000.0f;
    static constexpr float maxDb   = 18.0f;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (EQDisplay)
};
