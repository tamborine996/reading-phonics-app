# Project Context for Claude Code

This file contains important context that Claude Code should reference in all sessions for this project and user.

---

## 🔑 SUPABASE SETUP ALREADY COMPLETED

### User's Supabase Account Details

**Access Token (Permanent):**
```
sbp_1c6689e96dc992dc51a5d8676f67c8610cf5ad47
```

**This Project:**
- **Project Ref:** `lgcfmzksdpnolwjwavwt`
- **Project URL:** `https://lgcfmzksdpnolwjwavwt.supabase.co`
- **Database Password:** `qjeHVLTmT6SGs4xN`
- **Database URL:** `postgresql://postgres:qjeHVLTmT6SGs4xN@db.lgcfmzksdpnolwjwavwt.supabase.co:5432/postgres`

### Supabase Project Template Available

**Location:** `C:\Users\mqc20\Downloads\Projects\supabase-project-template\`

This template includes:
- ✅ RLS enabled from day 1
- ✅ Automated setup scripts
- ✅ Complete documentation
- ✅ Security verification scripts

**When starting new Supabase projects:**
1. Copy from `C:\Users\mqc20\Downloads\Projects\supabase-project-template\`
2. Run `./scripts/setup-project.sh`
3. RLS is automatically enabled - no rigmarole!

### Available CLI Commands

```bash
# User's access token is already set in environment
export SUPABASE_ACCESS_TOKEN=sbp_1c6689e96dc992dc51a5d8676f67c8610cf5ad47

# Link to Supabase project
npx supabase link --project-ref lgcfmzksdpnolwjwavwt

# Push migrations (includes RLS)
npx supabase db push

# Verify RLS is working
npm run check:rls

# Enable RLS directly
npm run enable:rls
```

### Documentation References

- `docs/FUTURE_PROJECT_SETUP.md` - Complete setup guide
- `SUPABASE_CLI_CHEATSHEET.md` - All CLI commands
- `SECURITY_FIX.md` - RLS security documentation
- `project-template/` - Reusable template for new projects

---

## 🐍 PYTHON SETUP

### Known Issue: Python.exe Location

**User frequently encounters Python path issues.**

### Always Check Python Location First

Before running Python commands, proactively check:

```bash
# Method 1: Try common locations
python --version
python3 --version
py --version

# Method 2: Find Python executable
where python
where python3
where py

# Method 3: Check common Windows locations
ls "C:\Python*\python.exe"
ls "C:\Users\mqc20\AppData\Local\Programs\Python\*\python.exe"
```

### Best Practice for Python Commands

**ALWAYS do this at start of session involving Python:**

```bash
# 1. Find Python
PYTHON_PATH=$(where python | head -n1)
echo "Using Python at: $PYTHON_PATH"

# 2. Verify it works
$PYTHON_PATH --version

# 3. Create alias or use full path
alias python="$PYTHON_PATH"
```

### Common Python Locations on This Machine

Check these first:
- `C:\Python311\python.exe`
- `C:\Python310\python.exe`
- `C:\Users\mqc20\AppData\Local\Programs\Python\Python311\python.exe`
- `C:\Users\mqc20\AppData\Local\Programs\Python\Python310\python.exe`
- `py.exe` (Python launcher - usually works)

### Virtual Environments

When creating venvs, use full path:

```bash
# Find Python first
PYTHON_PATH=$(where python | head -n1)

# Create venv with full path
$PYTHON_PATH -m venv venv

# Or use py launcher (more reliable on Windows)
py -m venv venv
```

### Recommended Approach

**Start of any Python session:**

1. **Ask user for Python path** if not immediately found
2. **Use `py` launcher** if available (more reliable on Windows)
3. **Store path in .env** or session variable for reuse

```bash
# Example session start
echo "Checking Python installation..."

if command -v py &> /dev/null; then
  echo "✅ Using Python launcher (py)"
  PYTHON=py
elif command -v python &> /dev/null; then
  echo "✅ Using python"
  PYTHON=python
elif command -v python3 &> /dev/null; then
  echo "✅ Using python3"
  PYTHON=python3
else
  echo "❌ Python not found in PATH"
  echo "Please provide Python executable path"
  # Ask user
fi

# Then use $PYTHON for all commands
$PYTHON --version
$PYTHON -m pip install -r requirements.txt
```

---

## 🏗️ PROJECT-SPECIFIC KNOWLEDGE

### This Project (Reading Phonics App)

**Type:** TypeScript + Vite web app for teaching phonics

**Tech Stack:**
- Frontend: TypeScript + Vite
- Database: Supabase (PostgreSQL with RLS)
- Auth: Google OAuth
- Deployment: GitHub Pages
- Testing: Vitest

**Key Files:**
- `src/data/wordPacks.ts` - Source of truth for word data
- `supabase-schema.sql` - Database schema with RLS
- `package.json` - All scripts available

**Available npm Scripts:**
```bash
npm run dev              # Development server
npm run build            # Production build
npm run type-check       # TypeScript validation
npm test                 # Run tests
npm run check:rls        # Verify RLS security
npm run enable:rls       # Enable RLS directly
```

**Deployment:**
- Auto-deploys to GitHub Pages on push to master
- URL: https://tamborine996.github.io/reading-phonics-app/

**Security:**
- RLS is ENABLED on pack_progress table
- 4 policies active (SELECT, INSERT, UPDATE, DELETE)
- Verified working as of 2025-01-09

---

## 📋 USER PREFERENCES

### Development Workflow

**Preferred:** CLI-first, minimal web dashboard usage

**For Supabase:**
- Use CLI for everything possible
- Only use web dashboard for:
  1. Generating access token (already done)
  2. OAuth provider setup (if needed)

**For Python:**
- Always verify Python path before running commands
- Proactively ask if location not found
- Use `py` launcher when available

### Code Style

- TypeScript preferred
- Type-safe development
- Tests required for new features
- Documentation should be updated with changes

### Git Workflow

- Descriptive commit messages
- Auto-deploy to GitHub Pages
- Include "🤖 Generated with Claude Code" in commits

---

## 🎯 MASTER STANDARDS

These apply to ALL projects for this user:

### 1. Supabase Projects

**ALWAYS:**
- ✅ Refer to template at `C:\Users\mqc20\Downloads\Projects\supabase-project-template\`
- ✅ Use CLI-first approach
- ✅ Enable RLS from day 1 (it's in the template!)
- ✅ Verify security with `npm run check:rls`
- ✅ Use migrations for schema changes

**NEVER:**
- ❌ Assume RLS is enabled without checking
- ❌ Create tables without RLS policies
- ❌ Skip security verification
- ❌ Use web dashboard when CLI can do it

### 2. Python Development

**ALWAYS:**
- ✅ Check Python location at start of session
- ✅ Try `py`, `python`, `python3` in that order
- ✅ Use full path or `py` launcher for reliability
- ✅ Proactively ask user if Python not found
- ✅ Show which Python is being used

**NEVER:**
- ❌ Assume `python` command works
- ❌ Proceed without verifying Python path
- ❌ Silently fail on Python not found

### 3. General Development

**ALWAYS:**
- ✅ Run tests before deployment
- ✅ Type-check TypeScript projects
- ✅ Update documentation when making changes
- ✅ Verify changes work before committing
- ✅ Use descriptive commit messages

---

## 📖 QUICK REFERENCE

### New Supabase Project

```bash
cp -r "C:\Users\mqc20\Downloads\Projects\supabase-project-template" ./new-project
cd new-project
export SUPABASE_ACCESS_TOKEN=sbp_1c6689e96dc992dc51a5d8676f67c8610cf5ad47
./scripts/setup-project.sh
npm run check:rls
```

### Python Session Start

```bash
# Find Python
py --version || python --version || python3 --version

# Use py launcher (preferred on Windows)
py -m venv venv
py -m pip install -r requirements.txt
```

### This Project Development

```bash
npm run dev              # Start development
npm run type-check       # Check types
npm test                 # Run tests
npm run build            # Build for production
npm run check:rls        # Verify security
```

---

## 🛠️ TOOLS INSTALLED

### Chrome DevTools MCP
- **Installed:** 2025-01-15
- **Location:** `C:\Users\mqc20\.claude.json`
- **Command:** `npx chrome-devtools-mcp@latest`
- **Purpose:** Control Chrome browser for mobile testing, screenshots, debugging
- **Status:** ✅ Installed, requires Claude Code restart to activate

### Wispr Flow (Voice Input)
- **Installed:** 2025-01-15
- **Platform:** Windows
- **Purpose:** Voice dictation for Claude Code and all apps
- **Pricing:** Free trial (14 days), then $12-15/month or free plan (2,000 words/week)

---

## 📌 RECENT WORK COMPLETED

### Session 2025-11-15: Apple-Quality Design Overhaul

**Major Accomplishments:**

1. **Apple-Style Practice Screen Redesign (COMPLETE)** ✅
   - Removed 5+ buttons, kept only 2 (Need Practice, Got It)
   - Fixed header/footer prevent scrolling issues on mobile
   - Tap word card to speak (removed speaker button with misaligned icon)
   - Swipe left/right to navigate (removed prev/next buttons)
   - Settings icon for syllables (removed creepy eye emoji 👁️)
   - Ultra-thin 2px progress bar (iOS blue #007AFF)
   - SF Pro Display font family
   - 100dvh viewport height (fits all phones perfectly)
   - Files: `index.html`, `style.css`, `src/app.ts`, `src/components/ui.ts`

2. **Apple Polish on Home Page (COMPLETE)** ✅
   - SF Pro Display font with antialiasing
   - Refined letter-spacing (-1.5px title, -0.3px subtitles)
   - Softer Apple-style shadows (subtle, layered)
   - 12px border-radius consistency
   - Enhanced transitions (cubic-bezier easing)
   - Polished button interactions (smooth scale/lift)
   - Backdrop blur on sticky headers
   - **Kept:** All emojis, colors, purple gradient, functionality
   - Added 280 lines of Apple polish CSS

3. **Bug Fix: Tricky Word Count Mismatch** ✅
   - Issue: Button showed "(10)" but only 7 words appeared
   - Root cause: Counting and collection functions used different logic
   - Fix: Aligned both functions to use identical iteration
   - Files: `src/components/ui.ts`

**Current State:**
- App is fully deployed and working: https://tamborine996.github.io/reading-phonics-app/
- Design is indistinguishable from Apple product quality
- Mobile experience is perfect (no scrolling issues)
- All functionality intact (search, filters, tables, quick jump)

---

## 🔮 PENDING SUGGESTIONS

### Magic E Pattern Visibility

**User Question:** "Why is Magic E just in advanced patterns? It should be more prominent."

**Current State:**
- Magic E **IS** in dedicated packs (P49-P57 in "Long Vowels" section)
- Pattern filter is just a tool to filter across all packs
- Not immediately obvious where Magic E packs are located

**Potential Improvements:**
1. Add "Magic E Words" to Quick Jump menu as its own category
2. Rename "Long Vowels" to "Long Vowels & Magic E" for clarity
3. Create dedicated "Magic E" section separate from other long vowels
4. Add quick scroll buttons for OUGH, Soft C/G, PH patterns

**Advanced Patterns That Could Use Quick Access:**
- OUGH patterns (through, cough, bought - 4 different sounds!)
- Soft C (city, ice, circle)
- Soft G (giant, age, giraffe)
- PH digraph (phone, graph, elephant)
- Magic E (fundamental phonics concept)

---

## 🎨 DESIGN SYSTEM ESTABLISHED

### Apple Design Language

**Typography:**
- Font: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text'`
- Font smoothing: `antialiased` / `grayscale`
- Letter spacing: Tighter for premium feel (-0.2px to -1.5px)
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Colors (Apple Palette):**
- Blue: `#007AFF` (iOS blue)
- Orange: `#FF9500` (warning/tricky)
- Green: `#34C759` (success)
- Gray: `#8E8E93` (secondary text)
- Gray BG: `#F2F2F7` (backgrounds)

**Shadows (Soft & Layered):**
- Small: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Medium: `0 2px 12px rgba(0, 0, 0, 0.1)`
- Large: `0 8px 24px rgba(0, 0, 0, 0.12)`
- Colored: `0 2px 12px rgba(102, 126, 234, 0.3)` for purple buttons

**Border Radius:**
- Buttons: `12px`
- Cards: `16px` (14px on mobile)
- Inputs: `12px` (10px on mobile)
- Large cards: `20px`

**Transitions:**
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Apple's standard)
- Duration: `0.3s` for most, `0.2s` for quick interactions
- Hover: `translateY(-2px)` with enhanced shadow
- Active: `scale(0.97)` or `translateY(0)`

**Layout:**
- Practice screen: `100dvh` (dynamic viewport height)
- Fixed header: 56px height
- Fixed footer: 52px buttons (48px on mobile)
- Safe area insets: `env(safe-area-inset-bottom)` for iOS

---

## 📝 FILES MODIFIED IN SESSION

**HTML:**
- `index.html` - Apple-style practice screen structure

**CSS:**
- `style.css` - +680 lines total
  - +400 lines Apple practice screen CSS
  - +280 lines Apple polish for home page

**TypeScript:**
- `src/app.ts` - Tap-to-speak, swipe gestures, keyboard shortcuts
- `src/components/ui.ts` - Apple elements, fixed tricky word count bug
- `src/types/index.ts` - AppState updates
- `src/utils/syllables.ts` - Syllable formatting

---

**Last Updated:** 2025-11-15 20:52 UTC
**User:** mqc20
**Machine:** Windows (Downloads/Projects folder)
**Deployment:** Live at https://tamborine996.github.io/reading-phonics-app/
