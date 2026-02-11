#include "ControlKnob.h"

static constexpr float kStartAngle = juce::MathConstants<float>::pi * 1.25f;  // -135 deg (7:30)
static constexpr float kEndAngle   = juce::MathConstants<float>::pi * 2.75f;  // +135 deg (4:30)
static constexpr float kAngleRange = kEndAngle - kStartAngle;                 // 270 deg

ControlKnob::ControlKnob (const juce::String& labelText,
                           const juce::String& unitText,
                           juce::Colour bandColour)
    : label (labelText), unit (unitText), colour (bandColour)
{
    slider.setSliderStyle (juce::Slider::RotaryVerticalDrag);
    slider.setTextBoxStyle (juce::Slider::NoTextBox, true, 0, 0);
    slider.setMouseCursor (juce::MouseCursor::NoCursor);
    addChildComponent (slider); // Hidden but used for parameter attachment

    slider.onValueChange = [this] { repaint(); };
    setMouseCursor (juce::MouseCursor::UpDownResizeCursor);

    startTimerHz (60);
}

ControlKnob::~ControlKnob()
{
    stopTimer();
}

void ControlKnob::resized()
{
    slider.setBounds (getLocalBounds());
}

void ControlKnob::timerCallback()
{
    // Smooth angle interpolation
    float targetPos = (float) slider.valueToProportionOfLength (slider.getValue());
    float targetAngle = kStartAngle + targetPos * kAngleRange;

    float diff = targetAngle - displayAngle;
    if (std::abs (diff) > 0.001f)
    {
        displayAngle += diff * 0.3f;
        repaint();
    }
}

juce::String ControlKnob::getValueText() const
{
    double val = slider.getValue();

    if (val > 999.0)
        return juce::String (val / 1000.0, 2) + "k" + unit;

    if (unit == "Hz")
        return juce::String ((int) val) + unit;

    return juce::String (val, 1) + unit;
}

void ControlKnob::paint (juce::Graphics& g)
{
    auto bounds = getLocalBounds().toFloat();

    // Layout: label at top (20px), knob in middle, readout at bottom (25px)
    auto labelArea = bounds.removeFromTop (20.0f);
    auto readoutArea = bounds.removeFromBottom (28.0f);

    // Knob area (centered square)
    auto knobSize = juce::jmin (bounds.getWidth(), bounds.getHeight());
    auto knobBounds = bounds.withSizeKeepingCentre (knobSize, knobSize);

    // --- Label ---
    g.setColour (isHovered ? TR88Colours::textSecondary
                           : TR88Colours::textSecondary.withAlpha (0.6f));
    g.setFont (juce::Font (11.0f, juce::Font::bold));
    g.drawText (label.toUpperCase(), labelArea, juce::Justification::centred);

    // --- Arc ---
    float pos = (float) slider.valueToProportionOfLength (slider.getValue());
    drawArc (g, knobBounds, pos);

    // --- Knob Body ---
    drawKnobBody (g, knobBounds, displayAngle);

    // --- Tooltip ---
    if (isHovered || isDragging)
        drawTooltip (g, knobBounds);

    // --- Readout ---
    drawReadout (g, readoutArea);
}

void ControlKnob::drawArc (juce::Graphics& g, juce::Rectangle<float> bounds, float position)
{
    auto centre = bounds.getCentre();
    auto radius = bounds.getWidth() / 2.0f;
    auto arcWidth = 4.0f;

    // Background arc
    juce::Path bgArc;
    bgArc.addCentredArc (centre.x, centre.y, radius, radius, 0.0f,
                          kStartAngle, kEndAngle, true);
    g.setColour (TR88Colours::border);
    g.strokePath (bgArc, juce::PathStrokeType (arcWidth, juce::PathStrokeType::curved,
                                                juce::PathStrokeType::rounded));

    // Active arc
    float toAngle = kStartAngle + position * kAngleRange;
    if (std::abs (position) > 0.001f)
    {
        juce::Path activeArc;
        activeArc.addCentredArc (centre.x, centre.y, radius, radius, 0.0f,
                                  kStartAngle, toAngle, true);
        g.setColour (isDragging ? TR88Colours::gold : colour);
        g.strokePath (activeArc, juce::PathStrokeType (arcWidth, juce::PathStrokeType::curved,
                                                        juce::PathStrokeType::rounded));
    }
}

void ControlKnob::drawKnobBody (juce::Graphics& g, juce::Rectangle<float> bounds, float angle)
{
    auto centre = bounds.getCentre();
    auto outerRadius = bounds.getWidth() * 0.35f;
    auto innerRadius = outerRadius * 0.82f;
    auto recessRadius = innerRadius * 0.78f;

    // Outer ring
    {
        juce::ColourGradient grad (juce::Colour (0xFF2A3036), centre.x, centre.y - outerRadius,
                                    juce::Colour (0xFF111418), centre.x, centre.y + outerRadius, false);
        g.setGradientFill (grad);
        g.fillEllipse (centre.x - outerRadius, centre.y - outerRadius,
                       outerRadius * 2.0f, outerRadius * 2.0f);
        g.setColour (juce::Colours::white.withAlpha (0.05f));
        g.drawEllipse (centre.x - outerRadius, centre.y - outerRadius,
                       outerRadius * 2.0f, outerRadius * 2.0f, 1.0f);
    }

    // Inner body
    {
        g.setColour (TR88Colours::border);
        g.fillEllipse (centre.x - innerRadius, centre.y - innerRadius,
                       innerRadius * 2.0f, innerRadius * 2.0f);

        // Brushed texture
        for (int i = 0; i < 60; ++i)
        {
            float a = (float) i / 60.0f * juce::MathConstants<float>::twoPi;
            auto p1 = centre.getPointOnCircumference (innerRadius * 0.3f, a);
            auto p2 = centre.getPointOnCircumference (innerRadius * 0.95f, a);
            g.setColour (juce::Colours::white.withAlpha (0.02f));
            g.drawLine (p1.x, p1.y, p2.x, p2.y, 0.5f);
        }
    }

    // Recess
    {
        juce::ColourGradient grad (juce::Colour (0xFF2A3036), centre.x - recessRadius, centre.y - recessRadius,
                                    juce::Colour (0xFF090C0F), centre.x + recessRadius, centre.y + recessRadius, false);
        g.setGradientFill (grad);
        g.fillEllipse (centre.x - recessRadius, centre.y - recessRadius,
                       recessRadius * 2.0f, recessRadius * 2.0f);
    }

    // Indicator notch
    {
        auto notchLength = outerRadius * 0.35f;
        auto notchWidth = 3.0f;
        juce::Path notch;
        notch.addRoundedRectangle (-notchWidth / 2.0f, -outerRadius + 3.0f,
                                    notchWidth, notchLength, 1.5f);
        notch.applyTransform (juce::AffineTransform::rotation (angle).translated (centre.x, centre.y));

        g.setColour (TR88Colours::gold);
        g.fillPath (notch);

        // Glow
        g.setColour (TR88Colours::gold.withAlpha (0.4f));
        g.strokePath (notch, juce::PathStrokeType (2.5f));
    }
}

void ControlKnob::drawTooltip (juce::Graphics& g, juce::Rectangle<float> knobBounds)
{
    auto text = getValueText();
    auto font = juce::Font (11.0f, juce::Font::bold);
    auto textWidth = font.getStringWidthFloat (text) + 16.0f;
    auto tooltipHeight = 24.0f;

    auto tooltipBounds = juce::Rectangle<float> (
        knobBounds.getCentreX() - textWidth / 2.0f,
        knobBounds.getY() - tooltipHeight - 8.0f,
        textWidth, tooltipHeight);

    // Background pill
    g.setColour (TR88Colours::gold);
    g.fillRoundedRectangle (tooltipBounds, 6.0f);

    // Arrow
    juce::Path arrow;
    auto arrowCx = tooltipBounds.getCentreX();
    auto arrowTop = tooltipBounds.getBottom();
    arrow.addTriangle (arrowCx - 6.0f, arrowTop,
                       arrowCx + 6.0f, arrowTop,
                       arrowCx, arrowTop + 6.0f);
    g.fillPath (arrow);

    // Text
    g.setColour (juce::Colours::black);
    g.setFont (font);
    g.drawText (text, tooltipBounds, juce::Justification::centred);
}

void ControlKnob::drawReadout (juce::Graphics& g, juce::Rectangle<float> area)
{
    double val = slider.getValue();
    juce::String valueStr;
    juce::String unitStr;

    if (val > 999.0)
    {
        valueStr = juce::String (val / 1000.0, 2);
        unitStr = "k" + unit;
    }
    else if (unit == "Hz")
    {
        valueStr = juce::String ((int) val);
        unitStr = unit;
    }
    else
    {
        valueStr = juce::String (val, 1);
        unitStr = unit;
    }

    auto valueFont = juce::Font (14.0f, juce::Font::bold);
    auto unitFont = juce::Font (9.0f, juce::Font::bold);

    auto valueWidth = valueFont.getStringWidthFloat (valueStr);
    auto unitWidth = unitFont.getStringWidthFloat (unitStr);
    auto totalWidth = valueWidth + unitWidth + 3.0f;
    auto startX = area.getCentreX() - totalWidth / 2.0f;

    auto textY = area.getY() + 2.0f;

    g.setColour (TR88Colours::white);
    g.setFont (valueFont);
    g.drawText (valueStr, (int) startX, (int) textY, (int) valueWidth + 2, 18,
                juce::Justification::centredLeft);

    g.setColour (TR88Colours::textSecondary.withAlpha (0.6f));
    g.setFont (unitFont);
    g.drawText (unitStr, (int) (startX + valueWidth + 3.0f), (int) textY + 2, (int) unitWidth + 2, 16,
                juce::Justification::centredLeft);

    // Gold underline
    auto lineY = textY + 20.0f;
    auto lineWidth = juce::jmax (totalWidth + 10.0f, 50.0f);
    juce::ColourGradient lineGrad (juce::Colours::transparentBlack, area.getCentreX() - lineWidth / 2.0f, lineY,
                                    juce::Colours::transparentBlack, area.getCentreX() + lineWidth / 2.0f, lineY, false);
    lineGrad.addColour (0.5, TR88Colours::gold.withAlpha (0.2f));
    g.setGradientFill (lineGrad);
    g.fillRect (area.getCentreX() - lineWidth / 2.0f, lineY, lineWidth, 2.0f);
}

void ControlKnob::mouseDown (const juce::MouseEvent& e)
{
    isDragging = true;
    dragStartY = e.getScreenY();
    dragStartValue = (float) slider.getValue();
    repaint();
}

void ControlKnob::mouseDrag (const juce::MouseEvent& e)
{
    auto deltaY = (float) (dragStartY - e.getScreenY());
    auto range = slider.getRange();
    auto sensitivity = 0.005f;
    auto newVal = juce::jlimit (range.getStart(), range.getEnd(),
                                 (double) (dragStartValue + deltaY * (float) range.getLength() * sensitivity));
    slider.setValue (newVal, juce::sendNotification);
}

void ControlKnob::mouseUp (const juce::MouseEvent&)
{
    isDragging = false;
    repaint();
}

void ControlKnob::mouseEnter (const juce::MouseEvent&)
{
    isHovered = true;
    repaint();
}

void ControlKnob::mouseExit (const juce::MouseEvent&)
{
    isHovered = false;
    repaint();
}

void ControlKnob::mouseWheelMove (const juce::MouseEvent&, const juce::MouseWheelDetails& wheel)
{
    auto range = slider.getRange();
    auto step = range.getLength() * 0.01;
    slider.setValue (slider.getValue() + wheel.deltaY * step, juce::sendNotification);
}

void ControlKnob::mouseDoubleClick (const juce::MouseEvent&)
{
    slider.setValue (slider.getDoubleClickReturnValue(), juce::sendNotification);
}
