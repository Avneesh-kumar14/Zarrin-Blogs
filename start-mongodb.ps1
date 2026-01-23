#!/usr/bin/env pwsh
# MongoDB Quick Start Script for Windows PowerShell

Write-Host "[*] Checking Docker status..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker ps *>$null
    $dockerRunning = $true
    Write-Host "[+] Docker is running" -ForegroundColor Green
} catch {
    $dockerRunning = $false
    Write-Host "[!] Docker is not running" -ForegroundColor Yellow
}

if (-not $dockerRunning) {
    Write-Host "[*] Starting Docker Desktop..." -ForegroundColor Cyan
    
    # Try to start Docker Desktop
    $dockerPaths = @(
        "C:\Program Files\Docker\Docker\Docker.exe",
        "$env:ProgramFiles\Docker\Docker\Docker.exe",
        "$env:ProgramFiles(x86)\Docker\Docker\Docker.exe"
    )
    
    $dockerFound = $false
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            Start-Process $path
            $dockerFound = $true
            break
        }
    }
    
    if ($dockerFound) {
        Write-Host "[*] Docker is starting... Waiting 60 seconds" -ForegroundColor Cyan
        Start-Sleep -Seconds 60
    } else {
        Write-Host "[!] Docker executable not found" -ForegroundColor Red
        Write-Host "[!] Please start Docker Desktop manually" -ForegroundColor Yellow
        Read-Host "Press Enter to continue..."
    }
}

Write-Host "[*] Checking for existing MongoDB container..." -ForegroundColor Cyan

# Check if container exists
$containerExists = docker ps -a --filter name=zarrin-mongodb --format "{{.ID}}" 2>$null

if ([string]::IsNullOrEmpty($containerExists)) {
    Write-Host "[*] Creating MongoDB container..." -ForegroundColor Cyan
    
    docker run -d --name zarrin-mongodb `
        -p 27017:27017 `
        -e MONGO_INITDB_ROOT_USERNAME=admin `
        -e MONGO_INITDB_ROOT_PASSWORD=password123 `
        mongo:5-alpine
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[+] MongoDB container created successfully" -ForegroundColor Green
        Write-Host "[*] Waiting for MongoDB to be ready..." -ForegroundColor Cyan
        Start-Sleep -Seconds 10
    } else {
        Write-Host "[!] Failed to create MongoDB container" -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
} else {
    Write-Host "[*] MongoDB container exists. Starting it..." -ForegroundColor Cyan
    docker start zarrin-mongodb | Out-Null
    Start-Sleep -Seconds 5
}

# Verify MongoDB is running
Write-Host "[*] Verifying MongoDB is running..." -ForegroundColor Cyan
$running = docker ps --filter name=zarrin-mongodb --format "{{.Names}}"

if ([string]::IsNullOrEmpty($running)) {
    Write-Host "[!] MongoDB container is not running" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "[+] MongoDB is running!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection Details:" -ForegroundColor Cyan
Write-Host "  Host:     localhost" -ForegroundColor White
Write-Host "  Port:     27017" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: password123" -ForegroundColor White
Write-Host ""
Write-Host "[*] Connection string in .env is already configured:" -ForegroundColor Cyan
Write-Host "  MONGO_URI=mongodb://localhost:27017/zarrin_blogs" -ForegroundColor White
Write-Host ""
Write-Host "[+] You can now run: npm start" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close this window..."
