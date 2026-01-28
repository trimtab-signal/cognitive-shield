/**
 * BLE Service for Quantum Metrics Transmission
 * GATT service to transmit real-time quantum security metrics to Cognitive Shield
 */

#pragma once

#include "esp_bt.h"
#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "esp_bt_defs.h"
#include "esp_bt_main.h"
#include "esp_gatt_common_api.h"
#include <string.h>

// BLE Service UUIDs
#define QUANTUM_SERVICE_UUID    0x00FF
#define QUANTUM_CHAR_QBER_UUID  0xFF01
#define QUANTUM_CHAR_PURITY_UUID 0xFF02
#define QUANTUM_CHAR_ATTACK_UUID 0xFF03
#define QUANTUM_CHAR_KEY_RATE_UUID 0xFF04

// BLE Device Configuration
#define DEVICE_NAME "Phenix Navigator"
#define MANUFACTURER_DATA_LEN 8

// Quantum metrics structure
struct QuantumMetrics {
    float qber;              // Quantum bit error rate (0.0-1.0)
    float purity;            // Quantum state purity (0.0-1.0)
    bool attack_detected;    // Attack detection flag
    uint32_t key_rate;       // Keys generated per minute
    uint32_t timestamp;      // Unix timestamp
};

class BLEQuantumService {
private:
    esp_gatt_if_t gatts_if;
    uint16_t conn_id;
    bool connected;
    bool advertising;

    // GATT handles
    uint16_t service_handle;
    uint16_t qber_char_handle;
    uint16_t purity_char_handle;
    uint16_t attack_char_handle;
    uint16_t key_rate_char_handle;

    // Current metrics
    QuantumMetrics current_metrics;

    // BLE event handlers
    static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param);
    static void gatts_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param);

    // Instance pointer for static callbacks
    static BLEQuantumService* instance;

public:
    BLEQuantumService();
    ~BLEQuantumService();

    esp_err_t init();
    esp_err_t start_advertising();
    esp_err_t stop_advertising();
    esp_err_t update_metrics(const QuantumMetrics& metrics);

    bool is_connected() const { return connected; }
    bool is_advertising() const { return advertising; }

    // Get current metrics
    const QuantumMetrics& get_current_metrics() const { return current_metrics; }
};