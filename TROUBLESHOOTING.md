# Troubleshooting Guide

## Common Issues and Solutions

### 1. Port Already in Use (EADDRINUSE)

**Error:** `Error: listen EADDRINUSE: address already in use :::6000`

**Solution:**
- Find and kill the process using the port:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :6000
  taskkill /PID <PID> /F
  
  # Or use a different port in .env
  PORT=5000
  ```

### 2. Unsafe Port Error (ERR_UNSAFE_PORT)

**Error:** Browser blocks ports like 6001, 6002, etc.

**Solution:**
- Use safe ports: 5000, 8000, 3000, 3001, 5173, etc.
- Update `.env` files:
  ```
  PORT=5000  # Backend
  VITE_API_URL=http://localhost:5000/api  # Frontend
  ```

### 3. MongoDB Connection Failed (ECONNREFUSED)

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017`

**Solutions:**

#### Option A: Install and Start Local MongoDB
1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Or start manually
   mongod
   ```

#### Option B: Use MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dragdrop
   ```

#### Option C: Test Without MongoDB
- The server will start but show a warning
- Contact form and ratings will return errors until MongoDB is connected
- Use `/api/health` to check database status

### 4. Express Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

### 5. Frontend Can't Connect to Backend

**Error:** `Failed to fetch` or CORS errors

**Solutions:**
1. Make sure backend is running: `http://localhost:5000/api/health`
2. Check `.env` files match:
   - Backend: `PORT=5000`
   - Frontend: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend after changing `.env`
4. Check CORS in `backend/server.js` - `FRONTEND_URL` should match your frontend URL

### 6. Module Not Found Errors

**Error:** `Cannot find module` or `ERR_MODULE_NOT_FOUND`

**Solution:**
```bash
cd backend
npm install express mongoose cors dotenv nodemailer body-parser
```

## Quick Test Commands

### Test Backend
```bash
curl http://localhost:5000/api/health
```

### Test MongoDB Connection
```bash
# If MongoDB is installed locally
mongosh
# or
mongo
```

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :5000
```

## Recommended Ports

- **Backend:** 5000 (safe port)
- **Frontend:** 5173 (Vite default)
- **MongoDB:** 27017 (default)

## Environment Variables Checklist

**Backend `.env`:**
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/dragdrop
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

