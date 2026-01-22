# Defensive Publication Figure Generation Prompts

## Overview
These prompts are designed for generating the four required technical figures for the SIC-POVM QKD mobile system defensive publication. Each prompt includes:
- Technical specifications from the system design
- Visual requirements for clarity and technical accuracy
- Style guidelines for scientific publication quality

## Figure 1: System Block Diagram (ESP32-S3, Optical Control, LoRa Module)

**Prompt for Diagram Generation:**

```
Create a detailed system block diagram for a mobile quantum key distribution device. The diagram should show:

MAIN COMPONENTS (in boxes):
- ESP32-S3 Dual-Core Microcontroller (center, labeled with pins GPIO13,14,21,38-41)
- Semtech SX1262 LoRa Module (right side, +22dBm output, 915MHz)
- 405nm Laser Diode with Driver Circuit
- Beta Barium Borate (BBO) Crystal for SPDC
- Single Photon Avalanche Diode (SPAD) Array
- Random Number Generator (Quantum RNG)
- Cryptographic Processor (AES-256, HKDF)

DATA FLOWS (arrows):
- Optical pulses from Laser Diode → BBO Crystal → Photon Pairs
- Photon detection → SPAD Array → ESP32-S3 ADC
- SIC-POVM processing → ESP32-S3 Core 0
- Key generation → Cryptographic Processor
- Encrypted data → LoRa Module for transmission

POWER AND INTERFACES:
- 5V USB-C input with buck converter
- I2C bus for sensor control
- SPI for LoRa communication
- UART for debugging

STYLE: Clean technical diagram, black text on white background, sans-serif font (Arial), minimum 1200x800 resolution, labeled arrows and blocks, include component specifications in parentheses.
```

## Figure 2: Optical Schematic (Tetrahedral SIC-POVM Setup with BBO Crystal)

**Prompt for Diagram Generation:**

```
Generate an optical schematic diagram showing a tetrahedral SIC-POVM quantum measurement setup:

OPTICAL COMPONENTS:
- 405nm Laser Diode source (top left)
- Beam splitter (BS) creating two paths
- Half-wave plates (HWP) at 22.5° and 45° angles
- Quarter-wave plates (QWP) for polarization control
- Beta Barium Borate (BBO) crystal for Type-I Spontaneous Parametric Down-Conversion (SPDC)
- Single Photon Avalanche Diode (SPAD) detectors at tetrahedral vertices

TETRAHEDRAL GEOMETRY:
- Four SPAD detectors positioned at vertices of regular tetrahedron
- Optical paths shown as solid lines with arrows
- Polarization states labeled (H, V, D, A for horizontal, vertical, diagonal, anti-diagonal)
- SIC-POVM state vectors shown as Bloch sphere vectors

MEASUREMENT SETUP:
- Input photon from SPDC pair enters through polarizing beam splitter (PBS)
- Four measurement bases corresponding to tetrahedral faces
- Detection events trigger timestamp recording

LABELING: Include wavelength (405nm), crystal specifications (BBO, Type-I SPDC), detector efficiency (>20%), and pairwise state overlap |⟨ψᵢ|ψⱼ⟩|² = 1/3

STYLE: Technical optics diagram, red for 405nm light, blue for detection paths, black labels, minimum 1000x1000 resolution, include coordinate system showing tetrahedral symmetry.
```

## Figure 3: Logic Flowchart for "Autopoietic Drift Correction"

**Prompt for Diagram Generation:**

```
Create a detailed logic flowchart for the "Autopoietic Drift Correction" algorithm in a quantum communication system:

START POINT:
- Input: Raw photon detection timestamps and RSSI measurements

PROCESS STEPS (rectangles):
1. Timestamp synchronization between transmitter and receiver
2. RSSI distance estimation using log-distance path loss model
3. SIC-POVM state reconstruction from detection patterns
4. Quantum state tomography calculation
5. Autopoietic feedback loop initialization

DECISION POINTS (diamonds):
- Is timestamp drift > threshold (10μs)?
- Are SIC-POVM fidelities within bounds (F > 0.95)?
- Has RSSI changed significantly (>3dB)?
- Is quantum bit error rate (QBER) acceptable (<11%)?

CORRECTION ACTIONS:
- Phase lock loop (PLL) adjustment for timing
- Polarization controller tuning
- Adaptive optics compensation
- Error correction code application

FEEDBACK LOOP:
- Autopoietic self-correction: System adjusts parameters based on measurement outcomes
- Continuous monitoring and adaptation
- Convergence check: Return to measurement if not stable

END POINT:
- Output: Corrected quantum key bits and system parameters

STYLE: Standard flowchart symbols (rectangles for processes, diamonds for decisions, arrows for flow), blue for measurement steps, green for correction actions, red for decision branches, minimum 800x1200 resolution, clear labels and numbered steps.
```

## Figure 4: Mesh Networking Topology Showing Ricci Curvature Path Selection

**Prompt for Diagram Generation:**

```
Design a network topology diagram illustrating mesh networking with Ollivier-Ricci curvature path optimization:

NETWORK ELEMENTS:
- 12 nodes arranged in hexagonal mesh pattern
- Central hub node (labeled "Base Station")
- Edge nodes representing mobile devices
- LoRa communication links (868/915 MHz, shown as curved lines)

RICCI CURVATURE VISUALIZATION:
- Link thickness proportional to Ollivier-Ricci curvature value
- Thick green lines for positive curvature (κ > 0, robust paths)
- Thin red lines for negative curvature (κ < 0, bottleneck paths)
- Curvature values labeled on each link (-0.2 to +0.3 range)

PATH SELECTION:
- Optimal path highlighted in bold blue (highest average curvature)
- Suboptimal paths in gray
- Path cost calculation: Minimize bottlenecks, maximize redundancy

NODE CHARACTERISTICS:
- Each node shows battery level, signal strength, and curvature contribution
- Mobile nodes (smartphones/tablets) vs fixed nodes (gateways)
- Node colors: Green for high connectivity, yellow for medium, red for isolated

DYNAMIC ELEMENTS:
- Animation arrows showing packet routing along optimal paths
- Congestion indicators on bottleneck links
- Real-time curvature updates based on network traffic

LABELING: Include formulas κ = 1 - W₁(μₓ,μᵧ)/W₁(μₓ)+W₁(μᵧ) for Ollivier-Ricci curvature, frequency bands, and data rates (up to 50kbps).

STYLE: Network diagram with node-link structure, color-coded edges, minimum 1200x1000 resolution, professional technical appearance with legend explaining curvature scale and path selection criteria.
```

## Technical Implementation Notes

### Software Tools for Generation
- **Block Diagram**: Draw.io or Lucidchart for system diagrams
- **Optical Schematic**: Inkscape or Adobe Illustrator with optics symbol libraries
- **Flowchart**: Microsoft Visio or draw.io flowchart templates
- **Network Topology**: Graphviz with custom styling or network visualization libraries

### Quality Standards
- **Resolution**: Minimum 1200x800 for print publication
- **Colors**: Technical color scheme (blue for data, green for success, red for errors)
- **Fonts**: Sans-serif (Arial, Helvetica) for readability
- **Labels**: Clear, concise, technically accurate
- **Scale**: Consistent sizing and spacing

### Validation Checklist
- [ ] All components properly labeled with specifications
- [ ] Arrows show correct data flow direction
- [ ] Mathematical formulas correctly rendered
- [ ] Color scheme follows technical standards
- [ ] Figure numbers and captions match publication requirements
- [ ] High enough resolution for journal submission (300 DPI minimum)