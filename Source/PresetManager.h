#pragma once
#include <juce_audio_processors/juce_audio_processors.h>

struct FactoryPreset
{
    juce::String name;
    juce::String category;

    struct BandConfig
    {
        float freq;
        float gain;
        float q;
        int type;      // 0=lowshelf, 1=peaking, 2=highshelf, 3=lowcut, 4=highcut, 5=brickwalllow, 6=brickwallhigh
        bool enabled;
    };

    BandConfig bands[4];
    float masterGain;
};

class PresetManager
{
public:
    PresetManager (juce::AudioProcessorValueTreeState& apvts);

    int getNumFactoryPresets() const;
    juce::String getFactoryPresetName (int index) const;
    juce::String getFactoryPresetCategory (int index) const;
    void loadFactoryPreset (int index);

    void saveUserPreset (const juce::String& name);
    void loadUserPreset (const juce::String& name);
    void deleteUserPreset (const juce::String& name);
    juce::StringArray getUserPresetNames() const;

    int getCurrentPresetIndex() const { return currentPreset; }
    void setCurrentPresetIndex (int idx) { currentPreset = idx; }

    juce::String getCurrentPresetName() const;

    void loadNextPreset();
    void loadPreviousPreset();

    // Category helpers
    juce::StringArray getCategoryNames() const;
    std::vector<int> getPresetsInCategory (const juce::String& category) const;

private:
    juce::AudioProcessorValueTreeState& valueTreeState;
    int currentPreset = 0;

    static const std::vector<FactoryPreset>& getFactoryPresets();
    juce::File getPresetDirectory() const;

    void applyPreset (const FactoryPreset& preset);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (PresetManager)
};
