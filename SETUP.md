# Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (if not installed)
# macOS: brew install mongodb-community
# Then start it:
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist IP (use `0.0.0.0/0` for development)
6. Get connection string

### Step 3: Create Environment File

Create `.env.local` in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/goal_tracker
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goal_tracker?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NODE_ENV=development
```

**Generate a secure JWT_SECRET:**
```bash
# On macOS/Linux:
openssl rand -base64 32

# Or use an online generator
```

### Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## ✅ Verify Installation

1. You should see the landing page with animated particles
2. Create an account (sign up)
3. You'll be redirected to the dashboard
4. Create your first goal
5. Log some progress
6. Check the calendar heatmap
7. Try to unlock rewards!

## 🐛 Common Issues

### MongoDB Connection Error
- **Local**: Make sure MongoDB is running (`brew services list` on macOS)
- **Atlas**: Check connection string, username, password, and IP whitelist

### Port 3000 Already in Use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy!

### Environment Variables for Production

Make sure to:
- Use MongoDB Atlas (not local)
- Generate a strong JWT_SECRET (32+ characters)
- Set `NODE_ENV=production`
- Enable HTTPS (Vercel does this automatically)

## 🎯 Next Steps

1. Create your first goal
2. Start logging daily progress
3. Build your streak!
4. Unlock rewards
5. Share with friends!

Enjoy your anime-style goal tracker! 🎮✨
