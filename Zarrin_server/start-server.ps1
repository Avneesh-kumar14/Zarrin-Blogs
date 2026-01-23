# Simple script to start the server and keep it running
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Starting Zarrin Backend Server..." -ForegroundColor Cyan
Write-Host "Port: 8200" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Ignore Ctrl+C and let the npm process handle it
$null = npm start

Write-Host "Server stopped" -ForegroundColor Red
