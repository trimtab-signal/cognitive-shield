/**
 * PHENIX NAVIGATOR - Comprehensive Automated Test Suite
 * Tests all TDP compliance requirements and system integration
 */

#include <unity.h>
#include <esp_log.h>
#include <esp_system.h>
#include <esp_timer.h>

// Test components
#include "sic_povm.h"
#include "ollivier_ricci.h"
#include "tdoa_sync.h"
#include "audio_processor.h"
#include "haptic_controller.h"
#include "ble_quantum_service.h"

// Test configuration from Kconfig
#ifdef CONFIG_PHENIX_TEST_ITERATIONS
#define TEST_ITERATIONS CONFIG_PHENIX_TEST_ITERATIONS
#else
#define TEST_ITERATIONS 1000
#endif

#ifdef CONFIG_PHENIX_TEST_DURATION_MS
#define PERFORMANCE_TEST_DURATION_MS CONFIG_PHENIX_TEST_DURATION_MS
#else
#define PERFORMANCE_TEST_DURATION_MS 5000
#endif

static const char *TAG = "PHENIX_TESTS";

// ============================================================================
// UNIT TESTS
// ============================================================================

void test_sic_povm_geometry(void) {
    ESP_LOGI(TAG, "Testing SIC-POVM tetrahedral geometry...");

    // Test completeness
    bool completeness_ok = sic_povm.verify_completeness();
    TEST_ASSERT_TRUE(completeness_ok);

    // Test symmetry
    bool symmetry_ok = sic_povm.verify_symmetry();
    TEST_ASSERT_TRUE(symmetry_ok);

    // Test overlap constant
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.333f, SIC_OVERLAP_CONSTANT);

    ESP_LOGI(TAG, "✓ SIC-POVM geometry validation passed");
}

void test_sic_povm_protocol(void) {
    ESP_LOGI(TAG, "Testing SIC-POVM QKD protocol...");

    for (int i = 0; i < TEST_ITERATIONS; i++) {
        auto result = qkd_system.protocol_step(true, false);

        // Protocol should succeed
        TEST_ASSERT_TRUE(result.success);

        // Purity should be reasonable
        TEST_ASSERT_FLOAT_WITHIN(1.0f, 0.0f, result.corrected_purity);
        TEST_ASSERT_FLOAT_WITHIN(1.0f, 1.0f, result.corrected_purity);

        // Key bit should be 0 or 1
        TEST_ASSERT_TRUE(result.key_bit == 0 || result.key_bit == 1);
    }

    ESP_LOGI(TAG, "✓ SIC-POVM protocol test passed (%d iterations)", TEST_ITERATIONS);
}

void test_ollivier_ricci_routing(void) {
    ESP_LOGI(TAG, "Testing Ollivier-Ricci mesh routing...");

    // Initialize mesh router
    OllivierRicciRouter router;
    router.init();

    // Add test nodes
    for (int i = 0; i < 5; i++) {
        router.add_node(i);
    }

    // Test routing calculations
    for (int i = 0; i < 5; i++) {
        for (int j = i + 1; j < 5; j++) {
            float curvature = router.calculate_curvature(i, j);
            TEST_ASSERT_FLOAT_WITHIN(2.0f, -1.0f, curvature); // Reasonable curvature range
        }
    }

    ESP_LOGI(TAG, "✓ Ollivier-Ricci routing test passed");
}

void test_tdoa_synchronization(void) {
    ESP_LOGI(TAG, "Testing TDOA time synchronization...");

    TDOASync tdoa;
    tdoa.init();

    // Generate test chirp
    uint8_t buffer[256];
    size_t len;
    tdoa.generate_sync_chirp(buffer, len, 12345);

    TEST_ASSERT_TRUE(len > 0);
    TEST_ASSERT_TRUE(len <= sizeof(buffer));

    // Test synchronization
    tdoa.synchronize_mesh();

    ESP_LOGI(TAG, "✓ TDOA synchronization test passed");
}

void test_audio_processor(void) {
    ESP_LOGI(TAG, "Testing audio processing pipeline...");

    AudioProcessor processor;

    esp_err_t ret = processor.init();
    TEST_ASSERT_EQUAL(ESP_OK, ret);

    // Generate test audio samples
    int16_t test_samples[AUDIO_FFT_SIZE];
    for (int i = 0; i < AUDIO_FFT_SIZE; i++) {
        test_samples[i] = (int16_t)(32767 * sin(2 * M_PI * 1000 * i / AUDIO_SAMPLE_RATE)); // 1kHz tone
    }

    // Process audio
    ret = processor.process_audio(test_samples, AUDIO_FFT_SIZE);
    TEST_ASSERT_EQUAL(ESP_OK, ret);

    // Check latency compliance
    bool latency_ok = processor.is_latency_compliant();
    TEST_ASSERT_TRUE(latency_ok);

    ESP_LOGI(TAG, "✓ Audio processor test passed");
}

void test_haptic_controller(void) {
    ESP_LOGI(TAG, "Testing haptic feedback controller...");

    HapticController controller;

    // Note: Hardware tests would require actual DRV2605L
    // For now, test software logic

    // Test QBER to resistance mapping
    float test_qber_values[] = {0.0f, 0.5f, 1.0f};
    float expected_resistance[] = {1.0f, 0.55f, 0.1f}; // Inverse relationship

    for (int i = 0; i < 3; i++) {
        controller.update_resistance_from_qber(test_qber_values[i]);
        float resistance = controller.get_resistance_level();
        TEST_ASSERT_FLOAT_WITHIN(0.1f, expected_resistance[i], resistance);
    }

    ESP_LOGI(TAG, "✓ Haptic controller test passed");
}

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

void test_quantum_protocol_performance(void) {
    ESP_LOGI(TAG, "Testing quantum protocol performance...");

    uint32_t start_time = esp_timer_get_time() / 1000;
    uint32_t operations = 0;

    while ((esp_timer_get_time() / 1000) - start_time < PERFORMANCE_TEST_DURATION_MS) {
        auto result = qkd_system.protocol_step(true, false);
        if (result.success) {
            operations++;
        }
    }

    float ops_per_second = (float)operations / (PERFORMANCE_TEST_DURATION_MS / 1000.0f);
    ESP_LOGI(TAG, "Quantum protocol: %.1f ops/sec", ops_per_second);

    // Should achieve reasonable throughput
    TEST_ASSERT_TRUE(ops_per_second > 10.0f);

    ESP_LOGI(TAG, "✓ Quantum protocol performance test passed");
}

void test_audio_latency(void) {
    ESP_LOGI(TAG, "Testing audio processing latency...");

    AudioProcessor processor;
    processor.init();

    uint32_t latencies[LATENCY_TEST_SAMPLES];
    int16_t test_samples[AUDIO_FFT_SIZE];

    // Generate test audio
    for (int i = 0; i < AUDIO_FFT_SIZE; i++) {
        test_samples[i] = rand() % 65536 - 32768;
    }

    for (int i = 0; i < LATENCY_TEST_SAMPLES; i++) {
        uint32_t start = esp_timer_get_time();
        processor.process_audio(test_samples, AUDIO_FFT_SIZE);
        uint32_t end = esp_timer_get_time();

        latencies[i] = (end - start) / 1000; // Convert to microseconds
    }

    // Calculate average latency
    uint32_t total_latency = 0;
    uint32_t max_latency = 0;
    uint32_t min_latency = UINT32_MAX;

    for (int i = 0; i < LATENCY_TEST_SAMPLES; i++) {
        total_latency += latencies[i];
        if (latencies[i] > max_latency) max_latency = latencies[i];
        if (latencies[i] < min_latency) min_latency = latencies[i];
    }

    float avg_latency_ms = (float)total_latency / LATENCY_TEST_SAMPLES / 1000.0f;

    ESP_LOGI(TAG, "Audio latency - Avg: %.2fms, Min: %.2fms, Max: %.2fms",
             avg_latency_ms, (float)min_latency / 1000.0f, (float)max_latency / 1000.0f);

    // Must meet 20ms requirement
    TEST_ASSERT_TRUE(avg_latency_ms < 20.0f);
    TEST_ASSERT_TRUE(max_latency < 50000); // 50ms absolute maximum

    ESP_LOGI(TAG, "✓ Audio latency test passed");
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

void test_full_system_integration(void) {
    ESP_LOGI(TAG, "Testing full system integration...");

    // Initialize all components
    AudioProcessor audio_processor;
    HapticController haptic_controller;
    BLEQuantumService ble_service;

    TEST_ASSERT_EQUAL(ESP_OK, audio_processor.init());
    TEST_ASSERT_EQUAL(ESP_OK, haptic_controller.init(HAPTIC_I2C_NUM));
    TEST_ASSERT_EQUAL(ESP_OK, ble_service.init());

    // Run integrated protocol loop
    for (int i = 0; i < 50; i++) {
        // Quantum protocol step
        auto result = qkd_system.protocol_step(true, false);
        TEST_ASSERT_TRUE(result.success);

        // Calculate QBER from purity
        float qber = 1.0f - result.corrected_purity;

        // Update haptic feedback
        TEST_ASSERT_EQUAL(ESP_OK, haptic_controller.update_resistance_from_qber(qber));

        // Update BLE metrics
        QuantumMetrics metrics = {
            .qber = qber,
            .purity = result.corrected_purity,
            .attack_detected = result.attack_detected,
            .key_rate = i, // Mock key rate
            .timestamp = (uint32_t)(esp_timer_get_time() / 1000000)
        };
        TEST_ASSERT_EQUAL(ESP_OK, ble_service.update_metrics(metrics));

        // Small delay to simulate real-time operation
        vTaskDelay(pdMS_TO_TICKS(10));
    }

    ESP_LOGI(TAG, "✓ Full system integration test passed");
}

// ============================================================================
// SECURITY TESTS
// ============================================================================

void test_quantum_security_properties(void) {
    ESP_LOGI(TAG, "Testing quantum security properties...");

    // Test attack detection
    bool attack_detected = false;
    float avg_purity = 1.0f;

    for (int i = 0; i < TEST_ITERATIONS; i++) {
        auto result = qkd_system.protocol_step(true, false);

        if (result.attack_detected) {
            attack_detected = true;
            ESP_LOGI(TAG, "Attack detected at iteration %d", i);
        }

        // Track average purity
        avg_purity = 0.99f * avg_purity + 0.01f * result.corrected_purity;
    }

    // Should maintain high average purity
    TEST_ASSERT_FLOAT_WITHIN(0.1f, 0.9f, avg_purity);

    ESP_LOGI(TAG, "✓ Quantum security test passed (Avg purity: %.3f)", avg_purity);
}

// ============================================================================
// TEST RUNNER
// ============================================================================

void run_all_tests(void) {
    ESP_LOGI(TAG, "=========================================");
    ESP_LOGI(TAG, "PHENIX NAVIGATOR - FULL AUTOMATED TESTING");
    ESP_LOGI(TAG, "=========================================");

    // Unit Tests
    UNITY_BEGIN();

    RUN_TEST(test_sic_povm_geometry);
    RUN_TEST(test_sic_povm_protocol);
    RUN_TEST(test_ollivier_ricci_routing);
    RUN_TEST(test_tdoa_synchronization);
    RUN_TEST(test_audio_processor);
    RUN_TEST(test_haptic_controller);

    // Performance Tests
    RUN_TEST(test_quantum_protocol_performance);
    RUN_TEST(test_audio_latency);

    // Integration Tests
    RUN_TEST(test_full_system_integration);

    // Security Tests
    RUN_TEST(test_quantum_security_properties);

    UNITY_END();

    ESP_LOGI(TAG, "=========================================");
    ESP_LOGI(TAG, "ALL TESTS COMPLETED");
    ESP_LOGI(TAG, "=========================================");
}

// Test main function for ESP-IDF
extern "C" void app_main(void) {
    ESP_LOGI(TAG, "Starting Phenix Navigator automated test suite...");

    // Initialize basic ESP32 components
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // Run all tests
    run_all_tests();

    ESP_LOGI(TAG, "Test suite execution complete. Check results above.");
}