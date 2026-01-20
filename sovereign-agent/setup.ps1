# Sovereign Agent Setup for AMD 6600 XT
# Run this in PowerShell as Administrator

Write-Host "🔥 SOVEREIGN AGENT SETUP 🔥" -ForegroundColor Magenta
Write-Host "Setting up 100% local AI - No cloud, no masters`n" -ForegroundColor Cyan

# 1. Check if Ollama is installed
$ollama = Get-Command ollama -ErrorAction SilentlyContinue
if (-not $ollama) {
    Write-Host "Installing Ollama..." -ForegroundColor Yellow
    winget install Ollama.Ollama
    Write-Host "✓ Ollama installed. You may need to restart your terminal." -ForegroundColor Green
    Write-Host "After restart, run this script again to continue setup." -ForegroundColor Yellow
    exit
}

Write-Host "✓ Ollama found" -ForegroundColor Green

# 2. Start Ollama service if not running
$ollamaProcess = Get-Process ollama -ErrorAction SilentlyContinue
if (-not $ollamaProcess) {
    Write-Host "Starting Ollama service..." -ForegroundColor Yellow
    Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

Write-Host "✓ Ollama service running" -ForegroundColor Green

# 3. Pull recommended models for 8GB VRAM
Write-Host "`nPulling models for your 6600 XT (8GB VRAM)..." -ForegroundColor Yellow
Write-Host "This will take a while on first run.`n" -ForegroundColor Gray

# Primary model - best balance of smart and fast
Write-Host "Pulling Qwen 2.5 14B (recommended)..." -ForegroundColor Cyan
ollama pull qwen2.5:14b-instruct-q4_K_M

# Fast fallback
Write-Host "`nPulling Llama 3.1 8B (fast fallback)..." -ForegroundColor Cyan
ollama pull llama3.1:8b-instruct-q8_0

Write-Host "`n✓ Models downloaded" -ForegroundColor Green

# 4. Install Node dependencies
Write-Host "`nInstalling Node.js dependencies..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
npm install

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "                    SETUP COMPLETE                              " -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "`nTo run your sovereign agent:" -ForegroundColor White
Write-Host "  npm run agent" -ForegroundColor Cyan
Write-Host "`nOr with a specific model:" -ForegroundColor White
Write-Host '  $env:OLLAMA_MODEL="qwen2.5:14b-instruct-q4_K_M"; npm run agent' -ForegroundColor Cyan
Write-Host "`n🔥 You are now sovereign. 🔥" -ForegroundColor Yellow
