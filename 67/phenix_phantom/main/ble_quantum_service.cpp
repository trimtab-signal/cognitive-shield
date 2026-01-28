/**
 * BLE Quantum Service Implementation
 */

#include "ble_quantum_service.h"
#include "esp_log.h"
#include "esp_system.h"

static const char *TAG = "BLE_QUANTUM";

// Static instance pointer for callbacks
BLEQuantumService* BLEQuantumService::instance = nullptr;

// GATT Database
static const uint16_t primary_service_uuid = ESP_GATT_UUID_PRI_SERVICE;
static const uint16_t character_declaration_uuid = ESP_GATT_UUID_CHAR_DECLARE;
static const uint16_t character_client_config_uuid = ESP_GATT_UUID_CHAR_CLIENT_CONFIG;

// Service UUID (16-bit)
static const uint16_t quantum_service_uuid = QUANTUM_SERVICE_UUID;

// Characteristic UUIDs (16-bit)
static const uint16_t qber_char_uuid = QUANTUM_CHAR_QBER_UUID;
static const uint16_t purity_char_uuid = QUANTUM_CHAR_PURITY_UUID;
static const uint16_t attack_char_uuid = QUANTUM_CHAR_ATTACK_UUID;
static const uint16_t key_rate_char_uuid = QUANTUM_CHAR_KEY_RATE_UUID;

// Characteristic properties
static const uint8_t char_prop_read_notify = ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_NOTIFY;
static const uint8_t char_prop_read = ESP_GATT_CHAR_PROP_BIT_READ;

// GATT database
static esp_gatts_attr_db_t gatt_db[] = {
    // Service Declaration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&primary_service_uuid, ESP_GATT_PERM_READ,
      sizeof(uint16_t), sizeof(quantum_service_uuid), (uint8_t*)&quantum_service_uuid}},

    // QBER Characteristic Declaration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_declaration_uuid, ESP_GATT_PERM_READ,
      sizeof(uint8_t), sizeof(char_prop_read_notify), (uint8_t*)&char_prop_read_notify}},

    // QBER Characteristic Value
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&qber_char_uuid, ESP_GATT_PERM_READ,
      sizeof(float), 0, nullptr}},

    // QBER Client Configuration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_client_config_uuid, ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
      sizeof(uint16_t), 0, nullptr}},

    // Purity Characteristic Declaration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_declaration_uuid, ESP_GATT_PERM_READ,
      sizeof(uint8_t), sizeof(char_prop_read_notify), (uint8_t*)&char_prop_read_notify}},

    // Purity Characteristic Value
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&purity_char_uuid, ESP_GATT_PERM_READ,
      sizeof(float), 0, nullptr}},

    // Purity Client Configuration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_client_config_uuid, ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
      sizeof(uint16_t), 0, nullptr}},

    // Attack Detection Characteristic Declaration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_declaration_uuid, ESP_GATT_PERM_READ,
      sizeof(uint8_t), sizeof(char_prop_read_notify), (uint8_t*)&char_prop_read_notify}},

    // Attack Detection Characteristic Value
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&attack_char_uuid, ESP_GATT_PERM_READ,
      sizeof(bool), 0, nullptr}},

    // Attack Detection Client Configuration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_client_config_uuid, ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
      sizeof(uint16_t), 0, nullptr}},

    // Key Rate Characteristic Declaration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_declaration_uuid, ESP_GATT_PERM_READ,
      sizeof(uint8_t), sizeof(char_prop_read_notify), (uint8_t*)&char_prop_read_notify}},

    // Key Rate Characteristic Value
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&key_rate_char_uuid, ESP_GATT_PERM_READ,
      sizeof(uint32_t), 0, nullptr}},

    // Key Rate Client Configuration
    {{ESP_GATT_AUTO_RSP}, {ESP_UUID_LEN_16, (uint8_t*)&character_client_config_uuid, ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
      sizeof(uint16_t), 0, nullptr}},
};

BLEQuantumService::BLEQuantumService() :
    gatts_if(ESP_GATT_IF_NONE),
    conn_id(0),
    connected(false),
    advertising(false),
    service_handle(0),
    qber_char_handle(0),
    purity_char_handle(0),
    attack_char_handle(0),
    key_rate_char_handle(0)
{
    memset(&current_metrics, 0, sizeof(QuantumMetrics));
    instance = this;
}

BLEQuantumService::~BLEQuantumService() {
    instance = nullptr;
}

esp_err_t BLEQuantumService::init() {
    ESP_LOGI(TAG, "Initializing BLE quantum service...");

    // Initialize BT controller
    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    esp_err_t ret = esp_bt_controller_init(&bt_cfg);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "BT controller init failed: %d", ret);
        return ret;
    }

    ret = esp_bt_controller_enable(ESP_BT_MODE_BLE);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "BT controller enable failed: %d", ret);
        return ret;
    }

    // Initialize Bluedroid
    ret = esp_bluedroid_init();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Bluedroid init failed: %d", ret);
        return ret;
    }

    ret = esp_bluedroid_enable();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Bluedroid enable failed: %d", ret);
        return ret;
    }

    // Register callbacks
    ret = esp_ble_gap_register_callback(gap_event_handler);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "GAP register failed: %d", ret);
        return ret;
    }

    ret = esp_ble_gatts_register_callback(gatts_event_handler);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "GATTS register failed: %d", ret);
        return ret;
    }

    // Set device name
    ret = esp_ble_gap_set_device_name(DEVICE_NAME);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Set device name failed: %d", ret);
        return ret;
    }

    ESP_LOGI(TAG, "BLE quantum service initialized");
    return ESP_OK;
}

esp_err_t BLEQuantumService::start_advertising() {
    if (advertising) {
        return ESP_OK;
    }

    ESP_LOGI(TAG, "Starting BLE advertising...");

    // Configure advertising parameters
    esp_ble_adv_params_t adv_params = {
        .adv_int_min = 0x20,
        .adv_int_max = 0x40,
        .adv_type = ADV_TYPE_IND,
        .own_addr_type = BLE_ADDR_TYPE_PUBLIC,
        .channel_map = ADV_CHNL_ALL,
        .adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY,
    };

    // Set advertising data
    uint8_t adv_data[31] = {0};
    uint8_t adv_data_len = 0;

    // Flags
    adv_data[adv_data_len++] = 2;
    adv_data[adv_data_len++] = ESP_BT_EIR_TYPE_FLAGS;
    adv_data[adv_data_len++] = ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT;

    // Service UUID
    adv_data[adv_data_len++] = 3;
    adv_data[adv_data_len++] = ESP_BT_EIR_TYPE_16SRV_PART;
    adv_data[adv_data_len++] = (uint8_t)(quantum_service_uuid & 0xFF);
    adv_data[adv_data_len++] = (uint8_t)((quantum_service_uuid >> 8) & 0xFF);

    // Device name
    uint8_t name_len = strlen(DEVICE_NAME);
    adv_data[adv_data_len++] = name_len + 1;
    adv_data[adv_data_len++] = ESP_BT_EIR_TYPE_CMPL_LOCAL_NAME;
    memcpy(&adv_data[adv_data_len], DEVICE_NAME, name_len);
    adv_data_len += name_len;

    esp_err_t ret = esp_ble_gap_config_adv_data_raw(adv_data, adv_data_len);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Config adv data failed: %d", ret);
        return ret;
    }

    ret = esp_ble_gap_start_advertising(&adv_params);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Start advertising failed: %d", ret);
        return ret;
    }

    advertising = true;
    ESP_LOGI(TAG, "BLE advertising started");
    return ESP_OK;
}

esp_err_t BLEQuantumService::stop_advertising() {
    if (!advertising) {
        return ESP_OK;
    }

    esp_err_t ret = esp_ble_gap_stop_advertising();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Stop advertising failed: %d", ret);
        return ret;
    }

    advertising = false;
    ESP_LOGI(TAG, "BLE advertising stopped");
    return ESP_OK;
}

esp_err_t BLEQuantumService::update_metrics(const QuantumMetrics& metrics) {
    current_metrics = metrics;

    if (!connected || gatts_if == ESP_GATT_IF_NONE) {
        return ESP_ERR_INVALID_STATE;
    }

    // Update QBER characteristic
    esp_ble_gatts_set_attr_value(qber_char_handle, sizeof(float), (uint8_t*)&metrics.qber);

    // Update purity characteristic
    esp_ble_gatts_set_attr_value(purity_char_handle, sizeof(float), (uint8_t*)&metrics.purity);

    // Update attack detection characteristic
    esp_ble_gatts_set_attr_value(attack_char_handle, sizeof(bool), (uint8_t*)&metrics.attack_detected);

    // Update key rate characteristic
    esp_ble_gatts_set_attr_value(key_rate_char_handle, sizeof(uint32_t), (uint8_t*)&metrics.key_rate);

    ESP_LOGD(TAG, "Updated BLE metrics - QBER: %.3f, Purity: %.3f, Attack: %s, KeyRate: %lu",
             metrics.qber, metrics.purity, metrics.attack_detected ? "YES" : "NO", metrics.key_rate);

    return ESP_OK;
}

// Static callback handlers
void BLEQuantumService::gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param) {
    if (!instance) return;

    switch (event) {
        case ESP_GAP_BLE_ADV_START_COMPLETE_EVT:
            if (param->adv_start_cmpl.status == ESP_BT_STATUS_SUCCESS) {
                ESP_LOGI(TAG, "BLE advertising started successfully");
            } else {
                ESP_LOGE(TAG, "BLE advertising start failed: %d", param->adv_start_cmpl.status);
            }
            break;

        case ESP_GAP_BLE_ADV_STOP_COMPLETE_EVT:
            if (param->adv_stop_cmpl.status == ESP_BT_STATUS_SUCCESS) {
                ESP_LOGI(TAG, "BLE advertising stopped successfully");
                instance->advertising = false;
            }
            break;

        default:
            break;
    }
}

void BLEQuantumService::gatts_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param) {
    if (!instance) return;

    instance->gatts_if = gatts_if;

    switch (event) {
        case ESP_GATTS_REG_EVT:
            if (param->reg.status == ESP_GATT_OK) {
                ESP_LOGI(TAG, "GATTS registered, app_id: %04x", param->reg.app_id);

                // Create GATT database
                esp_ble_gatts_create_attr_tab(gatt_db, gatts_if, sizeof(gatt_db) / sizeof(gatt_db[0]), 0);
            }
            break;

        case ESP_GATTS_CREAT_ATTR_TAB_EVT:
            if (param->add_attr_tab.status == ESP_GATT_OK) {
                ESP_LOGI(TAG, "GATT database created successfully");

                // Store characteristic handles
                instance->service_handle = param->add_attr_tab.svc_handle;
                instance->qber_char_handle = param->add_attr_tab.char_handle;
                instance->purity_char_handle = param->add_attr_tab.char_handle + 3;
                instance->attack_char_handle = param->add_attr_tab.char_handle + 6;
                instance->key_rate_char_handle = param->add_attr_tab.char_handle + 9;

                // Start advertising
                instance->start_advertising();
            }
            break;

        case ESP_GATTS_CONNECT_EVT:
            ESP_LOGI(TAG, "BLE device connected");
            instance->connected = true;
            instance->conn_id = param->connect.conn_id;
            break;

        case ESP_GATTS_DISCONNECT_EVT:
            ESP_LOGI(TAG, "BLE device disconnected");
            instance->connected = false;
            instance->conn_id = 0;

            // Restart advertising
            instance->start_advertising();
            break;

        default:
            break;
    }
}