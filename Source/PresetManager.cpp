#include "PresetManager.h"

PresetManager::PresetManager (juce::AudioProcessorValueTreeState& apvts)
    : valueTreeState (apvts)
{
}

// Type indices: 0=lowshelf, 1=peaking, 2=highshelf, 3=lowcut, 4=highcut, 5=brickwalllow, 6=brickwallhigh
const std::vector<FactoryPreset>& PresetManager::getFactoryPresets()
{
    static const std::vector<FactoryPreset> presets =
    {
        // ==================== VOCALS (7) ====================
        {
            "Vocal Clarity", "Vocals",
            { { 85.0f, 0.0f, 0.7f, 3, true }, { 280.0f, -2.5f, 1.2f, 1, true }, { 3500.0f, 3.0f, 0.8f, 1, true }, { 10000.0f, 2.5f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Vocal Warmth", "Vocals",
            { { 65.0f, 0.0f, 0.7f, 3, true }, { 220.0f, 2.5f, 0.7f, 1, true }, { 2800.0f, -1.5f, 1.0f, 1, true }, { 12000.0f, -1.5f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Vocal Presence", "Vocals",
            { { 100.0f, 0.0f, 0.7f, 3, true }, { 400.0f, -2.0f, 1.5f, 1, true }, { 4500.0f, 4.5f, 0.7f, 1, true }, { 10000.0f, 1.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "De-Mud", "Vocals",
            { { 100.0f, 0.0f, 0.7f, 3, true }, { 300.0f, -5.0f, 1.8f, 1, true }, { 2500.0f, 1.5f, 0.8f, 1, true }, { 8000.0f, 2.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Broadcast / Podcast", "Vocals",
            { { 80.0f, 0.0f, 0.7f, 3, true }, { 180.0f, 1.5f, 0.7f, 1, true }, { 3000.0f, 2.5f, 0.8f, 1, true }, { 10000.0f, 1.5f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Airy Vocals", "Vocals",
            { { 120.0f, 0.0f, 0.7f, 3, true }, { 400.0f, -3.0f, 1.0f, 1, true }, { 7000.0f, 2.0f, 0.6f, 1, true }, { 10000.0f, 5.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Nasal Reduction", "Vocals",
            { { 80.0f, 0.0f, 0.7f, 3, true }, { 1000.0f, -5.0f, 3.0f, 1, true }, { 3500.0f, 1.0f, 0.8f, 1, true }, { 10000.0f, 1.0f, 0.7f, 2, true } },
            0.0f
        },

        // ==================== DRUMS (7) ====================
        {
            "Kick Punch", "Drums",
            { { 28.0f, 0.0f, 0.7f, 3, true }, { 60.0f, 4.0f, 1.2f, 1, true }, { 350.0f, -4.0f, 1.5f, 1, true }, { 4000.0f, 3.0f, 1.0f, 1, true } },
            0.0f
        },
        {
            "Snare Crack", "Drums",
            { { 80.0f, 0.0f, 0.7f, 3, true }, { 200.0f, 2.0f, 1.0f, 1, true }, { 500.0f, -3.0f, 1.5f, 1, true }, { 3000.0f, 4.5f, 0.8f, 1, true } },
            0.0f
        },
        {
            "Hi-Hat Shimmer", "Drums",
            { { 350.0f, 0.0f, 0.7f, 3, true }, { 1500.0f, -2.0f, 1.0f, 1, true }, { 8000.0f, 3.5f, 0.7f, 1, true }, { 12000.0f, 2.5f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Drum Bus Glue", "Drums",
            { { 30.0f, 0.0f, 0.7f, 3, true }, { 100.0f, 2.5f, 0.7f, 0, true }, { 400.0f, -1.5f, 0.5f, 1, true }, { 8000.0f, 2.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Toms Thump", "Drums",
            { { 40.0f, 0.0f, 0.7f, 3, true }, { 80.0f, 3.5f, 1.0f, 1, true }, { 500.0f, -4.0f, 2.0f, 1, true }, { 3500.0f, 2.5f, 0.8f, 1, true } },
            0.0f
        },
        {
            "Overhead Clean", "Drums",
            { { 250.0f, 0.0f, 0.7f, 3, true }, { 1000.0f, -1.5f, 1.0f, 1, true }, { 6000.0f, 2.0f, 0.7f, 1, true }, { 12000.0f, 3.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "808 Sub", "Drums",
            { { 25.0f, 0.0f, 0.7f, 3, true }, { 55.0f, 5.0f, 0.8f, 0, true }, { 250.0f, -3.5f, 1.0f, 1, true }, { 6000.0f, -3.0f, 0.7f, 2, true } },
            0.0f
        },

        // ==================== INSTRUMENTS (6) ====================
        {
            "Electric Guitar Edge", "Instruments",
            { { 80.0f, 0.0f, 0.7f, 3, true }, { 350.0f, -2.5f, 1.2f, 1, true }, { 2500.0f, 3.5f, 0.8f, 1, true }, { 6000.0f, 1.5f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Piano Fullness", "Instruments",
            { { 40.0f, 0.0f, 0.7f, 3, true }, { 150.0f, 2.0f, 0.7f, 0, true }, { 3500.0f, 1.5f, 0.7f, 1, true }, { 8000.0f, 2.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Synth Pad Warmth", "Instruments",
            { { 35.0f, 0.0f, 0.7f, 3, true }, { 150.0f, 3.0f, 0.7f, 0, true }, { 2500.0f, -2.0f, 1.0f, 1, true }, { 8000.0f, -3.5f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Synth Lead Cut-Through", "Instruments",
            { { 100.0f, 0.0f, 0.7f, 3, true }, { 400.0f, -3.0f, 1.5f, 1, true }, { 3000.0f, 4.5f, 0.8f, 1, true }, { 8000.0f, 2.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Strings Sweetness", "Instruments",
            { { 60.0f, 0.0f, 0.7f, 3, true }, { 300.0f, 1.5f, 0.7f, 1, true }, { 2500.0f, -2.5f, 1.2f, 1, true }, { 10000.0f, 3.5f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Brass Punch", "Instruments",
            { { 80.0f, 0.0f, 0.7f, 3, true }, { 400.0f, 1.0f, 0.8f, 1, true }, { 2000.0f, 3.5f, 1.0f, 1, true }, { 8000.0f, 1.5f, 0.7f, 2, true } },
            0.0f
        },

        // ==================== GENERAL (6) ====================
        {
            "Low Cut (HPF 80)", "General",
            { { 80.0f, 0.0f, 0.7f, 3, true }, { 500.0f, 0.0f, 1.0f, 1, true }, { 3000.0f, 0.0f, 1.0f, 1, true }, { 10000.0f, 0.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Low Cut (HPF 120)", "General",
            { { 120.0f, 0.0f, 0.7f, 3, true }, { 500.0f, 0.0f, 1.0f, 1, true }, { 3000.0f, 0.0f, 1.0f, 1, true }, { 10000.0f, 0.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "High Cut (LPF 12k)", "General",
            { { 30.0f, 0.0f, 0.7f, 3, true }, { 500.0f, 0.0f, 1.0f, 1, true }, { 3000.0f, 0.0f, 1.0f, 1, true }, { 12000.0f, 0.0f, 0.7f, 4, true } },
            0.0f
        },
        {
            "Telephone", "General",
            { { 300.0f, 0.0f, 0.7f, 3, true }, { 1000.0f, 2.0f, 0.8f, 1, true }, { 2000.0f, 3.0f, 1.5f, 1, true }, { 3400.0f, 0.0f, 0.7f, 4, true } },
            0.0f
        },
        {
            "De-Harsh", "General",
            { { 30.0f, 0.0f, 0.7f, 3, true }, { 500.0f, 0.0f, 1.0f, 1, true }, { 3500.0f, -4.5f, 2.5f, 1, true }, { 10000.0f, -1.0f, 0.7f, 2, true } },
            0.0f
        },
        {
            "Flat / Bypass", "General",
            { { 20.0f, 0.0f, 0.7f, 3, true }, { 500.0f, 0.0f, 1.0f, 1, true }, { 3000.0f, 0.0f, 1.0f, 1, true }, { 10000.0f, 0.0f, 0.7f, 2, true } },
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

juce::String PresetManager::getFactoryPresetCategory (int index) const
{
    auto& presets = getFactoryPresets();
    if (index >= 0 && index < (int) presets.size())
        return presets[(size_t) index].category;
    return {};
}

void PresetManager::applyPreset (const FactoryPreset& preset)
{
    for (int i = 0; i < 4; ++i)
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

juce::StringArray PresetManager::getCategoryNames() const
{
    juce::StringArray categories;
    for (auto& preset : getFactoryPresets())
    {
        if (! categories.contains (preset.category))
            categories.add (preset.category);
    }
    return categories;
}

std::vector<int> PresetManager::getPresetsInCategory (const juce::String& category) const
{
    std::vector<int> indices;
    auto& presets = getFactoryPresets();
    for (int i = 0; i < (int) presets.size(); ++i)
    {
        if (presets[(size_t) i].category == category)
            indices.push_back (i);
    }
    return indices;
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
