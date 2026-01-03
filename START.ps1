# ============================================================================
# COGNITIVE SHIELD - FAILPROOF STARTUP SEQUENCE
# ============================================================================
# Run this script to start everything:
#   Right-click -> Run with PowerShell
#   OR: powershell -ExecutionPolicy Bypass -File START.ps1
# ============================================================================

$Host.UI.RawUI.WindowTitle = "Cognitive Shield - Control Panel"

Write-Host @"

    ╔═══════════════════════════════════════════════════════════════╗
    ║           COGNITIVE SHIELD - STARTUP SEQUENCE                 ║
    ║                   G.O.D. PROTOCOL v1                          ║
    ╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# ----------------------------------------------------------------------------
# CONFIGURATION
# ----------------------------------------------------------------------------
$AppPath = "C:\Users\sandra\cognitive-shield"
$OllamaPath = "C:\Users\sandra\AppData\Local\Programs\Ollama\ollama.exe"
$WebPort = 3000
$OllamaPort = 11434
$FunnelDomain = "dicktater-fundip.tail377c92.ts.net"

# ----------------------------------------------------------------------------
# STEP 1: Kill any existing processes
# ----------------------------------------------------------------------------
Write-Host "[1/6] Cleaning up existing processes..." -ForegroundColor Yellow

# Kill Node.js (web server)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Kill Ollama
Get-Process -Name "ollama*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait for ports to free up
Start-Sleep -Seconds 2
Write-Host "      Done." -ForegroundColor Green

# ----------------------------------------------------------------------------
# STEP 2: Start Ollama with CORS
# ----------------------------------------------------------------------------
Write-Host "[2/6] Starting Ollama (GPU-accelerated)..." -ForegroundColor Yellow

$env:OLLAMA_ORIGINS = "http://localhost:*,https://localhost:*,http://127.0.0.1:*,https://127.0.0.1:*,https://*.ts.net,https://$FunnelDomain"
$env:OLLAMA_VULKAN = "1"
$env:OLLAMA_HOST = "0.0.0.0:$OllamaPort"

Start-Process -FilePath $OllamaPath -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Verify Ollama
$ollamaCheck = $null
try {
    $ollamaCheck = Invoke-RestMethod -Uri "http://localhost:$OllamaPort/api/tags" -TimeoutSec 5 -ErrorAction SilentlyContinue
} catch {}

if ($ollamaCheck) {
    Write-Host "      Ollama running. Models: $($ollamaCheck.models.Count)" -ForegroundColor Green
} else {
    Write-Host "      WARNING: Ollama may not have started correctly" -ForegroundColor Red
}

# ----------------------------------------------------------------------------
# STEP 3: Start Web Server
# ----------------------------------------------------------------------------
Write-Host "[3/6] Starting web server on port $WebPort..." -ForegroundColor Yellow

Set-Location $AppPath

# Check if dist folder exists
if (-not (Test-Path "$AppPath\dist")) {
    Write-Host "      Building app first..." -ForegroundColor Cyan
    npm run build 2>$null
}

# Start serve in background using cmd to properly handle npx
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npx serve -s dist -l $WebPort" -WindowStyle Hidden
Start-Sleep -Seconds 5

# Verify web server
$webCheck = $null
try {
    $webCheck = Invoke-WebRequest -Uri "http://localhost:$WebPort" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
} catch {}

if ($webCheck.StatusCode -eq 200) {
    Write-Host "      Web server running." -ForegroundColor Green
} else {
    Write-Host "      WARNING: Web server may not have started correctly" -ForegroundColor Red
}

# ----------------------------------------------------------------------------
# STEP 4: Configure Tailscale Funnel
# ----------------------------------------------------------------------------
Write-Host "[4/6] Configuring Tailscale Funnel..." -ForegroundColor Yellow

# Reset any existing config
tailscale funnel reset 2>$null
tailscale serve reset 2>$null
Start-Sleep -Seconds 1

# Set up serve paths
tailscale serve --bg --https=443 --set-path=/ http://127.0.0.1:$WebPort 2>$null
tailscale serve --bg --https=443 --set-path=/api/ollama http://127.0.0.1:$OllamaPort 2>$null
Start-Sleep -Seconds 1

# Enable funnel
tailscale funnel --https=443 --bg $WebPort 2>$null
Start-Sleep -Seconds 2

Write-Host "      Funnel configured." -ForegroundColor Green

# ----------------------------------------------------------------------------
# STEP 5: Verify Everything
# ----------------------------------------------------------------------------
Write-Host "[5/6] Verifying all services..." -ForegroundColor Yellow

$allGood = $true

# Check ports
$port3000 = netstat -ano | Select-String ":$WebPort.*LISTENING"
$port11434 = netstat -ano | Select-String ":$OllamaPort.*LISTENING"

if ($port3000) {
    Write-Host "      [OK] Web server on port $WebPort" -ForegroundColor Green
} else {
    Write-Host "      [FAIL] Web server not listening" -ForegroundColor Red
    $allGood = $false
}

if ($port11434) {
    Write-Host "      [OK] Ollama on port $OllamaPort" -ForegroundColor Green
} else {
    Write-Host "      [FAIL] Ollama not listening" -ForegroundColor Red
    $allGood = $false
}

# Check Tailscale
$tsStatus = tailscale status 2>$null
if ($tsStatus) {
    Write-Host "      [OK] Tailscale connected" -ForegroundColor Green
} else {
    Write-Host "      [FAIL] Tailscale not connected" -ForegroundColor Red
    $allGood = $false
}

# ----------------------------------------------------------------------------
# STEP 6: Display Access Info
# ----------------------------------------------------------------------------
Write-Host "`n[6/6] STARTUP COMPLETE!" -ForegroundColor Green

Write-Host @"

    ╔═══════════════════════════════════════════════════════════════╗
    ║                    ACCESS YOUR APP                            ║
    ╠═══════════════════════════════════════════════════════════════╣
    ║                                                               ║
    ║  LOCAL (this computer):                                       ║
    ║    http://localhost:$WebPort                                     ║
    ║                                                               ║
    ║  PUBLIC (phone/anywhere):                                     ║
    ║    https://$FunnelDomain                    ║
    ║                                                               ║
    ║  OLLAMA ENDPOINT (for remote access):                         ║
    ║    https://$FunnelDomain/api/ollama         ║
    ║                                                               ║
    ╠═══════════════════════════════════════════════════════════════╣
    ║  Press Ctrl+C or close this window to stop all services       ║
    ╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Keep the window open and show status
Write-Host "Services running. Monitoring..." -ForegroundColor Gray
Write-Host "(Press Ctrl+C to stop)`n" -ForegroundColor DarkGray

# Trap Ctrl+C to cleanup
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Write-Host "`nShutting down services..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "ollama*" -ErrorAction SilentlyContinue | Stop-Process -Force
    tailscale funnel reset 2>$null
    Write-Host "Goodbye!" -ForegroundColor Cyan
}

# Keep alive and show heartbeat
while ($true) {
    $timestamp = Get-Date -Format "HH:mm:ss"
    $ollamaOK = Test-NetConnection -ComputerName localhost -Port $OllamaPort -WarningAction SilentlyContinue -InformationLevel Quiet
    $webOK = Test-NetConnection -ComputerName localhost -Port $WebPort -WarningAction SilentlyContinue -InformationLevel Quiet
    
    $status = "[$timestamp] "
    $status += if ($webOK) { "WEB:OK " } else { "WEB:DOWN " }
    $status += if ($ollamaOK) { "OLLAMA:OK " } else { "OLLAMA:DOWN " }
    $status += "FUNNEL:ACTIVE"
    
    Write-Host "`r$status" -NoNewline -ForegroundColor DarkGray
    Start-Sleep -Seconds 30
}

