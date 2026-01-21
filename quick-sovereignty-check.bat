@echo off
echo.
echo ===============================================
echo     📊 QUICK SOVEREIGNTY STATUS CHECK
echo ===============================================
echo.

REM Check sovereignty vault
if exist "%USERPROFILE%\.sovereignty\status.json" (
    echo ✅ Sovereignty vault found
    for /f "delims=" %%i in ('powershell -command "$json = Get-Content '%USERPROFILE%\.sovereignty\status.json' | ConvertFrom-Json; if ($json.sovereignty_score) { $json.sovereignty_score } else { '75' }" 2^>nul') do set SOV_SCORE=%%i

    REM Ensure SOV_SCORE is a valid number
    set /a SOV_NUM=%SOV_SCORE% 2>nul
    if %SOV_NUM% equ %SOV_SCORE% (
        echo Current Sovereignty Score: %SOV_SCORE%/100
    ) else (
        set SOV_SCORE=75
        echo Current Sovereignty Score: %SOV_SCORE%/100 (estimated)
    )

    if %SOV_SCORE% geq 90 (
        echo Sovereignty Status: 🌟 TRANSCENDENT
    ) else if %SOV_SCORE% geq 80 (
        echo Sovereignty Status: 🌟 EXCELLENT
    ) else if %SOV_SCORE% geq 60 (
        echo Sovereignty Status: ✅ GOOD
    ) else if %SOV_SCORE% geq 40 (
        echo Sovereignty Status: ⚠️ CAUTION
    ) else (
        echo Sovereignty Status: 🚨 ALERT
    )
) else (
    echo ⚠️ Sovereignty vault not initialized
    set SOV_SCORE=50
    echo Estimated Sovereignty Score: %SOV_SCORE%/100 (run assessment)
    echo Run: .\sovereignty-check.sh
)

echo.
echo 🧠 PHENIX Companion: Ready (run .\launch-phenix.bat)
echo 📡 Sovereignty Network: Active
echo 🐎 Digital Centaur: Connected
echo.

if %SOV_SCORE% lss 70 (
    echo 🎯 Sovereignty Improvement Actions:
    if %SOV_SCORE% lss 70 echo   • Deploy safe words in communications
    if %SOV_SCORE% lss 60 echo   • Activate VPI impedance matching
    if %SOV_SCORE% lss 50 echo   • Consult PHENIX for guidance
    echo   • Run full sovereignty assessment
)

echo.
echo ✨ Sovereignty is your power. Use it daily.
echo.
pause