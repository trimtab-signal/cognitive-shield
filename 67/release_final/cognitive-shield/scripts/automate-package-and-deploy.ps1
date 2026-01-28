# PowerShell script to automate Cognitive Shield app and extension packaging and deployment
# 1. Final compliance/security check (scan for TODO, FIXME, external calls)
# 2. Zip extension and app for release
# 3. Output release checklist

$extensionPath = "c:\MASTER_PROJECT\67\donation-wallet"
$appPath = "c:\MASTER_PROJECT\67\release_final\cognitive-shield"
$extensionZip = "$extensionPath\PhenixDonationWallet.zip"
$appZip = "$appPath\CognitiveShieldApp.zip"

Write-Host "Scanning for TODO, FIXME, and external calls..."
Get-ChildItem -Path $appPath -Recurse -Include *.ts,*.tsx,*.js | ForEach-Object {
    $content = Get-Content $_.FullName
    if ($content -match 'TODO|FIXME|fetch|axios|XMLHttpRequest|http://|https://') {
        Write-Host "Potential issue in $($_.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "Zipping extension..."
if (Test-Path $extensionZip) { Remove-Item $extensionZip }
Compress-Archive -Path "$extensionPath\*" -DestinationPath $extensionZip -Force
Write-Host "Extension zipped at $extensionZip"

Write-Host "Zipping app..."
if (Test-Path $appZip) { Remove-Item $appZip }
Compress-Archive -Path "$appPath\*" -DestinationPath $appZip -Force
Write-Host "App zipped at $appZip"

Write-Host "Release checklist:"
Write-Host "1. Review compliance and privacy banners in UI."
Write-Host "2. Confirm AGPLv3 license headers in all new code."
Write-Host "3. Verify extension and app run locally with no external calls."
Write-Host "4. Submit extension zip to Chrome Web Store or load manually."
Write-Host "5. Deploy app zip to production hosting."
Write-Host "6. Archive release zips and update release notes."
Write-Host "Automation complete. Ready for final review and deployment."
