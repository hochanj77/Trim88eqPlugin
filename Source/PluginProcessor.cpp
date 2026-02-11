#include "PluginProcessor.h"
#include "PluginEditor.h"

TR88EQProcessor::TR88EQProcessor()
    : AudioProcessor (BusesProperties()
                        .withInput  ("Input",  juce::AudioChannelSet::stereo(), true)
                        .withOutput ("Output", juce::AudioChannelSet::stereo(), true)),
      apvts (*this, nullptr, "Parameters", createParameterLayout())
{
}

juce::AudioProcessorValueTreeState::ParameterLayout TR88EQProcessor::createParameterLayout()
{
    std::vector<std::unique_ptr<juce::RangedAudioParameter>> params;

    auto freqRange = juce::NormalisableRange<float> (20.0f, 20000.0f, 1.0f, 0.25f);
    auto gainRange = juce::NormalisableRange<float> (-18.0f, 18.0f, 0.01f);
    auto qRange    = juce::NormalisableRange<float> (0.1f, 10.0f, 0.01f, 0.5f);

    juce::StringArray filterTypes { "lowshelf", "peaking", "highshelf", "lowcut", "highcut" };
    float defaultFreqs[3] = { 100.0f, 1000.0f, 8000.0f };
    juce::String defaultTypes[3] = { "lowshelf", "peaking", "highshelf" };

    for (int i = 0; i < 3; ++i)
    {
        auto idx = juce::String (i + 1);

        params.push_back (std::make_unique<juce::AudioParameterFloat> (
            juce::ParameterID { "band" + idx + "_freq", 1 },
            "Band " + idx + " Freq",
            freqRange, defaultFreqs[i]));

        params.push_back (std::make_unique<juce::AudioParameterFloat> (
            juce::ParameterID { "band" + idx + "_gain", 1 },
            "Band " + idx + " Gain",
            gainRange, 0.0f));

        params.push_back (std::make_unique<juce::AudioParameterFloat> (
            juce::ParameterID { "band" + idx + "_q", 1 },
            "Band " + idx + " Q",
            qRange, 0.7f));

        params.push_back (std::make_unique<juce::AudioParameterChoice> (
            juce::ParameterID { "band" + idx + "_type", 1 },
            "Band " + idx + " Type",
            filterTypes,
            filterTypes.indexOf (defaultTypes[i])));

        params.push_back (std::make_unique<juce::AudioParameterBool> (
            juce::ParameterID { "band" + idx + "_enabled", 1 },
            "Band " + idx + " Enabled",
            true));
    }

    params.push_back (std::make_unique<juce::AudioParameterFloat> (
        juce::ParameterID { "master_gain", 1 },
        "Master Gain",
        gainRange, 0.0f));

    params.push_back (std::make_unique<juce::AudioParameterBool> (
        juce::ParameterID { "power", 1 },
        "Power",
        true));

    return { params.begin(), params.end() };
}

BandParameters TR88EQProcessor::getBandParameters (int bandIndex) const
{
    auto idx = juce::String (bandIndex + 1);
    BandParameters bp;
    bp.freq    = apvts.getRawParameterValue ("band" + idx + "_freq");
    bp.gain    = apvts.getRawParameterValue ("band" + idx + "_gain");
    bp.q       = apvts.getRawParameterValue ("band" + idx + "_q");
    bp.type    = apvts.getRawParameterValue ("band" + idx + "_type");
    bp.enabled = apvts.getRawParameterValue ("band" + idx + "_enabled");
    return bp;
}

std::atomic<float>* TR88EQProcessor::getMasterGain() const
{
    return apvts.getRawParameterValue ("master_gain");
}

std::atomic<float>* TR88EQProcessor::getPowerParam() const
{
    return apvts.getRawParameterValue ("power");
}

void TR88EQProcessor::prepareToPlay (double sampleRate, int samplesPerBlock)
{
    currentSampleRate = sampleRate;

    juce::dsp::ProcessSpec spec;
    spec.sampleRate = sampleRate;
    spec.maximumBlockSize = (juce::uint32) samplesPerBlock;
    spec.numChannels = (juce::uint32) getTotalNumOutputChannels();

    for (auto& band : bands)
    {
        band.filter1.prepare (spec);
        band.filter2.prepare (spec);
    }

    masterGainDSP.prepare (spec);
    masterGainDSP.setRampDurationSeconds (0.02);

    updateFilters();

    fifo.fill (0.0f);
    fifoIndex = 0;
    nextFFTBlockReady.store (false);
}

void TR88EQProcessor::releaseResources()
{
}

bool TR88EQProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
{
    if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::mono()
        && layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
        return false;

    if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
        return false;

    return true;
}

juce::dsp::IIR::Coefficients<float>::Ptr TR88EQProcessor::makeCoefficients (int bandIndex) const
{
    auto bp = getBandParameters (bandIndex);
    float freq = bp.freq->load();
    float gain = bp.gain->load();
    float q    = bp.q->load();
    int   type = (int) bp.type->load();

    auto sr = currentSampleRate;

    switch (type)
    {
        case 0: // lowshelf
            return juce::dsp::IIR::Coefficients<float>::makeLowShelf (sr, freq, q,
                       juce::Decibels::decibelsToGain (gain));
        case 1: // peaking
            return juce::dsp::IIR::Coefficients<float>::makePeakFilter (sr, freq, q,
                       juce::Decibels::decibelsToGain (gain));
        case 2: // highshelf
            return juce::dsp::IIR::Coefficients<float>::makeHighShelf (sr, freq, q,
                       juce::Decibels::decibelsToGain (gain));
        case 3: // lowcut (highpass)
            return juce::dsp::IIR::Coefficients<float>::makeHighPass (sr, freq, q);
        case 4: // highcut (lowpass)
            return juce::dsp::IIR::Coefficients<float>::makeLowPass (sr, freq, q);
        default:
            return juce::dsp::IIR::Coefficients<float>::makePeakFilter (sr, freq, q,
                       juce::Decibels::decibelsToGain (gain));
    }
}

void TR88EQProcessor::updateFilters()
{
    for (int i = 0; i < 3; ++i)
    {
        auto bp = getBandParameters (i);
        int type = (int) bp.type->load();
        bool enabled = bp.enabled->load() > 0.5f;

        currentBandEnabled[i] = enabled;

        auto coeffs = makeCoefficients (i);
        *bands[i].filter1.state = *coeffs;
        currentCoeffs[i] = coeffs;

        // Cascade for cut filters (4th order)
        bool cascade = (type == 3 || type == 4);
        bands[i].needsCascade = cascade;
        currentBandCascaded[i] = cascade;

        if (cascade)
        {
            auto coeffs2 = makeCoefficients (i);
            *bands[i].filter2.state = *coeffs2;
            currentCascadeCoeffs[i] = coeffs2;
        }
        else
        {
            currentCascadeCoeffs[i] = nullptr;
        }
    }

    float masterGainDb = getMasterGain()->load();
    masterGainDSP.setGainDecibels (masterGainDb);
}

void TR88EQProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer&)
{
    juce::ScopedNoDenormals noDenormals;

    auto totalNumInputChannels  = getTotalNumInputChannels();
    auto totalNumOutputChannels = getTotalNumOutputChannels();

    for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
        buffer.clear (i, 0, buffer.getNumSamples());

    bool powerOn = getPowerParam()->load() > 0.5f;

    if (! powerOn)
        return;

    updateFilters();

    juce::dsp::AudioBlock<float> block (buffer);
    juce::dsp::ProcessContextReplacing<float> context (block);

    for (int i = 0; i < 3; ++i)
    {
        if (! currentBandEnabled[i])
            continue;

        bands[i].filter1.process (context);

        if (bands[i].needsCascade)
            bands[i].filter2.process (context);
    }

    masterGainDSP.process (context);

    // Push samples to FFT FIFO (mono sum)
    auto numSamples = buffer.getNumSamples();
    auto numChannels = buffer.getNumChannels();

    for (int s = 0; s < numSamples; ++s)
    {
        float sample = 0.0f;
        for (int ch = 0; ch < numChannels; ++ch)
            sample += buffer.getSample (ch, s);
        sample /= (float) numChannels;

        pushSampleToFFT (sample);
    }
}

void TR88EQProcessor::pushSampleToFFT (float sample)
{
    if (fifoIndex >= fftSize)
    {
        if (! nextFFTBlockReady.load())
        {
            std::copy (fifo.begin(), fifo.end(), fftData.begin());
            std::fill (fftData.begin() + fftSize, fftData.end(), 0.0f);
            nextFFTBlockReady.store (true);
        }
        fifoIndex = 0;
    }

    fifo[(size_t) fifoIndex++] = sample;
}

void TR88EQProcessor::getFFTData (float* outputMagnitudes, int numPoints) const
{
    if (! nextFFTBlockReady.load())
    {
        // Return smoothed data from last frame
        auto count = juce::jmin (numPoints, (int) smoothedMagnitudes.size());
        std::copy (smoothedMagnitudes.begin(), smoothedMagnitudes.begin() + count, outputMagnitudes);
        return;
    }

    // Copy and process FFT
    auto fftDataCopy = fftData;

    const_cast<juce::dsp::WindowingFunction<float>&> (window).multiplyWithWindowingTable (
        fftDataCopy.data(), (size_t) fftSize);

    const_cast<juce::dsp::FFT&> (forwardFFT).performFrequencyOnlyForwardTransform (
        fftDataCopy.data());

    const float minDb = -100.0f;
    const float maxDb = 0.0f;
    auto count = juce::jmin (numPoints, fftSize / 2);

    for (int i = 0; i < count; ++i)
    {
        auto level = juce::jlimit (minDb, maxDb,
                                    juce::Decibels::gainToDecibels (fftDataCopy[(size_t) i])
                                    - juce::Decibels::gainToDecibels ((float) fftSize));

        float normalized = juce::jmap (level, minDb, maxDb, 0.0f, 1.0f);

        // Smooth with decay
        float decay = 0.88f;
        smoothedMagnitudes[(size_t) i] = juce::jmax (normalized, smoothedMagnitudes[(size_t) i] * decay);

        outputMagnitudes[i] = smoothedMagnitudes[(size_t) i];
    }

    const_cast<std::atomic<bool>&> (nextFFTBlockReady).store (false);
}

void TR88EQProcessor::getMagnitudeResponseForBand (int bandIndex, const double* frequencies,
                                                     double* magnitudes, int numPoints) const
{
    if (bandIndex < 0 || bandIndex >= 3 || ! currentBandEnabled[bandIndex])
    {
        for (int i = 0; i < numPoints; ++i)
            magnitudes[i] = 1.0;
        return;
    }

    if (currentCoeffs[bandIndex] != nullptr)
    {
        currentCoeffs[bandIndex]->getMagnitudeForFrequencyArray (
            frequencies, magnitudes, (size_t) numPoints, currentSampleRate);

        if (currentBandCascaded[bandIndex] && currentCascadeCoeffs[bandIndex] != nullptr)
        {
            std::vector<double> cascadeMag ((size_t) numPoints);
            currentCascadeCoeffs[bandIndex]->getMagnitudeForFrequencyArray (
                frequencies, cascadeMag.data(), (size_t) numPoints, currentSampleRate);

            for (int i = 0; i < numPoints; ++i)
                magnitudes[i] *= cascadeMag[(size_t) i];
        }
    }
    else
    {
        for (int i = 0; i < numPoints; ++i)
            magnitudes[i] = 1.0;
    }
}

void TR88EQProcessor::getCompositeMagnitudeResponse (const double* frequencies,
                                                       double* magnitudes, int numPoints) const
{
    for (int i = 0; i < numPoints; ++i)
        magnitudes[i] = 1.0;

    std::vector<double> bandMag ((size_t) numPoints);

    for (int b = 0; b < 3; ++b)
    {
        getMagnitudeResponseForBand (b, frequencies, bandMag.data(), numPoints);
        for (int i = 0; i < numPoints; ++i)
            magnitudes[i] *= bandMag[(size_t) i];
    }

    // Apply master gain
    float masterDb = getMasterGain()->load();
    double masterLinear = juce::Decibels::decibelsToGain ((double) masterDb);
    for (int i = 0; i < numPoints; ++i)
        magnitudes[i] *= masterLinear;
}

juce::AudioProcessorEditor* TR88EQProcessor::createEditor()
{
    return new TR88EQEditor (*this);
}

void TR88EQProcessor::getStateInformation (juce::MemoryBlock& destData)
{
    auto state = apvts.copyState();
    auto xml = state.createXml();
    copyXmlToBinary (*xml, destData);
}

void TR88EQProcessor::setStateInformation (const void* data, int sizeInBytes)
{
    auto xml = getXmlFromBinary (data, sizeInBytes);
    if (xml != nullptr && xml->hasTagName (apvts.state.getType()))
        apvts.replaceState (juce::ValueTree::fromXml (*xml));
}

juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new TR88EQProcessor();
}
