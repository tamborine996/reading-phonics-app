# Workflow Guide - Making Updates

## Quick Reference

### 🎯 Source of Truth
- **app.js** = What's live on the website
- **Excel** = Mirror/reference (always shows what's live)

---

## Standard Update Process

### Making Changes to Word Packs

```bash
# 1. Edit app.js
# Open app.js in your editor and modify the wordPacks array

# 2. Sync Excel (so it mirrors app.js)
python sync_excel_from_app.py

# 3. Commit changes
git add app.js Phonics_Word_Bank.xlsx
git commit -m "Descriptive message about your changes"

# 4. Deploy
git push origin master

# 5. Wait ~30 seconds
# Site auto-updates at https://creative-marzipan-00a78e.netlify.app
```

---

## What Each Step Does

### Step 1: Edit app.js
- This is where you make actual changes
- Modify words, titles, descriptions in the `wordPacks` array
- **This is the source of truth** - what you put here goes live

### Step 2: Sync Excel
- Runs `sync_excel_from_app.py`
- Reads app.js and updates Excel to match
- Excel now shows what will be live
- **Purpose**: Keep Excel as a reference/overview

### Step 3: Commit
- Git saves your changes
- Both app.js and Excel are committed together
- They stay in sync

### Step 4: Push
- Sends your changes to GitHub
- GitHub webhook triggers Netlify
- Netlify starts auto-deployment

### Step 5: Wait
- Netlify builds and deploys (~30 seconds)
- Site updates automatically
- No manual upload needed

---

## Common Tasks

### Add a New Pack
1. Edit `app.js` - add new pack object to wordPacks array
2. Run sync script
3. Commit and push

### Change Words in Existing Pack
1. Edit `app.js` - modify words array in the pack
2. Run sync script
3. Commit and push

### Update Pack Title/Description
1. Edit `app.js` - change title or description fields
2. Run sync script
3. Commit and push

### View What's Currently Live
- Look at Excel file (it mirrors app.js)
- OR visit: https://creative-marzipan-00a78e.netlify.app

---

## Why This Workflow?

### Problem We Solved
- Don't want accidental Excel edits to go live
- Want to control when changes deploy
- Need Excel for easy overview
- Want single source of truth

### Solution
- **app.js is source of truth** (what goes live)
- **Excel mirrors app.js** (for reference)
- **Explicit push to deploy** (you control timing)
- **Sync script keeps them in sync**

---

## Troubleshooting

### Excel Won't Update
- Make sure Excel file is **closed** before running sync script
- Python can't write to open files

### Changes Not Showing on Site
- Wait 30-60 seconds after push
- Check Netlify deploy status: https://app.netlify.com/projects/creative-marzipan-00a78e
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Git Conflicts
- Rare with this workflow
- If happens, ask Claude for help

---

## Deployment URLs

- **Live Site**: https://creative-marzipan-00a78e.netlify.app
- **GitHub Repo**: https://github.com/tamborine996/reading-phonics-app
- **Netlify Dashboard**: https://app.netlify.com/projects/creative-marzipan-00a78e

---

## File Structure

```
app.js                      → SOURCE OF TRUTH (edit this)
    ↓
sync_excel_from_app.py      → Sync script
    ↓
Phonics_Word_Bank.xlsx      → MIRROR (shows what's live)
    ↓
Git commit + push           → Version control
    ↓
GitHub                      → Code repository
    ↓
Netlify (auto-deploy)       → Hosting
    ↓
Live website                → Users see your changes
```

---

## Pro Tips

1. **Always run sync script** before committing - keeps Excel in sync
2. **Use descriptive commit messages** - easier to track changes
3. **Test locally first** - open index.html in browser before pushing
4. **Check Excel after sync** - verify it matches your expectations
5. **One logical change per commit** - easier to track and revert if needed
