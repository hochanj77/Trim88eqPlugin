#pragma once
#include <juce_gui_basics/juce_gui_basics.h>
#include "LookAndFeel.h"

class ControlKnob : public juce::Component, private juce::Timer
{
public:
    ControlKnob (const juce::String& labelText,
                 const juce::String& unitText,
                 juce::Colour bandColour);
    ~ControlKnob() override;

    void paint (juce::Graphics& g) override;
    void resized() override;

    void mouseDown (const juce::MouseEvent& e) override;
    void mouseDrag (const juce::MouseEvent& e) override;
    void mouseUp (const juce::MouseEvent& e) override;
    void mouseEnter (const juce::MouseEvent& e) override;
    void mouseExit (const juce::MouseEvent& e) override;
    void mouseWheelMove (const juce::MouseEvent& e, const juce::MouseWheelDetails& wheel) override;
    void mouseDoubleClick (const juce::MouseEvent& e) override;

    juce::Slider& getSlider() { return slider; }

    void setColour (juce::Colour c) { colour = c; repaint(); }

private:
    void timerCallback() override;

    juce::Slider slider;
    juce::String label;
    juce::String unit;
    juce::Colour colour;

    bool isHovered = false;
    bool isDragging = false;
    float displayAngle = 0.0f; // Smoothed display angle

    int dragStartY = 0;
    float dragStartValue = 0.0f;

    juce::String getValueText() const;
    void drawArc (juce::Graphics& g, juce::Rectangle<float> bounds, float position);
    void drawKnobBody (juce::Graphics& g, juce::Rectangle<float> bounds, float angle);
    void drawTooltip (juce::Graphics& g, juce::Rectangle<float> knobBounds);
    void drawReadout (juce::Graphics& g, juce::Rectangle<float> area);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (ControlKnob)
};
