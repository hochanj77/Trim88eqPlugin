#pragma once
#include <juce_gui_basics/juce_gui_basics.h>

namespace TR88Colours
{
    const juce::Colour bgDeepest     { 0xFF050608 };
    const juce::Colour bgChassis     { 0xFF0D1117 };
    const juce::Colour bgControls    { 0xFF0A0C0F };
    const juce::Colour bgHeader      { 0xFF14181E };
    const juce::Colour border        { 0xFF1A2026 };
    const juce::Colour borderLight   { 0xFF2A3036 };
    const juce::Colour gridDark      { 0xFF14181E };
    const juce::Colour textSecondary { 0xFF6784A3 };
    const juce::Colour gold          { 0xFFFFB000 };
    const juce::Colour green         { 0xFF5FFF9F };
    const juce::Colour white         { 0xFFFFFFFF };
    const juce::Colour band1         { 0xFFFF5F5F };
    const juce::Colour band2         { 0xFFA38CF4 };
    const juce::Colour band3         { 0xFF6784A3 };
    const juce::Colour master        { 0xFF5FFF9F };

    inline juce::Colour getBandColour (int bandIndex)
    {
        switch (bandIndex)
        {
            case 0: return band1;
            case 1: return band2;
            case 2: return band3;
            default: return master;
        }
    }
}

class TR88LookAndFeel : public juce::LookAndFeel_V4
{
public:
    TR88LookAndFeel();
    ~TR88LookAndFeel() override = default;

    void drawRotarySlider (juce::Graphics& g, int x, int y, int width, int height,
                           float sliderPosProportional, float rotaryStartAngle,
                           float rotaryEndAngle, juce::Slider& slider) override;

    void drawToggleButton (juce::Graphics& g, juce::ToggleButton& button,
                           bool shouldDrawButtonAsHighlighted,
                           bool shouldDrawButtonAsDown) override;

    void drawComboBox (juce::Graphics& g, int width, int height, bool isButtonDown,
                       int buttonX, int buttonY, int buttonW, int buttonH,
                       juce::ComboBox& box) override;

    void drawPopupMenuBackground (juce::Graphics& g, int width, int height) override;

    void drawPopupMenuItem (juce::Graphics& g, const juce::Rectangle<int>& area,
                            bool isSeparator, bool isActive, bool isHighlighted,
                            bool isTicked, bool hasSubMenu,
                            const juce::String& text, const juce::String& shortcutKeyText,
                            const juce::Drawable* icon, const juce::Colour* textColour) override;

    juce::Font getLabelFont (juce::Label& label) override;

private:
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (TR88LookAndFeel)
};
