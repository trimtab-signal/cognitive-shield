/**
 * TDOA Synchronization Implementation
 */

#include "tdoa_sync.h"
#include "esp_log.h"

static const char *TAG = "TDOA_SYNC";

TDOASync::TDOASync() {
    memset(node_offsets, 0, sizeof(node_offsets));
    last_sync_time_ms = 0;
    sync_precision_us = TDOA_SYNC_PRECISION_US * 10; // Start with poor precision
    recent_chirps.reserve(TDOA_MAX_CHIRPS);
}

TDOASync::~TDOASync() {
    // Cleanup
}

void TDOASync::add_chirp_timestamp(const ChirpTimestamp& chirp) {
    recent_chirps.push_back(chirp);

    // Keep only recent chirps
    if (recent_chirps.size() > TDOA_MAX_CHIRPS) {
        recent_chirps.erase(recent_chirps.begin());
    }

    ESP_LOGD(TAG, "Added chirp from node %d, seq %d", chirp.node_id, chirp.sequence_number);
}

double TDOASync::calculate_offset(int node_a, int node_b) {
    // Find common chirp sequences between nodes
    std::vector<std::pair<ChirpTimestamp, ChirpTimestamp>> common_chirps;

    for (const auto& chirp_a : recent_chirps) {
        if (chirp_a.node_id != (uint32_t)node_a) continue;

        for (const auto& chirp_b : recent_chirps) {
            if (chirp_b.node_id != (uint32_t)node_b) continue;
            if (chirp_a.sequence_number == chirp_b.sequence_number) {
                common_chirps.emplace_back(chirp_a, chirp_b);
                break;
            }
        }
    }

    if (common_chirps.empty()) {
        ESP_LOGW(TAG, "No common chirps found between nodes %d and %d", node_a, node_b);
        return 0.0;
    }

    // Calculate average time difference
    double total_offset = 0.0;
    for (const auto& pair : common_chirps) {
        const auto& chirp_a = pair.first;
        const auto& chirp_b = pair.second;

        // Time difference at reception
        int32_t time_diff = (int32_t)chirp_a.local_timestamp_us - (int32_t)chirp_b.local_timestamp_us;

        // Account for propagation delay (simplified - assumes symmetric distances)
        // In full implementation, would use known node positions

        total_offset += time_diff;
    }

    double avg_offset = total_offset / common_chirps.size();

    ESP_LOGI(TAG, "Calculated offset between nodes %d and %d: %.1f us", node_a, node_b, avg_offset);

    return avg_offset;
}

void TDOASync::synchronize_mesh() {
    // Simplified synchronization - in full implementation would use multilateration
    // For tetrahedron mesh, we can use pairwise offsets to establish relative timing

    ESP_LOGI(TAG, "Starting mesh synchronization with %d recent chirps", recent_chirps.size());

    // Calculate pairwise offsets
    for (int i = 0; i < OR_MAX_NODES; i++) {
        for (int j = i + 1; j < OR_MAX_NODES; j++) {
            double offset = calculate_offset(i, j);
            if (offset != 0.0) {
                node_offsets[i] = offset / 2.0;  // Simplified
                node_offsets[j] = -offset / 2.0;
            }
        }
    }

    // Calculate synchronization precision
    sync_precision_us = 0.0;
    int valid_offsets = 0;

    for (int i = 0; i < OR_MAX_NODES; i++) {
        if (node_offsets[i] != 0.0) {
            sync_precision_us += fabs(node_offsets[i]);
            valid_offsets++;
        }
    }

    if (valid_offsets > 0) {
        sync_precision_us /= valid_offsets;
    } else {
        sync_precision_us = TDOA_SYNC_PRECISION_US * 10; // Poor precision
    }

    last_sync_time_ms = esp_timer_get_time() / 1000;

    ESP_LOGI(TAG, "Mesh synchronization complete. Precision: %.1f us, Valid nodes: %d",
             sync_precision_us, valid_offsets);
}

void TDOASync::generate_sync_chirp(uint8_t* buffer, size_t& length, uint32_t sequence_num) {
    // Create synchronization chirp packet
    // Format: [MSG_TYPE_SYNC][seq_num_4bytes][timestamp_4bytes][reserved]

    buffer[0] = MSG_TYPE_SYNC;
    buffer[1] = 12;  // Payload length

    // Sequence number
    buffer[2] = sequence_num & 0xFF;
    buffer[3] = (sequence_num >> 8) & 0xFF;
    buffer[4] = (sequence_num >> 16) & 0xFF;
    buffer[5] = (sequence_num >> 24) & 0xFF;

    // Current timestamp
    uint32_t timestamp = esp_timer_get_time();
    buffer[6] = timestamp & 0xFF;
    buffer[7] = (timestamp >> 8) & 0xFF;
    buffer[8] = (timestamp >> 16) & 0xFF;
    buffer[9] = (timestamp >> 24) & 0xFF;

    // Reserved
    buffer[10] = 0;
    buffer[11] = 0;
    buffer[12] = 0;
    buffer[13] = 0;

    length = 14;  // Total packet length

    ESP_LOGD(TAG, "Generated sync chirp seq %d", sequence_num);
}

void TDOASync::process_sync_chirp(const uint8_t* buffer, size_t length, uint32_t local_timestamp_us) {
    if (length < 14 || buffer[0] != MSG_TYPE_SYNC) {
        ESP_LOGW(TAG, "Invalid sync chirp packet");
        return;
    }

    ChirpTimestamp chirp;
    chirp.sequence_number = buffer[2] | (buffer[3] << 8) | (buffer[4] << 16) | (buffer[5] << 24);
    chirp.remote_timestamp_us = buffer[6] | (buffer[7] << 8) | (buffer[8] << 16) | (buffer[9] << 24);
    chirp.local_timestamp_us = local_timestamp_us;
    chirp.signal_strength_dbm = -50.0f;  // Placeholder - would come from LoRa hardware
    chirp.node_id = 0;  // Placeholder - would be determined from packet source

    add_chirp_timestamp(chirp);

    ESP_LOGD(TAG, "Processed sync chirp seq %d, remote_ts=%d, local_ts=%d",
             chirp.sequence_number, chirp.remote_timestamp_us, chirp.local_timestamp_us);
}</content>
<parameter name="filePath">c:\MASTER_PROJECT\67\phenix_phantom\main\tdoa_sync.cpp