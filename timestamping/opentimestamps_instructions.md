# OpenTimestamps Instructions

**Service:** OpenTimestamps (opentimestamps.org)
**Cost:** Free
**Method:** Bitcoin Blockchain Anchoring
**Timeline:** Stamp (immediate) → Confirmation (1 hour) → Upgrade (minutes)

## Prerequisites

1. **Python Installation:** Python 3.6+ required
2. **OpenTimestamps Client:** `pip install opentimestamps-client`
3. **Bitcoin Node Access:** Client connects to public Bitcoin nodes

## Step-by-Step Process

### 1. Create Timestamp (Immediate)
```bash
# Navigate to document directory
cd /path/to/defensive_publication

# Create timestamp
ots stamp SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf

# Expected output:
# Submitting to remote calendar https://bob.btc.calendar.opentimestamps.org
# Submitting to remote calendar https://alice.btc.calendar.opentimestamps.org
# Submitting to remote calendar https://finney.calendar.eternitywall.com
# Success! Timestamp complete.
```

### 2. Wait for Bitcoin Confirmation (~1 hour)
```bash
# Monitor Bitcoin blockchain
# Wait for 1 block confirmation (average 10 minutes)
# Recommended: wait 6 blocks (1 hour) for security
```

### 3. Upgrade Proof File (After Confirmation)
```bash
# Upgrade the proof to include actual Bitcoin block
ots upgrade SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf.ots

# Expected output:
# Success! Timestamp upgraded.
# New .ots file size will be larger (includes Merkle path)
```

### 4. Verify Timestamp
```bash
# Verify the timestamp is valid
ots verify SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf.ots

# Expected output:
# Assuming target hash is in Bitcoin block [block hash]
# Success! Bitcoin attests to target hash's existence as of [timestamp]
```

## File Management

```
Original: SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf
Stamp:    SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf.ots (initial)
Upgraded: SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf.ots (final)
```

## Security Features

- **Blockchain Anchoring:** Timestamp anchored to Bitcoin blockchain
- **Merkle Trees:** Document hash aggregated with others for efficiency
- **Multiple Calendars:** Distributed timestamping servers
- **Cryptographic Proof:** SHA-256 hash with verifiable Merkle path
- **Permanent Validity:** Even if OpenTimestamps service disappears, proofs remain valid

## Backup and Storage

1. **Store .ots file** with original document
2. **Multiple copies** across different locations
3. **Include in evidence package** for patent proceedings
4. **Document creation process** with timestamps

## Troubleshooting

### If Stamp Fails:
- Check internet connection
- Verify Python installation
- Try different calendar servers

### If Upgrade Fails:
- Wait longer for block confirmations
- Check Bitcoin network status
- Retry upgrade command

### If Verification Fails:
- Ensure using upgraded .ots file
- Check file integrity (SHA-256 hash)
- Contact OpenTimestamps support

## Legal Admissibility

- **Court Acceptance:** Proven in multiple jurisdictions
- **Independent Verification:** Anyone can verify using Bitcoin node
- **No Third Party Dependency:** Blockchain provides permanent record
- **Timestamp Accuracy:** Within seconds of submission

## Cost-Benefit Analysis

**Pros:**
- Completely free
- Permanent blockchain record
- Independent verification
- High legal admissibility

**Cons:**
- Requires technical setup
- 1-hour wait for confirmation
- Bitcoin network dependency

**Recommendation:** Use as primary timestamping method due to permanence and cost.