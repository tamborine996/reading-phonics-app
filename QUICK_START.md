# Quick Start Guide

## What You Have Now

### 📊 Word Bank
- **Phonics_Word_Bank.xlsx** - 130 packs, ~30 words each, 3,383 total unique words
- Clean organization: "Category - Pack 1", "Category - Pack 2", etc.
- No duplicates, no tiny categories

### 🌐 Web App
- **index.html** - Open this in a browser to use the app!
- Works offline, saves progress automatically
- Currently loaded with first 4 packs (100 words)

## Using the Web App

1. **Open**: Double-click `index.html` or drag it into a browser
2. **Practice**: Click a pack, read words, mark as "Got it!" or "Tricky"
3. **Review**: At the end, review tricky words
4. **Parent View**: Click parent button to see progress

## Next Session Tasks

### Option A: Expand to All 130 Packs
1. Edit `extract_first_packs.py` line 24: change `range(2, 6)` to `range(2, ws.max_row + 1)`
2. Run: `python extract_first_packs.py`
3. Copy JSON from `word_packs.json` into `app.js` (replace wordPacks array)

### Option B: Add Features
See CLAUDE_NOTES.md "Next Steps / TODO" section for ideas:
- Audio pronunciation
- Shuffle mode
- Progress export
- More gamification

### Option C: Adjust Pack Sizes
Edit `create_simple_packs.py`:
- Change `pack_size = 30` to your preferred size
- Run script to regenerate word bank

## Important Files

- **README.md** - Full project documentation
- **CLAUDE_NOTES.md** - Detailed technical notes for Claude
- **WEB_APP_README.md** - Web app specific docs
- **Phonics_Word_Bank.xlsx** - The data
- **index.html** - The app

## Key Scripts

- **create_simple_packs.py** - Main organization script (CURRENT)
- **extract_first_packs.py** - Export to JSON
- **reorganize_with_levels.py** - Legacy (don't use)

## Testing Checklist

Before showing to your daughter:
- [ ] Open index.html - does it show 4 packs?
- [ ] Click Pack 1 - does it show words?
- [ ] Mark some words as "Tricky" - do they appear in review?
- [ ] Complete a pack - does completion screen show stats?
- [ ] Check Parent View - does it show tricky words?
- [ ] Close browser and reopen - is progress saved?

## Contact / Feedback

If you need to continue development or have issues, share:
- This folder
- README.md
- CLAUDE_NOTES.md

Everything is documented!
