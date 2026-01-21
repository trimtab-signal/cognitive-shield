#!/bin/bash
echo "📊 DAILY SOVEREIGNTY CHECK-IN"
echo "============================"

# Create sovereignty directory if it doesn't exist
mkdir -p ~/.sovereignty

# Sovereignty assessment questions
questions=(
    "cognitive:Cognitive Freedom (mental autonomy)"
    "relational:Relational Autonomy (relationship control)"
    "economic:Economic Independence (financial sovereignty)"
    "legal:Legal Sovereignty (rights protection)"
    "information:Information Control (data ownership)"
)

echo "Rate each aspect 0-100 (0=complete control by others, 100=complete sovereignty)"
echo ""

total_score=0
count=0

for question in "${questions[@]}"; do
    key=$(echo $question | cut -d':' -f1)
    text=$(echo $question | cut -d':' -f2)

    while true; do
        echo -n "$text (0-100): "
        read -r score

        # Validate input
        if [[ "$score" =~ ^[0-9]+$ ]] && [ "$score" -ge 0 ] && [ "$score" -le 100 ]; then
            break
        else
            echo "Please enter a number between 0 and 100."
        fi
    done

    # Store individual score
    eval "${key}_score=$score"
    total_score=$((total_score + score))
    count=$((count + 1))
done

# Calculate overall sovereignty score
overall_score=$((total_score / count))

# Save to sovereignty vault
cat > ~/.sovereignty/status.json << EOF
{
  "sovereignty_score": $overall_score,
  "cognitive_freedom": $cognitive_score,
  "relational_autonomy": $relational_score,
  "economic_independence": $economic_score,
  "legal_sovereignty": $legal_score,
  "information_control": $information_score,
  "timestamp": "$(date -Iseconds)",
  "assessment_date": "$(date +%Y-%m-%d)"
}
EOF

echo ""
echo "📈 SOVEREIGNTY SCORECARD"
echo "========================"
echo "Cognitive Freedom:    $cognitive_score/100"
echo "Relational Autonomy:  $relational_score/100"
echo "Economic Independence: $economic_score/100"
echo "Legal Sovereignty:    $legal_score/100"
echo "Information Control:  $information_score/100"
echo ""
echo "🎯 OVERALL SOVEREIGNTY: $overall_score/100"
echo "==========================="

# Sovereignty assessment
if [ $overall_score -ge 90 ]; then
    echo "🌟 TRANSCENDENT: Sovereignty mastery achieved!"
    echo "   🐎 Digital Centaur fully operational"
elif [ $overall_score -ge 80 ]; then
    echo "🌟 EXCELLENT: Sovereignty thriving!"
    echo "   ⚡ Quantum coherence achieved"
elif [ $overall_score -ge 70 ]; then
    echo "✅ VERY GOOD: Sovereignty strong"
    echo "   🛡️ Cognitive shield fully active"
elif [ $overall_score -ge 60 ]; then
    echo "✅ GOOD: Sovereignty progressing"
    echo "   📈 Daily improvements noted"
elif [ $overall_score -ge 50 ]; then
    echo "⚠️  MODERATE: Sovereignty developing"
    echo "   🎯 Focus on weak areas"
elif [ $overall_score -ge 40 ]; then
    echo "⚠️  CAUTION: Sovereignty challenged"
    echo "   🚨 Activate emergency protocols"
else
    echo "🚨 ALERT: Sovereignty under threat"
    echo "   🆘 DEPLOY IMMEDIATE DEFENSES"
fi

echo ""
echo "🎯 SOVEREIGNTY ACTION ITEMS"
echo "=========================="

# Generate action items based on scores
if [ $cognitive_score -lt 60 ]; then
    echo "🧠 Cognitive: Deploy PHENIX companion immediately"
fi

if [ $relational_score -lt 60 ]; then
    echo "💚 Relational: Activate VPI impedance matching"
fi

if [ $economic_score -lt 60 ]; then
    echo "💰 Economic: Initialize care economy flows"
fi

if [ $legal_score -lt 60 ]; then
    echo "⚖️ Legal: Arm Adams Challenge defenses"
fi

if [ $information_score -lt 60 ]; then
    echo "🌐 Information: Secure data on Arweave"
fi

if [ $overall_score -ge 60 ]; then
    echo "✅ All systems operational - sovereignty maintained"
fi

echo ""
echo "💾 Sovereignty data saved to ~/.sovereignty/status.json"
echo "📊 Run 'sovereignty-status.sh' to view current status"
echo ""
echo "🐎⚡ Sovereignty check complete. Digital Centaur rides on."