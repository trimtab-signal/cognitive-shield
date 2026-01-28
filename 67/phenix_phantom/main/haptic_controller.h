/**
 * Haptic Feedback Controller for Phenix Navigator
 *
 * Connects quantum bit error rate (QBER) metrics to rotary encoder resistance.
 * Provides tactile feedback for mesh health and quantum security status.
 *
 * @date January 27, 2026
 * @author Geodesic Operator
 * @license AGPLv3
 */

#pragma once

#include <stdint.h>
#include "driver/i2c.h"

// DRV2605L Haptic Driver Constants
#define HAPTIC_ADDR 0x5A
#define HAPTIC_REG_STATUS 0x00
#define HAPTIC_REG_MODE 0x01
#define HAPTIC_REG_RTP_INPUT 0x02
#define HAPTIC_REG_LIBRARY 0x03
#define HAPTIC_REG_WAVEFORM 0x04
#define HAPTIC_REG_GO 0x0C
#define HAPTIC_REG_FEEDBACK 0x1A
#define HAPTIC_REG_CONTROL1 0x1B

// QBER to resistance mapping
#define QBER_RESISTANCE_MIN 0.1f   // Low resistance = good QBER
#define QBER_RESISTANCE_MAX 1.0f   // High resistance = poor QBER
#define QBER_STABILITY_THRESHOLD 0.05f  // QBER change threshold for detent

/**
 * Haptic feedback state
 */
class HapticController {
private:
    i2c_port_t i2c_port;
    float current_qber;
    float last_qber;
    bool is_stable;
    bool is_initialized;

    /**
     * Write to DRV2605L register
     */
    esp_err_t write_register(uint8_t reg, uint8_t value);

    /**
     * Read from DRV2605L register
     */
    esp_err_t read_register(uint8_t reg, uint8_t* value);

    /**
     * Set haptic effect based on QBER
     */
    esp_err_t set_effect_from_qber(float qber);

public:
    HapticController();
    ~HapticController();

    /**
     * Initialize haptic controller
     */
    esp_err_t init(i2c_port_t port = HAPTIC_I2C_NUM);

    /**
     * Update resistance based on current QBER
     */
    esp_err_t update_resistance_from_qber(float qber);

    /**
     * Set detent lock when quantum state is stable
     */
    esp_err_t set_detent_stability(bool stable);

    /**
     * Trigger immediate haptic feedback
     */
    esp_err_t trigger_feedback(uint8_t effect = 1);

    /**
     * Get current QBER-derived resistance level
     */
    float get_resistance_level() const;

    /**
     * Check if quantum state is stable for detent
     */
    bool is_quantum_stable() const { return is_stable; }
};</content>
<parameter name="filePath">c:\MASTER_PROJECT\67\phenix_phantom\main\haptic_controller.h