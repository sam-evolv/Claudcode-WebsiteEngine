# Render Deployment Guide - Fix Template Upload

## 🎯 Problem
The template upload modal shows "success" immediately without allowing file upload. This is because the **new drag-and-drop code (commit 374e6bf) hasn't been deployed to Render yet**.

## ✅ Solution: Manual Deploy on Render

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Log in to your account
3. Find your service: **evolvai-website-factory**
4. Click on it to open the service details

### Step 2: Trigger Manual Deploy
1. In the top right, you'll see a **"Manual Deploy"** button
2. Click the dropdown arrow next to it
3. Select **"Clear build cache & deploy"**
   - This ensures a fresh build with the latest code
4. Click **Deploy**

### Step 3: Monitor the Deployment
You'll see a live log stream showing:
```
==> Cloning from https://github.com/[your-repo]...
==> Checked out commit: 374e6bf
==> Installing dependencies...
==> Running build command: npm install && npm run build
==> Build complete
==> Starting service...
==> Service is live!
```

**Wait for**: `==> Live` status (usually 2-5 minutes)

### Step 4: Clear Your Browser Cache
Once deployment shows "Live":

**Chrome/Edge:**
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. OR just do a hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Firefox:**
1. Press `Ctrl+Shift+Delete`
2. Select "Cache"
3. Click "Clear Now"

### Step 5: Test the New Upload UI
1. Go to your Render app URL
2. Click **Templates** in sidebar
3. Click **Upload Template** button
4. You should now see:

**NEW DRAG-AND-DROP INTERFACE:**
```
┌─────────────────────────────────────┐
│   🔄                                 │
│   Click to upload or drag and drop  │
│   ZIP files up to 100MB             │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Drag ZIP files directly into the dashed box
- ✅ Click the box to open file picker
- ✅ See file name and size after selection
- ✅ "Change File" button to select different file
- ✅ Visual feedback when dragging (border turns blue)

## 🔍 How to Verify It Worked

### Check 1: Deployment Version
In Render dashboard, check the **Latest Deployment** section:
- ✅ Commit should be: `374e6bf`
- ✅ Status should be: "Live"
- ✅ Date should be: Today

### Check 2: Browser Console
1. Open your app in browser
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Refresh the page
5. Look for any errors (there shouldn't be any)

### Check 3: Upload Flow
1. Click **Upload Template**
2. Modal should show form fields:
   - Template Name (text input)
   - Description (textarea)
   - Tags (text input)
   - **File Upload Zone** (big dashed box - THIS IS NEW!)
3. Try dragging a ZIP file over the box
4. Box should turn blue when hovering
5. Drop the file
6. File name and size should appear

## 🚨 Troubleshooting

### Issue: Still showing old UI after deploy
**Solution:**
```bash
# Hard refresh didn't work? Try this:
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage" in sidebar
4. Check all boxes
5. Click "Clear site data"
6. Refresh page
```

### Issue: Deploy failed on Render
**Check the logs for:**
- Build errors (red text)
- Missing dependencies
- Memory issues

**Common fixes:**
```bash
# If build fails, try in Render dashboard:
Settings → Build & Deploy → Add Environment Variable
Name: NODE_OPTIONS
Value: --max-old-space-size=4096
```

### Issue: Deploy succeeded but upload still broken
**Check if backend is running:**
1. Open browser console
2. Try to upload a template
3. Look at Network tab (F12 → Network)
4. Should see POST request to `/api/templates/upload`
5. If 404 or CORS error, backend isn't running

**Fix:** Restart the service in Render dashboard

## 📊 What Changed (Technical Details)

### Before (Old Code):
```tsx
<Input
  id="template-file"
  type="file"
  accept=".zip"
  onChange={handleFileChange}
  className="cursor-pointer"
/>
```
**Problem:** Basic file input, no drag-and-drop, hard to use

### After (New Code - Commit 374e6bf):
```tsx
<div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className={cn(
    "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
    isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted hover:border-primary/50"
  )}
  onClick={() => document.getElementById('template-file')?.click()}
>
  <input type="file" className="hidden" />
  {/* Visual drag-drop zone */}
</div>
```
**Features:**
- Drag-and-drop support
- Visual feedback
- File preview with size
- Click-to-browse
- File validation

## ✅ Expected Behavior After Fix

1. **Open Upload Modal**
   - See form with Name, Description, Tags
   - See large dashed box for file upload

2. **Drag a ZIP File**
   - Box turns blue
   - Drop the file
   - See: ✅ filename.zip (2.5 MB)
   - See "Change File" button

3. **Fill Form**
   - Enter template name: "My Portfolio"
   - Enter description: "My design style"
   - Enter tags: "dark, modern"

4. **Click Upload**
   - See "Uploading..." spinner
   - Modal closes
   - Toast: "Template uploaded successfully! Processing..."
   - Template appears in list with "Processing" badge

5. **Wait for Processing**
   - After ~30 seconds, badge changes to "Ready"
   - Template is now usable in Generator

## 🎉 Success Criteria

You'll know it's working when:
- ✅ Upload modal shows drag-and-drop zone (not basic file input)
- ✅ You can drag ZIP files onto the dashed box
- ✅ File name and size appear after selection
- ✅ Upload button is disabled until all fields are filled
- ✅ After upload, template shows in list with "Processing" status
- ✅ After processing completes, status changes to "Ready"

---

**Need help?** Check Render logs for errors or open an issue on GitHub.
