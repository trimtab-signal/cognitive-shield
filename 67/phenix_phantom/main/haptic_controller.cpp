/**
 * Haptic Controller Implementation
 */

#include "haptic_controller.h"
#include "esp_log.h"
#include "driver/gpio.h"

static const char *TAG = "HAPTIC";

HapticController::HapticController() :
    i2c_port(I2C_NUM_0),
    current_qber(0.0f),
    last_qber(0.0f),
    is_stable(false),
    is_initialized(false)
{
}

HapticController::~HapticController() {
    // Cleanup if needed
}

esp_err_t HapticController::init(i2c_port_t port) {
    i2c_port = port;

    ESP_LOGI(TAG, "Initializing haptic controller (DRV2605L) on I2C port %d", port);

    // Configure I2C for haptic driver
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = HAPTIC_I2C_SDA,
        .scl_io_num = HAPTIC_I2C_SCL,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master = {
            .clk_speed = 400000
        }
    };

    esp_err_t ret = i2c_param_config(i2c_port, &conf);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to configure I2C: %d", ret);
        return ret;
    }

    ret = i2c_driver_install(i2c_port, conf.mode, 0, 0, 0);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to install I2C driver: %d", ret);
        return ret;
    }

    // Initialize DRV2605L
    vTaskDelay(pdMS_TO_TICKS(100));  // Wait for device to be ready

    // Set to PWM input mode for real-time control
    ret = write_register(HAPTIC_REG_MODE, 0x03);  // PWM input mode
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to set haptic mode: %d", ret);
        return ret;
    }

    // Configure feedback control for LRA motor
    ret = write_register(HAPTIC_REG_FEEDBACK, 0xB6);  // LRA mode, 2x brake factor
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to configure feedback: %d", ret);
        return ret;
    }

    // Set control register for LRA
    ret = write_register(HAPTIC_REG_CONTROL1, 0x93);  // LRA drive time 2.3ms, sample time 300us
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to set control: %d", ret);
        return ret;
    }

    is_initialized = true;
    ESP_LOGI(TAG, "Haptic controller initialized - QBER-driven feedback active");

    return ESP_OK;
}

esp_err_t HapticController::write_register(uint8_t reg, uint8_t value) {
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();

    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (HAPTIC_ADDR << 1) | I2C_MASTER_WRITE, true);
    i2c_master_write_byte(cmd, reg, true);
    i2c_master_write_byte(cmd, value, true);
    i2c_master_stop(cmd);

    esp_err_t ret = i2c_master_cmd_begin(i2c_port, cmd, pdMS_TO_TICKS(100));
    i2c_cmd_link_delete(cmd);

    return ret;
}

esp_err_t HapticController::read_register(uint8_t reg, uint8_t* value) {
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();

    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (HAPTIC_ADDR << 1) | I2C_MASTER_WRITE, true);
    i2c_master_write_byte(cmd, reg, true);
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (HAPTIC_ADDR << 1) | I2C_MASTER_READ, true);
    i2c_master_read_byte(cmd, value, I2C_MASTER_NACK);
    i2c_master_stop(cmd);

    esp_err_t ret = i2c_master_cmd_begin(i2c_port, cmd, pdMS_TO_TICKS(100));
    i2c_cmd_link_delete(cmd);

    return ret;
}

esp_err_t HapticController::update_resistance_from_qber(float qber) {
    if (!is_initialized) {
        return ESP_ERR_INVALID_STATE;
    }

    current_qber = qber;

    // Check stability for detent
    float qber_change = fabs(current_qber - last_qber);
    is_stable = (qber_change < QBER_STABILITY_THRESHOLD);

    last_qber = current_qber;

    // Map QBER to PWM duty cycle (inverse relationship)
    // Lower QBER = lower resistance = higher PWM duty cycle
    float resistance_factor = QBER_RESISTANCE_MIN +
                             (QBER_RESISTANCE_MAX - QBER_RESISTANCE_MIN) * current_qber;

    // Convert to PWM value (0-255)
    uint8_t pwm_value = (uint8_t)(resistance_factor * 255.0f);

    // Set RTP input register for real-time PWM control
    esp_err_t ret = write_register(HAPTIC_REG_RTP_INPUT, pwm_value);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to update QBER resistance: %d", ret);
        return ret;
    }

    ESP_LOGD(TAG, "Updated haptic resistance - QBER: %.3f, PWM: %d, Stable: %s",
             current_qber, pwm_value, is_stable ? "YES" : "NO");

    return ESP_OK;
}

esp_err_t HapticController::set_detent_stability(bool stable) {
    if (!is_initialized) {
        return ESP_ERR_INVALID_STATE;
    }

    is_stable = stable;

    // In full implementation, would control rotary encoder detent
    // For now, trigger different haptic effects based on stability

    uint8_t effect = stable ? 0x01 : 0x02;  // Different waveforms

    esp_err_t ret = write_register(HAPTIC_REG_WAVEFORM, effect);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to set detent stability: %d", ret);
        return ret;
    }

    ret = write_register(HAPTIC_REG_GO, 0x01);  // Trigger effect
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to trigger detent effect: %d", ret);
        return ret;
    }

    ESP_LOGD(TAG, "Set detent stability: %s", stable ? "LOCKED" : "UNLOCKED");

    return ESP_OK;
}

esp_err_t HapticController::trigger_feedback(uint8_t effect) {
    if (!is_initialized) {
        return ESP_ERR_INVALID_STATE;
    }

    esp_err_t ret = write_register(HAPTIC_REG_WAVEFORM, effect);
    if (ret != ESP_OK) {
        return ret;
    }

    ret = write_register(HAPTIC_REG_GO, 0x01);
    if (ret != ESP_OK) {
        return ret;
    }

    ESP_LOGD(TAG, "Triggered haptic feedback effect: %d", effect);

    return ESP_OK;
}

float HapticController::get_resistance_level() const {
    // Return resistance factor based on current QBER
    return QBER_RESISTANCE_MIN + (QBER_RESISTANCE_MAX - QBER_RESISTANCE_MIN) * current_qber;
}</content>
<parameter name="filePath">c:\MASTER_PROJECT\67\phenix_phantom\main\haptic_controller.cpp