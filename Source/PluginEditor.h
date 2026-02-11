#pragma once
#include <juce_audio_processors/juce_audio_processors.h>
#include "PluginProcessor.h"
#include "LookAndFeel.h"
#include "EQDisplay.h"
#include "BandControls.h"
#include "PresetManager.h"

class TR88EQEditor : public juce::AudioProcessorEditor
{
public:
    explicit TR88EQEditor (TR88EQProcessor& processor);
    ~TR88EQEditor() override;

    void paint (juce::Graphics& g) override;
    void resized() override;

private:
    TR88EQProcessor& processorRef;
    TR88LookAndFeel lookAndFeel;
    PresetManager presetManager;

    // --- Child Components ---
    EQDisplay eqDisplay;
    BandControls bandControls;

    // --- Header ---
    juce::ComboBox presetSelector;
    juce::TextButton saveButton { "S" };
    juce::TextButton powerButton { "PWR" };
    bool isPowerOn = true;

    // Drawing helpers
    void drawHeader (juce::Graphics& g, juce::Rectangle<int> area);
    void drawStatusBar (juce::Graphics& g, juce::Rectangle<int> area);
    void drawDisplayPanel (juce::Graphics& g, juce::Rectangle<int> area);

    void updatePowerState();
    void populatePresetSelector();

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (TR88EQEditor)
};
