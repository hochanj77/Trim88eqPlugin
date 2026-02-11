#include "LookAndFeel.h"

TR88LookAndFeel::TR88LookAndFeel()
{
    setColour (juce::ResizableWindow::backgroundColourId, TR88Colours::bgChassis);
    setColour (juce::Label::textColourId, TR88Colours::white);
    setColour (juce::ComboBox::backgroundColourId, TR88Colours::bgControls);
    setColour (juce::ComboBox::outlineColourId, TR88Colours::border);
    setColour (juce::ComboBox::textColourId, TR88Colours::textSecondary);
    setColour (juce::ComboBox::arrowColourId, TR88Colours::textSecondary.withAlpha (0.4f));
    setColour (juce::PopupMenu::backgroundColourId, TR88Colours::bgControls);
    setColour (juce::PopupMenu::textColourId, TR88Colours::textSecondary);
    setColour (juce::PopupMenu::highlightedBackgroundColourId, TR88Colours::border.withAlpha (0.4f));
    setColour (juce::PopupMenu::highlightedTextColourId, TR88Colours::gold);
    setColour (juce::TextButton::buttonColourId, TR88Colours::bgControls);
    setColour (juce::TextButton::textColourOffId, TR88Colours::textSecondary);
}

void TR88LookAndFeel::drawRotarySlider (juce::Graphics& g, int x, int y, int width, int height,
                                         float sliderPos, float rotaryStartAngle,
                                         float rotaryEndAngle, juce::Slider& slider)
{
    auto bounds = juce::Rectangle<int> (x, y, width, height).toFloat().reduced (2.0f);
    auto centre = bounds.getCentre();
    auto radius = juce::jmin (bounds.getWidth(), bounds.getHeight()) / 2.0f;

    auto arcRadius = radius;
    auto arcWidth = 4.0f;
    auto toAngle = rotaryStartAngle + sliderPos * (rotaryEndAngle - rotaryStartAngle);

    // --- Arc track (background) ---
    juce::Path bgArc;
    bgArc.addCentredArc (centre.x, centre.y, arcRadius, arcRadius, 0.0f,
                          rotaryStartAngle, rotaryEndAngle, true);
    g.setColour (TR88Colours::border);
    g.strokePath (bgArc, juce::PathStrokeType (arcWidth, juce::PathStrokeType::curved,
                                                juce::PathStrokeType::rounded));

    // --- Arc track (active) ---
    if (std::abs (toAngle - rotaryStartAngle) > 0.01f)
    {
        juce::Path activeArc;
        activeArc.addCentredArc (centre.x, centre.y, arcRadius, arcRadius, 0.0f,
                                  rotaryStartAngle, toAngle, true);

        auto arcColour = slider.isMouseButtonDown() ? TR88Colours::gold
                         : slider.findColour (juce::Slider::thumbColourId);
        g.setColour (arcColour);
        g.strokePath (activeArc, juce::PathStrokeType (arcWidth, juce::PathStrokeType::curved,
                                                        juce::PathStrokeType::rounded));
    }

    // --- Knob body outer ring ---
    auto knobRadius = radius * 0.7f;
    {
        juce::ColourGradient outerGrad (juce::Colour (0xFF2A3036), centre.x, centre.y - knobRadius,
                                         juce::Colour (0xFF111418), centre.x, centre.y + knobRadius, false);
        g.setGradientFill (outerGrad);
        g.fillEllipse (centre.x - knobRadius, centre.y - knobRadius,
                       knobRadius * 2.0f, knobRadius * 2.0f);
        g.setColour (juce::Colours::white.withAlpha (0.05f));
        g.drawEllipse (centre.x - knobRadius, centre.y - knobRadius,
                       knobRadius * 2.0f, knobRadius * 2.0f, 1.0f);
    }

    // --- Knob body inner ---
    auto innerRadius = knobRadius * 0.82f;
    {
        g.setColour (TR88Colours::border);
        g.fillEllipse (centre.x - innerRadius, centre.y - innerRadius,
                       innerRadius * 2.0f, innerRadius * 2.0f);

        // Brushed texture (subtle conic-like lines)
        for (int i = 0; i < 60; ++i)
        {
            float angle = (float) i / 60.0f * juce::MathConstants<float>::twoPi;
            auto lineEnd = centre.getPointOnCircumference (innerRadius * 0.95f, angle);
            auto lineStart = centre.getPointOnCircumference (innerRadius * 0.3f, angle);
            g.setColour (juce::Colours::white.withAlpha (0.02f));
            g.drawLine (lineStart.x, lineStart.y, lineEnd.x, lineEnd.y, 0.5f);
        }
    }

    // --- Inner recess ---
    auto recessRadius = innerRadius * 0.8f;
    {
        juce::ColourGradient recessGrad (juce::Colour (0xFF2A3036), centre.x - recessRadius, centre.y - recessRadius,
                                          juce::Colour (0xFF090C0F), centre.x + recessRadius, centre.y + recessRadius, false);
        g.setGradientFill (recessGrad);
        g.fillEllipse (centre.x - recessRadius, centre.y - recessRadius,
                       recessRadius * 2.0f, recessRadius * 2.0f);
        g.setColour (juce::Colours::white.withAlpha (0.04f));
        g.drawEllipse (centre.x - recessRadius, centre.y - recessRadius,
                       recessRadius * 2.0f, recessRadius * 2.0f, 0.5f);
    }

    // --- Indicator notch ---
    {
        auto notchLength = knobRadius * 0.3f;
        auto notchWidth = 3.0f;
        juce::Path notch;
        notch.addRoundedRectangle (-notchWidth / 2.0f, -knobRadius + 4.0f,
                                    notchWidth, notchLength, 1.5f);
        notch.applyTransform (juce::AffineTransform::rotation (toAngle).translated (centre.x, centre.y));
        g.setColour (TR88Colours::gold);
        g.fillPath (notch);

        // Glow
        g.setColour (TR88Colours::gold.withAlpha (0.3f));
        g.strokePath (notch, juce::PathStrokeType (2.0f));
    }
}

void TR88LookAndFeel::drawToggleButton (juce::Graphics& g, juce::ToggleButton& button,
                                         bool shouldDrawButtonAsHighlighted,
                                         bool /*shouldDrawButtonAsDown*/)
{
    auto bounds = button.getLocalBounds().toFloat().reduced (1.0f);
    bool isOn = button.getToggleState();

    // Background
    g.setColour (isOn ? TR88Colours::green.withAlpha (0.05f) : TR88Colours::border);
    g.fillRoundedRectangle (bounds, 8.0f);

    // Border
    g.setColour (isOn ? TR88Colours::green.withAlpha (0.3f)
                      : TR88Colours::borderLight);
    g.drawRoundedRectangle (bounds, 8.0f, 2.0f);

    // Text
    g.setColour (isOn ? TR88Colours::green : TR88Colours::textSecondary.withAlpha (0.2f));
    g.setFont (juce::Font (11.0f, juce::Font::bold));

    auto text = isOn ? "ACTIVE" : "BYPASS";
    g.drawText (text, bounds, juce::Justification::centred);
}

void TR88LookAndFeel::drawComboBox (juce::Graphics& g, int width, int height, bool /*isButtonDown*/,
                                     int, int, int, int, juce::ComboBox& box)
{
    auto bounds = juce::Rectangle<int> (0, 0, width, height).toFloat();

    g.setColour (TR88Colours::bgControls);
    g.fillRect (bounds);
    g.setColour (box.hasKeyboardFocus (true) ? TR88Colours::gold.withAlpha (0.4f) : TR88Colours::border);
    g.drawRect (bounds, 1.0f);

    // Arrow
    auto arrowZone = bounds.removeFromRight (30.0f).reduced (8.0f);
    juce::Path arrow;
    arrow.addTriangle (arrowZone.getX(), arrowZone.getCentreY() - 3.0f,
                       arrowZone.getRight(), arrowZone.getCentreY() - 3.0f,
                       arrowZone.getCentreX(), arrowZone.getCentreY() + 3.0f);
    g.setColour (TR88Colours::textSecondary.withAlpha (0.4f));
    g.fillPath (arrow);
}

void TR88LookAndFeel::drawPopupMenuBackground (juce::Graphics& g, int width, int height)
{
    g.setColour (TR88Colours::bgControls);
    g.fillRect (0, 0, width, height);
    g.setColour (TR88Colours::border);
    g.drawRect (0, 0, width, height, 2);
}

void TR88LookAndFeel::drawPopupMenuItem (juce::Graphics& g, const juce::Rectangle<int>& area,
                                          bool /*isSeparator*/, bool isActive, bool isHighlighted,
                                          bool isTicked, bool /*hasSubMenu*/,
                                          const juce::String& text, const juce::String&,
                                          const juce::Drawable*, const juce::Colour*)
{
    if (isHighlighted && isActive)
    {
        g.setColour (TR88Colours::border.withAlpha (0.4f));
        g.fillRect (area);
    }

    g.setColour (isTicked ? TR88Colours::gold
                 : (isHighlighted ? TR88Colours::textSecondary : TR88Colours::textSecondary));
    g.setFont (juce::Font (12.0f));
    g.drawText (text, area.reduced (12, 0), juce::Justification::centredLeft);

    if (isTicked)
    {
        auto areaCopy = area;
        auto dotArea = areaCopy.removeFromRight (20).toFloat();
        g.setColour (TR88Colours::gold);
        g.fillEllipse (dotArea.getCentreX() - 3.0f, dotArea.getCentreY() - 3.0f, 6.0f, 6.0f);
    }
}

juce::Font TR88LookAndFeel::getLabelFont (juce::Label&)
{
    return juce::Font (11.0f, juce::Font::bold);
}
