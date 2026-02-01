<div className="chat-header">
  <h2>{conversation.otherName || 'User'}</h2>
  
  {/* Add this line - Call button */}
  <CallButton 
    recipientId={conversation.otherId || conversation.participants?.[1]?._id}
    conversationId={conversation._id}
    recipientName={conversation.otherName || conversation.participants?.[1]?.name}
  />
</div><div className="chat-header">
  <h2>{conversation.otherName || 'User'}</h2>
  
  {/* Add this line - Call button */}
  <CallButton 
    recipientId={conversation.otherId || conversation.participants?.[1]?._id}
    conversationId={conversation._id}
    recipientName={conversation.otherName || conversation.participants?.[1]?.name}
  />
</div>@echo off
REM MongoDB Quick Start Script for Windows

echo [*] Checking if Docker is running...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [!] Docker is not running. Starting Docker...
    start "" "C:\Program Files\Docker\Docker\Docker.exe"
    echo [*] Docker is starting... Please wait 30-60 seconds
    timeout /t 60 /nobreak
)

echo [*] Checking if MongoDB container already exists...
docker ps -a --filter name=zarrin-mongodb --format "{{.ID}}" >nul 2>&1

if errorlevel 1 (
    echo [*] Creating MongoDB container...
    docker run -d --name zarrin-mongodb -p 27017:27017 ^
        -e MONGO_INITDB_ROOT_USERNAME=admin ^
        -e MONGO_INITDB_ROOT_PASSWORD=password123 ^
        mongo:5-alpine
    
    if errorlevel 1 (
        echo [!] Failed to create MongoDB container
        pause
        exit /b 1
    )
    
    echo [*] Waiting for MongoDB to be ready...
    timeout /t 10 /nobreak
) else (
    echo [*] MongoDB container exists. Starting it...
    docker start zarrin-mongodb
)

echo [*] Verifying MongoDB is running...
docker ps --filter name=zarrin-mongodb

echo.
echo [+] MongoDB is now running on: localhost:27017
echo [+] Username: admin
echo [+] Password: password123
echo.
echo [*] You can now run: npm start
pause
