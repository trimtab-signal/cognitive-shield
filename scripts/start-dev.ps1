# Cognitive Shield - Automated Development Startup
# Handles all infrastructure automatically

param(
    [switch]$Clean,
    [switch]$Force,
    [int]$Port = 5173,
    [string]$HostName = "localhost"
)

Write-Host "🧠 COGNITIVE SHIELD - AUTOMATED STARTUP" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Function to check if port is available
function Test-PortAvailable {
    param([int]$Port)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("127.0.0.1", $Port)
        $tcpClient.Close()
        return $false
    } catch {
        return $true
    }
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processInfo = netstat -ano | findstr ":$Port"
        if ($processInfo) {
            $pid = ($processInfo -split '\s+')[-1]
            if ($pid -and $pid -ne "0") {
                Write-Host "🔪 Killing process $pid on port $Port..." -ForegroundColor Yellow
                taskkill /f /pid $pid 2>$null | Out-Null
                Start-Sleep -Seconds 2
            }
        }
    } catch {
        Write-Host "⚠️  Could not kill process on port $Port" -ForegroundColor Yellow
    }
}

# Function to clean up Node processes
function Clear-NodeProcesses {
    Write-Host "🧹 Cleaning up existing Node.js processes..." -ForegroundColor Yellow
    try {
        $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            foreach ($proc in $nodeProcesses) {
                Write-Host "🔪 Terminating Node process $($proc.Id)..." -ForegroundColor Yellow
                $proc.Kill()
                $proc.WaitForExit(5000)
            }
            Start-Sleep -Seconds 3
        }
    } catch {
        Write-Host "⚠️  Could not clean up all Node processes" -ForegroundColor Yellow
    }
}

# Function to clean npm cache if requested
function Clear-NpmCache {
    if ($Clean) {
        Write-Host "🧽 Cleaning npm cache..." -ForegroundColor Yellow
        npm cache clean --force 2>$null | Out-Null
    }
}

# Function to check system requirements
function Test-SystemRequirements {
    Write-Host "🔍 Checking system requirements..." -ForegroundColor Blue

    # Check Node.js
    try {
        $nodeVersion = & node --version 2>$null
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
        exit 1
    }

    # Check npm
    try {
        $npmVersion = & npm --version 2>$null
        Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ npm not found" -ForegroundColor Red
        exit 1
    }

    # Check if we're in the right directory
    if (!(Test-Path "package.json")) {
        Write-Host "❌ Not in Cognitive Shield directory (package.json not found)" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ System requirements met" -ForegroundColor Green
}

# Main startup logic
try {
    # Clean up if requested or if port is in use
    $portAvailable = Test-PortAvailable -Port $Port
    if (!$portAvailable -or $Clean -or $Force) {
        Write-Host "🔄 Port $Port in use or cleanup requested..." -ForegroundColor Yellow
        Stop-ProcessOnPort -Port $Port
        Clear-NodeProcesses
        Clear-NpmCache
        Start-Sleep -Seconds 2
    }

    # Check requirements
    Test-SystemRequirements

    # Final port check
    if (!(Test-PortAvailable -Port $Port)) {
        Write-Host "❌ Port $Port still in use. Please try a different port or kill the process manually." -ForegroundColor Red
        exit 1
    }

    Write-Host "🚀 Starting Cognitive Shield development server..." -ForegroundColor Green
    Write-Host "📡 URL: http://$($HostName):$Port" -ForegroundColor Cyan
    Write-Host "🔺 Tetrahedron Protocol ready for testing" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor White

    # Start the dev server
    & npx vite --host --force --port $Port

} catch {
    Write-Host "❌ Startup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}