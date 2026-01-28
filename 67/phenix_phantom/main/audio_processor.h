/**
 * Audio Processing for Phenix Navigator - Voice Quantization
 *
 * Implements FFT-based voice processing for ESP32-S3 with <20ms latency.
 * Quantizes voice to remove emotional entropy and extract quantum coherence.
 *
 * @date January 27, 2026
 * @author Geodesic Operator
 * @license AGPLv3
 */

#pragma once

#include <stdint.h>
#include <math.h>
#include "driver/i2s.h"

// Audio processing constants
#define AUDIO_SAMPLE_RATE 16000  // 16kHz for voice processing
#define AUDIO_FFT_SIZE 512       // 512 samples = 32ms window @ 16kHz
#define AUDIO_CHANNELS 1         // Mono processing
#define AUDIO_BITS_PER_SAMPLE 16 // 16-bit PCM

// Latency target: <20ms total processing time
#define AUDIO_LATENCY_TARGET_MS 20

// Voice quantization parameters
#define VOICE_FLATTENING_FACTOR 0.7f  // Reduce pitch variance
#define EMOTIONAL_ENTROPY_THRESHOLD 0.3f  // Coherence threshold

/**
 * Audio processing state
 */
class AudioProcessor {
private:
    // I2S configuration
    i2s_config_t i2s_config;
    i2s_pin_config_t pin_config;

    // FFT buffers
    float fft_input[AUDIO_FFT_SIZE];
    float fft_output[AUDIO_FFT_SIZE];
    int16_t audio_buffer[AUDIO_FFT_SIZE];

    // Processing state
    uint32_t sample_count;
    float emotional_entropy;
    bool is_initialized;

    // Voice quantization results
    float coherence_level;      // 0.0 - 1.0 (higher = more coherent)
    float pitch_stability;      // Measure of pitch variance
    float amplitude_normalization;

public:
    AudioProcessor();
    ~AudioProcessor();

    /**
     * Initialize audio processing pipeline
     */
    esp_err_t init();

    /**
     * Process audio buffer and extract quantum coherence
     */
    esp_err_t process_audio(const int16_t* samples, size_t sample_count);

    /**
     * Get current emotional entropy level
     */
    float get_emotional_entropy() const { return emotional_entropy; }

    /**
     * Get voice coherence level (0.0 = chaotic, 1.0 = quantum coherent)
     */
    float get_coherence_level() const { return coherence_level; }

    /**
     * Check if processing latency is within target
     */
    bool is_latency_compliant() const;

private:
    /**
     * Perform FFT on audio buffer
     */
    void perform_fft();

    /**
     * Flatten spectral content to reduce emotional variance
     */
    void flatten_spectrum();

    /**
     * Calculate emotional entropy from frequency domain
     */
    void calculate_emotional_entropy();

    /**
     * Normalize amplitude to remove volume-based emotional cues
     */
    void normalize_amplitude();
};</content>
<parameter name="filePath">c:\MASTER_PROJECT\67\phenix_phantom\main\audio_processor.h