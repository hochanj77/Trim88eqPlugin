#pragma once
#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_dsp/juce_dsp.h>

struct BandParameters
{
    std::atomic<float>* freq    = nullptr;
    std::atomic<float>* gain    = nullptr;
    std::atomic<float>* q       = nullptr;
    std::atomic<float>* type    = nullptr;
    std::atomic<float>* enabled = nullptr;
};

class TR88EQProcessor : public juce::AudioProcessor
{
public:
    TR88EQProcessor();
    ~TR88EQProcessor() override = default;

    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    bool isBusesLayoutSupported (const BusesLayout& layouts) const override;
    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override { return true; }

    const juce::String getName() const override { return JucePlugin_Name; }
    bool acceptsMidi() const override { return false; }
    bool producesMidi() const override { return false; }
    bool isMidiEffect() const override { return false; }
    double getTailLengthSeconds() const override { return 0.0; }

    int getNumPrograms() override { return 1; }
    int getCurrentProgram() override { return 0; }
    void setCurrentProgram (int) override {}
    const juce::String getProgramName (int) override { return {}; }
    void changeProgramName (int, const juce::String&) override {}

    void getStateInformation (juce::MemoryBlock& destData) override;
    void setStateInformation (const void* data, int sizeInBytes) override;

    juce::AudioProcessorValueTreeState apvts;
    static juce::AudioProcessorValueTreeState::ParameterLayout createParameterLayout();

    // Band parameter accessors
    BandParameters getBandParameters (int bandIndex) const;
    std::atomic<float>* getMasterGain() const;
    std::atomic<float>* getPowerParam() const;

    // --- FFT / Spectrum Analyzer Data ---
    static constexpr int fftOrder = 12;
    static constexpr int fftSize  = 1 << fftOrder; // 4096

    // Called by the editor to get current magnitude data
    void getFFTData (float* outputMagnitudes, int numPoints) const;
    bool isFFTDataReady() const { return nextFFTBlockReady.load(); }

    // Get magnitude response at given frequencies for a specific band
    void getMagnitudeResponseForBand (int bandIndex, const double* frequencies,
                                      double* magnitudes, int numPoints) const;
    void getCompositeMagnitudeResponse (const double* frequencies,
                                         double* magnitudes, int numPoints) const;

    double getCurrentSampleRate() const { return currentSampleRate; }

private:
    // --- DSP ---
    double currentSampleRate = 44100.0;

    // Each band: up to 2 cascaded IIR filters (for steeper cut slopes)
    // Using ProcessorDuplicator for stereo
    using MonoFilter = juce::dsp::IIR::Filter<float>;
    using StereoFilter = juce::dsp::ProcessorDuplicator<MonoFilter, juce::dsp::IIR::Coefficients<float>>;

    struct FilterBand
    {
        StereoFilter filter1;
        StereoFilter filter2; // Used for cascaded cuts (2nd order + 2nd order = 4th order)
        bool needsCascade = false;
    };

    FilterBand bands[3];
    juce::dsp::Gain<float> masterGainDSP;

    void updateFilters();
    juce::dsp::IIR::Coefficients<float>::Ptr makeCoefficients (int bandIndex) const;

    // Store current coefficients for magnitude response queries
    juce::dsp::IIR::Coefficients<float>::Ptr currentCoeffs[3];
    juce::dsp::IIR::Coefficients<float>::Ptr currentCascadeCoeffs[3];
    bool currentBandCascaded[3] = { false, false, false };
    bool currentBandEnabled[3]  = { true, true, true };

    // --- FFT ---
    juce::dsp::FFT forwardFFT { fftOrder };
    juce::dsp::WindowingFunction<float> window { (size_t) fftSize, juce::dsp::WindowingFunction<float>::hann };

    std::array<float, fftSize> fifo {};
    std::array<float, fftSize * 2> fftData {};
    int fifoIndex = 0;
    std::atomic<bool> nextFFTBlockReady { false };

    // Smoothed magnitude output
    mutable std::array<float, fftSize / 2> smoothedMagnitudes {};

    void pushSampleToFFT (float sample);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (TR88EQProcessor)
};
