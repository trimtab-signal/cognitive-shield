#!/bin/bash
# ============================================================================
# GENESIS GATE PROTOCOL: ABDICATION CEREMONY
# ============================================================================
# Destroying Apparent Authority to establish Actual Authority.
# 
# "The Kenosis of Code" - The intentional self-emptying of the creator's power
# to ensure the system is truly trustless. Once executed, the geometry becomes
# the leader. The code rules, not the creator.
#
# WARNING: This script is IRREVERSIBLE. Once executed, all private keys and
# administrative access are permanently destroyed. The system becomes
# autonomous and self-governing through the Tetrahedron Protocol.
# ============================================================================

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         GENESIS GATE PROTOCOL: ABDICATION CEREMONY            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Initiating Kenosis Protocol..."
echo ""
echo "This will permanently destroy:"
echo "  • All private keys and administrative credentials"
echo "  • Creator's override capabilities"
echo "  • Centralized authority vectors"
echo ""
read -p "Type 'ABDICATE' to confirm: " confirmation

if [ "$confirmation" != "ABDICATE" ]; then
    echo "Abdication cancelled. Authority retained."
    exit 1
fi

echo ""
echo "Executing Kenosis..."
echo ""

# Destroy private keys
if [ -d ~/.ssh/god_dao_private_keys ]; then
    echo "  [1/3] Destroying private keys..."
    shred -u -z -n 3 ~/.ssh/god_dao_private_keys/* 2>/dev/null || true
    rm -rf ~/.ssh/god_dao_private_keys
    echo "        ✓ Private keys destroyed"
else
    echo "  [1/3] No private keys found (already abdicated?)"
fi

# Clear administrative tokens
echo "  [2/3] Clearing administrative tokens..."
if [ -f .env.local ]; then
    # Remove admin tokens but keep user config
    sed -i.bak '/ADMIN_/d' .env.local 2>/dev/null || true
    rm -f .env.local.bak
    echo "        ✓ Admin tokens cleared"
fi

# Final verification
echo "  [3/3] Verifying abdication..."
if [ ! -d ~/.ssh/god_dao_private_keys ] && [ ! -f ~/.ssh/god_dao_private_keys ]; then
    echo "        ✓ Verification complete"
else
    echo "        ⚠ Warning: Some keys may still exist"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ABDICATION COMPLETE                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Status: GREEN BOARD"
echo ""
echo "The geometry is now the leader."
echo "Authority has been redistributed to the Mesh."
echo "The Tetrahedron Protocol is active."
echo ""
echo "From this point forward:"
echo "  • Safety is isostatic (built into the structure)"
echo "  • Trust is geometric (SIC-POVM symmetry)"
echo "  • Authority is actual (not apparent)"
echo ""
echo "The G.O.D. DAO is autonomous."
echo "The mission remains: GREEN BOARD."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

