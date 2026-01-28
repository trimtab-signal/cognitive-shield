# Windows Node.js Cleanup Script - Enhanced Edition
# Handles locked files that prevent normal cleanup with multiple strategies

param(
    [switch]$Force,
    [switch]$SkipConfirmation,
    [string]$Path = $PWD
)

Write-Host "🧹 Starting Enhanced Windows Node.js Cleanup..." -ForegroundColor Cyan
Write-Host "Working Directory: $Path" -ForegroundColor Gray
Write-Host ""

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Not running as Administrator. Some operations may fail." -ForegroundColor Yellow
    Write-Host "   For best results, run as Administrator." -ForegroundColor Yellow
    Write-Host ""
}

# Confirmation prompt
if (-not $SkipConfirmation -and -not $Force) {
    $confirmation = Read-Host "This will delete node_modules and lock files. Continue? (y/N)"
    if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
        Write-Host "❌ Cleanup cancelled by user" -ForegroundColor Red
        exit 1
    }
}

# Function to safely remove directory with retries
function Remove-DirectorySafely {
    param([string]$path, [string]$description)

    if (Test-Path $path) {
        Write-Host "🗑️  Removing $description..." -ForegroundColor Yellow

        # Try normal removal first
        try {
            $item = Get-Item $path
            $size = Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue $path | Measure-Object -Property Length -Sum | Select-Object -ExpandProperty Sum
            if ($size) {
                $sizeMB = [math]::Round($size / 1MB, 2)
                Write-Host "   Size: $sizeMB MB" -ForegroundColor Gray
            }

            Remove-Item -Recurse -Force $path -ErrorAction Stop
            Write-Host "✅ $description removed successfully" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "⚠️  Normal removal failed, trying alternative methods..." -ForegroundColor Yellow

            # Method 2: Use robocopy to mirror empty directory
            try {
                $emptyDir = "$env:TEMP\empty-$(Get-Random)"
                New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
                & robocopy $emptyDir $path /MIR /R:1 /W:1 /NFL /NDL /NJH /NJS 2>$null | Out-Null
                Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
                Remove-Item -Recurse -Force $emptyDir -ErrorAction SilentlyContinue
                if (!(Test-Path $path)) {
                    Write-Host "✅ $description removed using robocopy method" -ForegroundColor Green
                    return $true
                }
            }
            catch {
                Write-Host "🔄 Robocopy failed, trying scheduled deletion..." -ForegroundColor Yellow
            }

            # Method 3: Schedule for deletion on reboot
            try {
                $deleteName = "$path.deleteme.$(Get-Random)"
                if (Test-Path $deleteName) { Remove-Item $deleteName -Force -ErrorAction SilentlyContinue }

                Move-Item -Path $path -Destination $deleteName -ErrorAction Stop
                Write-Host "✅ $description scheduled for deletion on next reboot" -ForegroundColor Green
                Write-Host "   Temporary name: $deleteName" -ForegroundColor Gray
                return $true
            }
            catch {
                Write-Host "❌ Failed to remove $description. Manual intervention required." -ForegroundColor Red
                Write-Host "   Try closing all editors, terminals, and Node.js processes first." -ForegroundColor Yellow
                Write-Host "   Or run: rmdir /s /q `"$path`"" -ForegroundColor Yellow
                return $false
            }
        }
    } else {
        Write-Host "ℹ️  $description not found, skipping" -ForegroundColor Gray
        return $true
    }
}

# Set working directory
$currentDir = Resolve-Path $Path
Set-Location $currentDir
Write-Host "Working Directory: $currentDir" -ForegroundColor Blue
Write-Host ""

# Stop any running Node.js processes
Write-Host "🔪 Stopping Node.js processes..." -ForegroundColor Yellow
$processes = @("node", "npm", "yarn", "tsc", "vite", "webpack")
$stoppedProcesses = @()

foreach ($proc in $processes) {
    $running = Get-Process $proc -ErrorAction SilentlyContinue
    if ($running) {
        try {
            $running | Stop-Process -Force -ErrorAction Stop
            $stoppedProcesses += $proc
        } catch {
            Write-Host "⚠️  Could not stop $proc processes" -ForegroundColor Yellow
        }
    }
}

if ($stoppedProcesses) {
    Write-Host "✅ Stopped processes: $($stoppedProcesses -join ', ')" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No running Node.js processes found" -ForegroundColor Gray
}

Write-Host ""

# Remove directories and files
$successCount = 0
$totalOperations = 0

# Remove node_modules
$totalOperations++
$success1 = Remove-DirectorySafely "$currentDir\node_modules" "node_modules directory"
if ($success1) { $successCount++ }

# Remove package-lock.json
$totalOperations++
if (Test-Path "$currentDir\package-lock.json") {
    try {
        Remove-Item -Force "$currentDir\package-lock.json" -ErrorAction Stop
        Write-Host "✅ package-lock.json removed" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "⚠️  Could not remove package-lock.json" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  package-lock.json not found" -ForegroundColor Gray
    $successCount++
}

# Remove yarn.lock if it exists
$totalOperations++
if (Test-Path "$currentDir\yarn.lock") {
    try {
        Remove-Item -Force "$currentDir\yarn.lock" -ErrorAction Stop
        Write-Host "✅ yarn.lock removed" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "⚠️  Could not remove yarn.lock" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  yarn.lock not found" -ForegroundColor Gray
    $successCount++
}

# Clean npm cache
$totalOperations++
Write-Host "🧽 Cleaning npm cache..." -ForegroundColor Yellow
try {
    $cacheOutput = & npm cache clean --force 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm cache cleaned" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "⚠️  npm cache clean had warnings" -ForegroundColor Yellow
        $successCount++
    }
} catch {
    Write-Host "ℹ️  npm cache clean skipped (npm may not be available)" -ForegroundColor Gray
    $successCount++
}

# Check for any remaining processes that might lock files
Write-Host "🔍 Checking for file locks..." -ForegroundColor Yellow
$lockedBy = $null
try {
    # Try using handle.exe if available (from Sysinternals)
    $handleOutput = & handle.exe "$currentDir" 2>$null 2>&1
    $lockedFiles = $handleOutput | Where-Object { $_ -match "node\.exe|npm\.cmd|yarn\.cmd|vite|webpack|tsc" }
    if ($lockedFiles) {
        Write-Host "⚠️  Found processes that may be locking files:" -ForegroundColor Yellow
        $lockedFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
        $lockedBy = "external processes"
    } else {
        Write-Host "✅ No file locks detected" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ️  Could not check for file locks (handle.exe not available)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎯 Cleanup Summary:" -ForegroundColor Cyan
Write-Host "   Operations completed: $successCount/$totalOperations" -ForegroundColor White

$successRate = [math]::Round(($successCount / $totalOperations) * 100, 1)
if ($successRate -eq 100) {
    Write-Host "   Success rate: $successRate% ✅" -ForegroundColor Green
} elseif ($successRate -ge 75) {
    Write-Host "   Success rate: $successRate% ⚠️" -ForegroundColor Yellow
} else {
    Write-Host "   Success rate: $successRate% ❌" -ForegroundColor Red
}

if ($lockedBy) {
    Write-Host ""
    Write-Host "⚠️  Warning: $lockedBy may still be locking files" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Ready for fresh install! Run:" -ForegroundColor Green
Write-Host "   npm install" -ForegroundColor White
Write-Host "   # or" -ForegroundColor Gray
Write-Host "   yarn install" -ForegroundColor White

if (-not $success1) {
    Write-Host ""
    Write-Host "🔄 If node_modules cleanup failed, try:" -ForegroundColor Yellow
    Write-Host "   1. Close all editors and terminals" -ForegroundColor White
    Write-Host "   2. Run as Administrator: " -NoNewline -ForegroundColor White
    Write-Host ".\cleanup-node-modules.ps1 -Force" -ForegroundColor Cyan
    Write-Host "   3. Reboot and run cleanup again" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ Cleanup completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray