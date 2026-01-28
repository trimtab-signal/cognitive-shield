/**
 * TDOA (Time Difference of Arrival) Synchronization for Tetrahedron Protocol
 *
 * Implements background-independent time synchronization using LoRa chirp timestamps.
 * No GPS/NTP dependency - uses relative timing between mesh nodes.
 *
 * Reference: LoRa chirp spread spectrum timing for mesh networks
 *
 * @date January 27, 2026
 * @author Geodesic Operator
 * @license AGPLv3
 */

#pragma once

#include <stdint.h>
#include <stdlib.h>
#include <math.h>
#include <vector>

// TDOA Constants
#define TDOA_MAX_CHIRPS 32
#define TDOA_SYNC_PRECISION_US 1000  // ±1ms target precision
#define TDOA_CHIRP_DURATION_US 1000000  // 1 second chirp for timing
#define TDOA_SPEED_OF_LIGHT 299792458.0f  // m/s
#define TDOA_LORA_FREQUENCY 915000000.0f  // 915 MHz

/**
 * Chirp timestamp from LoRa receiver
 */
struct ChirpTimestamp {
    uint32_t node_id;
    uint32_t local_timestamp_us;    // When received locally
    uint32_t remote_timestamp_us;   // Timestamp embedded in chirp
    float signal_strength_dbm;      // For quality assessment
    uint32_t sequence_number;       // Chirp sequence for tracking
};

/**
 * TDOA synchronization state for a node
 */
class TDOASync {
private:
    std::vector<ChirpTimestamp> recent_chirps;
    float node_offsets[OR_MAX_NODES];  // Time offset for each node (microseconds)
    uint32_t last_sync_time_ms;
    float sync_precision_us;           // Current synchronization precision

public:
    TDOASync();
    ~TDOASync();

    /**
     * Add a received chirp timestamp
     */
    void add_chirp_timestamp(const ChirpTimestamp& chirp);

    /**
     * Calculate time offset between two nodes using TDOA
     */
    double calculate_offset(int node_a, int node_b);

    /**
     * Synchronize the entire mesh using collected chirp data
     */
    void synchronize_mesh();

    /**
     * Get current synchronization precision
     */
    float get_sync_precision_us() const { return sync_precision_us; }

    /**
     * Check if synchronization is within acceptable bounds
     */
    bool is_synchronized() const { return sync_precision_us <= TDOA_SYNC_PRECISION_US; }

    /**
     * Generate synchronization chirp packet
     */
    void generate_sync_chirp(uint8_t* buffer, size_t& length, uint32_t sequence_num);

    /**
     * Process incoming synchronization chirp
     */
    void process_sync_chirp(const uint8_t* buffer, size_t length, uint32_t local_timestamp_us);
};</content>
<parameter name="filePath">c:\MASTER_PROJECT\67\phenix_phantom\main\tdoa_sync.h