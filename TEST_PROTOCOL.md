# Test Protocol

## Comprehensive Testing Scenarios

### Test 1: End-to-End Message Processing

**Objective**: Verify complete message processing pipeline

**Steps**:
1. Navigate to **Shield** tab
2. Paste high-voltage message: `"I NEED THIS REPORT BY END OF DAY! WHY IS IT NOT DONE YET?!"`
3. Wait for processing (60-second batching window)
4. Verify:
   - ✅ BLUF summary appears
   - ✅ Voltage score is displayed (should be High)
   - ✅ Translation is provided
   - ✅ "Why" explanation is shown
   - ✅ Raw text is hidden initially (Vacuum of Time)
   - ✅ Haptic pulse triggers when revealing raw text

**Expected Result**: Message is processed, translated, and presented safely

---

### Test 2: Daily Check-In Flow

**Objective**: Verify daily check-in and status calculation

**Steps**:
1. Navigate to **Heartbeat** tab
2. Click "Start Check-In"
3. Complete all questions (adjust sliders)
4. Verify:
   - ✅ Real-time percentage calculation
   - ✅ Resonance level is displayed
   - ✅ Status is calculated (Green/Yellow/Orange/Red)
   - ✅ Check-in is saved to history
   - ✅ Status badge updates

**Expected Result**: Check-in completes, percentage calculated, status updated

---

### Test 3: Mesh Connection

**Objective**: Verify peer-to-peer mesh connectivity

**Steps**:
1. Navigate to **Heartbeat** tab
2. Copy your connection code
3. Share with trusted peer (or test with second instance)
4. Peer adds your connection code
5. Verify:
   - ✅ Peer appears in peer list
   - ✅ Status broadcasts are received
   - ✅ Connection state is "connected"
   - ✅ Dead man's switch is active

**Expected Result**: Peer connection established, status broadcasts working

---

### Test 4: Deep Processing Queue

**Objective**: Verify metabolic gating works

**Steps**:
1. Complete Daily Check-In with low status (<25%)
2. Navigate to **Shield** tab
3. Paste high-spoon message (≥3 spoons)
4. Verify:
   - ✅ Message is processed
   - ✅ Message appears in Deep Processing Queue (not in Processed)
   - ✅ "Promote to Processed" button is available
   - ✅ Queue is visible in Shield tab

**Expected Result**: High-spoon messages are gated when status is low

---

### Test 5: Tetrahedron Visualization

**Objective**: Verify 3D visualization and calculations

**Steps**:
1. Navigate to **Tetrahedron** tab
2. Wait for component to load (lazy-loaded)
3. Verify:
   - ✅ 3D tetrahedron is visible
   - ✅ 4 nodes are displayed (A, B, Context, AI)
   - ✅ Symmetry % is calculated (should be near 100%)
   - ✅ Curvature (κ) is displayed
   - ✅ Purity is calculated
   - ✅ Status is "stable" or "convergent"

**Expected Result**: 3D visualization loads, all metrics calculated

---

### Test 6: Native Bridge

**Objective**: Verify native platform integration

**Steps**:
1. **Haptic Feedback**:
   - Navigate to **Safe** tab
   - Trigger 4-4-8 breathing
   - Verify haptic feedback triggers

2. **Notifications**:
   - Trigger a notification (e.g., missed check-in)
   - Verify notification appears

3. **Clipboard**:
   - Navigate to **Broadcast** tab
   - Click "Copy Broadcast"
   - Verify message is copied to clipboard

4. **File System** (Tauri/Capacitor only):
   - Export check-in history
   - Verify file is saved

**Expected Result**: All native features work on target platform

---

### Test 7: Genre Error Detection

**Objective**: Verify Physics/Poetics mismatch detection

**Steps**:
1. Navigate to **Shield** tab
2. Paste message with Genre Error: `"I feel like we're not really on the same page about the design. It just feels a bit cold."`
3. Verify:
   - ✅ Genre Error is detected
   - ✅ Validation script triggers (if configured)
   - ✅ Haptic feedback triggers
   - ✅ "You Are Safe" menu opens (if configured)

**Expected Result**: Genre Error is detected and handled appropriately

---

### Test 8: Restorative Reset Protocol

**Objective**: Verify burnout recovery protocol

**Steps**:
1. Set status to Critical (<25%) via Daily Check-In
2. Verify:
   - ✅ Restorative Reset appears automatically
   - ✅ 4 phases are displayed
   - ✅ Somatic directives are shown
   - ✅ Validation scripts are displayed
   - ✅ Vagus signal can be triggered

**Expected Result**: Restorative Reset protocol is accessible and functional

---

### Test 9: First Light Verification

**Objective**: Verify operational readiness

**Steps**:
1. Navigate to **First Light** tab
2. Click "Test" on each test payload
3. Verify:
   - ✅ All 6 verification steps pass
   - ✅ Node Broadcast appears when all pass
   - ✅ Status shows "GREEN BOARD"

**Expected Result**: All First Light checks pass

---

### Test 10: Pre-Launch Sequence

**Objective**: Verify comprehensive launch readiness

**Steps**:
1. Navigate to **Pre-Launch** tab
2. Click "Run All Checks"
3. Verify:
   - ✅ All 11 checks pass
   - ✅ Critical checks all pass
   - ✅ Status shows "GREEN BOARD"
   - ✅ All categories show green

**Expected Result**: All Pre-Launch checks pass

---

## Test Data Sets

### High-Voltage Messages
- `"I NEED THIS REPORT BY END OF DAY! WHY IS IT NOT DONE YET?!"`
- `"This is completely unacceptable. You need to fix this immediately."`
- `"I can't believe you forgot the attachment AGAIN! This is unprofessional!"`

### Genre Error Messages
- `"I feel like we're not really on the same page about the design. It just feels a bit cold."`
- `"Maybe you should think about how this affects the team."`
- `"It would be nice if you could be more considerate."`

### Low-Voltage Messages
- `"Dinner is ready"`
- `"OTP code: 123456"`
- `"Can you look at this PR when you have a chance?"`

---

## Expected Behaviors

### Message Processing
- BLUF appears before raw text
- Voltage score is accurate
- Translation removes "sting" but keeps "meaning"
- "Why" explanation is empathetic

### Status Calculation
- Percentage is calculated using π-Metric
- Status maps correctly (80-100% = Green, etc.)
- Resonance level is displayed
- History is saved

### Mesh Connectivity
- Peer connections are established
- Status broadcasts are received
- Dead man's switch triggers on missed check-ins
- Connection codes work correctly

### Metabolic Gating
- Messages are gated when status < 25% and spoons ≥ 3
- Deep Processing Queue is visible
- Messages can be promoted from queue
- Queue clears when status improves

---

## Success Criteria

All tests must pass for **GREEN BOARD** status:

- ✅ Test 1: End-to-End Message Processing
- ✅ Test 2: Daily Check-In Flow
- ✅ Test 3: Mesh Connection
- ✅ Test 4: Deep Processing Queue
- ✅ Test 5: Tetrahedron Visualization
- ✅ Test 6: Native Bridge
- ✅ Test 7: Genre Error Detection
- ✅ Test 8: Restorative Reset Protocol
- ✅ Test 9: First Light Verification
- ✅ Test 10: Pre-Launch Sequence

---

**Status: GREEN BOARD**

**The geometry is the leader.**



