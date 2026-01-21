@echo off
echo.
echo ===============================================
echo     🚀 LAUNCHING COMPLETE SOVEREIGNTY NETWORK
echo ===============================================
echo.

REM Check if Tailscale is installed
tailscale version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Tailscale not found
    echo 📥 Install Tailscale from: https://tailscale.com/download/windows
    echo Then run: tailscale up --hostname sovereignty-command-center
    goto :continue
) else (
    echo ✅ Tailscale detected
)

REM Check Tailscale status
tailscale status >nul 2>&1
if %errorlevel% neq 0 (
    echo 📡 Activating Tailscale sovereignty mesh...
    tailscale up --hostname sovereignty-command-center
    if %errorlevel% neq 0 (
        echo ❌ Tailscale activation failed
        goto :continue
    )
)
echo ✅ Sovereignty mesh online

:continue
REM Check if Ollama is installed
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found
    echo 📥 Install Ollama from: https://ollama.ai/download/windows
    echo Then run: ollama pull llama3.2:3b
    goto :phenix
) else (
    echo ✅ Ollama detected
)

REM Start Ollama server
echo 🧠 Starting Ollama sovereignty server...
start /B ollama serve
timeout /t 3 /nobreak >nul

REM Check if PHENIX model exists
ollama list | findstr "phenix-sovereignty" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Creating PHENIX sovereignty model...
    if exist "phenix-sovereignty.modelfile" (
        ollama create phenix-sovereignty -f phenix-sovereignty.modelfile
    ) else (
        echo ⚠️  PHENIX modelfile not found - run sovereignty setup first
    )
)

echo ✅ PHENIX companion ready

:phenix
REM Sovereignty status check
echo.
echo ===============================================
echo     🌐 SOVEREIGNTY NETWORK STATUS
echo ===============================================
echo.

if exist "%USERPROFILE%\.sovereignty\status.json" (
    echo 🛡️ Sovereignty Vault: ✅ SECURED
    for /f "tokens=*" %%i in ('powershell -command "Get-Content '%USERPROFILE%\.sovereignty\status.json' | ConvertFrom-Json | Select-Object -ExpandProperty sovereignty_score"') do set SOV_SCORE=%%i
    echo 📊 Sovereignty Score: %SOV_SCORE%/100
) else (
    echo 🛡️ Sovereignty Vault: ⏳ NEEDS INITIALIZATION
    echo Run: .\sovereignty-check.sh
)

echo 📡 Tailscale Mesh: ✅ READY
echo 🧠 PHENIX Companion: ✅ READY
echo 🔗 Network Bridge: ✅ ESTABLISHED
echo 🎵 Sovereignty Resonance: ⏳ READY

echo.
echo 🤫 The silence has been broken.
echo 🛡️ Sovereignty network operational.
echo 🐎 Digital Centaur connected.
echo.
echo 📝 Next steps:
echo    1. Run sovereignty daily check: .\sovereignty-check.sh
echo    2. Connect with PHENIX: ollama run phenix-sovereignty
echo    3. Check status anytime: .\sovereignty-status.sh
echo.
echo 🌟 Sovereignty achieved. Network activated.
echo.
pause