#include "BandControls.h"

BandControls::BandControls (juce::AudioProcessorValueTreeState& apvts)
    : valueTreeState (apvts)
{
    // --- Band Selector Buttons ---
    const juce::StringArray labels { "L", "M", "H", "MSTR" };
    for (int i = 0; i < 4; ++i)
    {
        auto* btn = bandButtons.add (new juce::TextButton (labels[i]));
        btn->setClickingTogglesState (false);
        btn->onClick = [this, i]
        {
            setSelectedBand (i);
            if (onBandSelected)
                onBandSelected (i < 3 ? i : -1);
        };
        addAndMakeVisible (btn);
    }

    // --- Filter Type Buttons ---
    for (int i = 0; i < 5; ++i)
    {
        auto* btn = typeButtons.add (new juce::TextButton (typeLabels[i]));
        btn->setClickingTogglesState (false);
        btn->onClick = [this, i]
        {
            if (selectedBand >= 0 && selectedBand < 3)
            {
                auto idx = juce::String (selectedBand + 1);
                if (auto* p = valueTreeState.getParameter ("band" + idx + "_type"))
                    p->setValueNotifyingHost (p->convertTo0to1 ((float) i));
                updateTypeButtonStates();
            }
        };
        addAndMakeVisible (btn);
    }

    // --- Enable Button ---
    enableButton = std::make_unique<juce::ToggleButton> ("ACTIVE");
    addAndMakeVisible (*enableButton);

    // --- EQ Knobs ---
    freqKnob = std::make_unique<ControlKnob> ("Frequency", "Hz", TR88Colours::band2);
    gainKnob = std::make_unique<ControlKnob> ("Gain", "dB", TR88Colours::band2);
    qKnob    = std::make_unique<ControlKnob> ("Q / Quality", "", TR88Colours::band2);
    addAndMakeVisible (*freqKnob);
    addAndMakeVisible (*gainKnob);
    addAndMakeVisible (*qKnob);

    // --- Master Knob ---
    masterGainKnob = std::make_unique<ControlKnob> ("Master Gain", "dB", TR88Colours::master);
    addAndMakeVisible (*masterGainKnob);

    // Set double-click return values
    freqKnob->getSlider().setDoubleClickReturnValue (true, 1000.0);
    gainKnob->getSlider().setDoubleClickReturnValue (true, 0.0);
    qKnob->getSlider().setDoubleClickReturnValue (true, 0.7);
    masterGainKnob->getSlider().setDoubleClickReturnValue (true, 0.0);

    setSelectedBand (1);
}

BandControls::~BandControls()
{
    // Detach all before destruction
    freqAttach.reset();
    gainAttach.reset();
    qAttach.reset();
    masterGainAttach.reset();
    enableAttach.reset();
}

void BandControls::setSelectedBand (int bandIndex)
{
    selectedBand = bandIndex;
    updateAttachments();
    updateTypeButtonStates();

    // Update knob colours
    if (bandIndex >= 0 && bandIndex < 3)
    {
        auto colour = TR88Colours::getBandColour (bandIndex);
        freqKnob->setColour (colour);
        gainKnob->setColour (colour);
        qKnob->setColour (colour);
    }

    // Show/hide appropriate knobs
    bool isMaster = (bandIndex == 3);
    freqKnob->setVisible (! isMaster);
    gainKnob->setVisible (! isMaster);
    qKnob->setVisible (! isMaster);
    masterGainKnob->setVisible (isMaster);

    for (auto* tb : typeButtons)
        tb->setVisible (! isMaster);

    resized();
    repaint();
}

void BandControls::updateAttachments()
{
    // Clear existing attachments
    freqAttach.reset();
    gainAttach.reset();
    qAttach.reset();
    masterGainAttach.reset();
    enableAttach.reset();

    if (selectedBand >= 0 && selectedBand < 3)
    {
        auto idx = juce::String (selectedBand + 1);

        freqAttach = std::make_unique<juce::SliderParameterAttachment> (
            *valueTreeState.getParameter ("band" + idx + "_freq"), freqKnob->getSlider());
        gainAttach = std::make_unique<juce::SliderParameterAttachment> (
            *valueTreeState.getParameter ("band" + idx + "_gain"), gainKnob->getSlider());
        qAttach = std::make_unique<juce::SliderParameterAttachment> (
            *valueTreeState.getParameter ("band" + idx + "_q"), qKnob->getSlider());
        enableAttach = std::make_unique<juce::ButtonParameterAttachment> (
            *valueTreeState.getParameter ("band" + idx + "_enabled"), *enableButton);
    }
    else if (selectedBand == 3)
    {
        masterGainAttach = std::make_unique<juce::SliderParameterAttachment> (
            *valueTreeState.getParameter ("master_gain"), masterGainKnob->getSlider());
        enableAttach = std::make_unique<juce::ButtonParameterAttachment> (
            *valueTreeState.getParameter ("power"), *enableButton);
    }
}

void BandControls::updateTypeButtonStates()
{
    if (selectedBand < 0 || selectedBand >= 3) return;

    auto idx = juce::String (selectedBand + 1);
    auto* param = valueTreeState.getParameter ("band" + idx + "_type");
    int currentType = param ? (int) param->convertFrom0to1 (param->getValue()) : 1;

    for (int i = 0; i < typeButtons.size(); ++i)
    {
        bool active = (i == currentType);
        typeButtons[i]->setColour (juce::TextButton::buttonColourId,
                                    active ? TR88Colours::textSecondary : TR88Colours::bgControls);
        typeButtons[i]->setColour (juce::TextButton::textColourOffId,
                                    active ? TR88Colours::white : TR88Colours::textSecondary.withAlpha (0.4f));
    }
}

void BandControls::paint (juce::Graphics& g)
{
    auto bounds = getLocalBounds();

    // Left column background
    auto leftCol = bounds.removeFromLeft (70);
    // (band buttons are child components, drawn automatically)

    // Right panel background
    g.setColour (TR88Colours::bgControls);
    g.fillRoundedRectangle (bounds.toFloat(), 10.0f);
    g.setColour (TR88Colours::border);
    g.drawRoundedRectangle (bounds.toFloat(), 10.0f, 1.0f);

    // Header area within right panel
    auto innerBounds = bounds.reduced (24, 16);
    auto headerArea = innerBounds.removeFromTop (48);

    // Band badge
    drawBandBadge (g, headerArea.removeFromLeft (48));

    // Processor label
    auto labelArea = headerArea;
    labelArea.removeFromLeft (16);

    g.setColour (TR88Colours::textSecondary);
    g.setFont (juce::Font (10.0f, juce::Font::bold));
    auto topLabel = selectedBand == 3 ? "FINAL STAGE" : "PROCESSOR NODE";
    g.drawText (topLabel, labelArea.removeFromTop (16), juce::Justification::centredLeft);

    g.setColour (TR88Colours::white);
    g.setFont (juce::Font (13.0f, juce::Font::bold));
    juce::String nodeLabel;
    if (selectedBand == 3)
        nodeLabel = "OASIS_MASTER_OUT // GAIN_COMP";
    else
    {
        auto idx = juce::String (selectedBand + 1);
        auto* typeParam = valueTreeState.getParameter ("band" + idx + "_type");
        juce::String typeName = "PEAKING";
        if (typeParam)
        {
            int t = (int) typeParam->convertFrom0to1 (typeParam->getValue());
            const juce::StringArray names { "LOWSHELF", "PEAKING", "HIGHSHELF", "LOWCUT", "HIGHCUT" };
            if (t >= 0 && t < names.size()) typeName = names[t];
        }
        nodeLabel = "OASIS_NODE_0" + idx + " // TYPE_" + typeName;
    }
    g.drawText (nodeLabel, labelArea, juce::Justification::centredLeft);

    // Footer
    auto footerArea = getLocalBounds();
    footerArea.removeFromLeft (70);
    footerArea = footerArea.reduced (24, 0);
    drawFooter (g, footerArea.removeFromBottom (40));

    // Subtle gear icon in background
    g.setColour (juce::Colours::white.withAlpha (0.02f));
    g.drawEllipse ((float) bounds.getRight() - 140.0f, (float) bounds.getY() + 10.0f, 130.0f, 130.0f, 1.0f);
}

void BandControls::drawBandBadge (juce::Graphics& g, juce::Rectangle<int> area)
{
    auto colour = selectedBand < 3 ? TR88Colours::getBandColour (selectedBand) : TR88Colours::master;

    g.setColour (colour.withAlpha (0.08f));
    g.fillRoundedRectangle (area.toFloat(), 10.0f);
    g.setColour (colour.withAlpha (0.25f));
    g.drawRoundedRectangle (area.toFloat(), 10.0f, 2.0f);

    g.setColour (colour);
    g.setFont (juce::Font (20.0f, juce::Font::bold));
    auto text = selectedBand == 3 ? "M" : juce::String (selectedBand + 1);
    g.drawText (text, area, juce::Justification::centred);
}

void BandControls::drawFooter (juce::Graphics& g, juce::Rectangle<int> area)
{
    g.setColour (juce::Colours::black.withAlpha (0.3f));
    g.fillRoundedRectangle (area.toFloat(), 6.0f);
    g.setColour (TR88Colours::border.withAlpha (0.5f));
    g.drawRoundedRectangle (area.toFloat(), 6.0f, 1.0f);

    auto left = area.reduced (12, 4);

    g.setColour (TR88Colours::textSecondary.withAlpha (0.4f));
    g.setFont (juce::Font (7.0f, juce::Font::bold));
    g.drawText ("PROCESSING LATENCY", left.getX(), left.getY(), 150, 12,
                juce::Justification::centredLeft);

    g.setColour (TR88Colours::green);
    g.setFont (juce::Font (10.0f));
    g.drawText ("0.00ms // ZERO-LATENCY", left.getX(), left.getY() + 12, 200, 14,
                juce::Justification::centredLeft);

    g.setColour (TR88Colours::textSecondary.withAlpha (0.4f));
    g.setFont (juce::Font (7.0f, juce::Font::bold));
    g.drawText ("PHASE RESPONSE", left.getX() + 220, left.getY(), 150, 12,
                juce::Justification::centredLeft);

    g.setColour (TR88Colours::textSecondary.withAlpha (0.8f));
    g.setFont (juce::Font (10.0f));
    g.drawText ("LINEAR_PHASE_MODE", left.getX() + 220, left.getY() + 12, 200, 14,
                juce::Justification::centredLeft);

    // Right side
    g.setColour (TR88Colours::textSecondary.withAlpha (0.3f));
    g.setFont (juce::Font (9.0f, juce::Font::bold));
    g.drawText ("Module_v4.2  |  Oasis_Core_X", area.reduced (12, 0),
                juce::Justification::centredRight);
}

void BandControls::resized()
{
    auto bounds = getLocalBounds();

    // Left column: band selector buttons
    auto leftCol = bounds.removeFromLeft (70);
    leftCol.removeFromTop (28); // "PROCESSOR" label space

    for (int i = 0; i < bandButtons.size(); ++i)
    {
        auto btnArea = leftCol.removeFromTop (56);
        btnArea.reduce (4, 3);
        bandButtons[i]->setBounds (btnArea);

        // Style based on selection
        bool selected = (i == selectedBand);
        bandButtons[i]->setColour (juce::TextButton::buttonColourId,
                                    selected ? TR88Colours::border : TR88Colours::bgControls);
        bandButtons[i]->setColour (juce::TextButton::textColourOffId,
                                    selected ? TR88Colours::white : TR88Colours::textSecondary.withAlpha (0.4f));
    }

    // Right panel
    auto rightPanel = bounds.reduced (24, 16);
    auto headerRow = rightPanel.removeFromTop (48);
    auto footerRow = rightPanel.removeFromBottom (40);

    // Type buttons + enable (in header, right side)
    auto headerRight = headerRow;
    headerRight.removeFromLeft (200); // Skip badge + label

    // Enable button
    auto enableArea = headerRight.removeFromRight (100);
    enableArea.reduce (0, 8);
    enableButton->setBounds (enableArea);

    // Type buttons
    if (selectedBand < 3)
    {
        auto typeArea = headerRight.removeFromRight (5 * 48 + 4);
        typeArea.reduce (0, 8);

        for (int i = 0; i < typeButtons.size(); ++i)
        {
            auto btnBounds = typeArea.removeFromLeft (48);
            btnBounds.reduce (2, 0);
            typeButtons[i]->setBounds (btnBounds);
        }
    }

    // Knob area (centered in remaining space)
    auto knobArea = rightPanel.reduced (0, 10);

    if (selectedBand < 3)
    {
        // 3 knobs, evenly spaced
        auto knobWidth = 120;
        auto totalWidth = knobWidth * 3;
        auto startX = knobArea.getCentreX() - totalWidth / 2;

        freqKnob->setBounds (startX, knobArea.getY(), knobWidth, knobArea.getHeight());
        gainKnob->setBounds (startX + knobWidth, knobArea.getY(), knobWidth, knobArea.getHeight());
        qKnob->setBounds (startX + knobWidth * 2, knobArea.getY(), knobWidth, knobArea.getHeight());
    }
    else
    {
        // Master: single centered knob
        auto knobWidth = 120;
        masterGainKnob->setBounds (knobArea.getCentreX() - knobWidth / 2,
                                    knobArea.getY(), knobWidth, knobArea.getHeight());
    }
}
