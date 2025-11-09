# Claude Development Notes

## Quick Context for Future Sessions

**Project**: Reading Phonics App - TypeScript web app for teaching phonics to children
**Live URL**: https://tamborine996.github.io/reading-phonics-app/
**GitHub**: https://github.com/tamborine996/reading-phonics-app
**Last Major Update**: 2025-01-08

## Current Architecture (v2.0)

### Tech Stack
- **Frontend**: TypeScript + Vite + HTML/CSS
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Google OAuth via Supabase
- **Deployment**: GitHub Pages (auto-deploy via GitHub Actions)
- **TTS**: Web Speech API (browser native)
- **Testing**: Vitest
- **Linting**: ESLint

### Key Design Decisions

**Why TypeScript**: Type safety, better IDE support, catches errors at compile time
**Why Supabase**: Free tier, OAuth built-in, PostgreSQL, Row Level Security, real-time capabilities
**Why GitHub Pages**: Unlimited free deployments, no build minute limits (previous host: Netlify ran out of credits)
**Why Vite**: Fast development server, optimal production builds, modern tooling
**Why localStorage + Supabase**: Offline-first approach, works without auth, syncs when available

### Data Flow

```
User marks word
  ↓
Save to localStorage (immediate)
  ↓
If authenticated: Save to Supabase (real-time)
  ↓
Database sync complete
```

**Source of Truth**: `src/data/wordPacks.ts` (all 130 packs defined here)
**No Python scripts** - TypeScript file is the only source to edit
**No Excel files** - Legacy from original architecture, no longer used

## Project Structure

```
src/
├── components/
│   ├── auth.ts              # Auth UI, OAuth callbacks, sign in/out
│   └── ui.ts                # Pack lists, practice screen, completion screen
├── constants/
│   └── config.ts            # Supabase table names, constants
├── data/
│   └── wordPacks.ts         # SOURCE OF TRUTH - All 130 packs
├── services/
│   ├── auth.service.ts      # Authentication logic
│   ├── storage.service.ts   # LocalStorage management
│   └── supabase.service.ts  # Database operations
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   ├── helpers.ts           # Pack grouping, date formatting
│   ├── logger.ts            # Console logging with [INFO]/[WARN]/[ERROR]
│   ├── speech.ts            # Text-to-speech service
│   └── validation.ts        # Email validation
├── app.ts                   # Main entry point, event listeners
└── env.ts                   # Environment variable access
```

## Database Schema (Supabase)

### Table: `pack_progress`

| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | FK to auth.users(id) |
| pack_id | integer | Pack number (1-130) |
| words | jsonb | {"word": "tricky" \| "mastered"} |
| completed | boolean | Pack marked complete |
| last_reviewed | timestamp | Last practice date |
| synced_at | timestamp | Last sync time |

**Primary Key**: `(user_id, pack_id)`

### Row Level Security (RLS) Policies
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

Users can only access their own data.

## Authentication Flow

1. **First Visit**: Show auth screen
2. **Options**:
   - Sign in with Google (OAuth) → Cloud sync
   - Skip auth → LocalStorage only
3. **OAuth Flow**:
   - User clicks "Sign in with Google"
   - Redirect to Google
   - Google redirects to app with OAuth tokens in URL hash
   - Supabase auto-processes tokens (NO manual getSession())
   - User authenticated
   - Load database progress → Merge with local → Sync local to database
4. **Authenticated Use**:
   - Every word mark → Save to localStorage + Supabase
   - Progress syncs across all devices
5. **Sign Out**:
   - Clear local session
   - Data remains in database
   - Can sign in again to restore

**Critical OAuth Fix**: Let Supabase auto-process OAuth tokens. Don't call `getSession()` manually or it causes double-processing and 401 errors.

## Key Features

### 1. Word Packs (130 packs, 3,383 words)
- Organized by phonics patterns
- Year 1-6 curriculum coverage
- ~26 words per pack
- Grouped by sub-packs (Year 1, Year 2, Short Vowels, etc.)

### 2. Text-to-Speech
- Web Speech API
- Prefers British English (en-GB)
- Falls back to any English voice
- Speech rate: 0.9x (slower for learning)
- Click 🔊 speaker button

### 3. Progress Tracking
- **Local**: Immediate save to localStorage
- **Cloud**: Real-time save to Supabase (if authenticated)
- **Merge**: Database precedence when signing in
- **Tricky Words**: Three review modes (global, sub-pack, individual pack)

### 4. Parent Dashboard
- View all packs and progress percentages
- See tricky words by pack
- Last reviewed dates
- Completion status

## Deployment Pipeline

### GitHub Actions Workflow
File: `.github/workflows/deploy.yml`

Triggered on push to `master`:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (with caching via package-lock.json)
4. Build project with environment variables from GitHub Secrets
5. Deploy to GitHub Pages

**Environment Variables** (stored in GitHub Secrets):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Deploy Time**: ~30-40 seconds from push to live

### Supabase Configuration
**Important**: Supabase Site URL must match deployment URL:
- Current: `https://tamborine996.github.io/reading-phonics-app/`
- OAuth redirects to this URL
- Mismatch causes 404/500 errors

## Common Development Tasks

### Adding New Word Pack
1. Edit `src/data/wordPacks.ts`
2. Add new pack object with id, category, subPack, words
3. Test locally: `npm run dev`
4. Type check: `npm run type-check`
5. Commit and push → Auto-deploys

### Adding New Feature
1. Create files in appropriate `src/` directory
2. Follow existing TypeScript patterns
3. Add tests in `*.test.ts` files
4. Update types in `src/types/index.ts` if needed
5. Test, type-check, commit, push

### Debugging
- Check browser console for `[INFO]`, `[WARN]`, `[ERROR]` logs
- All major operations are logged
- Supabase errors logged with full context
- OAuth flow extensively logged

## Historical Context

### Evolution of Architecture

**v1.0 (Nov 2025)**: Simple JavaScript + Netlify
- Plain JavaScript (app.js)
- LocalStorage only
- 4 packs deployed
- Python scripts to manage Excel ↔ JSON
- Netlify deployment

**v2.0 (Dec 2025 - Jan 2026)**: TypeScript + Supabase + GitHub Pages
- Complete TypeScript rewrite
- Modular architecture
- Supabase integration
- Google OAuth
- All 130 packs
- Text-to-speech
- GitHub Pages (unlimited deployments)
- Removed Python/Excel dependency

### Why Migration from Netlify to GitHub Pages
- Netlify: 300 build minutes/month limit (ran out in one day)
- GitHub Pages: Unlimited deployments
- Both are free, but GitHub Pages has no build limits
- Migration successful, OAuth working, faster deploys

### Key Problems Solved

**Problem**: OAuth 401 errors after Google sign-in
**Solution**: Stop calling `getSession()` manually, let Supabase auto-process tokens

**Problem**: Purple screen after OAuth (all screens hidden)
**Solution**: Explicitly call `showScreen('homeScreen')` after OAuth callback

**Problem**: Tricky word counts not updating
**Solution**: Re-render pack list when clicking Back/Home buttons

**Problem**: Unmarking tricky words not syncing to database
**Solution**: Call `syncLocalProgressToDatabase()` immediately after marking any word

**Problem**: Supabase upsert 409 Conflict errors
**Solution**: Add `onConflict: 'user_id,pack_id'` parameter to upsert

**Problem**: Sheraz Bhai test page (removed)
**Solution**: Created and then removed test page for user's cousin - cleaned up in final state

## Testing Strategy

### Unit Tests (Vitest)
- Service logic tests
- Helper function tests
- Validation tests

### Manual Testing Checklist
- [ ] All 130 packs load
- [ ] Words mark as tricky/mastered
- [ ] Progress persists after reload
- [ ] TTS works (speaker button)
- [ ] OAuth flow completes successfully
- [ ] Progress syncs to Supabase
- [ ] Tricky review shows correct words
- [ ] Parent view shows all data
- [ ] Mobile/tablet responsive
- [ ] Cross-browser compatible

## User Preferences & Feedback

### What User Values
- **NOT interested in localStorage** - wants cloud sync as primary
- **Wants unlimited deployments** - moved from Netlify to GitHub Pages
- **Real-time sync** - implemented immediate Supabase sync on every word mark
- **Simple workflow** - removed Python scripts, Excel files
- **Child-friendly design** - large text, simple buttons, purple theme

## Future Enhancement Ideas

### Requested/Discussed
- Progress export to PDF/CSV
- Custom user-created packs
- Multiple child profiles
- Achievement badges
- Spelling tests
- Dark mode

### Technical Improvements
- Service worker for offline support
- PWA (installable app)
- Better error boundaries
- Loading states

## Important Files for Claude

When starting a new session, read these files to understand the project:
1. **README.md** - Comprehensive documentation
2. **QUICK_START.md** - Quick reference
3. **This file (CLAUDE_NOTES.md)** - Technical context
4. **src/data/wordPacks.ts** - Data structure
5. **src/app.ts** - Main application flow
6. **src/types/index.ts** - Type definitions

## Common Gotchas

1. **Environment Variables**: Must be in GitHub Secrets for deployment
2. **OAuth Redirect URL**: Must match Supabase Site URL exactly
3. **Base Path**: Vite config has `base: '/reading-phonics-app/'` for GitHub Pages
4. **Hard Refresh**: Users need Ctrl+Shift+R after deployment to bypass cache
5. **Snake Case vs Camel Case**: Database uses snake_case, TypeScript uses camelCase - map carefully
6. **Double OAuth Processing**: NEVER call `getSession()` manually, Supabase does it automatically

## Session Summary Template

When wrapping up a session, document:
- What was built/fixed
- Files modified
- Deployment status
- Testing completed
- Known issues (if any)
- Next steps

---

**Last Updated**: 2025-01-08
**Version**: 2.0
**Status**: Production-ready, all features working
**Next Session**: Pick from Future Enhancement Ideas or user requests
