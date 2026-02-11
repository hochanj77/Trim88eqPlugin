#include "PluginEditor.h"

TR88EQEditor::TR88EQEditor (TR88EQProcessor& processor)
    : AudioProcessorEditor (processor),
      processorRef (processor),
      presetManager (processor.apvts),
      eqDisplay (processor),
      bandControls (processor.apvts)
{
    setLookAndFeel (&lookAndFeel);
    setSize (1100, 720);

    // --- EQ Display ---
    addAndMakeVisible (eqDisplay);
    eqDisplay.onBandSelected = [this] (int band)
    {
        if (band >= 0 && band < 3)
            bandControls.setSelectedBand (band);
    };

    // --- Band Controls ---
    addAndMakeVisible (bandControls);
    bandControls.onBandSelected = [this] (int band)
    {
        if (band >= 0)
            eqDisplay.setSelectedBand (band);
    };

    // --- Preset Selector ---
    addAndMakeVisible (presetSelector);
    populatePresetSelector();
    presetSelector.onChange = [this]
    {
        auto idx = presetSelector.getSelectedItemIndex();
        if (idx >= 0)
        {
            presetManager.loadFactoryPreset (idx);
            presetManager.setCurrentPresetIndex (idx);
        }
    };

    // --- Save Button ---
    addAndMakeVisible (saveButton);
    saveButton.onClick = [this]
    {
        auto name = presetManager.getCurrentPresetName();

        auto dialog = std::make_shared<juce::AlertWindow> (
            "Save Preset", "Enter preset name:", juce::MessageBoxIconType::NoIcon);
        dialog->addTextEditor ("name", name, "Preset Name:");
        dialog->addButton ("Save", 1);
        dialog->addButton ("Cancel", 0);

        dialog->enterModalState (true, juce::ModalCallbackFunction::create (
            [this, dialog] (int result)
            {
                if (result == 1)
                {
                    auto presetName = dialog->getTextEditorContents ("name");
                    if (presetName.isNotEmpty())
                        presetManager.saveUserPreset (presetName);
                }
            }));
    };

    // --- Power Button ---
    addAndMakeVisible (powerButton);
    powerButton.onClick = [this]
    {
        if (auto* p = processorRef.apvts.getParameter ("power"))
        {
            bool current = p->getValue() > 0.5f;
            p->setValueNotifyingHost (current ? 0.0f : 1.0f);
        }
        updatePowerState();
    };
    updatePowerState();
}

TR88EQEditor::~TR88EQEditor()
{
    setLookAndFeel (nullptr);
}

void TR88EQEditor::populatePresetSelector()
{
    presetSelector.clear();
    for (int i = 0; i < presetManager.getNumFactoryPresets(); ++i)
        presetSelector.addItem (presetManager.getFactoryPresetName (i), i + 1);

    presetSelector.setSelectedItemIndex (presetManager.getCurrentPresetIndex(),
                                          juce::dontSendNotification);
}

void TR88EQEditor::updatePowerState()
{
    auto* p = processorRef.apvts.getParameter ("power");
    isPowerOn = p != nullptr && p->getValue() > 0.5f;

    powerButton.setColour (juce::TextButton::buttonColourId,
                            isPowerOn ? TR88Colours::green.withAlpha (0.05f) : TR88Colours::border);
    powerButton.setColour (juce::TextButton::textColourOffId,
                            isPowerOn ? TR88Colours::green : TR88Colours::textSecondary.withAlpha (0.2f));
    repaint();
}

void TR88EQEditor::paint (juce::Graphics& g)
{
    // Outermost background
    g.fillAll (TR88Colours::bgDeepest);

    auto bounds = getLocalBounds().reduced (12);

    // Main chassis background
    g.setColour (TR88Colours::bgChassis);
    g.fillRoundedRectangle (bounds.toFloat(), 12.0f);

    // Chassis border
    g.setColour (TR88Colours::border);
    g.drawRoundedRectangle (bounds.toFloat(), 12.0f, 3.0f);

    // --- Sections ---
    auto headerArea = bounds.removeFromTop (72);
    auto statusArea = bounds.removeFromBottom (36);
    auto bodyArea = bounds;

    drawHeader (g, headerArea);
    drawStatusBar (g, statusArea);

    // Display panel recessed frame (drawn behind the component)
    auto displayPanelArea = bodyArea.reduced (24, 16);
    displayPanelArea = displayPanelArea.removeFromTop ((int) (displayPanelArea.getHeight() * 0.52f));
    drawDisplayPanel (g, displayPanelArea.expanded (6));
}

void TR88EQEditor::drawHeader (juce::Graphics& g, juce::Rectangle<int> area)
{
    // Header background gradient
    juce::ColourGradient headerGrad (TR88Colours::bgHeader, (float) area.getX(), (float) area.getY(),
                                      TR88Colours::bgChassis, (float) area.getX(), (float) area.getBottom(), false);
    g.setGradientFill (headerGrad);
    g.fillRect (area);

    // Bottom border
    g.setColour (TR88Colours::border);
    g.drawHorizontalLine (area.getBottom() - 1, (float) area.getX(), (float) area.getRight());

    // --- Logo (left side) ---
    auto logoArea = area.reduced (24, 12);
    auto logoBounds = logoArea.removeFromLeft (240);

    // Logo container
    auto logoBox = logoBounds.reduced (0, 2);
    g.setColour (juce::Colour (0xFF0B0F13).withAlpha (0.9f));
    g.fillRoundedRectangle (logoBox.toFloat(), 10.0f);
    g.setColour (TR88Colours::gold.withAlpha (0.2f));
    g.drawRoundedRectangle (logoBox.toFloat(), 10.0f, 1.0f);

    // "TR-88 EQ" text
    g.setColour (TR88Colours::white);
    g.setFont (juce::Font (26.0f, juce::Font::bold));
    g.drawText ("TR-88 EQ", logoBox.reduced (16, 0), juce::Justification::centredLeft);

    // Gold underline
    auto underlineY = logoBox.getBottom() - 8;
    g.setColour (TR88Colours::gold);
    g.fillRoundedRectangle ((float) logoBox.getX() + 16.0f, (float) underlineY,
                             (float) logoBox.getWidth() - 32.0f, 3.0f, 1.5f);

    // --- Right side: power status ---
    auto rightArea = area.reduced (24, 16);
    rightArea.removeFromLeft (400); // Skip left side

    // Status text
    auto statusArea = rightArea.removeFromRight (160);

    g.setColour (TR88Colours::textSecondary.withAlpha (0.6f));
    g.setFont (juce::Font (9.0f, juce::Font::bold));
    g.drawText ("MASTER SYSTEM", statusArea.getX(), statusArea.getY(), 100, 14,
                juce::Justification::centredRight);

    // Status indicator
    auto dotX = statusArea.getX() + 102;
    auto dotY = statusArea.getY() + 20;
    g.setColour (isPowerOn ? TR88Colours::green : juce::Colour (0xFF7F1D1D));
    g.fillEllipse ((float) dotX, (float) dotY, 6.0f, 6.0f);
    if (isPowerOn)
    {
        g.setColour (TR88Colours::green.withAlpha (0.3f));
        g.fillEllipse ((float) dotX - 2.0f, (float) dotY - 2.0f, 10.0f, 10.0f);
    }

    g.setColour (isPowerOn ? TR88Colours::green : juce::Colour (0xFF7F1D1D).withAlpha (0.6f));
    g.setFont (juce::Font (11.0f));
    g.drawText (isPowerOn ? "STABLE" : "OFFLINE", dotX + 10, dotY - 3, 60, 14,
                juce::Justification::centredLeft);
}

void TR88EQEditor::drawStatusBar (juce::Graphics& g, juce::Rectangle<int> area)
{
    // Background
    g.setColour (TR88Colours::bgDeepest);
    g.fillRect (area);

    // Top border
    g.setColour (TR88Colours::border);
    g.drawHorizontalLine (area.getY(), (float) area.getX(), (float) area.getRight());

    auto content = area.reduced (24, 0);

    g.setColour (TR88Colours::textSecondary.withAlpha (0.3f));
    g.setFont (juce::Font (9.0f, juce::Font::bold));

    // Left items
    g.drawText ("OVERSAMPLING: 4X   |   ENGINE: 1.0.42_PRO   |   CRC: OK",
                content, juce::Justification::centredLeft);

    // Right items
    g.setColour (TR88Colours::gold.withAlpha (0.4f));
    g.drawText ("PROPERTY OF OASIS ENGINEERING", content.removeFromRight (400),
                juce::Justification::centredRight);
}

void TR88EQEditor::drawDisplayPanel (juce::Graphics& g, juce::Rectangle<int> area)
{
    // Recessed panel frame
    g.setColour (TR88Colours::border);
    g.fillRoundedRectangle (area.toFloat(), 10.0f);

    // Inner shadow simulation
    g.setColour (juce::Colours::black.withAlpha (0.4f));
    g.drawRoundedRectangle (area.reduced (1).toFloat(), 9.0f, 2.0f);

    // Inner area border (black)
    g.setColour (juce::Colours::black);
    g.drawRoundedRectangle (area.reduced (4).toFloat(), 8.0f, 1.0f);
}

void TR88EQEditor::resized()
{
    auto bounds = getLocalBounds().reduced (12);

    auto headerArea = bounds.removeFromTop (72);
    auto statusArea = bounds.removeFromBottom (36);
    auto bodyArea = bounds.reduced (24, 16);

    // --- Header components ---
    auto headerContent = headerArea.reduced (24, 16);
    headerContent.removeFromLeft (260); // Skip logo

    // Preset selector
    auto presetArea = headerContent.removeFromLeft (220);
    presetSelector.setBounds (presetArea.removeFromLeft (180).reduced (0, 6));
    saveButton.setBounds (presetArea.removeFromLeft (36).reduced (2, 6));

    // Power button (far right)
    auto powerArea = headerContent.removeFromRight (48);
    powerButton.setBounds (powerArea.reduced (0, 6));

    // --- Body ---
    // EQ Display: ~52% of body height
    auto displayHeight = (int) (bodyArea.getHeight() * 0.52f);
    auto displayArea = bodyArea.removeFromTop (displayHeight);
    eqDisplay.setBounds (displayArea.reduced (6));

    // Gap
    bodyArea.removeFromTop (16);

    // Band Controls: remaining
    bandControls.setBounds (bodyArea);
}
