cmake_minimum_required(VERSION 3.22)
project(TR88_EQ VERSION 1.0.0)

# JUCE path — override with -DJUCE_PATH=... if needed
if(NOT DEFINED JUCE_PATH)
    set(JUCE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../JUCE")
endif()

add_subdirectory(${JUCE_PATH} ${CMAKE_BINARY_DIR}/JUCE)

juce_add_plugin(TR88_EQ
    COMPANY_NAME "Oasis Creative Labs"
    PLUGIN_MANUFACTURER_CODE Oasi
    PLUGIN_CODE Tr88
    FORMATS VST3 AU Standalone
    PRODUCT_NAME "TR-88 EQ"
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT FALSE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD TRUE
)

target_sources(TR88_EQ PRIVATE
    Source/PluginProcessor.cpp
    Source/PluginProcessor.h
    Source/PluginEditor.cpp
    Source/PluginEditor.h
    Source/EQDisplay.cpp
    Source/EQDisplay.h
    Source/BandControls.cpp
    Source/BandControls.h
    Source/ControlKnob.cpp
    Source/ControlKnob.h
    Source/PresetManager.cpp
    Source/PresetManager.h
    Source/LookAndFeel.cpp
    Source/LookAndFeel.h
)

target_compile_definitions(TR88_EQ PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    JUCE_VST3_CAN_REPLACE_VST2=0
    JUCE_DISPLAY_SPLASH_SCREEN=0
)

target_link_libraries(TR88_EQ
    PRIVATE
        juce::juce_audio_utils
        juce::juce_dsp
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags
)
