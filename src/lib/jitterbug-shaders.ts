/**
 * JITTERBUG SHADERS - DYNAMIC ENTROPY VISUALIZATION SYSTEM
 * Chaotic, beautiful GLSL shaders for quantum entropy visualization
 *
 * Creates mesmerizing, jittering entropy fields that dance with quantum uncertainty
 * Red=jagged (high entropy), Blue=fuzzy (thermal noise), Green=stable (coherence)
 */

import * as THREE from 'three';

// Jitterbug Shader System
export class JitterbugShaders {
  private shaders: Map<string, THREE.ShaderMaterial> = new Map();
  private uniforms: Map<string, any> = new Map();

  constructor() {
    this.initializeShaders();
  }

  /**
   * Initialize all Jitterbug entropy shaders
   */
  private initializeShaders(): void {
    // Red Jagged Entropy Shader (High Entropy - Chaotic)
    this.createRedJaggedShader();

    // Blue Fuzzy Thermal Shader (Thermal Noise - Wavy)
    this.createBlueFuzzyShader();

    // Green Stable Coherence Shader (Low Entropy - Ordered)
    this.createGreenStableShader();

    // Purple Quantum Superposition Shader (Mixed States)
    this.createPurpleSuperpositionShader();

    // Rainbow Decoherence Cascade Shader (State Collapse)
    this.createRainbowDecoherenceShader();

    // Gold Resonance Field Shader (Coherence Amplification)
    this.createGoldResonanceShader();

    // Void Singularity Shader (Maximum Entropy)
    this.createVoidSingularityShader();
  }

  /**
   * Red Jagged Entropy Shader - Chaotic high-entropy visualization
   */
  private createRedJaggedShader(): void {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        vTime = time;

        // Jitter vertices based on entropy
        vec3 jitteredPosition = position;
        float jitterAmount = entropy * 0.3;

        // Chaotic vertex displacement
        float noise1 = sin(position.x * 10.0 + time * 3.0) * cos(position.y * 8.0 + time * 2.5);
        float noise2 = sin(position.z * 12.0 + time * 4.0) * sin(position.x * 6.0 + time * 1.8);
        float noise3 = cos(position.y * 9.0 + time * 2.2) * cos(position.z * 7.0 + time * 3.7);

        jitteredPosition.x += (noise1 + noise2) * jitterAmount;
        jitteredPosition.y += (noise2 + noise3) * jitterAmount;
        jitteredPosition.z += (noise3 + noise1) * jitterAmount;

        // Distance-based jitter scaling
        float distance = length(position - playerPosition);
        float distanceFactor = 1.0 / (1.0 + distance * 0.1);
        jitteredPosition *= (1.0 + distanceFactor * entropy * 0.5);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(jitteredPosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      // Noise functions for jagged effects
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 st = vUv * 10.0;
        float n = noise(st + time * 2.0);

        // Jagged red entropy color
        vec3 baseColor = vec3(0.8, 0.1, 0.1);
        vec3 entropyColor = vec3(1.0, 0.3, 0.3);

        // Chaotic color variation
        float chaos = sin(vPosition.x * 5.0 + time * 3.0) *
                     cos(vPosition.y * 4.0 + time * 2.0) *
                     sin(vPosition.z * 6.0 + time * 4.0);

        vec3 finalColor = mix(baseColor, entropyColor, entropy + chaos * 0.3);

        // Jagged alpha based on entropy
        float jaggedAlpha = step(0.5, sin(vPosition.x * 20.0 + time * 5.0) *
                                       cos(vPosition.y * 15.0 + time * 3.0));

        float alpha = entropy * 0.8 + jaggedAlpha * 0.4;

        // Distance-based transparency
        float distance = length(vPosition - playerPosition);
        alpha *= 1.0 / (1.0 + distance * 0.05);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        entropy: { value: 0.5 },
        playerPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    this.shaders.set('redJagged', material);
  }

  /**
   * Blue Fuzzy Thermal Shader - Wavy thermal noise visualization
   */
  private createBlueFuzzyShader(): void {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vTime;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        vTime = time;

        // Thermal wave displacement
        vec3 displacedPosition = position;
        float waveAmplitude = entropy * 0.2;

        // Multiple wave frequencies for thermal noise
        float wave1 = sin(position.x * 3.0 + time * 1.5) * cos(position.z * 2.5 + time * 1.2);
        float wave2 = sin(position.y * 4.0 + time * 2.1) * sin(position.x * 2.0 + time * 1.8);
        float wave3 = cos(position.z * 3.5 + time * 1.9) * cos(position.y * 2.8 + time * 2.3);

        displacedPosition.y += (wave1 + wave2 + wave3) * waveAmplitude;

        // Thermal expansion
        float expansion = entropy * 0.1 * sin(time * 0.5);
        displacedPosition *= (1.0 + expansion);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vTime;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      // Fuzzy noise for thermal effects
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;

        for(int i = 0; i < 4; i++) {
          value += amplitude * sin(st.x * frequency + time);
          st *= 2.0;
          amplitude *= 0.5;
          frequency += 1.0;
        }
        return value;
      }

      void main() {
        vec2 st = vUv * 8.0;
        float fuzzyNoise = fbm(st + time * 0.3);

        // Blue thermal color palette
        vec3 coolBlue = vec3(0.1, 0.3, 0.8);
        vec3 warmBlue = vec3(0.3, 0.5, 1.0);
        vec3 thermalBlue = vec3(0.5, 0.7, 1.0);

        // Thermal color mixing based on entropy
        vec3 baseColor = mix(coolBlue, warmBlue, entropy);
        vec3 finalColor = mix(baseColor, thermalBlue, fuzzyNoise * 0.5);

        // Fuzzy alpha with thermal waves
        float thermalWave = sin(vPosition.x * 2.0 + time * 1.5) *
                           cos(vPosition.z * 1.8 + time * 1.2) *
                           sin(vPosition.y * 2.5 + time * 1.8);

        float alpha = entropy * 0.6 + thermalWave * 0.3 + fuzzyNoise * 0.2;

        // Distance attenuation
        float distance = length(vPosition - playerPosition);
        alpha *= 1.0 / (1.0 + distance * 0.03);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        entropy: { value: 0.5 },
        playerPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    this.shaders.set('blueFuzzy', material);
  }

  /**
   * Green Stable Coherence Shader - Ordered low-entropy visualization
   */
  private createGreenStableShader(): void {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vTime;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        vTime = time;

        // Minimal stable displacement
        vec3 stablePosition = position;

        // Gentle coherence waves
        float coherenceWave = sin(position.x * 2.0 + time * 0.5) *
                             cos(position.z * 1.5 + time * 0.3) * 0.05;

        stablePosition.y += coherenceWave * (1.0 - entropy);

        // Coherence-based scaling
        float coherenceScale = 1.0 + (1.0 - entropy) * 0.1;
        stablePosition *= coherenceScale;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(stablePosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vTime;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      // Stable crystalline pattern
      float crystalPattern(vec2 st) {
        vec2 grid = fract(st * 5.0) - 0.5;
        float dist = length(grid);
        return 1.0 - smoothstep(0.0, 0.4, dist);
      }

      void main() {
        vec2 st = vUv * 6.0;
        float crystal = crystalPattern(st + time * 0.1);

        // Green coherence colors
        vec3 stableGreen = vec3(0.1, 0.8, 0.1);
        vec3 coherentGreen = vec3(0.3, 1.0, 0.3);
        vec3 crystalGreen = vec3(0.5, 1.0, 0.5);

        // Coherence-based color mixing
        vec3 baseColor = mix(stableGreen, coherentGreen, 1.0 - entropy);
        vec3 finalColor = mix(baseColor, crystalGreen, crystal * (1.0 - entropy));

        // Stable alpha
        float alpha = (1.0 - entropy) * 0.9 + crystal * 0.3;

        // Distance-based coherence falloff
        float distance = length(vPosition - playerPosition);
        alpha *= 1.0 / (1.0 + distance * 0.02);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        entropy: { value: 0.5 },
        playerPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    this.shaders.set('greenStable', material);
  }

  /**
   * Purple Quantum Superposition Shader - Mixed quantum states
   */
  private createPurpleSuperpositionShader(): void {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vSuperpositionPhase;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        vTime = time;

        // Quantum superposition displacement
        vec3 superpositionPosition = position;

        // Multiple quantum states interfering
        float phase1 = sin(position.x * 4.0 + time * 2.0) * cos(position.y * 3.0 + time * 1.5);
        float phase2 = cos(position.z * 3.5 + time * 2.5) * sin(position.x * 2.8 + time * 1.8);
        float phase3 = sin(position.y * 4.2 + time * 1.3) * cos(position.z * 3.1 + time * 2.2);

        vSuperpositionPhase = (phase1 + phase2 + phase3) / 3.0;

        // Superposition displacement
        float displacement = vSuperpositionPhase * entropy * 0.15;
        superpositionPosition += normal * displacement;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(superpositionPosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vSuperpositionPhase;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      // Quantum interference pattern
      vec3 quantumInterference(float phase) {
        float interference = sin(phase * 10.0 + time * 3.0);
        vec3 purple1 = vec3(0.5, 0.1, 0.8);
        vec3 purple2 = vec3(0.8, 0.3, 1.0);
        return mix(purple1, purple2, (interference + 1.0) * 0.5);
      }

      void main() {
        vec3 interferenceColor = quantumInterference(vSuperpositionPhase);

        // Superposition probability visualization
        float probability = abs(sin(vSuperpositionPhase * 5.0 + time * 2.0));
        float alpha = entropy * 0.7 + probability * 0.4;

        // Distance-based decoherence
        float distance = length(vPosition - playerPosition);
        alpha *= 1.0 / (1.0 + distance * 0.04);

        gl_FragColor = vec4(interferenceColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        entropy: { value: 0.5 },
        playerPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    this.shaders.set('purpleSuperposition', material);
  }

  /**
   * Rainbow Decoherence Cascade Shader - State collapse visualization
   */
  private createRainbowDecoherenceShader(): void {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vCollapseFactor;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        vTime = time;

        // Decoherence cascade displacement
        vec3 cascadePosition = position;

        // Wave function collapse simulation
        float collapseWave = sin(length(position) * 2.0 - time * 4.0);
        vCollapseFactor = smoothstep(0.0, 1.0, collapseWave);

        // Chaotic collapse displacement
        vec3 collapseDisplacement = normal * vCollapseFactor * entropy * 0.2;
        cascadePosition += collapseDisplacement;

        // Rainbow refraction effect
        float rainbowShift = vCollapseFactor * 0.1;
        cascadePosition.x += sin(time * 5.0 + position.y) * rainbowShift;
        cascadePosition.z += cos(time * 4.0 + position.x) * rainbowShift;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(cascadePosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vCollapseFactor;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      // Rainbow color from collapse factor
      vec3 rainbowColor(float factor) {
        float hue = factor * 6.0;
        float x = 1.0 - abs(mod(hue, 2.0) - 1.0);
        if (hue < 1.0) return vec3(1.0, x, 0.0);
        if (hue < 2.0) return vec3(x, 1.0, 0.0);
        if (hue < 3.0) return vec3(0.0, 1.0, x);
        if (hue < 4.0) return vec3(0.0, x, 1.0);
        if (hue < 5.0) return vec3(x, 0.0, 1.0);
        return vec3(1.0, 0.0, x);
      }

      void main() {
        vec3 collapseColor = rainbowColor(vCollapseFactor);

        // Decoherence sparkle effect
        float sparkle = sin(vPosition.x * 20.0 + time * 8.0) *
                       cos(vPosition.y * 15.0 + time * 6.0) *
                       sin(vPosition.z * 18.0 + time * 7.0);

        vec3 finalColor = mix(collapseColor, vec3(1.0), sparkle * 0.3);

        // Collapse-based transparency
        float alpha = entropy * 0.8 + vCollapseFactor * 0.5 + sparkle * 0.2;

        // Distance attenuation
        float distance = length(vPosition - playerPosition);
        alpha *= 1.0 / (1.0 + distance * 0.06);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        entropy: { value: 0.5 },
        playerPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    this.shaders.set('rainbowDecoherence', material);
  }

  /**
   * Gold Resonance Field Shader - Coherence amplification
   */
  private createGoldResonanceShader(): void {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vResonance;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        vTime = time;

        // Resonance field harmonics
        vec3 resonancePosition = position;

        // Multiple harmonic frequencies
        float harmonic1 = sin(length(position) * 3.0 - time * 2.0) * cos(position.y * 2.0 + time * 1.5);
        float harmonic2 = cos(length(position) * 4.0 - time * 3.0) * sin(position.x * 1.8 + time * 2.2);
        float harmonic3 = sin(length(position) * 2.5 - time * 1.8) * cos(position.z * 2.2 + time * 1.3);

        vResonance = (harmonic1 + harmonic2 + harmonic3) / 3.0;

        // Resonance displacement
        float displacement = vResonance * (1.0 - entropy) * 0.1;
        resonancePosition += normal * displacement;

        // Coherence amplification scaling
        float coherenceScale = 1.0 + (1.0 - entropy) * vResonance * 0.2;
        resonancePosition *= coherenceScale;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(resonancePosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vResonance;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      // Golden resonance color with metallic sheen
      vec3 goldResonance(float resonance) {
        vec3 gold1 = vec3(1.0, 0.8, 0.2);
        vec3 gold2 = vec3(1.0, 0.9, 0.4);
        vec3 metallic = vec3(0.9, 0.95, 0.8);

        float metallicMix = sin(resonance * 8.0 + time * 4.0) * 0.3 + 0.7;
        vec3 baseGold = mix(gold1, gold2, (resonance + 1.0) * 0.5);
        return mix(baseGold, metallic, metallicMix);
      }

      void main() {
        vec3 resonanceColor = goldResonance(vResonance);

        // Resonance field intensity
        float fieldStrength = (1.0 - entropy) * 0.9 + abs(vResonance) * 0.4;
        float alpha = fieldStrength;

        // Distance-based resonance falloff
        float distance = length(vPosition - playerPosition);
        alpha *= 1.0 / (1.0 + distance * 0.03);

        // Resonance sparkle
        float sparkle = sin(vPosition.x * 15.0 + time * 6.0) *
                       cos(vPosition.y * 12.0 + time * 5.0) *
                       sin(vPosition.z * 18.0 + time * 7.0);
        alpha += sparkle * 0.2 * (1.0 - entropy);

        gl_FragColor = vec4(resonanceColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        entropy: { value: 0.5 },
        playerPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    this.shaders.set('goldResonance', material);
  }

  /**
   * Void Singularity Shader - Maximum entropy black hole effect
   */
  private createVoidSingularityShader(): void {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vSingularityFactor;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        vTime = time;

        // Singularity gravitational lensing
        vec3 singularityPosition = position;

        // Distance from singularity center
        vec3 singularityCenter = vec3(0.0, 0.0, 0.0);
        vec3 toCenter = singularityCenter - position;
        float distance = length(toCenter);

        // Event horizon effect
        float horizonDistance = 2.0;
        vSingularityFactor = 1.0 - smoothstep(0.0, horizonDistance, distance);

        // Gravitational lensing displacement
        if (distance > 0.1) {
          vec3 lensDirection = normalize(toCenter);
          float lensStrength = vSingularityFactor * entropy * 0.5;
          singularityPosition += lensDirection * lensStrength;
        }

        // Time dilation near singularity
        float timeDilation = 1.0 - vSingularityFactor * 0.5;
        // (Would affect animation speed in fragment shader)

        gl_Position = projectionMatrix * modelViewMatrix * vec4(singularityPosition, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vTime;
      varying float vSingularityFactor;

      uniform float time;
      uniform float entropy;
      uniform vec3 playerPosition;

      // Hawking radiation visualization
      vec3 hawkingRadiation(float factor) {
        // Virtual particle pairs near event horizon
        float particleEffect = sin(vPosition.x * 50.0 + time * 15.0) *
                              cos(vPosition.y * 40.0 + time * 12.0) *
                              sin(vPosition.z * 45.0 + time * 18.0);

        vec3 radiationColor = vec3(0.8, 0.6, 1.0); // Purple-ish Hawking radiation
        return radiationColor * particleEffect * factor;
      }

      void main() {
        // Deep void colors
        vec3 voidColor = vec3(0.05, 0.02, 0.08);
        vec3 eventHorizonColor = vec3(0.1, 0.05, 0.15);
        vec3 singularityColor = vec3(0.0, 0.0, 0.0);

        // Color mixing based on singularity factor
        vec3 baseColor = mix(voidColor, eventHorizonColor, vSingularityFactor);
        vec3 finalColor = mix(baseColor, singularityColor, vSingularityFactor * vSingularityFactor);

        // Add Hawking radiation
        vec3 radiation = hawkingRadiation(vSingularityFactor);
        finalColor += radiation;

        // Singularity-based transparency
        float alpha = entropy * 0.9 + vSingularityFactor * 0.5;

        // Distance-based void attenuation
        float distance = length(vPosition - playerPosition);
        alpha *= 1.0 / (1.0 + distance * 0.02);

        // Maximum entropy = completely opaque void
        if (entropy > 0.95) {
          alpha = 1.0;
          finalColor = vec3(0.0);
        }

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        entropy: { value: 0.5 },
        playerPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    this.shaders.set('voidSingularity', material);
  }

  /**
   * Get shader material by name
   */
  getShader(name: string): THREE.ShaderMaterial | null {
    return this.shaders.get(name) || null;
  }

  /**
   * Update all shader uniforms
   */
  updateShaders(time: number, entropy: number, playerPosition: THREE.Vector3): void {
    this.shaders.forEach((shader) => {
      if (shader.uniforms.time) shader.uniforms.time.value = time;
      if (shader.uniforms.entropy) shader.uniforms.entropy.value = entropy;
      if (shader.uniforms.playerPosition) shader.uniforms.playerPosition.value = playerPosition;
    });
  }

  /**
   * Get all available shader names
   */
  getShaderNames(): string[] {
    return Array.from(this.shaders.keys());
  }

  /**
   * Create animated entropy field mesh
   */
  createEntropyField(size: number = 10): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(size, size, 32, 32);
    const material = this.getShader('redJagged')!;
    const mesh = new THREE.Mesh(geometry, material);

    // Add wave animation
    const animate = () => {
      mesh.rotation.z += 0.005;
      mesh.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      requestAnimationFrame(animate);
    };
    animate();

    return mesh;
  }

  /**
   * Create quantum superposition orb
   */
  createSuperpositionOrb(radius: number = 2): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = this.getShader('purpleSuperposition')!;
    const mesh = new THREE.Mesh(geometry, material);

    // Add orbital motion
    const animate = () => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.008;
      mesh.rotation.z += 0.006;
      requestAnimationFrame(animate);
    };
    animate();

    return mesh;
  }

  /**
   * Create decoherence cascade effect
   */
  createDecoherenceCascade(position: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();
    group.position.copy(position);

    // Create multiple cascading planes
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(4 - i * 0.5, 4 - i * 0.5);
      const material = this.getShader('rainbowDecoherence')!;
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.z = i * 0.2;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      group.add(mesh);
    }

    // Add rotation animation
    const animate = () => {
      group.rotation.y += 0.02;
      group.children.forEach((child, index) => {
        child.rotation.z += 0.01 * (index + 1);
      });
      requestAnimationFrame(animate);
    };
    animate();

    return group;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.shaders.forEach((shader) => {
      shader.dispose();
    });
    this.shaders.clear();
    this.uniforms.clear();
  }
}

// Global Jitterbug shader system
export const jitterbugShaders = new JitterbugShaders();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    jitterbugShaders.dispose();
  });
}