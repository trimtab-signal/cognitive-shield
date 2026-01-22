# Prompts for Generating Defensive Publication Figures

## Figure 1: System Block Diagram (ESP32-S3, Optical Control, LoRa Module)

**Prompt for DALL-E or AI Image Generator:**

"Create a detailed technical block diagram for a mobile quantum key distribution device. Show the following components connected with labeled arrows and data flow:

- Central component: ESP32-S3 dual-core microcontroller with labels 'Optical Pulse Timing' and 'Cryptographic Stack'
- Connected to: 405nm Laser Diode with label 'Photon Source'
- Connected to: Beta Barium Borate (BBO) crystal with label 'Type-I SPDC for Photon Pairs'
- Connected to: Single Photon Avalanche Diode (SPAD) array with label 'Photon Detection'
- Connected to: Semtech SX1262 LoRa module with label '868/915 MHz Mesh Network'
- Data flow arrows showing: 'Optical Control' from ESP32 to laser/BBO, 'Raw Photon Data' from SPAD to ESP32, 'Quantum Key' from ESP32 to LoRa
- Include power supply block (Battery) connected to all components
- Style: Clean technical diagram with white background, blue/green color scheme, sans-serif fonts, vector graphics quality"

## Figure 2: Optical Schematic (Tetrahedral SIC-POVM Setup with BBO Crystal)

**Prompt for DALL-E or AI Image Generator:**

"Generate a precise optical schematic diagram for a tetrahedral SIC-POVM quantum measurement setup. Show:

- Central BBO crystal (Beta Barium Borate) with 405nm pump laser input beam
- Type-I Spontaneous Parametric Down-Conversion producing two entangled photon beams at 810nm each
- Beam splitter dividing photons to four measurement paths
- Four polarizing beam splitters (PBS) and wave plates forming tetrahedral geometry
- Four single photon detectors at the vertices of a regular tetrahedron
- Polarization rotators (half-wave plates) for SIC state preparation
- Include labels: 'Pump Laser 405nm', 'BBO Crystal', 'Signal Photon', 'Idler Photon', 'PBS', 'HWP', 'Detector'
- Show tetrahedral geometry with dotted lines connecting detectors
- Style: Scientific illustration, black lines on white background, precise technical drawing, include coordinate axes showing tetrahedral symmetry"

## Figure 3: Logic Flowchart for "Autopoietic Drift Correction"

**Prompt for DALL-E or AI Image Generator:**

"Create a detailed flowchart diagram showing the autopoietic drift correction algorithm for quantum key distribution. Use the following steps in a vertical flow:

- Start: 'Photon Detection Event'
- Decision: 'Coincidence Window Check (<1ns)?'
- Branch Yes: 'Valid Entangled Pair Detected'
- Branch No: 'Noise Event - Discard'
- Next: 'Extract Raw Key Bits'
- Process: 'Apply SIC-POVM Measurement'
- Decision: 'Quantum Bit Error Rate (QBER) < Threshold?'
- Branch Yes: 'Proceed to Privacy Amplification'
- Branch No: 'Drift Detected - Initiate Correction'
- Subprocess box: 'Autopoietic Correction Algorithm: Adjust measurement basis using feedback loop, minimize KL divergence between expected and measured state distributions'
- Loop back: 'Return to SIC-POVM Measurement'
- End: 'Secure Key Generated'

- Include arrows, diamonds for decisions, rectangles for processes, rounded rectangles for subprocesses
- Style: Technical flowchart, blue color scheme, clear labels, professional engineering diagram"

## Figure 4: Mesh Networking Topology Showing Ricci Curvature Path Selection

**Prompt for DALL-E or AI Image Generator:**

"Illustrate a decentralized mesh network topology diagram showing Ollivier-Ricci curvature-based path optimization. Show:

- 12 nodes arranged in a hexagonal mesh pattern
- Solid lines representing active connections with varying thickness (thicker = higher Ricci curvature/positive value)
- Dashed lines representing potential connections with lower curvature
- Color coding: Green lines for positive curvature (robust paths), red lines for negative curvature (bottleneck paths)
- Node labels showing curvature values (e.g., κ = +0.3, κ = -0.1)
- Central data packet path highlighted in blue, showing optimal route avoiding negative curvature bottlenecks
- Include legend: 'Positive Ricci Curvature (Robust)', 'Negative Ricci Curvature (Bottleneck)', 'Selected Path'
- Mathematical annotation: Show Ollivier-Ricci formula κ(x,y) = 1 - W₁(μₓ, μᵧ)/d(x,y)
- Style: Network topology diagram, clean lines, color-coded edges, scientific visualization with mathematical symbols"