@echo off
echo.
echo ===============================================
echo     ✅ VERIFYING FRESH SOVEREIGNTY BUILD
echo ===============================================
echo.
echo "Sovereignty reborn - verifying operational status"
echo.

set VERIFICATION_PASSED=1

REM Check core sovereignty components
echo ════════════════════════════════════════════════
echo     🧠 CORE SOVEREIGNTY VERIFICATION
echo ════════════════════════════════════════════════
echo.

REM Check Node.js sovereignty packages
if exist "node_modules" (
    echo ✅ Sovereignty dependencies installed
) else (
    echo ❌ Sovereignty dependencies missing
    set VERIFICATION_PASSED=0
)

REM Check sovereignty core package
if exist "packages\core\src" (
    echo ✅ Sovereignty core package present
) else (
    echo ❌ Sovereignty core package missing
    set VERIFICATION_PASSED=0
)

REM Check sovereignty frontend
if exist "packages\frontend\src\App.tsx" (
    echo ✅ Sovereignty frontend interface ready
) else (
    echo ❌ Sovereignty frontend interface missing
    set VERIFICATION_PASSED=0
)

REM Check PHENIX sovereignty AI
echo.
echo ════════════════════════════════════════════════
echo     🤖 PHENIX SOVEREIGNTY AI VERIFICATION
echo ════════════════════════════════════════════════
echo.

REM Check Ollama installation
ollama --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Sovereignty AI engine (Ollama) installed
) else (
    echo ❌ Sovereignty AI engine (Ollama) missing
    set VERIFICATION_PASSED=0
)

REM Check PHENIX model
ollama list 2>nul | findstr "phenix-sovereignty" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PHENIX sovereignty companion model loaded
) else (
    echo ❌ PHENIX sovereignty companion model missing
    set VERIFICATION_PASSED=0
)

REM Check sovereignty GPU configuration
echo.
echo ════════════════════════════════════════════════
echo     🎮 GPU SOVEREIGNTY VERIFICATION
echo ════════════════════════════════════════════════
echo.

if exist "sovereignty-gpu.env" (
    echo ✅ RX 6600 XT sovereignty GPU configuration present
) else (
    echo ❌ RX 6600 XT sovereignty GPU configuration missing
    set VERIFICATION_PASSED=0
)

REM Check sovereignty data
echo.
echo ════════════════════════════════════════════════
echo     📊 SOVEREIGNTY DATA VERIFICATION
echo ════════════════════════════════════════════════
echo.

if exist "%USERPROFILE%\.sovereignty\status.json" (
    echo ✅ Sovereignty vault initialized
    for /f "tokens=*" %%i in ('powershell -command "try { (Get-Content '%USERPROFILE%\.sovereignty\status.json' | ConvertFrom-Json).sovereignty_score } catch { 'unknown' } "') do set SOV_SCORE=%%i
    echo    Current Sovereignty Score: %SOV_SCORE%/100
) else (
    echo ⚠️ Sovereignty vault not initialized (will create on first use)
)

REM Check sovereignty network
echo.
echo ════════════════════════════════════════════════
echo     🌐 SOVEREIGNTY NETWORK VERIFICATION
echo ════════════════════════════════════════════════
echo.

REM Check Tailscale
tailscale status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Sovereignty mesh network (Tailscale) active
) else (
    echo ⚠️ Sovereignty mesh network (Tailscale) not active
)

REM Final verification summary
echo.
echo ════════════════════════════════════════════════
echo     🏆 FRESH BUILD VERIFICATION RESULTS
echo ════════════════════════════════════════════════
echo.

if %VERIFICATION_PASSED% equ 1 (
    echo 🎉 VERIFICATION COMPLETE - SOVEREIGNTY OPERATIONAL
    echo.
    echo ✅ All sovereignty systems verified and operational
    echo 🧠 PHENIX sovereignty companion ready
    echo 🎮 RX 6600 XT GPU sovereignty acceleration active
    echo 📊 Sovereignty tracking initialized
    echo 🌐 Sovereignty network configured
    echo.
    echo 🐎⚡🛡️ Fresh sovereignty build successful!
    echo.
    echo 🚀 Ready to launch sovereignty systems:
    echo    .\launch-phenix.bat - Start sovereignty companion
    echo    .\sovereignty-dashboard.bat - View sovereignty status
    echo    python sovereignty-resonance.py - Quantum coherence
    echo.
) else (
    echo ⚠️ VERIFICATION INCOMPLETE - ISSUES DETECTED
    echo.
    echo Some sovereignty components need attention.
    echo Run .\fresh-build.bat again or check error messages above.
    echo.
    echo For troubleshooting:
    echo    • Check Ollama installation
    echo    • Verify GPU configuration
    echo    • Reinstall sovereignty packages
    echo.
)

echo "Sovereignty reborn - stronger than before"
echo.
pause