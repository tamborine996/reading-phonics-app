# Reading App - Phonics Word Bank Project

## Overview
This project provides a comprehensive phonics word bank for teaching reading, along with an interactive web app for daily word practice. The word bank contains 3,383 unique words organized into 130 packs of ~30 words each, covering all major phonics patterns from Year 1 through Year 6.

## Live Application
**URL**: https://creative-marzipan-00a78e.netlify.app
**GitHub**: https://github.com/tamborine996/reading-phonics-app
**Status**: Live and auto-deploying via Netlify

## Files

### Web App (NEW!)
- **index.html** - Main web application for word practice
- **style.css** - Child-friendly UI styling (purple gradient, large buttons)
- **app.js** - Application logic and progress tracking
- **word_packs.json** - Word data in JSON format (for reference)

### Word Bank
- **Phonics_Word_Bank.xlsx** - Main word bank organized into 130 simple packs (~30 words each)
- **Duplicate_Report.txt** - Report of duplicate words found across categories

### Python Scripts

#### 1. sync_excel_from_app.py (CURRENT - PRIMARY WORKFLOW)
**Purpose**: Syncs Excel file to match what's live in app.js

**Architecture**: app.js is the source of truth. Excel mirrors what's live.

**Usage**:
```bash
python sync_excel_from_app.py
```

**Output**:
- Updates Phonics_Word_Bank.xlsx to match app.js data
- Ensures Excel always shows what's actually deployed

**When to use**: After editing app.js and before committing changes

#### 2. create_simple_packs.py (LEGACY - Initial Setup)
**Purpose**: Creates clean, simple word packs for daily practice

**Features**:
- Consolidates all "Level" variations into base categories
- Creates packs of ~30 words each
- Removes all duplicates automatically
- Simple naming: "Category - Pack 1", "Category - Pack 2", etc.
- Skips tiny categories (<10 words)
- Generates 130 total packs from 3,383 unique words

**Note**: Used for initial organization. Now use sync_excel_from_app.py for updates.

#### 3. extract_first_packs.py (LEGACY)
**Purpose**: Extracts word packs from Excel to JSON format for web app

**Note**: Replaced by new workflow. app.js is now edited directly.

#### 4. Other Legacy Scripts
- reorganize_with_levels.py
- split_existing_wordbank.py
- create_split_wordbank.py
- create_segmented_wordbank.py

These contain historical word bank data and alternative organization approaches.

## Web App - Quick Start

### How to Use
1. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari)
2. The app works completely offline - no internet needed!
3. Select a pack to start practicing
4. Mark each word as "Got it!" or "Tricky"
5. Review tricky words at the end
6. Parents can click "Parent View" to see progress

### Features
- **Large, clear word display** - Easy for children to read
- **Simple two-button interface** - "Got it!" or "Tricky"
- **Automatic progress saving** - Uses browser localStorage
- **Visual progress tracking** - See words completed
- **Review mode** - Practice tricky words again
- **Parent dashboard** - Track which words need practice
- **Child-friendly design** - Purple gradient, animations, large text

### Current Status
- Currently loaded with first 4 packs (100 Year 1 high-frequency words)
- Can easily expand to all 130 packs (see instructions below)

### Expanding to All Packs
To add all 130 packs to the web app:
1. Modify `extract_first_packs.py` to extract all rows (change `range(2, 6)` to `range(2, ws.max_row + 1)`)
2. Run the script to generate full JSON
3. Copy the JSON data into `app.js` wordPacks array
4. Done! App handles any number of packs automatically

## Word Bank Organization

### Categories Included (130 Packs Total)
1. **High Frequency Words** (Year 1) - 4 packs
2. **Common Exception Words** (Years 2-6) - 11 packs
3. **Short Vowels** (a, e, i, o, u) - 13 packs
4. **Consonant Blends** (L/R/S/3-letter) - 8 packs
5. **Digraphs** (ch, sh, th, wh, ph) - 12 packs
6. **Long Vowels & Vowel Teams** - 19 packs
7. **R-Controlled Vowels** (ar, or, er, ir, ur) - 15 packs
8. **Advanced Patterns** - 48 packs

### Pack Organization
- Each pack contains ~30 words (some have fewer: 10-29)
- Words organized by phonics pattern, not difficulty
- Simple naming: "Category - Pack 1", "Category - Pack 2"
- No tiny packs (minimum 10 words per pack)
- All duplicates removed

## Recent Updates

### Latest Session (2025-11-07) - Deployment & Workflow

#### Production Deployment
- Deployed to Netlify: https://creative-marzipan-00a78e.netlify.app
- GitHub repository: https://github.com/tamborine996/reading-phonics-app
- Auto-deployment pipeline: GitHub → Netlify (30 second deploy time)
- Free tier hosting (sufficient for family use)

#### Architecture Changes
- **app.js is now source of truth** (what's live on the website)
- **Excel mirrors app.js** (for easy overview/reference)
- Created sync_excel_from_app.py to keep Excel in sync
- Sequential pack numbering: P1, P2, P3... P130
- Controlled deployment workflow (no accidental pushes)

#### Workflow Established
1. Edit app.js (make changes)
2. Run sync script (update Excel)
3. Commit to git
4. Push to GitHub
5. Auto-deploy to Netlify

### Previous Session (2025-11-06)

#### Phase 1: Initial Organization
- Reorganized word bank with difficulty-based splitting
- Found and removed 7 duplicate words: could, old, children, mr, mrs, people, busy
- Created 297 sections (too complex with Level 1A/1B/Level 3 - Level 3, etc.)

#### Phase 2: Simplified Reorganization
- Completely rebuilt with simple approach
- 130 clean packs, ~30 words each
- Simple naming: "Category - Pack 1", "Category - Pack 2"
- Removed confusing "Level" naming scheme
- Eliminated all 1-2 word tiny categories

#### Phase 3: Web App Development
- Created interactive web app for word practice
- Child-friendly interface with large buttons
- Progress tracking with localStorage
- Parent dashboard to view difficult words
- Currently loaded with first 4 packs (100 words)
- Fully functional and tested

## Dependencies
```
openpyxl
```

Install with:
```bash
pip install openpyxl
```

## How to Make Updates (Current Workflow)

### Making Changes to Word Packs

**IMPORTANT**: app.js is the source of truth. Excel mirrors what's live.

#### Step-by-Step Process:

1. **Edit app.js**
   - Open `app.js` in your editor
   - Modify the `wordPacks` array (add/remove/change words)
   - Save the file

2. **Sync Excel** (keeps Excel as a mirror)
   ```bash
   python sync_excel_from_app.py
   ```
   - This updates Excel to match app.js
   - Excel now shows what will be live

3. **Commit Changes**
   ```bash
   git add app.js Phonics_Word_Bank.xlsx
   git commit -m "Your descriptive message"
   ```

4. **Deploy**
   ```bash
   git push origin master
   ```
   - GitHub receives the push
   - Netlify auto-deploys (takes ~30 seconds)
   - Site is live at https://creative-marzipan-00a78e.netlify.app

### Why This Workflow?

- **app.js = Live data** (what users see)
- **Excel = Reference/overview** (always matches live)
- **No accidental deployments** (you control when to push)
- **Single source of truth** (app.js)
- **Easy overview** (Excel for quick viewing)

## Notes
- All scripts preserve word integrity (no hyphens or modifications)
- Duplicate detection is case-insensitive
- High-frequency and exception words are preserved even if duplicated
- Maximum ~35 words per section for readability
