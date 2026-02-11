#pragma once
#include <juce_gui_basics/juce_gui_basics.h>
#include <juce_audio_processors/juce_audio_processors.h>
#include "ControlKnob.h"
#include "LookAndFeel.h"

class BandControls : public juce::Component
{
public:
    BandControls (juce::AudioProcessorValueTreeState& apvts);
    ~BandControls() override;

    void paint (juce::Graphics& g) override;
    void resized() override;

    void setSelectedBand (int bandIndex);  // 0-2 for EQ bands, 3 for master
    int getSelectedBand() const { return selectedBand; }

    std::function<void (int)> onBandSelected;

private:
    juce::AudioProcessorValueTreeState& valueTreeState;
    int selectedBand = 1; // Start on mid band

    // --- Band Selector Buttons (left column) ---
    juce::OwnedArray<juce::TextButton> bandButtons;

    // --- EQ Band Controls ---
    std::unique_ptr<ControlKnob> freqKnob;
    std::unique_ptr<ControlKnob> gainKnob;
    std::unique_ptr<ControlKnob> qKnob;

    // --- Master Controls ---
    std::unique_ptr<ControlKnob> masterGainKnob;

    // --- Filter Type Buttons ---
    juce::OwnedArray<juce::TextButton> typeButtons;
    juce::StringArray typeLabels { "LS", "PK", "HS", "LC", "HC" };

    // --- Enable Button ---
    std::unique_ptr<juce::ToggleButton> enableButton;

    // --- Parameter Attachments ---
    std::unique_ptr<juce::SliderParameterAttachment> freqAttach;
    std::unique_ptr<juce::SliderParameterAttachment> gainAttach;
    std::unique_ptr<juce::SliderParameterAttachment> qAttach;
    std::unique_ptr<juce::SliderParameterAttachment> masterGainAttach;
    std::unique_ptr<juce::ButtonParameterAttachment> enableAttach;

    void updateAttachments();
    void updateTypeButtonStates();
    void drawBandBadge (juce::Graphics& g, juce::Rectangle<int> area);
    void drawFooter (juce::Graphics& g, juce::Rectangle<int> area);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (BandControls)
};
