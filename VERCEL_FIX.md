# 🔧 Vercel "Invalid Characters" Error Fix

## Error Message:
"The name contains invalid characters. Only letters, digits, and underscores are allowed. Furthermore, the name should not start with a digit."

## Solution:

### Option 1: Use a Valid Project Name in Vercel

When creating the project in Vercel:

1. **Project Name:** Use only:
   - Letters (a-z, A-Z)
   - Numbers (0-9)
   - Underscores (_)
   - Hyphens (-) are also allowed

2. **Valid Examples:**
   - ✅ `anime_goal_tracker`
   - ✅ `anime-goal-tracker`
   - ✅ `task_monitor`
   - ✅ `TaskMonitor`
   - ✅ `goal_tracker_app`

3. **Invalid Examples:**
   - ❌ `Task_Monitor!` (special character)
   - ❌ `Task Monitor` (space)
   - ❌ `Task@Monitor` (special character)
   - ❌ `123Task` (starts with digit)

### Option 2: Check Environment Variable Names

If the error is about environment variables:

**Valid Environment Variable Names:**
- ✅ `MONGODB_URI`
- ✅ `JWT_SECRET`
- ✅ `NODE_ENV`

**Invalid:**
- ❌ `MONGODB-URI` (hyphen not allowed in env var names)
- ❌ `JWT.SECRET` (dot not allowed)
- ❌ `123_JWT_SECRET` (starts with digit)

### Option 3: Fix During Vercel Import

When importing from GitHub:

1. **Project Name:** Change from `Task_Monitor` to:
   - `task_monitor` or
   - `TaskMonitor` or
   - `anime_goal_tracker`

2. **Steps:**
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Select your GitHub repo
   - **Change the Project Name** to something valid
   - Click "Deploy"

### Quick Fix:

**Recommended Project Name:**
```
anime_goal_tracker
```
or
```
task_monitor_app
```

---

## Step-by-Step Fix:

1. **Go to Vercel Dashboard**
2. **If project already exists:**
   - Go to Project Settings → General
   - Change "Project Name" to a valid name
   - Save

3. **If creating new project:**
   - When importing, manually type a valid name
   - Don't use the auto-suggested name if it has issues
   - Use: `anime_goal_tracker` or `task_monitor`

4. **Environment Variables:**
   - Make sure variable names are: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`
   - Values can have any characters (they're strings)

---

## Common Issues:

### Issue 1: GitHub Repo Name
- Your repo is `Task_Monitor` which is valid
- But Vercel might auto-suggest a project name with issues
- **Solution:** Manually type a valid project name

### Issue 2: Special Characters in Project Name
- Vercel project names can't have spaces or special chars
- **Solution:** Use underscores or hyphens

### Issue 3: Starting with Number
- Project names can't start with a digit
- **Solution:** Start with a letter

---

## Recommended Action:

**Use this project name in Vercel:**
```
anime_goal_tracker
```

This is:
- ✅ All lowercase (clean)
- ✅ Uses underscores (valid)
- ✅ No special characters
- ✅ Starts with a letter
- ✅ Easy to remember

---

Try again with a valid project name and it should work! 🚀
