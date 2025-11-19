# Quick Start Guide - Fix All Issues

## ✅ Step 1: Update Port to 5000 (Safe Port)

**Backend `.env` file:**
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/dragdrop
```

**Frontend `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

⚠️ **IMPORTANT:** Ports 6000, 6001, 6002, etc. are blocked by browsers (ERR_UNSAFE_PORT). Use port 5000 instead.

## ✅ Step 2: Install Dependencies

```bash
cd backend
npm install
```

## ✅ Step 3: Set Up MongoDB

### Option A: MongoDB Atlas (Easiest - Recommended)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a FREE cluster (takes 3-5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dragdrop
   ```
   Replace `username`, `password`, and `cluster` with your actual values.

### Option B: Local MongoDB

1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   # Windows (PowerShell as Admin)
   net start MongoDB
   
   # Or manually start
   mongod
   ```
4. Use in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/dragdrop
   ```

## ✅ Step 4: Start Backend

```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Connected to MongoDB (or warning if not connected)
```

## ✅ Step 5: Test Backend

Open browser: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "port": 5000
}
```

If `database: "disconnected"`, MongoDB is not running or connection string is wrong.

## ✅ Step 6: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
- Check MongoDB is running: `mongosh` (should connect)
- Verify connection string in `.env`
- For Atlas: Make sure IP is whitelisted (0.0.0.0/0 for testing)
- Check firewall isn't blocking port 27017

### Frontend Can't Connect
- Verify `VITE_API_URL=http://localhost:5000/api` in frontend `.env`
- Restart frontend after changing `.env`
- Check browser console for CORS errors

## 📝 Environment Files Checklist

**`backend/.env`:**
- ✅ PORT=5000
- ✅ FRONTEND_URL=http://localhost:5173
- ✅ MONGODB_URI=(your connection string)

**`frontend/.env`:**
- ✅ VITE_API_URL=http://localhost:5000/api

