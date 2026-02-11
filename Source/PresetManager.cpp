#include "PresetManager.h"

PresetManager::PresetManager (juce::AudioProcessorValueTreeState& apvts)
    : valueTreeState (apvts)
{
}

const std::vector<FactoryPreset>& PresetManager::getFactoryPresets()
{
    static const std::vector<FactoryPreset> presets =
    {
        {
            "00_INIT_SYSTEM",
            {
                { 100.0f,  0.0f, 0.7f, 0, true },
                { 1000.0f, 0.0f, 1.0f, 1, true },
                { 8000.0f, 0.0f, 0.7f, 2, true }
            },
            0.0f
        },
        {
            "01_DEEP_PULSE",
            {
                { 60.0f,   4.5f, 1.5f, 1, true },
                { 250.0f, -3.0f, 2.0f, 1, true },
                { 3500.0f, 2.0f, 1.2f, 1, true }
            },
            0.0f
        },
        {
            "02_VOCAL_ATMOS",
            {
                { 120.0f,  0.0f, 0.7f, 3, true },
                { 1500.0f, 1.5f, 0.8f, 1, true },
                { 8000.0f, 4.0f, 0.7f, 2, true }
            },
            0.0f
        },
        {
            "03_MID_DEFINITION",
            {
                { 200.0f, -2.0f, 0.7f, 0, true },
                { 800.0f,  3.5f, 2.5f, 1, true },
                { 2500.0f, 4.0f, 1.8f, 1, true }
            },
            0.0f
        }
    };

    return presets;
}

int PresetManager::getNumFactoryPresets() const
{
    return (int) getFactoryPresets().size();
}

juce::String PresetManager::getFactoryPresetName (int index) const
{
    auto& presets = getFactoryPresets();
    if (index >= 0 && index < (int) presets.size())
        return presets[(size_t) index].name;
    return {};
}

void PresetManager::applyPreset (const FactoryPreset& preset)
{
    for (int i = 0; i < 3; ++i)
    {
        auto idx = juce::String (i + 1);
        auto& bc = preset.bands[i];

        if (auto* p = valueTreeState.getParameter ("band" + idx + "_freq"))
            p->setValueNotifyingHost (p->convertTo0to1 (bc.freq));
        if (auto* p = valueTreeState.getParameter ("band" + idx + "_gain"))
            p->setValueNotifyingHost (p->convertTo0to1 (bc.gain));
        if (auto* p = valueTreeState.getParameter ("band" + idx + "_q"))
            p->setValueNotifyingHost (p->convertTo0to1 (bc.q));
        if (auto* p = valueTreeState.getParameter ("band" + idx + "_type"))
            p->setValueNotifyingHost (p->convertTo0to1 ((float) bc.type));
        if (auto* p = valueTreeState.getParameter ("band" + idx + "_enabled"))
            p->setValueNotifyingHost (bc.enabled ? 1.0f : 0.0f);
    }

    if (auto* p = valueTreeState.getParameter ("master_gain"))
        p->setValueNotifyingHost (p->convertTo0to1 (preset.masterGain));
}

void PresetManager::loadFactoryPreset (int index)
{
    auto& presets = getFactoryPresets();
    if (index >= 0 && index < (int) presets.size())
    {
        applyPreset (presets[(size_t) index]);
        currentPreset = index;
    }
}

juce::String PresetManager::getCurrentPresetName() const
{
    auto& presets = getFactoryPresets();
    if (currentPreset >= 0 && currentPreset < (int) presets.size())
        return presets[(size_t) currentPreset].name;
    return "User Preset";
}

void PresetManager::loadNextPreset()
{
    auto total = getNumFactoryPresets();
    if (total > 0)
        loadFactoryPreset ((currentPreset + 1) % total);
}

void PresetManager::loadPreviousPreset()
{
    auto total = getNumFactoryPresets();
    if (total > 0)
        loadFactoryPreset ((currentPreset - 1 + total) % total);
}

juce::File PresetManager::getPresetDirectory() const
{
    auto dir = juce::File::getSpecialLocation (juce::File::userApplicationDataDirectory)
                   .getChildFile ("Oasis Creative Labs")
                   .getChildFile ("TR-88 EQ")
                   .getChildFile ("Presets");
    dir.createDirectory();
    return dir;
}

void PresetManager::saveUserPreset (const juce::String& name)
{
    auto file = getPresetDirectory().getChildFile (name + ".xml");
    auto state = valueTreeState.copyState();
    auto xml = state.createXml();
    if (xml != nullptr)
        xml->writeTo (file);
}

void PresetManager::loadUserPreset (const juce::String& name)
{
    auto file = getPresetDirectory().getChildFile (name + ".xml");
    if (file.existsAsFile())
    {
        auto xml = juce::parseXML (file);
        if (xml != nullptr && xml->hasTagName (valueTreeState.state.getType()))
            valueTreeState.replaceState (juce::ValueTree::fromXml (*xml));
    }
}

void PresetManager::deleteUserPreset (const juce::String& name)
{
    auto file = getPresetDirectory().getChildFile (name + ".xml");
    if (file.existsAsFile())
        file.deleteFile();
}

juce::StringArray PresetManager::getUserPresetNames() const
{
    juce::StringArray names;
    auto dir = getPresetDirectory();
    for (auto& file : dir.findChildFiles (juce::File::findFiles, false, "*.xml"))
        names.add (file.getFileNameWithoutExtension());
    return names;
}
