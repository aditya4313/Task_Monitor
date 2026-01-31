# 🚀 Vercel Deployment Guide

## Step-by-Step Deployment Instructions

### Prerequisites
- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ MongoDB Atlas cluster running
- ✅ Your code ready to deploy

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 2: MongoDB Atlas Setup (IMPORTANT!)

### 2.1 Network Access
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **"Network Access"** in left sidebar
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
5. Click **"Confirm"**

**Why?** Vercel servers have dynamic IPs, so you need to allow all IPs.

### 2.2 Get Your Connection String
1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your actual password: `5OAmEY2puAK4sy2Q`
5. Add database name: `goal_tracker`

**Final connection string should look like:**
```
mongodb+srv://adityaevan433_db_user:5OAmEY2puAK4sy2Q@cluster0.izae84x.mongodb.net/goal_tracker?retryWrites=true&w=majority
```

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com)**
   - Sign up/Login with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Environment Variables** (CRITICAL!)
   Click **"Environment Variables"** and add:

   ```
   MONGODB_URI = mongodb+srv://adityaevan433_db_user:5OAmEY2puAK4sy2Q@cluster0.izae84x.mongodb.net/goal_tracker?retryWrites=true&w=majority
   ```
   
   ```
   JWT_SECRET = your-super-secret-jwt-key-minimum-32-characters-long-for-production-use
   ```
   
   ```
   NODE_ENV = production
   ```

   **Important:** 
   - Generate a strong JWT_SECRET (use: `openssl rand -base64 32`)
   - Make sure to add these for **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete (2-3 minutes)
   - Your app will be live! 🎉

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? (press enter for default)
# - Directory? ./
# - Override settings? N

# Set environment variables
vercel env add MONGODB_URI
# Paste: mongodb+srv://adityaevan433_db_user:5OAmEY2puAK4sy2Q@cluster0.izae84x.mongodb.net/goal_tracker?retryWrites=true&w=majority

vercel env add JWT_SECRET
# Paste: your-generated-secret-key

vercel env add NODE_ENV
# Paste: production

# Deploy to production
vercel --prod
```

---

## Step 4: Post-Deployment Checklist

### ✅ Verify Deployment
1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test signup/login
3. Create a goal
4. Log progress
5. Check calendar heatmap

### ✅ MongoDB Atlas
- ✅ Network Access allows `0.0.0.0/0`
- ✅ Database user has correct permissions
- ✅ Connection string is correct

### ✅ Environment Variables
- ✅ `MONGODB_URI` is set
- ✅ `JWT_SECRET` is set (strong, random)
- ✅ `NODE_ENV` is set to `production`

---

## Common Issues & Solutions

### Issue 1: "MongoDB connection error"
**Solution:**
- Check MongoDB Atlas Network Access (must allow `0.0.0.0/0`)
- Verify connection string in Vercel environment variables
- Check MongoDB Atlas cluster is running

### Issue 2: "Build failed"
**Solution:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### Issue 3: "Environment variables not working"
**Solution:**
- Make sure variables are added for **Production** environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue 4: "Authentication not working"
**Solution:**
- Verify `JWT_SECRET` is set in Vercel
- Check cookie settings (should work automatically on Vercel)
- Clear browser cookies and try again

---

## Security Best Practices

### ⚠️ Important Security Notes:

1. **Never commit `.env.local` to GitHub**
   - It's already in `.gitignore` ✅

2. **Use strong JWT_SECRET in production**
   ```bash
   openssl rand -base64 32
   ```

3. **MongoDB Password**
   - Your password is in the connection string
   - Keep it secure
   - Consider rotating it periodically

4. **Environment Variables**
   - Only set in Vercel dashboard
   - Never hardcode in code
   - Use different JWT_SECRET for production

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will handle SSL automatically

---

## Monitoring & Logs

### View Logs:
- Vercel Dashboard → Your Project → **"Logs"** tab
- Real-time function logs
- Error tracking

### Analytics:
- Vercel Dashboard → Your Project → **"Analytics"** tab
- Page views, performance metrics

---

## Updating Your App

### After making changes:

```bash
# Make your changes
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically:
- ✅ Detect the push
- ✅ Build the new version
- ✅ Deploy it
- ✅ Update your live site

**No manual deployment needed!** 🎉

---

## Cost

**Vercel Free Tier includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Automatic SSL
- ✅ Custom domains

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Perfect for development/small apps

---

## Support

If you face any issues:
1. Check Vercel build logs
2. Check MongoDB Atlas logs
3. Check browser console for errors
4. Review this guide again

---

**Your app is now live! 🚀**

Visit: `https://your-app-name.vercel.app`
