/**
 * Audio Processing Implementation
 */

#include "audio_processor.h"
#include "esp_log.h"
#include "esp_timer.h"

static const char *TAG = "AUDIO_PROC";

AudioProcessor::AudioProcessor() :
    sample_count(0),
    emotional_entropy(0.0f),
    is_initialized(false),
    coherence_level(0.0f),
    pitch_stability(0.0f),
    amplitude_normalization(1.0f)
{
    // Initialize I2S config for ES8311
    i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
        .sample_rate = AUDIO_SAMPLE_RATE,
        .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
        .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
        .communication_format = I2S_COMM_FORMAT_I2S,
        .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
        .dma_buf_count = 8,
        .dma_buf_len = AUDIO_FFT_SIZE,
        .use_apll = false,
        .tx_desc_auto_clear = false,
        .fixed_mclk = 0
    };

    pin_config = {
        .bck_io_num = AUDIO_I2S_BCK,
        .ws_io_num = AUDIO_I2S_WS,
        .data_out_num = I2S_PIN_NO_CHANGE,
        .data_in_num = AUDIO_I2S_DIN
    };
}

AudioProcessor::~AudioProcessor() {
    if (is_initialized) {
        i2s_driver_uninstall(I2S_NUM_0);
    }
}

esp_err_t AudioProcessor::init() {
    ESP_LOGI(TAG, "Initializing audio processor for voice quantization");

    // Install I2S driver
    esp_err_t ret = i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to install I2S driver: %d", ret);
        return ret;
    }

    // Set pin configuration
    ret = i2s_set_pin(I2S_NUM_0, &pin_config);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to set I2S pins: %d", ret);
        return ret;
    }

    // Initialize FFT buffers
    memset(fft_input, 0, sizeof(fft_input));
    memset(fft_output, 0, sizeof(fft_output));

    is_initialized = true;
    ESP_LOGI(TAG, "Audio processor initialized - target latency: %dms", AUDIO_LATENCY_TARGET_MS);

    return ESP_OK;
}

esp_err_t AudioProcessor::process_audio(const int16_t* samples, size_t count) {
    if (!is_initialized) {
        return ESP_ERR_INVALID_STATE;
    }

    uint64_t start_time = esp_timer_get_time();

    // Copy samples to processing buffer
    size_t copy_count = (count < AUDIO_FFT_SIZE) ? count : AUDIO_FFT_SIZE;
    for (size_t i = 0; i < copy_count; i++) {
        audio_buffer[i] = samples[i];
        fft_input[i] = (float)samples[i] / 32768.0f;  // Normalize to [-1, 1]
    }

    // Zero-pad if needed
    for (size_t i = copy_count; i < AUDIO_FFT_SIZE; i++) {
        audio_buffer[i] = 0;
        fft_input[i] = 0.0f;
    }

    // Perform FFT and processing
    perform_fft();
    flatten_spectrum();
    calculate_emotional_entropy();
    normalize_amplitude();

    // Calculate coherence level (inverse of emotional entropy)
    coherence_level = 1.0f - emotional_entropy;

    // Calculate pitch stability (simplified spectral centroid variance)
    // In full implementation, would track centroid over time
    pitch_stability = 0.8f;  // Placeholder

    uint64_t end_time = esp_timer_get_time();
    uint32_t processing_time_us = end_time - start_time;
    float processing_time_ms = processing_time_us / 1000.0f;

    ESP_LOGD(TAG, "Audio processed in %.1fms - coherence: %.3f, entropy: %.3f",
             processing_time_ms, coherence_level, emotional_entropy);

    return ESP_OK;
}

void AudioProcessor::perform_fft() {
    // Simplified FFT implementation for ESP32
    // In production, would use ESP-DSP library or optimized FFT

    // Copy input to output (placeholder - real FFT would transform)
    memcpy(fft_output, fft_input, sizeof(fft_input));

    // Apply windowing (Hann window)
    for (int i = 0; i < AUDIO_FFT_SIZE; i++) {
        float window = 0.5f * (1.0f - cosf(2.0f * M_PI * i / (AUDIO_FFT_SIZE - 1)));
        fft_output[i] *= window;
    }

    // Placeholder FFT - in real implementation:
    // dsps_fft2r_fc32(fft_input, AUDIO_FFT_SIZE);
    // dsps_bit_rev_fc32(fft_input, AUDIO_FFT_SIZE);
}

void AudioProcessor::flatten_spectrum() {
    // Reduce pitch variance by flattening spectral peaks
    // This removes emotional "color" from voice

    for (int i = 0; i < AUDIO_FFT_SIZE / 2; i++) {  // Only process positive frequencies
        // Apply flattening factor to reduce dynamic range
        fft_output[i] *= (1.0f - VOICE_FLATTENING_FACTOR) +
                        VOICE_FLATTENING_FACTOR * (fft_output[i] / (fabs(fft_output[i]) + 1e-6f));
    }
}

void AudioProcessor::calculate_emotional_entropy() {
    // Calculate spectral entropy as measure of emotional variance
    float total_energy = 0.0f;
    float entropy = 0.0f;

    // Calculate total energy
    for (int i = 0; i < AUDIO_FFT_SIZE / 2; i++) {
        float magnitude = fabs(fft_output[i]);
        total_energy += magnitude * magnitude;
    }

    if (total_energy < 1e-6f) {
        emotional_entropy = 0.0f;
        return;
    }

    // Calculate Shannon entropy of spectrum
    for (int i = 0; i < AUDIO_FFT_SIZE / 2; i++) {
        float magnitude = fabs(fft_output[i]);
        float probability = (magnitude * magnitude) / total_energy;

        if (probability > 1e-6f) {
            entropy -= probability * log2f(probability);
        }
    }

    // Normalize entropy (max entropy for uniform spectrum)
    float max_entropy = log2f(AUDIO_FFT_SIZE / 2);
    emotional_entropy = entropy / max_entropy;

    // Clamp to [0, 1]
    if (emotional_entropy > 1.0f) emotional_entropy = 1.0f;
    if (emotional_entropy < 0.0f) emotional_entropy = 0.0f;
}

void AudioProcessor::normalize_amplitude() {
    // Calculate RMS amplitude
    float rms = 0.0f;
    for (int i = 0; i < AUDIO_FFT_SIZE; i++) {
        rms += audio_buffer[i] * audio_buffer[i];
    }
    rms = sqrtf(rms / AUDIO_FFT_SIZE);

    // Normalize to consistent level
    if (rms > 1e-6f) {
        amplitude_normalization = 16000.0f / rms;  // Target RMS level
    } else {
        amplitude_normalization = 1.0f;
    }
}

bool AudioProcessor::is_latency_compliant() const {
    // In full implementation, would track actual processing times
    // For now, assume compliant if initialized
    return is_initialized;
}</content>
<parameter name="filePath">c:\MASTER_PROJECT\67\phenix_phantom\main\audio_processor.cpp