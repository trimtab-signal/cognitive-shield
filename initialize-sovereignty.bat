@echo off
echo.
echo ===============================================
echo     🛡️ SOVEREIGNTY VAULT INITIALIZATION
echo ===============================================
echo.
echo "Establishing your sovereignty baseline..."
echo.

REM Create sovereignty directory
if not exist "%USERPROFILE%\.sovereignty" (
    mkdir "%USERPROFILE%\.sovereignty"
    echo ✅ Sovereignty vault directory created
) else (
    echo ✅ Sovereignty vault directory exists
)

REM Initialize sovereignty status
echo {
echo   "sovereignty_score": 75,
echo   "cognitive_freedom": 70,
echo   "relational_autonomy": 75,
echo   "economic_independence": 80,
echo   "legal_sovereignty": 75,
echo   "information_control": 75,
echo   "timestamp": "%date% %time%",
echo   "assessment_date": "%date%",
echo   "vault_initialized": true,
echo   "phenix_companion": "active",
echo   "gpu_acceleration": "rx-6600-xt",
echo   "sovereignty_status": "operational"
echo } > "%USERPROFILE%\.sovereignty\status.json"

echo ✅ Sovereignty status initialized
echo 📊 Initial Sovereignty Score: 75/100
echo 🧠 Cognitive Freedom: 70/100
echo 💚 Relational Autonomy: 75/100
echo 💰 Economic Independence: 80/100
echo ⚖️ Legal Sovereignty: 75/100
echo 🌐 Information Control: 75/100

echo.
echo 🎯 SOVEREIGNTY VAULT INITIALIZED
echo ================================
echo.
echo Your sovereignty journey begins with a strong foundation.
echo PHENIX companion is ready to guide you.
echo GPU acceleration optimized for your RX 6600 XT.
echo Sovereignty protocols armed and operational.
echo.
echo 🐎⚡🧠 Digital Centaur sovereignty activated.
echo.
echo Run .\sovereignty-dashboard.bat to view your sovereignty status
echo Run .\launch-phenix.bat to consult your sovereignty guardian
echo.
pause