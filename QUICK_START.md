# Quick Start Guide

## Current Project Status (2025-01-08)

###  Live App
- **URL**: https://tamborine996.github.io/reading-phonics-app/
- **Hosting**: GitHub Pages (unlimited free deployments)
- **All 130 packs** deployed and working
- **Features**: Text-to-speech, cloud sync, OAuth, progress tracking

## For Users (Parents/Children)

### Using the App
1. Visit https://tamborine996.github.io/reading-phonics-app/
2. Choose: Sign in with Google (syncs progress) OR Skip (local-only)
3. Select a word pack to practice
4. Read words, mark as "Tricky" or "Got it!"
5. Click 🔊 speaker button to hear word pronounced
6. Review tricky words anytime
7. Check "Parent View" to see progress

### Features
- ✅ 130 word packs (3,383 words total)
- ✅ Cloud sync across devices (when signed in)
- ✅ Text-to-speech (British English)
- ✅ Progress tracking
- ✅ Works on phone, tablet, desktop

## For Developers

### Getting Started
```bash
# Clone and install
git clone https://github.com/tamborine996/reading-phonics-app.git
cd reading-phonics-app
npm install

# Create .env file
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Run locally
npm run dev  # Opens at localhost:3000
```

### Making Changes

**To edit word packs:**
1. Edit `src/data/wordPacks.ts` (this is the source of truth)
2. Test locally: `npm run dev`
3. Run checks: `npm run type-check && npm run test:run`
4. Commit and push
5. GitHub Actions auto-deploys in ~30-40 seconds

**To add features:**
1. Follow TypeScript patterns in `src/`
2. Add tests in `*.test.ts` files
3. Update documentation
4. Commit, push, auto-deploy

### Key Commands
```bash
npm run dev          # Development server
npm test             # Run tests (watch mode)
npm run test:run     # Run tests once
npm run type-check   # TypeScript validation
npm run build        # Production build
```

### Project Structure
```
src/
├── data/wordPacks.ts       # ← Source of truth for all word data
├── components/             # UI rendering
├── services/               # Business logic (auth, storage, database)
├── utils/                  # Helpers, logging, speech
└── app.ts                  # Main entry point
```

## Tech Stack Summary

- **Frontend**: TypeScript + Vite + HTML/CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Google OAuth via Supabase
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **TTS**: Web Speech API

## Important Notes

### Data Source of Truth
**File**: `src/data/wordPacks.ts`

This TypeScript file contains all 130 packs. There are no Python scripts or Excel files to maintain anymore. Just edit this file, test, and push.

### Environment Variables
Stored in GitHub Secrets for deployment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

For local development, create `.env` file in root.

### Deployment
- Push to `master` branch → GitHub Actions builds → Deploys to GitHub Pages
- Takes 30-40 seconds
- Hard refresh browser (Ctrl+Shift+R) after deployment

## Next Steps / Ideas

**Potential Features**:
- [ ] Progress export (PDF/CSV)
- [ ] Custom user-created packs
- [ ] Multiple child profiles
- [ ] Achievement badges
- [ ] Word shuffle mode
- [ ] Spelling tests
- [ ] Dark mode
- [ ] PWA (installable app)

## Need Help?

1. Check **README.md** - Full documentation
2. Check **CLAUDE_NOTES.md** - Technical deep-dive
3. Check browser console for errors ([INFO]/[WARN]/[ERROR] logs)
4. GitHub Issues: https://github.com/tamborine996/reading-phonics-app/issues

---

**Last Updated**: 2025-01-08
**Version**: 2.0 (TypeScript + Supabase + GitHub Pages)
