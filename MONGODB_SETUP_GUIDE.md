# MongoDB Setup Guide

## Problem
The server cannot connect to MongoDB Atlas due to DNS resolution failure. The network is blocking external DNS requests to `cluster0.2i0o1zg.mongodb.net`.

## Solution: Use Local MongoDB

### Option 1: Using Docker (Recommended)

1. **Start Docker Desktop**
   - Open Docker Desktop application
   - Wait for it to fully start

2. **Start MongoDB Container**
   ```powershell
   docker run -d --name zarrin-mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 mongo:5-alpine
   ```

3. **Verify MongoDB is Running**
   ```powershell
   docker ps | Select-Object ID, Image, Status
   ```

4. **Your .env is Already Configured**
   - The local MongoDB connection string is already set in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/zarrin_blogs
   ```

5. **Restart the Server**
   ```powershell
   npm start
   ```

### Option 2: Install MongoDB Community Edition Locally

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows
   - Download the MSI Installer

2. **Install MongoDB**
   - Run the installer
   - Follow the installation wizard
   - Choose "Install MongoDB as a Service"

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   # MongoDB should start automatically
   # Or manually start it:
   net start MongoDB
   ```

5. **Restart the Server**
   ```powershell
   npm start
   ```

### Option 3: Use MongoDB Atlas with VPN/Proxy

If you need to use the cloud MongoDB:

1. **Check Network Status**
   ```powershell
   Test-NetConnection -ComputerName cluster0.2i0o1zg.mongodb.net -Port 27017
   ```

2. **If DNS is Blocked**
   - Check if your network uses a corporate proxy
   - Try using a VPN if available
   - Contact your network administrator

3. **Update .env** (if connectivity is restored)
   ```
   MONGO_URI=mongodb+srv://rajneeshavneeshkar:1234@cluster0.2i0o1zg.mongodb.net/zarrin_blogs?retryWrites=true&w=majority
   ```

4. **Restart the Server**
   ```powershell
   npm start
   ```

## Verify Connection

Once MongoDB is running, restart the server and check for:

```
✅ MongoDB connection successful
✅ Backend API running
```

Instead of:
```
🔴 MongoDB: DISCONNECTED
```

## Troubleshooting

### Port 27017 Already in Use
```powershell
# Find process using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Docker Container Won't Start
```powershell
# Stop and remove the old container
docker stop zarrin-mongodb
docker rm zarrin-mongodb

# Start fresh
docker run -d --name zarrin-mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 mongo:5-alpine
```

### MongoDB Service Won't Start
```powershell
# Check service status
Get-Service MongoDB

# Start the service
Start-Service MongoDB

# View logs
Get-Content $env:ProgramData\MongoDB\logs\mongod.log -Tail 50
```

## Next Steps

Once MongoDB is connected:
1. Run the database migrations (if any)
2. Seed initial data (if needed)
3. Restart frontend: `npm start` in `zarrin_blogs` folder
4. Test API endpoints at `http://localhost:8200/api-docs`

