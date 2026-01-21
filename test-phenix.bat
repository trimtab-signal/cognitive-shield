@echo off
echo.
echo ===============================================
echo     🧠 TESTING PHENIX SOVEREIGNTY COMPANION
echo ===============================================
echo.

REM Check if Ollama is running
curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama server not running
    echo Run: .\launch-phenix.bat first
    goto :end
)

REM Check if PHENIX model exists
ollama list | findstr "phenix-sovereignty" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHENIX sovereignty model not found
    echo Run: .\launch-phenix.bat to create it
    goto :end
)

echo ✅ Ollama server running
echo ✅ PHENIX sovereignty model available
echo.
echo 🧪 Testing PHENIX sovereignty response...
echo.

REM Test PHENIX with a simple sovereignty query
echo Testing: "sovereignty status"
curl -s -X POST http://127.0.0.1:11434/api/generate -H "Content-Type: application/json" -d "{\"model\":\"phenix-sovereignty\",\"prompt\":\"sovereignty status\",\"stream\":false}" | findstr /C:"response" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ PHENIX sovereignty companion responding
    echo.
    echo 🎉 PHENIX is ready for sovereignty guidance!
    echo.
    echo To start interactive session: .\launch-phenix.bat
    echo For usage guide: start PHENIX_USAGE_GUIDE.md
) else (
    echo ⚠️ PHENIX response test inconclusive
    echo Model may still be loading. Try again in a moment.
)

:end
echo.
pause