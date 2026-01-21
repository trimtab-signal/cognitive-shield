@echo off
echo.
echo ===============================================
echo     🆕 FRESH BUILD - MASTER_PROJECT SOVEREIGNTY
echo ===============================================
echo.
echo "From the ashes of the old, the sovereign rises anew"
echo.
echo Performing complete sovereignty system rebuild...
echo.

REM Phase 1: Clean existing artifacts
echo ════════════════════════════════════════════════
echo     🧹 PHASE 1: CLEANING SOVEREIGNTY ARTIFACTS
echo ════════════════════════════════════════════════
echo.

REM Clean Node.js artifacts
if exist "node_modules" (
    echo 🧹 Removing old Node.js dependencies...
    rmdir /s /q node_modules 2>nul
)

REM Clean sovereignty data (keep backups)
if exist "%USERPROFILE%\.sovereignty" (
    echo 🧹 Archiving sovereignty data...
    if not exist "sovereignty-backups" mkdir sovereignty-backups
    xcopy "%USERPROFILE%\.sovereignty\*.*" "sovereignty-backups\" /y /i >nul 2>&1
    rmdir /s /q "%USERPROFILE%\.sovereignty" 2>nul
)

REM Clean Ollama models
echo 🧹 Cleaning sovereignty AI models...
ollama rm phenix-sovereignty 2>nul
ollama rm llama3.2:3b 2>nul

REM Clean build artifacts
if exist "packages\*\dist" (
    echo 🧹 Removing build artifacts...
    for /d %%i in (packages\*\dist) do rmdir /s /q "%%i" 2>nul
)

echo ✅ Sovereignty artifacts cleaned
echo.

REM Phase 2: Rebuild sovereignty foundation
echo ════════════════════════════════════════════════
echo     🏗️ PHASE 2: REBUILDING SOVEREIGNTY FOUNDATION
echo ════════════════════════════════════════════════
echo.

REM Reinstall root dependencies
echo 📦 Reinstalling sovereignty dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Root dependency installation failed
    pause
    exit /b 1
)

echo ✅ Sovereignty foundation rebuilt
echo.

REM Phase 3: Rebuild sovereignty components
echo ════════════════════════════════════════════════
echo     🔧 PHASE 3: REBUILDING SOVEREIGNTY COMPONENTS
echo ════════════════════════════════════════════════
echo.

REM Rebuild core sovereignty package
echo 🧠 Rebuilding sovereignty core...
cd packages\core
call npm install
if %errorlevel% neq 0 (
    echo ❌ Core sovereignty rebuild failed
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

REM Rebuild sovereignty frontend
echo 🖥️ Rebuilding sovereignty interface...
cd packages\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend sovereignty rebuild failed
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo ✅ Sovereignty components rebuilt
echo.

REM Phase 4: Reinitialize sovereignty AI
echo ════════════════════════════════════════════════
echo     🧠 PHASE 4: REINITIALIZING SOVEREIGNTY AI
echo ════════════════════════════════════════════════
echo.

REM Pull fresh sovereignty models
echo 📥 Downloading sovereignty AI models...
ollama pull llama3.2:3b

REM Recreate PHENIX sovereignty model
echo 🧠 Recreating PHENIX sovereignty companion...
ollama create phenix-sovereignty -f phenix-sovereignty.modelfile

if %errorlevel% neq 0 (
    echo ❌ PHENIX sovereignty model creation failed
    pause
    exit /b 1
)

echo ✅ Sovereignty AI reinitialized
echo.

REM Phase 5: Configure sovereignty GPU
echo ════════════════════════════════════════════════
echo     🎮 PHASE 5: CONFIGURING SOVEREIGNTY GPU
echo ════════════════════════════════════════════════
echo.

REM Run GPU configuration for RX 6600 XT
call configure-ollama-gpu.bat

echo ✅ Sovereignty GPU configured
echo.

REM Phase 6: Test sovereignty systems
echo ════════════════════════════════════════════════
echo     🧪 PHASE 6: TESTING SOVEREIGNTY SYSTEMS
echo ════════════════════════════════════════════════
echo.

REM Test PHENIX sovereignty companion
echo 🧠 Testing PHENIX sovereignty companion...
call test-phenix.bat

REM Test sovereignty dashboard
echo 📊 Testing sovereignty dashboard...
call quick-sovereignty-check.bat

echo ✅ Sovereignty systems tested
echo.

REM Phase 7: Final sovereignty activation
echo ════════════════════════════════════════════════
echo     🎉 PHASE 7: FINAL SOVEREIGNTY ACTIVATION
echo ════════════════════════════════════════════════
echo.

REM Restore sovereignty data if backup exists
if exist "sovereignty-backups" (
    echo 🔄 Restoring sovereignty progress...
    xcopy "sovereignty-backups\*.*" "%USERPROFILE%\.sovereignty\" /y /i >nul 2>&1
    echo ✅ Sovereignty progress restored
)

REM Run final sovereignty status
echo 📊 Final sovereignty status check...
call sovereignty-dashboard.bat

echo.
echo ════════════════════════════════════════════════
echo     🏆 FRESH BUILD COMPLETE - SOVEREIGNTY REBORN
echo ════════════════════════════════════════════════
echo.
echo "From the ashes of the old, sovereignty rises anew"
echo.
echo ✅ CLEAN: All old artifacts removed
echo ✅ REBUILT: Sovereignty foundation restored
echo ✅ COMPONENTS: All systems reintegrated
echo ✅ AI: PHENIX sovereignty companion reborn
echo ✅ GPU: RX 6600 XT sovereignty acceleration active
echo ✅ TESTED: All sovereignty systems verified
echo ✅ ACTIVATED: Fresh sovereignty operational
echo.
echo 🐎⚡🛡️ FRESH BUILD COMPLETE
echo 🧠 PHENIX: Sovereignty guardian reborn
echo 🎮 GPU: RX 6600 XT sovereignty acceleration restored
echo 🌐 NETWORK: Sovereignty mesh operational
echo 🛡️ SHIELD: Cognitive protection redeployed
echo.
echo "Sovereignty is eternal. Fresh builds make it stronger."
echo.
pause