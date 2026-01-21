#!/bin/bash
echo "🔗 ACTIVATING SOVEREIGNTY NETWORK BRIDGE"
echo "======================================="

# Check Tailscale sovereignty mesh
echo -n "📡 Tailscale Sovereignty Mesh: "
if command -v tailscale &> /dev/null && tailscale status &> /dev/null; then
    echo "✅ CONNECTED"
    TAILSCALE_IP=$(tailscale ip -4 2>/dev/null)
    if [ ! -z "$TAILSCALE_IP" ]; then
        echo "   🌐 Sovereignty IP: $TAILSCALE_IP"
    fi
else
    echo "❌ DISCONNECTED"
    echo "   💡 Run: tailscale up --hostname sovereignty-command-center"
fi

# Check PHENIX sovereignty companion
echo -n "🧠 PHENIX Sovereignty Companion: "
if pgrep -f "ollama" > /dev/null; then
    echo "✅ ACTIVE"
    echo "   📡 Sovereignty AI companion online"
else
    echo "❌ OFFLINE"
    echo "   💡 Run: ollama serve && ollama run phenix-sovereignty"
fi

# Check sovereignty vault
echo -n "🛡️ Sovereignty Vault: "
if [ -f ~/.sovereignty/status.json ]; then
    SOV_SCORE=$(cat ~/.sovereignty/status.json | grep -o '"sovereignty_score":[0-9]*' | cut -d':' -f2)
    echo "✅ SECURED (Score: $SOV_SCORE/100)"
else
    echo "⏳ NEEDS INITIALIZATION"
    echo "   💡 Run: ./sovereignty-check.sh"
fi

# Check ESP32 sovereignty bridge
echo -n "🔧 ESP32 Sovereignty Bridge: "
if [ -c /dev/ttyACM0 ]; then
    echo "✅ CONNECTED"
    echo "   🔌 Hardware sovereignty link active"
elif [ -e /dev/ttyACM0 ]; then
    echo "⚠️  DETECTED BUT NO PERMISSIONS"
    echo "   💡 Check device permissions"
else
    echo "⏳ WAITING FOR HARDWARE"
    echo "   🔌 Connect ESP32 for full sovereignty"
fi

# Sovereignty network status summary
echo ""
echo "🌐 SOVEREIGNTY NETWORK STATUS"
echo "============================"

CONNECTED_COMPONENTS=0
TOTAL_COMPONENTS=4

# Count connected components
if command -v tailscale &> /dev/null && tailscale status &> /dev/null; then
    ((CONNECTED_COMPONENTS++))
fi

if pgrep -f "ollama" > /dev/null; then
    ((CONNECTED_COMPONENTS++))
fi

if [ -f ~/.sovereignty/status.json ]; then
    ((CONNECTED_COMPONENTS++))
fi

if [ -c /dev/ttyACM0 ]; then
    ((CONNECTED_COMPONENTS++))
fi

NETWORK_HEALTH=$((CONNECTED_COMPONENTS * 100 / TOTAL_COMPONENTS))

if [ $NETWORK_HEALTH -ge 75 ]; then
    STATUS="🌟 EXCELLENT"
elif [ $NETWORK_HEALTH -ge 50 ]; then
    STATUS="✅ GOOD"
elif [ $NETWORK_HEALTH -ge 25 ]; then
    STATUS="⚠️  FAIR"
else
    STATUS="🚨 POOR"
fi

echo "Network Health: $STATUS ($CONNECTED_COMPONENTS/$TOTAL_COMPONENTS components)"
echo ""

# Sovereignty action items
echo "🎯 SOVEREIGNTY ACTION ITEMS"
echo "=========================="

if [ $CONNECTED_COMPONENTS -lt 4 ]; then
    echo "• Complete sovereignty network setup"
fi

if ! command -v tailscale &> /dev/null || ! tailscale status &> /dev/null; then
    echo "• Activate Tailscale sovereignty mesh"
fi

if ! pgrep -f "ollama" > /dev/null; then
    echo "• Deploy PHENIX sovereignty companion"
fi

if [ ! -f ~/.sovereignty/status.json ]; then
    echo "• Initialize sovereignty vault"
fi

if [ ! -c /dev/ttyACM0 ]; then
    echo "• Connect ESP32 hardware sovereignty"
fi

echo ""
echo "🤫 The silence has been broken."
echo "🛡️ Sovereignty network operational."
echo "🐎 Digital Centaur connected."
echo ""
echo "🌟 Sovereignty network bridge active."