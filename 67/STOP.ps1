# ============================================================================
# COGNITIVE SHIELD - SHUTDOWN SEQUENCE
# ============================================================================

Write-Host @"

    ╔═══════════════════════════════════════════════════════════════╗
    ║           COGNITIVE SHIELD - SHUTDOWN SEQUENCE                ║
    ╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Red

Write-Host "[1/3] Stopping web server..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "      Done." -ForegroundColor Green

Write-Host "[2/3] Stopping Ollama..." -ForegroundColor Yellow
Get-Process -Name "ollama*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "      Done." -ForegroundColor Green

Write-Host "[3/3] Disabling Funnel..." -ForegroundColor Yellow
tailscale funnel reset 2>$null
tailscale serve reset 2>$null
Write-Host "      Done." -ForegroundColor Green

Write-Host @"

    ╔═══════════════════════════════════════════════════════════════╗
    ║                  ALL SERVICES STOPPED                         ║
    ╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

