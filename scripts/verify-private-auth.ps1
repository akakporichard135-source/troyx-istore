# TroyX iStore - Private Password Verification Tool (PowerShell)
# Prompts for owner password using native Windows masked input (AsSecureString).
# Tests credentials directly against Google Firebase Authentication.
# Password and tokens are NEVER displayed, logged, or saved.

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "TROYX iSTORE -- PRIVATE FIREBASE AUTHENTICATION TEST" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "Target Account: akakporichard135@gmail.com" -ForegroundColor White
Write-Host "Target UID:     07Rwzx6R7iaENCpBWSQZ2Ta0YLX2" -ForegroundColor White
Write-Host ""

$sec = Read-Host -Prompt "Enter owner password to verify privately" -AsSecureString
if (-not $sec) {
    Write-Host ""
    Write-Host "[ERROR] Password cannot be empty." -ForegroundColor Red
    exit 1
}

$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
$plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
$sec = $null

Write-Host ""
Write-Host "Testing credentials with Google Firebase Authentication..." -ForegroundColor Yellow

$plain | node scripts/test-private-credentials.mjs

$plain = $null
[System.GC]::Collect()
