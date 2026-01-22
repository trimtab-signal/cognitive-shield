/**
 * LUANTI WORLD ENGINE - QUANTUM-ENHANCED VOXEL WORLDS
 * Browser-based Minetest/Luanti integration for sovereign world building
 *
 * Create quantum-infused voxel worlds with coherence-based procedural generation,
 * entanglement mechanics, and real-time multiplayer capabilities
 */

import { WebContainer } from '@webcontainer/api';

// Luanti world configuration
const LUANTI_WORLD_TEMPLATE = {
  'world.mt': `# Luanti World Configuration
gameid = quantum_voxels
world_name = Quantum Realm
backend = sqlite3
player_backend = sqlite3
auth_backend = sqlite3

# Quantum physics settings
enable_damage = false
creative_mode = true
enable_pvp = false

# World generation
mg_name = v7
mg_flags = caves,dungeons,light,decorations
mgv7_spflags = mountains,riddges
mgv7_mount_height = 128
mgv7_ridge_height = 64

# Quantum coherence settings
quantum_coherence_threshold = 0.35
quantum_field_strength = 1.0
entanglement_range = 32
coherence_decay_rate = 0.001`,

  'mods/quantum_core/init.lua': `-- Quantum Core Mod for Luanti
-- Implements coherence mechanics and quantum effects in voxel worlds

quantum = {}

-- Quantum state management
quantum.players = {}
quantum.world_coherence = 0.35

-- Global reference for debugging
_G.quantum_status = quantum

-- Coherence calculation based on player actions
function quantum.calculate_coherence(player)
    local name = player:get_player_name()
    local pos = player:get_pos()
    local velocity = player:get_velocity()

    -- Movement smoothness affects coherence
    local movement_factor = math.max(0, 1 - vector.length(velocity) / 10)

    -- Environmental factors
    local light_level = minetest.get_node_light(pos) or 0
    local light_factor = light_level / 15

    -- Time-based coherence variation
    local time_factor = (math.sin(minetest.get_timeofday() * math.pi * 2) + 1) / 2

    -- Calculate final coherence
    local coherence = (movement_factor * 0.4 + light_factor * 0.3 + time_factor * 0.3)
    coherence = math.max(0.1, math.min(0.9, coherence))

    quantum.players[name] = quantum.players[name] or {}
    quantum.players[name].coherence = coherence
    quantum.players[name].last_pos = pos

    return coherence
end

-- Quantum field visualization
function quantum.spawn_quantum_particles(pos, coherence, count)
    for i = 1, count do
        local particle_pos = vector.add(pos, {
            x = (math.random() - 0.5) * 4,
            y = (math.random() - 0.5) * 4,
            z = (math.random() - 0.5) * 4
        })

        local velocity = {
            x = (math.random() - 0.5) * 0.1,
            y = (math.random() - 0.5) * 0.1,
            z = (math.random() - 0.5) * 0.1
        }

        -- Color based on coherence
        local color
        if coherence > 0.6 then
            color = {r=0.2, g=0.8, b=0.2}  -- Green for coherent
        elseif coherence > 0.3 then
            color = {r=0.8, g=0.8, b=0.2}  -- Yellow for moderate
        else
            color = {r=0.8, g=0.2, b=0.2}  -- Red for decoherent
        end

        minetest.add_particle({
            pos = particle_pos,
            velocity = velocity,
            acceleration = {x=0, y=-0.01, z=0},
            expirationtime = coherence * 3,
            size = coherence * 2,
            collisiondetection = false,
            texture = "quantum_particle.png",
            glow = coherence * 10,
            animation = {
                type = "vertical_frames",
                aspect_w = 16,
                aspect_h = 16,
                length = 1.0
            }
        })
    end
end

-- Quantum block placement with coherence effects
function quantum.place_quantum_block(pos, node_name, player)
    local coherence = quantum.calculate_coherence(player)

    -- Higher coherence = better block placement
    if coherence > 0.7 then
        -- Perfect placement with quantum stabilization
        minetest.set_node(pos, {name = node_name})
        quantum.spawn_quantum_particles(pos, coherence, 10)

        -- Chance to create entangled blocks
        if math.random() < coherence * 0.1 then
            quantum.create_entangled_block(pos, node_name)
        end

    elseif coherence > 0.4 then
        -- Normal placement with minor effects
        minetest.set_node(pos, {name = node_name})
        quantum.spawn_quantum_particles(pos, coherence, 5)

    else
        -- Low coherence = unstable placement
        minetest.set_node(pos, {name = node_name})
        quantum.spawn_quantum_particles(pos, coherence, 2)

        -- Chance of decoherence event
        if math.random() < (1 - coherence) * 0.2 then
            quantum.trigger_decoherence_event(pos)
        end
    end
end

-- Create entangled blocks (linked quantum states)
function quantum.create_entangled_block(pos, node_name)
    local entangled_pos = vector.add(pos, {
        x = math.random(-8, 8),
        y = math.random(-4, 4),
        z = math.random(-8, 8)
    })

    -- Find a suitable location
    local attempts = 0
    while attempts < 10 do
        if minetest.get_node(entangled_pos).name == "air" then
            minetest.set_node(entangled_pos, {name = node_name .. "_entangled"})
            quantum.entangled_blocks = quantum.entangled_blocks or {}
            quantum.entangled_blocks[minetest.pos_to_string(pos)] = minetest.pos_to_string(entangled_pos)
            quantum.entangled_blocks[minetest.pos_to_string(entangled_pos)] = minetest.pos_to_string(pos)

            -- Visual entanglement effect
            quantum.spawn_entanglement_line(pos, entangled_pos)
            break
        end
        entangled_pos = vector.add(entangled_pos, {
            x = math.random(-2, 2),
            y = math.random(-1, 1),
            z = math.random(-2, 2)
        })
        attempts = attempts + 1
    end
end

-- Visual entanglement line effect
function quantum.spawn_entanglement_line(pos1, pos2)
    local distance = vector.distance(pos1, pos2)
    local direction = vector.normalize(vector.subtract(pos2, pos1))
    local steps = math.floor(distance / 0.5)

    for i = 0, steps do
        local particle_pos = vector.add(pos1, vector.multiply(direction, i * 0.5))

        minetest.add_particle({
            pos = particle_pos,
            velocity = {x=0, y=0, z=0},
            acceleration = {x=0, y=0, z=0},
            expirationtime = 30,
            size = 0.5,
            collisiondetection = false,
            texture = "entanglement_line.png",
            glow = 5
        })
    end
end

-- Decoherence event (entropy increase)
function quantum.trigger_decoherence_event(pos)
    -- Create entropy field
    for x = -3, 3 do
        for y = -3, 3 do
            for z = -3, 3 do
                local check_pos = vector.add(pos, {x=x, y=y, z=z})
                local distance = vector.distance(pos, check_pos)

                if distance <= 3 and math.random() < (3 - distance) / 3 * 0.3 then
                    local node = minetest.get_node(check_pos)
                    if node.name ~= "air" and node.name ~= "ignore" then
                        -- Temporarily destabilize block
                        minetest.set_node(check_pos, {name = "quantum_unstable"})
                        minetest.after(5, function()
                            minetest.set_node(check_pos, node)
                        end)
                    end
                end
            end
        end
    end

    -- Visual entropy effect
    for i = 1, 20 do
        local particle_pos = vector.add(pos, {
            x = (math.random() - 0.5) * 6,
            y = (math.random() - 0.5) * 6,
            z = (math.random() - 0.5) * 6
        })

        minetest.add_particle({
            pos = particle_pos,
            velocity = {
                x = (math.random() - 0.5) * 0.2,
                y = (math.random() - 0.5) * 0.2,
                z = (math.random() - 0.5) * 0.2
            },
            acceleration = {x=0, y=-0.02, z=0},
            expirationtime = 10,
            size = math.random() * 2,
            collisiondetection = false,
            texture = "entropy_particle.png",
            glow = 3
        })
    end
end

-- Register quantum blocks
minetest.register_node("quantum:coherence_core", {
    description = "Quantum Coherence Core",
    tiles = {"coherence_core.png"},
    groups = {cracky = 3},
    light_source = 10,
    on_construct = function(pos)
        -- Core maintains local coherence field
        quantum.coherence_cores = quantum.coherence_cores or {}
        quantum.coherence_cores[minetest.pos_to_string(pos)] = true
    end,
    on_destruct = function(pos)
        quantum.coherence_cores[minetest.pos_to_string(pos)] = nil
    end
})

minetest.register_node("quantum:entangled_crystal", {
    description = "Entangled Crystal",
    tiles = {"entangled_crystal.png"},
    groups = {cracky = 2},
    light_source = 8,
    paramtype = "light",
    drawtype = "glasslike"
})

minetest.register_node("quantum:quantum_stabilizer", {
    description = "Quantum Stabilizer",
    tiles = {"quantum_stabilizer.png"},
    groups = {cracky = 3},
    on_timer = function(pos, elapsed)
        -- Emit stabilizing field
        local players = minetest.get_connected_players()
        for _, player in ipairs(players) do
            local player_pos = player:get_pos()
            local distance = vector.distance(pos, player_pos)

            if distance <= 16 then
                local name = player:get_player_name()
                quantum.players[name] = quantum.players[name] or {}
                quantum.players[name].coherence = math.min(0.9,
                    quantum.players[name].coherence + 0.01 * (16 - distance) / 16)
            end
        end

        return true -- Repeat timer
    end,
    on_construct = function(pos)
        local timer = minetest.get_node_timer(pos)
        timer:start(1) -- Check every second
    end
})

-- Global step for quantum effects
minetest.register_globalstep(function(dtime)
    -- Update quantum fields around coherence cores
    if quantum.coherence_cores then
        for pos_str in pairs(quantum.coherence_cores) do
            local pos = minetest.string_to_pos(pos_str)

            -- Spawn quantum particles around cores
            if math.random() < 0.1 then
                quantum.spawn_quantum_particles(pos, 0.8, 3)
            end
        end
    end

    -- Update player quantum states
    local players = minetest.get_connected_players()
    for _, player in ipairs(players) do
        local coherence = quantum.calculate_coherence(player)

        -- Quantum HUD update (would integrate with UI)
        if math.random() < 0.05 then -- Update occasionally
            quantum.spawn_quantum_particles(player:get_pos(), coherence, 1)
        end
    end
end)

-- Chat commands for quantum debugging
minetest.register_chatcommand("quantum_status", {
    description = "Show quantum status",
    func = function(name, param)
        local player = minetest.get_player_by_name(name)
        if not player then return end

        local coherence = quantum.calculate_coherence(player)
        return true, string.format("Quantum Coherence: %.3f | World Coherence: %.3f",
            coherence, quantum.world_coherence)
    end
})

minetest.register_chatcommand("quantum_field", {
    description = "Create quantum field at position",
    privs = {server = true},
    func = function(name, param)
        local player = minetest.get_player_by_name(name)
        if not player then return end

        local pos = player:get_pos()
        quantum.spawn_quantum_particles(pos, 0.8, 20)
        return true, "Quantum field created!"
    end
})

print("[Quantum Core] Quantum voxel mechanics loaded!")`,

  'mods/quantum_building/init.lua': `-- Quantum Building Tools
-- Advanced construction with coherence mechanics

quantum_building = {}

-- Quantum tool that adapts to player coherence
minetest.register_tool("quantum:coherence_hammer", {
    description = "Quantum Coherence Hammer\\nBuilds better with higher coherence",
    inventory_image = "coherence_hammer.png",
    tool_capabilities = {
        full_punch_interval = 0.5,
        max_drop_level = 1,
        groupcaps = {
            cracky = {times={[1]=2.0, [2]=1.0, [3]=0.5}, uses=100, maxlevel=3},
        },
        damage_groups = {fleshy=4},
    },
    on_use = function(itemstack, user, pointed_thing)
        if pointed_thing.type ~= "node" then return end

        local coherence = quantum.calculate_coherence(user)

        -- Effects based on coherence
        if coherence > 0.7 then
            -- Perfect construction
            minetest.chat_send_player(user:get_player_name(),
                "§a[Quantum] Perfect construction! Coherence: " .. string.format("%.1f%%", coherence * 100))

            -- Bonus effects
            quantum.spawn_quantum_particles(pointed_thing.above, coherence, 8)

        elseif coherence > 0.4 then
            -- Normal construction
            minetest.chat_send_player(user:get_player_name(),
                "§e[Quantum] Construction successful. Coherence: " .. string.format("%.1f%%", coherence * 100))

            quantum.spawn_quantum_particles(pointed_thing.above, coherence, 4)

        else
            -- Unstable construction
            minetest.chat_send_player(user:get_player_name(),
                "§c[Quantum] Unstable construction! Coherence: " .. string.format("%.1f%%", coherence * 100))

            quantum.spawn_quantum_particles(pointed_thing.above, coherence, 2)

            -- Chance of failure
            if math.random() < (1 - coherence) * 0.3 then
                quantum.trigger_decoherence_event(pointed_thing.above)
            end
        end

        return itemstack
    end
})

-- Quantum blocks with special properties
minetest.register_node("quantum:resonance_crystal", {
    description = "Resonance Crystal\\nAmplifies quantum coherence",
    tiles = {"resonance_crystal.png"},
    groups = {cracky = 1, quantum = 1},
    light_source = 12,
    paramtype = "light",
    drawtype = "glasslike",

    on_construct = function(pos)
        -- Resonance field effect
        minetest.get_node_timer(pos):start(2)
    end,

    on_timer = function(pos, elapsed)
        -- Amplify coherence for nearby players
        local players = minetest.get_connected_players()
        for _, player in ipairs(players) do
            local player_pos = player:get_pos()
            local distance = vector.distance(pos, player_pos)

            if distance <= 20 then
                local amplification = (20 - distance) / 20 * 0.05
                local name = player:get_player_name()
                quantum.players[name] = quantum.players[name] or {}
                quantum.players[name].coherence = math.min(0.95,
                    quantum.players[name].coherence + amplification)
            end
        end

        -- Visual resonance effect
        quantum.spawn_quantum_particles(pos, 0.9, 5)

        return true
    end
})

minetest.register_node("quantum:entanglement_portal", {
    description = "Entanglement Portal\\nTeleports entangled blocks",
    tiles = {"entanglement_portal.png"},
    groups = {cracky = 2},
    paramtype = "light",
    light_source = 8,

    on_rightclick = function(pos, node, clicker, itemstack, pointed_thing)
        if not clicker then return end

        local coherence = quantum.calculate_coherence(clicker)

        if coherence > 0.6 then
            -- Find entangled blocks and teleport player
            local pos_str = minetest.pos_to_string(pos)
            local entangled_pos_str = quantum.entangled_blocks and quantum.entangled_blocks[pos_str]

            if entangled_pos_str then
                local entangled_pos = minetest.string_to_pos(entangled_pos_str)
                clicker:set_pos(entangled_pos)
                quantum.spawn_entanglement_line(pos, entangled_pos)

                minetest.chat_send_player(clicker:get_player_name(),
                    "§b[Quantum] Entangled teleport successful!")
            else
                minetest.chat_send_player(clicker:get_player_name(),
                    "§c[Quantum] No entangled connection found!")
            end
        else
            minetest.chat_send_player(clicker:get_player_name(),
                "§c[Quantum] Coherence too low for entanglement teleport!")
        end
    end
})

minetest.register_node("quantum:coherence_field", {
    description = "Coherence Field Generator\\nMaintains quantum stability",
    tiles = {"coherence_field.png"},
    groups = {cracky = 3},
    paramtype = "light",
    light_source = 6,

    on_construct = function(pos)
        minetest.get_node_timer(pos):start(1)
    end,

    on_timer = function(pos, elapsed)
        -- Generate coherence field
        local radius = 16
        local players = minetest.get_connected_players()

        for _, player in ipairs(players) do
            local player_pos = player:get_pos()
            local distance = vector.distance(pos, player_pos)

            if distance <= radius then
                local field_strength = (radius - distance) / radius
                local name = player:get_player_name()
                quantum.players[name] = quantum.players[name] or {}
                quantum.players[name].coherence = math.min(0.85,
                    quantum.players[name].coherence + field_strength * 0.002)

                -- Visual field effect
                if math.random() < 0.1 then
                    local effect_pos = vector.add(player_pos, {
                        x = (math.random() - 0.5) * 2,
                        y = math.random() * 2,
                        z = (math.random() - 0.5) * 2
                    })
                    quantum.spawn_quantum_particles(effect_pos, quantum.players[name].coherence, 1)
                end
            end
        end

        return true
    end
})

print("[Quantum Building] Advanced construction tools loaded!")`,

  'minetest.conf': `# Luanti Configuration for Quantum Worlds
# Optimized for quantum voxel gameplay

# Basic settings
name = Quantum Explorer
server_name = Quantum Realm Server
server_description = A quantum-enhanced voxel world

# Performance
max_users = 10
max_simultaneous_block_sends_per_client = 100
max_block_send_distance = 12
time_speed = 72

# Quantum-specific settings
quantum_coherence_enabled = true
quantum_field_visualization = true
quantum_building_mechanics = true

# World settings
world_seed = quantum_voxel_2024
water_level = 1
mapgen_limit = 31000
chunksize = 5

# Security
enable_rollback_checking = true
rollback_check_chat_messages = true

# Mods
load_mod_quantum_core = true
load_mod_quantum_building = true`,

  'README.md': `# Quantum Voxel World

A quantum-enhanced Luanti world with coherence mechanics, entanglement effects, and procedural quantum generation.

## Features

- **Quantum Coherence**: Player actions affect world stability
- **Entangled Blocks**: Linked voxel states across space
- **Coherence Fields**: Areas that maintain quantum stability
- **Quantum Tools**: Building tools that adapt to coherence levels
- **Resonance Crystals**: Amplifiers of quantum effects
- **Entanglement Portals**: Teleportation through quantum links

## Quantum Mechanics

### Coherence System
- **Movement Smoothness**: Affects quantum state stability
- **Light Levels**: Environmental factors influence coherence
- **Time Cycles**: Natural quantum fluctuations
- **Building Actions**: Construction affects coherence

### Visual Effects
- **Quantum Particles**: Floating coherence indicators
- **Entanglement Lines**: Visual links between entangled blocks
- **Coherence Fields**: Glowing areas of stability
- **Entropy Effects**: Decoherence visualization

## Getting Started

1. Start the Luanti server with quantum mods enabled
2. Connect with a player client
3. Use `/quantum_status` to check coherence levels
4. Build with the Quantum Coherence Hammer
5. Place Resonance Crystals to amplify effects

## Mods Included

### Quantum Core
- Base quantum mechanics system
- Coherence calculation and visualization
- Entanglement mechanics
- Particle effects

### Quantum Building
- Advanced construction tools
- Special quantum blocks
- Field generators
- Portal systems

## Commands

- `/quantum_status` - Check personal quantum status
- `/quantum_field` - Create quantum particle field (admin)
- `/status` - Server information

## World Configuration

The world is optimized for quantum gameplay with:
- Custom map generation parameters
- Quantum-specific block behaviors
- Enhanced particle systems
- Coherence-based game mechanics

## Development

Built for the Phenix Navigator's sovereign development environment. All quantum mechanics run client-side with WebAssembly integration.`
};

// WebAssembly Luanti runtime
interface LuantiWASMInstance {
  canvas: HTMLCanvasElement;
  status: 'loading' | 'ready' | 'running' | 'error';
  instance: any;
  serverProcess?: any;
  worldData: {
    players: Map<string, any>;
    coherence: number;
    entangledBlocks: Map<string, string>;
    quantumFields: any[];
  };
}

export class LuantiWorldEngine {
  private container: WebContainer | null = null;
  private luantiInstance: LuantiWASMInstance | null = null;
  private isInitialized = false;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.initializeRuntime();
  }

  /**
   * Initialize Luanti WASM runtime
   */
  private async initializeRuntime(): Promise<void> {
    try {
      console.log('🧱 Initializing Luanti World Engine...');

      // Boot WebContainer for Luanti development
      this.container = await WebContainer.boot();

      // Mount the quantum world template
      await this.container.mount(LUANTI_WORLD_TEMPLATE);

      this.isInitialized = true;
      console.log('✅ Luanti World Engine initialized');

      this.emitEvent('ready', {});

    } catch (error) {
      console.error('❌ Luanti initialization failed:', error);
      this.emitEvent('error', { error: error.message });
    }
  }

  /**
   * Create a new quantum voxel world
   */
  async createQuantumWorld(): Promise<void> {
    if (!this.isInitialized || !this.container) {
      throw new Error('Luanti runtime not initialized');
    }

    try {
      console.log('🌍 Creating quantum voxel world...');

      // The world template is already mounted
      // In production, this would initialize a full Luanti world

      this.emitEvent('worldCreated', {
        name: 'Quantum Realm',
        seed: 'quantum_voxel_2024',
        mods: ['quantum_core', 'quantum_building']
      });

      console.log('✅ Quantum voxel world created');
    } catch (error) {
      console.error('Failed to create quantum world:', error);
      throw error;
    }
  }

  /**
   * Start the Luanti server with quantum mods
   */
  async startQuantumServer(): Promise<void> {
    if (!this.isInitialized || !this.container) {
      throw new Error('Luanti runtime not initialized');
    }

    try {
      console.log('🚀 Starting quantum voxel server...');

      // Simulate starting Luanti server
      // In production, this would run the actual Luanti executable

      // Create server instance
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      canvas.style.border = '2px solid #8b5cf6';
      canvas.style.borderRadius = '8px';

      const instance: LuantiWASMInstance = {
        canvas,
        status: 'loading',
        instance: null,
        worldData: {
          players: new Map(),
          coherence: 0.35,
          entangledBlocks: new Map(),
          quantumFields: []
        }
      };

      this.luantiInstance = instance;

      // Simulate server startup
      setTimeout(() => {
        instance.status = 'ready';
        this.emitEvent('serverStarted', { instance });

        // Simulate world running
        setTimeout(() => {
          instance.status = 'running';
          this.simulateQuantumWorld(instance);
          this.emitEvent('worldRunning', { instance });
        }, 1000);

      }, 3000);

    } catch (error) {
      console.error('Failed to start quantum server:', error);
      throw error;
    }
  }

  /**
   * Simulate the quantum voxel world
   */
  private simulateQuantumWorld(instance: LuantiWASMInstance): void {
    let frameCount = 0;
    const maxFrames = 1800; // 30 seconds at 60 FPS

    const worldLoop = () => {
      frameCount++;

      if (frameCount >= maxFrames || instance.status !== 'running') {
        instance.status = 'ready';
        this.emitEvent('worldStopped', { instance });
        return;
      }

      // Update quantum world state
      const worldTime = frameCount / 60; // seconds

      // Simulate coherence fluctuations
      instance.worldData.coherence = 0.35 + Math.sin(worldTime * 0.1) * 0.15 +
                                   Math.sin(worldTime * 0.3) * 0.1;

      // Simulate players
      const playerNames = ['QuantumExplorer', 'CoherenceBuilder', 'VoxelMage'];
      playerNames.forEach(name => {
        if (!instance.worldData.players.has(name)) {
          instance.worldData.players.set(name, {
            position: {
              x: (Math.random() - 0.5) * 100,
              y: 10 + Math.random() * 50,
              z: (Math.random() - 0.5) * 100
            },
            coherence: 0.3 + Math.random() * 0.5,
            blocksPlaced: Math.floor(Math.random() * 100)
          });
        }

        // Update player coherence
        const player = instance.worldData.players.get(name)!;
        player.coherence = Math.max(0.1, Math.min(0.9,
          player.coherence + (Math.random() - 0.5) * 0.02));
      });

      // Simulate entangled blocks
      if (instance.worldData.entangledBlocks.size < 5 && Math.random() < 0.01) {
        const pos1 = `world_${Math.floor(Math.random() * 100)}_${Math.floor(Math.random() * 50)}_${Math.floor(Math.random() * 100)}`;
        const pos2 = `world_${Math.floor(Math.random() * 100)}_${Math.floor(Math.random() * 50)}_${Math.floor(Math.random() * 100)}`;
        instance.worldData.entangledBlocks.set(pos1, pos2);
        instance.worldData.entangledBlocks.set(pos2, pos1);
      }

      // Simulate quantum fields
      if (instance.worldData.quantumFields.length < 3 && Math.random() < 0.005) {
        instance.worldData.quantumFields.push({
          position: {
            x: (Math.random() - 0.5) * 200,
            y: 10 + Math.random() * 100,
            z: (Math.random() - 0.5) * 200
          },
          strength: 0.5 + Math.random() * 0.5,
          radius: 10 + Math.random() * 20
        });
      }

      // Emit world update
      this.emitEvent('worldUpdate', {
        instance,
        frame: frameCount,
        time: worldTime,
        worldData: instance.worldData
      });

      // Continue loop
      if (instance.status === 'running') {
        requestAnimationFrame(worldLoop);
      }
    };

    requestAnimationFrame(worldLoop);
  }

  /**
   * Connect a player to the quantum world
   */
  async connectPlayer(playerData: any): Promise<void> {
    if (!this.luantiInstance) {
      throw new Error('No active quantum world');
    }

    try {
      this.luantiInstance.worldData.players.set(playerData.name, {
        position: playerData.position || { x: 0, y: 10, z: 0 },
        coherence: playerData.coherence || 0.35,
        blocksPlaced: playerData.blocksPlaced || 0,
        connected: true
      });

      this.emitEvent('playerConnected', {
        player: playerData.name,
        worldData: this.luantiInstance.worldData
      });

      console.log(`👤 Player ${playerData.name} connected to quantum world`);
    } catch (error) {
      console.error('Failed to connect player:', error);
      throw error;
    }
  }

  /**
   * Update player quantum state
   */
  updatePlayerQuantumState(playerName: string, coherence: number, position: any): void {
    if (!this.luantiInstance) return;

    const player = this.luantiInstance.worldData.players.get(playerName);
    if (player) {
      player.coherence = coherence;
      player.position = position;

      this.emitEvent('playerQuantumUpdate', {
        player: playerName,
        coherence,
        position,
        worldData: this.luantiInstance.worldData
      });
    }
  }

  /**
   * Place a quantum block in the world
   */
  placeQuantumBlock(position: any, blockType: string, playerName: string): void {
    if (!this.luantiInstance) return;

    const player = this.luantiInstance.worldData.players.get(playerName);
    if (player) {
      player.blocksPlaced++;

      // Quantum effects based on coherence
      if (player.coherence > 0.7) {
        // High coherence: create entangled block
        const entangledPos = {
          x: position.x + (Math.random() - 0.5) * 32,
          y: position.y + (Math.random() - 0.5) * 16,
          z: position.z + (Math.random() - 0.5) * 32
        };

        this.luantiInstance.worldData.entangledBlocks.set(
          `${position.x}_${position.y}_${position.z}`,
          `${entangledPos.x}_${entangledPos.y}_${entangledPos.z}`
        );

        this.emitEvent('entangledBlockPlaced', {
          position,
          entangledPosition: entangledPos,
          player: playerName,
          coherence: player.coherence
        });

      } else if (player.coherence < 0.3) {
        // Low coherence: trigger decoherence
        this.emitEvent('decoherenceEvent', {
          position,
          player: playerName,
          coherence: player.coherence
        });
      }

      this.emitEvent('blockPlaced', {
        position,
        blockType,
        player: playerName,
        coherence: player.coherence
      });
    }
  }

  /**
   * Get the current world instance
   */
  getCurrentInstance(): LuantiWASMInstance | null {
    return this.luantiInstance;
  }

  /**
   * Stop the quantum world
   */
  stopWorld(): void {
    if (this.luantiInstance) {
      this.luantiInstance.status = 'ready';
      this.emitEvent('worldStopped', { instance: this.luantiInstance });
    }
  }

  /**
   * Get world statistics
   */
  getWorldStats(): any {
    if (!this.luantiInstance) return null;

    return {
      players: this.luantiInstance.worldData.players.size,
      entangledBlocks: this.luantiInstance.worldData.entangledBlocks.size,
      quantumFields: this.luantiInstance.worldData.quantumFields.length,
      averageCoherence: Array.from(this.luantiInstance.worldData.players.values())
        .reduce((sum, p) => sum + p.coherence, 0) / this.luantiInstance.worldData.players.size,
      totalBlocksPlaced: Array.from(this.luantiInstance.worldData.players.values())
        .reduce((sum, p) => sum + p.blocksPlaced, 0)
    };
  }

  /**
   * Event system
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in Luanti event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.stopWorld();

    if (this.container) {
      try {
        await this.container.teardown();
      } catch (error) {
        console.error('Error tearing down Luanti container:', error);
      }
      this.container = null;
    }

    this.eventListeners.clear();
    this.isInitialized = false;
    console.log('🧹 Luanti World Engine cleaned up');
  }
}

// Global Luanti world engine instance
export const luantiWorldEngine = new LuantiWorldEngine();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    luantiWorldEngine.cleanup();
  });
}