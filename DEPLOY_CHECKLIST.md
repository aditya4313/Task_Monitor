# ✅ Vercel Deployment Checklist

## Before Deploying

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster is running
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0` (all IPs)
- [ ] Strong JWT_SECRET generated for production

## During Deployment

- [ ] Import project to Vercel from GitHub
- [ ] Set environment variables in Vercel:
  - [ ] `MONGODB_URI` = your Atlas connection string
  - [ ] `JWT_SECRET` = strong random string (32+ chars)
  - [ ] `NODE_ENV` = production
- [ ] Deploy and wait for build

## After Deployment

- [ ] Test signup
- [ ] Test login
- [ ] Create a goal
- [ ] Log progress
- [ ] Check calendar heatmap
- [ ] Verify rewards system

## Environment Variables for Vercel

Copy these to Vercel Dashboard → Your Project → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://adityaevan433_db_user:5OAmEY2puAK4sy2Q@cluster0.izae84x.mongodb.net/goal_tracker?retryWrites=true&w=majority

JWT_SECRET=generate-strong-secret-here-min-32-chars

NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

---

## Quick Deploy Steps

1. **GitHub:** Push code
2. **Vercel:** Import from GitHub
3. **Vercel:** Add environment variables
4. **Vercel:** Click Deploy
5. **Done!** 🎉

---

## Important Notes

- ✅ Your code is already Vercel-ready
- ✅ No code changes needed
- ✅ Just add environment variables
- ✅ MongoDB Atlas must allow all IPs (`0.0.0.0/0`)
