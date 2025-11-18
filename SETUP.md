# Quick Setup Guide

## Backend Setup (Port 6000)

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```env
PORT=6000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/dragdrop

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CONTACT_EMAIL=dragdroperp@gmail.com
```

3. **Start backend:**
```bash
npm start
```

Backend will run on: `http://localhost:6000`

## Frontend Setup

1. **Create `.env` file in `frontend/` directory:**
```env
VITE_API_URL=http://localhost:6000/api
```

2. **Start frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173` (default Vite port)

## MongoDB Setup

### Option 1: Local MongoDB
- Install MongoDB: https://www.mongodb.com/try/download/community
- Start MongoDB service
- Use: `mongodb://localhost:27017/dragdrop`

### Option 2: MongoDB Atlas (Cloud - Free)
- Sign up: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Use: `mongodb+srv://username:password@cluster.mongodb.net/dragdrop`

## Test Connection

Visit: `http://localhost:6000/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

