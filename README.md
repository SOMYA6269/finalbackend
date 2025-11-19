# Drag & Drop ERP Backend API

Backend server for handling contact form submissions and ratings using MongoDB Atlas.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dragdrop?retryWrites=true&w=majority
```

### 3. Set Up MongoDB Atlas

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**: Choose M0 (Free) tier
3. **Create Database User**:
   - Database Access → Add New User
   - Username: `dragdrop_user`
   - Password: Generate secure password (save it!)
4. **Whitelist IP Address**:
   - Network Access → Add IP Address
   - For testing: `0.0.0.0/0` (allows all IPs)
   - For production: Add your server IP
5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `dragdrop`
   - Example: `mongodb+srv://dragdrop_user:YourPassword123@cluster0.xxxxx.mongodb.net/dragdrop?retryWrites=true&w=majority`

### 4. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

### 5. Test Server

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "port": 5000,
  "environment": "development"
}
```

## 📋 API Endpoints

### Contact Form
- **POST** `/api/contact/submit`
  - Body: `{ name, email, phone?, reason, message }`
  - Returns: `{ success, message, submissionId }`

- **GET** `/api/contact/all` (Admin)
  - Returns: `{ success, contacts: [...] }`

### Ratings
- **POST** `/api/ratings/submit`
  - Body: `{ name?, rating, comment, page? }`
  - Returns: `{ success, message, ratingId }`
  
- **GET** `/api/ratings/all?page=grocery-studio&limit=50`
  - Returns: `{ success, ratings: [...] }`

### Health Check
- **GET** `/api/health`
  - Returns: `{ status, message, database, port, environment }`

## 🌐 Production Setup

### Backend `.env` (Production)

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://draganddrop.in,https://www.draganddrop.in
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dragdrop?retryWrites=true&w=majority
```

### Frontend `.env` (Production)

```env
VITE_API_URL=https://api.draganddrop.in/api
```

Or if backend is on same domain:
```env
VITE_API_URL=https://draganddrop.in/api
```

## 🔧 Troubleshooting

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

### ERR_UNSAFE_PORT
- Ports 6000-6999 are blocked by browsers
- Use port 5000 instead

### Nodemon Restarting Repeatedly
- Check `nodemon.json` configuration
- Verify `.env` file isn't being watched
- Check for syntax errors

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Allowed CORS origins (comma-separated) | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dragdrop` |
| `EMAIL_SERVICE` | Email service provider | `gmail` |
| `EMAIL_USER` | Email username | - |
| `EMAIL_PASSWORD` | Email password | - |
| `CONTACT_EMAIL` | Contact email address | `dragdroperp@gmail.com` |

## ✅ Check Setup

Run the setup checker:

```bash
npm run check
```

This will verify:
- Port configuration
- MongoDB connection
- Environment variables
