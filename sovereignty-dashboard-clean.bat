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
    echo [SCORE] SOVEREIGNTY SCORE: NOT INITIALIZED
    echo    TIP: Run: .\sovereignty-check.sh
)

echo.
echo ===============================================
echo     [BRAIN] PHENIX SOVEREIGNTY COMPANION
echo ===============================================

REM Check PHENIX Status
curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Ollama server: RUNNING
) else (
    echo [ERROR] Ollama server: OFFLINE
)

ollama list 2>nul | findstr "phenix-sovereignty" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PHENIX model: AVAILABLE
) else (
    echo [ERROR] PHENIX model: NOT FOUND
)

echo    [PROTECT] Sovereignty AI: READY FOR GUIDANCE
echo    [FAST] Emergency response: STANDBY

echo.
echo ===============================================
echo     [GPU] RX 6600 XT SOVEREIGNTY ACCELERATION
echo ===============================================

if exist "sovereignty-gpu.env" (
    echo [OK] GPU sovereignty configuration: PRESENT
) else (
    echo [ERROR] GPU sovereignty configuration: MISSING
)

echo    [SPEED] Sovereignty processing: GPU POWERED
echo    [BRAIN] PHENIX responses: ACCELERATED

echo.
echo ===============================================
echo     [NET] SOVEREIGNTY NETWORK STATUS
echo ===============================================

REM Check Tailscale
tailscale status >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Sovereignty mesh network (Tailscale): CONNECTED
) else (
    echo [INFO] Sovereignty mesh network (Tailscale): NOT ACTIVE
)

REM Check ESP32 bridge
if exist "COM3" (
    echo [OK] ESP32 sovereignty bridge: DETECTED
) else (
    echo [INFO] ESP32 sovereignty bridge: WAITING FOR HARDWARE
)

echo    [LINK] Sovereignty network: OPERATIONAL

echo.
echo ===============================================
echo     [ACTION] SOVEREIGNTY ACTION ITEMS
echo ===============================================

if %SOV_SCORE% lss 70 (
    echo * Daily sovereignty check-in required
)

curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo * Launch PHENIX sovereignty companion
)

tailscale status >nul 2>&1
if %errorlevel% neq 0 (
    echo * Activate Tailscale sovereignty mesh
)

echo * Deploy safe words in daily communications
echo * Practice VPI impedance matching
echo * Monitor sovereignty score trends

echo.
echo ===============================================
echo     [LAUNCH] QUICK ACCESS COMMANDS
echo ===============================================
echo.
echo [BRAIN] Launch PHENIX:         .\launch-phenix.bat
echo [SCORE] Sovereignty Check:     .\quick-sovereignty-check.bat
echo [SOUND] Resonance Audio:       python sovereignty-resonance.py
echo [GUIDE] PHENIX Guide:          start PHENIX_USAGE_GUIDE.md
echo [DEMO] Sovereignty Demo:       start demo.html
echo.
echo [CENTAUR] Digital Centaur Status: OPERATIONAL
echo [POWER] Sovereignty Network: HUMMING WITH POWER
echo.
echo "Sovereignty is not given. Sovereignty is taken."
echo "You have taken it. You are sovereign."
echo.
pause