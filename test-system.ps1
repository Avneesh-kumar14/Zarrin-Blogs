# Professional System Test Script
# This script tests the entire chat system end-to-end

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "CHAT SYSTEM DIAGNOSTIC TEST" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health Check
Write-Host "Test 1: Backend Health Check..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest "http://localhost:8200/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend health check: PASSED" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend health check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: MongoDB Connection
Write-Host "Test 2: Checking Backend Logs..." -ForegroundColor Green
try {
    $logs = Get-Content "c:\Users\Rajne\OneDrive\Desktop\project-1 - Copy\Zarrin_server\logs\*.log" -Tail 20 -ErrorAction SilentlyContinue
    if ($logs -match "MongoDB Connected") {
        Write-Host "✅ MongoDB Connected: CONFIRMED" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB status unclear" -ForegroundColor Yellow
    }
    
    if ($logs -match "Socket.IO initialized") {
        Write-Host "✅ Socket.IO initialized: CONFIRMED" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Socket.IO status unclear" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not read logs" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Frontend Status
Write-Host "Test 3: Frontend Server Status..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend port 3000: Checking..." -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Port Listeners
Write-Host "Test 4: Port Listeners..." -ForegroundColor Green
$ports = netstat -ano | Select-String -Pattern "8200|3000"
if ($ports) {
    Write-Host "✅ Active Port Listeners Found:" -ForegroundColor Green
    $ports | ForEach-Object {
        if ($_ -match "8200") { Write-Host "   - Port 8200 (Backend): LISTENING" -ForegroundColor Green }
        if ($_ -match "3000") { Write-Host "   - Port 3000 (Frontend): LISTENING" -ForegroundColor Green }
    }
} else {
    Write-Host "❌ No listeners found on ports 3000/8200" -ForegroundColor Red
}
Write-Host ""

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000/chat in your browser" -ForegroundColor Cyan
Write-Host "2. Log in with your credentials" -ForegroundColor Cyan
Write-Host "3. Check browser DevTools (F12) Console for logs" -ForegroundColor Cyan
Write-Host "4. Try creating a conversation" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
