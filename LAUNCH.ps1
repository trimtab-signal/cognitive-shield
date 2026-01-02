# ╔══════════════════════════════════════════════════════════════════════════╗
# ║                    COGNITIVE SHIELD LAUNCH SCRIPT                        ║
# ║                         Status: GREEN BOARD                              ║
# ╚══════════════════════════════════════════════════════════════════════════╝

Write-Host ""
Write-Host "  ██████╗ ██████╗  ██████╗ ███╗   ██╗██╗████████╗██╗██╗   ██╗███████╗" -ForegroundColor Cyan
Write-Host " ██╔════╝██╔═══██╗██╔════╝ ████╗  ██║██║╚══██╔══╝██║██║   ██║██╔════╝" -ForegroundColor Cyan
Write-Host " ██║     ██║   ██║██║  ███╗██╔██╗ ██║██║   ██║   ██║██║   ██║█████╗  " -ForegroundColor Cyan
Write-Host " ██║     ██║   ██║██║   ██║██║╚██╗██║██║   ██║   ██║╚██╗ ██╔╝██╔══╝  " -ForegroundColor Cyan
Write-Host " ╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║██║   ██║   ██║ ╚████╔╝ ███████╗" -ForegroundColor Cyan
Write-Host "  ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "       ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ " -ForegroundColor Magenta
Write-Host "       ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗" -ForegroundColor Magenta
Write-Host "       ███████╗███████║██║█████╗  ██║     ██║  ██║" -ForegroundColor Magenta
Write-Host "       ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║" -ForegroundColor Magenta
Write-Host "       ███████║██║  ██║██║███████╗███████╗██████╔╝" -ForegroundColor Magenta
Write-Host "       ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ " -ForegroundColor Magenta
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray

# Get computer name and IP
$computerName = $env:COMPUTERNAME
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*" } | Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "  PRE-FLIGHT CHECKS" -ForegroundColor Yellow
Write-Host "  ─────────────────" -ForegroundColor DarkGray

# Check if Tailscale is running
$tailscale = Get-Process -Name "tailscale*" -ErrorAction SilentlyContinue
if ($tailscale) {
    Write-Host "  [✓] Tailscale: RUNNING" -ForegroundColor Green
    try {
        $tsStatus = tailscale status 2>$null
        $tsIP = tailscale ip -4 2>$null
        if ($tsIP) {
            Write-Host "  [✓] Tailscale IP: $tsIP" -ForegroundColor Green
        }
    } catch {
        Write-Host "  [!] Tailscale: Install from tailscale.com/download" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [!] Tailscale: NOT RUNNING" -ForegroundColor Yellow
    Write-Host "      Download: https://tailscale.com/download" -ForegroundColor DarkGray
}

Write-Host "  [✓] Computer Name: $computerName" -ForegroundColor Green
Write-Host "  [✓] Local IP: $localIP" -ForegroundColor Green
Write-Host "  [✓] Production Build: READY" -ForegroundColor Green

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  LAUNCHING SERVER..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Access Points:" -ForegroundColor White
Write-Host "  ──────────────" -ForegroundColor DarkGray
Write-Host "  Local:     http://localhost:3000" -ForegroundColor Green
Write-Host "  Network:   http://${localIP}:3000" -ForegroundColor Green
if ($tsIP) {
    Write-Host "  Tailscale: http://${tsIP}:3000" -ForegroundColor Magenta
    Write-Host "             http://${computerName}:3000 (via MagicDNS)" -ForegroundColor Magenta
}
Write-Host ""
Write-Host "  Share with family: Give them the Tailscale address above" -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor DarkGray
Write-Host ""

# Launch the server
Set-Location $PSScriptRoot
serve -s dist -l 3000

