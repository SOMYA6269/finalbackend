# Production Setup Guide for draganddrop.in

## 🚀 Quick Fix Summary

All issues have been fixed:
- ✅ Port changed to 5000 (safe port, no ERR_UNSAFE_PORT)
- ✅ MongoDB Atlas connection ready
- ✅ Production domain support (draganddrop.in)
- ✅ Nodemon configured properly
- ✅ CORS configured for production

## 📝 Environment Variables Setup

### Backend `.env` (Production)

```env
# Server
PORT=5000
NODE_ENV=production

# Frontend URLs (comma-separated)
FRONTEND_URL=https://draganddrop.in,https://www.draganddrop.in

# MongoDB Atlas (REQUIRED - replace with your actual connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dragdrop?retryWrites=true&w=majority

# Email (Optional but recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CONTACT_EMAIL=dragdroperp@gmail.com
```

### Frontend `.env` (Production)

```env
# Production API URL
VITE_API_URL=https://api.draganddrop.in/api
```

Or if backend is on same domain:
```env
VITE_API_URL=https://draganddrop.in/api
```

## 🔧 MongoDB Atlas Setup

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**: 
   - Choose AWS/Google Cloud
   - Select free tier (M0)
   - Choose region closest to your server
3. **Create Database User**:
   - Database Access → Add New User
   - Username: `dragdrop_user`
   - Password: Generate secure password
   - Save password securely!
4. **Whitelist IP Address**:
   - Network Access → Add IP Address
   - For production: Add your server IP
   - For testing: `0.0.0.0/0` (allows all IPs - use only for testing)
5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `dragdrop`
   - Example: `mongodb+srv://dragdrop_user:YourPassword123@cluster0.xxxxx.mongodb.net/dragdrop?retryWrites=true&w=majority`
6. **Update `.env`**:
   ```env
   MONGODB_URI=mongodb+srv://dragdrop_user:YourPassword123@cluster0.xxxxx.mongodb.net/dragdrop?retryWrites=true&w=majority
   ```

## 🌐 Domain Configuration

### Option 1: Backend on Subdomain (Recommended)
- Frontend: `https://draganddrop.in`
- Backend API: `https://api.draganddrop.in`

### Option 2: Backend on Same Domain
- Frontend: `https://draganddrop.in`
- Backend API: `https://draganddrop.in/api`

## 🚀 Deployment Steps

### Backend Deployment

1. **Update `.env`** with production values
2. **Install dependencies**:
   ```bash
   npm install --production
   ```
3. **Start server**:
   ```bash
   npm start
   ```
   Or use PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start server.js --name dragdrop-api
   pm2 save
   pm2 startup
   ```

### Frontend Deployment

1. **Update `.env`** with production API URL
2. **Build**:
   ```bash
   npm run build
   ```
3. **Deploy** `dist/` folder to your hosting

## ✅ Testing

### Test Backend
```bash
curl https://api.draganddrop.in/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "port": 5000
}
```

### Test MongoDB Connection
```bash
cd backend
npm run check
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :5000
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
- Verify connection string in `.env`
- Check IP whitelist in Atlas
- Verify username/password
- Check network/firewall settings

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env` matches your domain
- Check browser console for exact error
- Ensure credentials are enabled

### Nodemon Restarting Repeatedly
- Check `nodemon.json` configuration
- Verify `.env` file isn't being watched
- Check for syntax errors in code

## 📋 Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP address whitelisted
- [ ] Connection string added to `.env`
- [ ] Backend `.env` configured for production
- [ ] Frontend `.env` configured for production
- [ ] CORS origins updated
- [ ] Server tested locally
- [ ] Deployed to production
- [ ] Health check endpoint working
- [ ] Contact form working
- [ ] Ratings working

