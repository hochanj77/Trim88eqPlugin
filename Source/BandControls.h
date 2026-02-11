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

    void setSelectedBand (int bandIndex);  // 0-3 for EQ bands, 4 for master
    int getSelectedBand() const { return selectedBand; }

    std::function<void (int)> onBandSelected;

private:
    juce::AudioProcessorValueTreeState& valueTreeState;
    int selectedBand = 1; // Start on low-mid band

    // --- Band Selector Buttons (left column) ---
    juce::OwnedArray<juce::TextButton> bandButtons;

    // --- EQ Band Controls ---
    std::unique_ptr<ControlKnob> freqKnob;
    std::unique_ptr<ControlKnob> gainKnob;
    std::unique_ptr<ControlKnob> qKnob;

    // --- Master Controls ---
    std::unique_ptr<ControlKnob> masterWidthKnob;
    std::unique_ptr<ControlKnob> masterGainKnob;
    std::unique_ptr<ControlKnob> masterPhaseKnob;

    // --- Filter Type Buttons ---
    // UI buttons: LC, PK, HC, BH, BL (no LS/HS)
    juce::OwnedArray<juce::TextButton> typeButtons;
    juce::StringArray typeLabels { "LC", "PK", "HC", "BH", "BL" };
    // Maps button index to parameter type index:
    // 0=lowshelf, 1=peaking, 2=highshelf, 3=lowcut, 4=highcut, 5=brickwalllow, 6=brickwallhigh
    const int typeButtonToParamIndex[5] = { 3, 1, 4, 6, 5 };  // LC→3, PK→1, HC→4, BH→6, BL→5

    // --- Enable Button ---
    std::unique_ptr<juce::ToggleButton> enableButton;

    // --- Parameter Attachments ---
    std::unique_ptr<juce::SliderParameterAttachment> freqAttach;
    std::unique_ptr<juce::SliderParameterAttachment> gainAttach;
    std::unique_ptr<juce::SliderParameterAttachment> qAttach;
    std::unique_ptr<juce::SliderParameterAttachment> masterWidthAttach;
    std::unique_ptr<juce::SliderParameterAttachment> masterGainAttach;
    std::unique_ptr<juce::SliderParameterAttachment> masterPhaseAttach;
    std::unique_ptr<juce::ButtonParameterAttachment> enableAttach;

    void updateAttachments();
    void updateTypeButtonStates();
    void drawBandBadge (juce::Graphics& g, juce::Rectangle<int> area);
    void drawFooter (juce::Graphics& g, juce::Rectangle<int> area);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (BandControls)
};
