# Quick Start Guide

## What You Have Now

### 🌐 Live Web App
- **URL**: https://creative-marzipan-00a78e.netlify.app
- **Status**: Live and deployed on Netlify (free tier)
- **Auto-deploys**: Every push to GitHub triggers deployment (~30 seconds)
- Currently loaded with first 4 packs (100 words)

### 📊 Word Bank
- **Phonics_Word_Bank.xlsx** - Mirrors what's live in the app
- 130 packs total, currently 4 packs deployed
- Sequential numbering: P1, P2, P3, P4
- ~30 words each, 3,383 total unique words

### 🔄 Architecture
- **app.js** = Source of truth (what's live)
- **Excel** = Mirror (shows what's live)
- **GitHub** = Code repository
- **Netlify** = Hosting & auto-deployment

## Using the Web App

1. **Visit**: https://creative-marzipan-00a78e.netlify.app
2. **Practice**: Click a pack, read words, mark as "Got it!" or "Tricky"
3. **Review**: At the end, review tricky words
4. **Parent View**: Click parent button to see progress

## Making Updates (Simple Workflow)

### To Change Word Packs:

1. **Edit app.js**
   - Open `app.js` in your editor
   - Modify the `wordPacks` array
   - Save the file

2. **Sync Excel** (keep Excel as mirror)
   ```bash
   python sync_excel_from_app.py
   ```

3. **Deploy**
   ```bash
   git add app.js Phonics_Word_Bank.xlsx
   git commit -m "Your message"
   git push origin master
   ```

4. **Wait ~30 seconds** - Site auto-updates!

### Next Session Tasks

#### Option A: Expand to All 130 Packs
- Currently: 4 packs deployed
- To expand: Add more packs to wordPacks array in app.js
- Run sync script, commit, push

#### Option B: Add Features
See CLAUDE_NOTES.md "Next Steps / TODO" section for ideas:
- Audio pronunciation
- Shuffle mode
- Progress export
- More gamification

#### Option C: Customize Packs
- Edit wordPacks array in app.js directly
- Adjust words, titles, descriptions
- Use sync script to update Excel

## Important Files

- **README.md** - Full project documentation
- **CLAUDE_NOTES.md** - Detailed technical notes for Claude
- **WEB_APP_README.md** - Web app specific docs
- **Phonics_Word_Bank.xlsx** - The data
- **index.html** - The app

## Key Scripts

- **sync_excel_from_app.py** - Sync Excel from app.js (CURRENT WORKFLOW)
- **create_simple_packs.py** - Initial pack organization (LEGACY)
- **extract_first_packs.py** - Export to JSON (LEGACY)
- **reorganize_with_levels.py** - Level-based organization (LEGACY)

## Testing Checklist

Before showing to your daughter:
- [ ] Visit https://creative-marzipan-00a78e.netlify.app
- [ ] Does it show 4 packs (P1-P4)?
- [ ] Click P1 - does it show words?
- [ ] Mark some words as "Tricky" - do they appear in review?
- [ ] Complete a pack - does completion screen show stats?
- [ ] Check Parent View - does it show tricky words?
- [ ] Close browser and reopen - is progress saved?
- [ ] Try on phone/tablet - does it work?

## Contact / Feedback

If you need to continue development or have issues, share:
- This folder
- README.md
- CLAUDE_NOTES.md

Everything is documented!
