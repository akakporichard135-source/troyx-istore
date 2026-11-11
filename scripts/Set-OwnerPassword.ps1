# TroyX iStore - Secure PowerShell Owner Password Recovery Tool
# Prompts for new password using native Windows masked input (AsSecureString).
# Passes password exclusively over stdin pipe to Node.js backend (never in CLI args, disk, or logs).

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "TROYX iSTORE -- SECURE POWERSHELL OWNER PASSWORD RECOVERY" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "Target Account: akakporichard135@gmail.com" -ForegroundColor White
Write-Host "Verified UID:   07Rwzx6R7iaENCpBWSQZ2Ta0YLX2" -ForegroundColor White
Write-Host ""

# 1. Native Windows Masked Password Prompts
$sec1 = Read-Host -Prompt "Enter new secure owner password" -AsSecureString
if (-not $sec1) {
    Write-Host ""
    Write-Host "[ERROR] Password cannot be empty." -ForegroundColor Red
    exit 1
}

$sec2 = Read-Host -Prompt "Confirm new secure owner password" -AsSecureString
if (-not $sec2) {
    Write-Host ""
    Write-Host "[ERROR] Password confirmation cannot be empty." -ForegroundColor Red
    exit 1
}

# 2. In-Memory Validation (Zero plain-text logging)
$bstr1 = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec1)
$plain1 = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr1)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr1)

$bstr2 = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec2)
$plain2 = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr2)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr2)

if ($plain1 -ne $plain2) {
    Write-Host ""
    Write-Host "[ERROR] Passwords do not match. Please run the script again." -ForegroundColor Red
    $plain1 = $null
    $plain2 = $null
    exit 1
}

if ($plain1.Length -lt 8) {
    Write-Host ""
    Write-Host "[ERROR] Password must be at least 8 characters long." -ForegroundColor Red
    $plain1 = $null
    $plain2 = $null
    exit 1
}

if ($plain1 -eq "TroyX@2026!" -or $plain1 -eq "troyxistore") {
    Write-Host ""
    Write-Host "[ERROR] Deprecated bootstrap passwords are permanently disabled." -ForegroundColor Red
    $plain1 = $null
    $plain2 = $null
    exit 1
}

Write-Host ""
Write-Host "Applying credentials to Firebase Authentication and Cloud Firestore..." -ForegroundColor Yellow

# 3. Securely Pipe to Local Node Worker via Standard Input Pipe
$plain1 | node scripts/apply-owner-password.mjs

# 4. Immediate In-Memory Wipe
$plain1 = $null
$plain2 = $null
$sec1 = $null
$sec2 = $null
[System.GC]::Collect()
