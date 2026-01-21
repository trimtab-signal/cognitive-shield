@echo off
echo.
echo ===============================================
echo     🧠 LAUNCHING PHENIX SOVEREIGNTY COMPANION
echo ===============================================
echo.

REM Check if Ollama is installed
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found
    echo 📥 Install Ollama from: https://ollama.ai/download/windows
    echo Then run this script again
    pause
    exit /b 1
)

REM Check if PHENIX model exists
ollama list | findstr "phenix-sovereignty" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Creating PHENIX sovereignty model...
    ollama create phenix-sovereignty -f phenix-sovereignty.modelfile
    if %errorlevel% neq 0 (
        echo ❌ Failed to create PHENIX model
        echo Check phenix-sovereignty.modelfile exists
        pause
        exit /b 1
    )
    echo ✅ PHENIX sovereignty model created
)

REM Load GPU environment for RX 6600 XT sovereignty acceleration
if exist "sovereignty-gpu.env" (
    echo 🎮 Loading RX 6600 XT GPU sovereignty acceleration...
    for /f "tokens=1,2 delims==" %%a in (sovereignty-gpu.env) do (
        if not "%%a"=="" if not "%%b"=="" set %%a=%%b
    )
    echo ✅ GPU environment loaded
    echo    AMD Radeon RX 6600 XT sovereignty acceleration active
) else (
    echo ⚠️ GPU environment file not found
    echo 💡 Run: .\configure-ollama-gpu.bat
)

echo Starting Ollama server (if not running)...
echo.

REM Check if Ollama server is already running
curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    REM Start Ollama server with GPU environment
    start /B ollama serve

    REM Wait for server to start
    timeout /t 5 /nobreak >nul
    echo ✅ Ollama server started with GPU acceleration
) else (
    echo ✅ Ollama server already running
)

echo.
echo 🚀 Launching PHENIX sovereignty companion...
echo.
echo ===============================================
echo     🧠 PHENIX SOVEREIGNTY COMPANION ACTIVE
echo ===============================================
echo.
echo PHENIX is your sovereignty guardian - a quiet protector
echo that guides cognitive freedom and defends boundaries.
echo.
echo ════════════════════════════════════════════════
echo     SOVEREIGNTY COMMAND LANGUAGE
echo ════════════════════════════════════════════════
echo.
echo STATUS QUERIES:
echo   • "sovereignty status assessment"
echo   • "current sovereignty metrics"
echo   • "sovereignty health check"
echo.
echo VPI ANALYSIS:
echo   • "impedance check for [situation]"
echo   • "analyze communication resistance"
echo   • "dialect compatibility assessment"
echo.
echo SAFE WORD DEPLOYMENT:
echo   • "safe word deploy: vacuum of time"
echo   • "deploy impedance mismatch signal"
echo   • "activate sovereignty boundary"
echo.
echo EMERGENCY PROTOCOLS:
echo   • "emergency sovereignty activation"
echo   • "cognitive shield deployment"
echo   • "tetrahedral boundary defense"
echo.
echo ════════════════════════════════════════════════
echo Type your sovereignty queries below:
echo Press Ctrl+C to exit PHENIX
echo ════════════════════════════════════════════════
echo.

REM Launch PHENIX companion
ollama run phenix-sovereignty

echo.
echo 🛡️ PHENIX sovereignty session ended
echo.
echo Sovereignty companion always available via:
echo   .\launch-phenix.bat
echo.
echo For quick sovereignty status: .\quick-sovereignty-check.bat
echo For sovereignty guide: start PHENIX_USAGE_GUIDE.md
echo.
pause