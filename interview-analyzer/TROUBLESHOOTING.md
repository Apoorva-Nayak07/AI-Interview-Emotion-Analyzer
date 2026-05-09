# 🔧 Troubleshooting Guide

## Problem: "It's not showing anything"

### Quick Fixes (Try these first):

#### 1. **Hard Refresh the Browser**
- Press `Ctrl + Shift + R` (Windows/Linux)
- Or `Cmd + Shift + R` (Mac)
- This clears the cache and reloads

#### 2. **Clear Browser Cache**
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"
- Refresh the page

#### 3. **Try Different URL Formats**
Try each of these in your browser:
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost:5173/

#### 4. **Check Browser Console**
- Press `F12` to open Developer Tools
- Click "Console" tab
- Look for any red error messages
- Take a screenshot and share if you see errors

#### 5. **Try a Different Browser**
- Use Google Chrome (recommended)
- Or Microsoft Edge
- Avoid Firefox/Safari for now

---

## Detailed Diagnostics

### Step 1: Verify Servers Are Running

**Check Frontend:**
```bash
# Should show "VITE ready" message
# Look for: "Local: http://localhost:5173/"
```

**Check Backend:**
Open this in browser: http://localhost:5000/api/health

Should show:
```json
{"status":"OK","message":"Server is running"}
```

### Step 2: Check for Port Conflicts

**Test if port is accessible:**
```bash
# In PowerShell
Test-NetConnection -ComputerName localhost -Port 5173
Test-NetConnection -ComputerName localhost -Port 5000
```

### Step 3: Check Firewall

Windows Firewall might be blocking the connection:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Look for Node.js
4. Make sure both Private and Public are checked

---

## Common Issues & Solutions

### Issue 1: Blank White Page

**Cause:** JavaScript error or build issue

**Solution:**
1. Open browser console (F12)
2. Look for errors
3. If you see "Failed to fetch" or "Network error":
   - Check if backend is running
   - Verify `.env` file exists in frontend folder

### Issue 2: "Cannot GET /"

**Cause:** Vite server not running properly

**Solution:**
```bash
# Stop and restart frontend
cd interview-analyzer/frontend
npm run dev
```

### Issue 3: Loading Forever

**Cause:** API connection issue

**Solution:**
1. Check backend is running on port 5000
2. Verify `.env` file in frontend:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart both servers

### Issue 4: "This site can't be reached"

**Cause:** Server not running or wrong URL

**Solution:**
1. Verify servers are running (check terminal output)
2. Try http://127.0.0.1:5173 instead
3. Check if another app is using port 5173

---

## Manual Server Restart

### Stop Everything:
1. Close all terminal windows
2. Or press `Ctrl + C` in each terminal

### Start Fresh:

**Terminal 1 - Backend:**
```bash
cd interview-analyzer/backend
npm run dev
```

Wait for: "🚀 Server running on port 5000"

**Terminal 2 - Frontend:**
```bash
cd interview-analyzer/frontend
npm run dev
```

Wait for: "Local: http://localhost:5173/"

---

## Check What's Actually Showing

### If you see a blank page:
1. Right-click on the page
2. Click "View Page Source"
3. You should see HTML with `<div id="root"></div>`
4. If you see this, the server is working but JavaScript isn't loading

### If you see "Cannot GET /":
- Frontend server isn't running properly
- Restart the frontend server

### If you see "This site can't be reached":
- Server isn't running at all
- Start the servers

### If you see browser error page:
- Wrong URL or port
- Try http://localhost:5173 exactly

---

## Advanced Debugging

### Check if files are being served:

Open these URLs in browser:

1. **Main page:** http://localhost:5173/
2. **Vite client:** http://localhost:5173/@vite/client
3. **Main JS:** http://localhost:5173/src/main.jsx

If any of these show 404, the Vite server isn't running correctly.

### Check Network Tab:

1. Open browser (F12)
2. Go to "Network" tab
3. Refresh page (F5)
4. Look for failed requests (red)
5. Click on failed requests to see error details

---

## Nuclear Option (Complete Reset)

If nothing works, try this:

```bash
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Delete node_modules and reinstall
cd interview-analyzer/frontend
Remove-Item -Recurse -Force node_modules
npm install

cd ../backend
Remove-Item -Recurse -Force node_modules
npm install

# 3. Clear Vite cache
cd ../frontend
Remove-Item -Recurse -Force node_modules/.vite

# 4. Start servers again
# Terminal 1:
cd interview-analyzer/backend
npm run dev

# Terminal 2:
cd interview-analyzer/frontend
npm run dev
```

---

## What Should You See?

### On http://localhost:5173 you should see:

1. **Top:** Navigation bar with "Interview Analyzer" logo
2. **Hero Section:** Large heading "Master Your Interview Skills with AI-Powered Analysis"
3. **Buttons:** "Get Started Free" and "Login"
4. **Features Section:** 6 feature cards with emojis
5. **How It Works:** 4 steps with numbers
6. **Bottom:** Purple gradient CTA section

### If you see this, it's working! 🎉

---

## Still Not Working?

### Share This Information:

1. **What do you see?**
   - Blank page?
   - Error message?
   - Loading forever?
   - Something else?

2. **Browser Console Errors:**
   - Press F12
   - Go to Console tab
   - Copy any red error messages

3. **Terminal Output:**
   - What does the frontend terminal show?
   - What does the backend terminal show?

4. **Browser & OS:**
   - Which browser? (Chrome, Edge, Firefox, etc.)
   - Which version?
   - Windows version?

---

## Quick Test Commands

Run these to verify everything:

```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend (should return HTML)
curl http://localhost:5173

# Check if ports are in use
netstat -ano | findstr :5173
netstat -ano | findstr :5000
```

---

## Contact Info

If you've tried everything and it still doesn't work, provide:
- Screenshot of what you see in browser
- Screenshot of browser console (F12)
- Terminal output from both servers
- Browser name and version
