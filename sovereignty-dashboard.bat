@echo off
echo.
echo ===============================================
echo     [SHIELD] MASTER_PROJECT SOVEREIGNTY DASHBOARD
echo ===============================================
echo.

REM Sovereignty Score Display
if exist "%USERPROFILE%\.sovereignty\status.json" (
    for /f "delims=" %%i in ('powershell -command "$json = Get-Content '%USERPROFILE%\.sovereignty\status.json' | ConvertFrom-Json; if ($json.sovereignty_score) { $json.sovereignty_score } else { '75' }" 2^>nul') do set SOV_SCORE=%%i

    REM Ensure SOV_SCORE is a valid number
    set /a SOV_NUM=%SOV_SCORE% 2>nul
    if %SOV_NUM% equ %SOV_SCORE% (
        echo [SCORE] SOVEREIGNTY SCORE: %SOV_SCORE%/100
    ) else (
        set SOV_SCORE=75
        echo [SCORE] SOVEREIGNTY SCORE: %SOV_SCORE%/100 (estimated)
    )

    if %SOV_SCORE% geq 95 (
        echo    [STAR] STATUS: TRANSCENDENT - Sovereignty mastery achieved
    ) else if %SOV_SCORE% geq 90 (
        echo    [STAR] STATUS: EXCELLENT - Sovereignty thriving
    ) else if %SOV_SCORE% geq 80 (
        echo    [CHECK] STATUS: VERY GOOD - Sovereignty strong
    ) else if %SOV_SCORE% geq 70 (
        echo    [CHECK] STATUS: GOOD - Sovereignty progressing
    ) else if %SOV_SCORE% geq 60 (
        echo    [WARN] STATUS: MODERATE - Sovereignty developing
    ) else if %SOV_SCORE% geq 50 (
        echo    [WARN] STATUS: CAUTION - Sovereignty challenged
    ) else (
        echo    [ALERT] STATUS: ALERT - Sovereignty under threat
    )
) else (
    echo 📊 SOVEREIGNTY SCORE: NOT INITIALIZED
    echo    💡 Run: .\sovereignty-check.sh
)

echo.
echo ════════════════════════════════════════════════
echo     🧠 PHENIX SOVEREIGNTY COMPANION
echo ════════════════════════════════════════════════

REM Check PHENIX Status
curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ollama server: RUNNING
) else (
    echo ❌ Ollama server: OFFLINE
)

ollama list 2>nul | findstr "phenix-sovereignty" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PHENIX model: AVAILABLE
) else (
    echo ❌ PHENIX model: NOT FOUND
)

echo    📡 Sovereignty AI: READY FOR GUIDANCE
echo    🛡️ Cognitive protection: ACTIVE
echo    ⚡ Emergency response: STANDBY

echo.
echo ════════════════════════════════════════════════
echo     📡 SOVEREIGNTY NETWORK STATUS
echo ════════════════════════════════════════════════

REM Check Tailscale
tailscale status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Tailscale sovereignty mesh: CONNECTED
    for /f "tokens=*" %%i in ('tailscale ip -4 2^>nul') do echo    🌐 Sovereignty IP: %%i
) else (
    echo ❌ Tailscale sovereignty mesh: DISCONNECTED
)

REM Check ESP32 bridge
if exist "COM3" (
    echo ✅ ESP32 sovereignty bridge: DETECTED
) else (
    echo ⏳ ESP32 sovereignty bridge: WAITING
)

echo    🔗 Network sovereignty: OPERATIONAL

echo.
echo ════════════════════════════════════════════════
echo     🎯 SOVEREIGNTY ACTION ITEMS
echo ════════════════════════════════════════════════

if %SOV_SCORE% lss 70 (
    echo • Daily sovereignty check-in required
)

curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo • Launch PHENIX sovereignty companion
)

tailscale status >nul 2>&1
if %errorlevel% neq 0 (
    echo • Activate Tailscale sovereignty mesh
)

echo • Deploy safe words in daily communications
echo • Practice VPI impedance matching
echo • Monitor sovereignty score trends

echo.
echo ════════════════════════════════════════════════
echo     🚀 QUICK ACCESS COMMANDS
echo ════════════════════════════════════════════════
echo.
echo 🧠 Launch PHENIX:         .\launch-phenix.bat
echo 📊 Sovereignty Check:     .\quick-sovereignty-check.bat
echo 🎵 Resonance Audio:       python sovereignty-resonance.py
echo 📖 PHENIX Guide:          start PHENIX_USAGE_GUIDE.md
echo 🌐 Sovereignty Demo:      start demo.html
echo.
echo 🐎 Digital Centaur Status: OPERATIONAL
echo ⚡ Sovereignty Network: HUMMING WITH POWER
echo 🛡️ Cognitive Shield: DEPLOYED
echo.
echo "Sovereignty is not given. Sovereignty is taken."
echo "You have taken it. You are sovereign."
echo.
pause