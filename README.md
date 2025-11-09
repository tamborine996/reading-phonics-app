# Reading Phonics App

## 🚨 CRITICAL SECURITY NOTICE

**⚠️ ROW LEVEL SECURITY (RLS) MUST BE ENABLED BEFORE USE ⚠️**

If you're deploying this app with Supabase, **RLS policies must be enabled** or all users will see each other's progress data.

**Action Required:**
1. Read `SECURITY_FIX.md` immediately
2. Run the SQL commands in your Supabase SQL Editor
3. Verify with: `npm run check:rls`

**Status Check:**
- Run `npm run check:rls` to verify RLS is enabled
- All tests should pass before allowing users to sign in

---

## Overview
A modern, child-friendly web application for practicing phonics words with cloud sync capabilities. The app features 130 word packs containing 3,383 unique words organized by phonics patterns, covering Year 1 through Year 6 curriculum.

## Live Application
- **URL**: https://tamborine996.github.io/reading-phonics-app/
- **GitHub**: https://github.com/tamborine996/reading-phonics-app
- **Hosting**: GitHub Pages (unlimited free deployments)
- **Auto-Deploy**: GitHub Actions workflow (deploys in ~30-40 seconds)

## Features

### Core Functionality
- ✅ **130 Complete Word Packs** - All phonics patterns from Year 1-6
- ✅ **Text-to-Speech** - Click 🔊 to hear words pronounced (British English voice)
- ✅ **Cloud Sync with Supabase** - Progress syncs across all devices
- ✅ **Google OAuth Authentication** - Secure sign-in
- ✅ **Real-time Progress Tracking** - Immediate database synchronization
- ✅ **Tricky Word Review** - Practice words marked as difficult
- ✅ **Parent Dashboard** - View child's progress and tricky words
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Offline Capable** - Can work without internet (localStorage fallback)

### User Experience
- **Large, Clear Word Display** - Easy for children to read
- **Simple Two-Button Interface** - "Tricky" or "Got it!"
- **Visual Progress Tracking** - See completion percentages
- **Pack Filtering** - Organized by sub-packs (Year 1, Year 2, etc.)
- **Review Modes** - Review all tricky words, by sub-pack, or by individual pack
- **Child-Friendly Design** - Purple gradient, smooth animations

## Tech Stack

### Frontend
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **HTML5/CSS3** - Semantic markup and modern styling
- **Web Speech API** - Text-to-speech functionality

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, real-time sync
- **Row Level Security** - User data isolation
- **Google OAuth** - Secure authentication flow

### Development Tools
- **Vitest** - Unit testing framework
- **ESLint** - Code quality and consistency
- **Git** - Version control
- **GitHub Actions** - CI/CD pipeline

## Project Structure

```
reading-phonics-app/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment
├── src/
│   ├── components/
│   │   ├── auth.ts             # Authentication UI and handlers
│   │   └── ui.ts               # Main UI rendering functions
│   ├── constants/
│   │   └── config.ts           # Supabase configuration
│   ├── data/
│   │   └── wordPacks.ts        # All 130 word packs (SOURCE OF TRUTH)
│   ├── services/
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── storage.service.ts  # LocalStorage management
│   │   └── supabase.service.ts # Supabase database operations
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   ├── helpers.ts          # Utility functions
│   │   ├── logger.ts           # Logging utility
│   │   ├── speech.ts           # Text-to-speech service
│   │   └── validation.ts       # Input validation
│   ├── app.ts                  # Main application entry point
│   └── env.ts                  # Environment variables
├── public/
│   └── (static assets)
├── index.html                  # Main HTML file
├── style.css                   # Global styles
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── .env                       # Environment variables (not committed)
```

## Getting Started

### Prerequisites
```bash
# Node.js 18+ required
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tamborine996/reading-phonics-app.git
   cd reading-phonics-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   # Opens at http://localhost:3000
   ```

### Build for Production
```bash
npm run build
# Output in dist/ directory
```

### Run Tests
```bash
npm test          # Watch mode
npm run test:run  # Run once
```

### Type Checking
```bash
npm run type-check
```

## Deployment

### Automatic Deployment (Current Setup)
1. Push to `master` branch
2. GitHub Actions workflow triggers automatically
3. Vite builds the project with environment variables from GitHub Secrets
4. Deploys to GitHub Pages
5. Live in ~30-40 seconds at https://tamborine996.github.io/reading-phonics-app/

### Manual Deployment
```bash
# Build the project
npm run build

# The dist/ folder can be deployed to any static host:
# - GitHub Pages
# - Netlify
# - Vercel
# - AWS S3
# - etc.
```

## Database Schema (Supabase)

### Tables

#### `pack_progress`
Stores user progress for each word pack.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | uuid | References auth.users(id) |
| `pack_id` | integer | Word pack identifier (1-130) |
| `words` | jsonb | Word statuses: {"word": "tricky" or "mastered"} |
| `completed` | boolean | Whether pack is marked complete |
| `last_reviewed` | timestamp | Last time pack was practiced |
| `synced_at` | timestamp | Last sync time |

**Primary Key**: `(user_id, pack_id)`

### Row Level Security Policies
- Users can only read/write their own progress
- INSERT/UPDATE/DELETE restricted to authenticated users
- SELECT restricted to user's own records

## Data Management

### Word Packs - Source of Truth

**File**: `src/data/wordPacks.ts`

This TypeScript file contains all 130 word packs and is the single source of truth for word data.

```typescript
export const wordPacks: WordPack[] = [
  {
    id: 1,
    category: "Year 1 High Frequency Words - Pack 1",
    subPack: "Year 1 - High Frequency Words",
    words: ["the", "and", "a", "to", ...]
  },
  // ... 129 more packs
];
```

### Making Changes to Word Packs

1. **Edit** `src/data/wordPacks.ts`
2. **Test** locally with `npm run dev`
3. **Type Check** with `npm run type-check`
4. **Run Tests** with `npm test`
5. **Commit** changes
6. **Push** to GitHub - auto-deploys

**Note**: There are no Python scripts or Excel files to maintain. The TypeScript file is the only source of truth.

## Word Pack Organization

### Total Coverage
- **130 Packs**
- **3,383 Unique Words**
- **~26 words per pack** (range: 10-35)

### Categories by Sub-Pack

1. **Year 1 - High Frequency Words** (4 packs)
   - Pack 1-4: Essential sight words

2. **Year 2-6 - Common Exception Words** (11 packs)
   - Pack 5-15: Exception words by year level

3. **Short Vowels** (13 packs)
   - Pack 16-28: a, e, i, o, u patterns

4. **Consonant Blends** (8 packs)
   - Pack 29-36: L-blends, R-blends, S-blends, 3-letter blends

5. **Digraphs** (12 packs)
   - Pack 37-48: ch, sh, th, wh, ph patterns

6. **Long Vowels & Vowel Teams** (19 packs)
   - Pack 49-67: a-e, ai, ay, ee, ea, oa, ow, ue, ew, etc.

7. **R-Controlled Vowels** (15 packs)
   - Pack 68-82: ar, or, er, ir, ur patterns

8. **Advanced Patterns** (48 packs)
   - Pack 83-130: ough, augh, silent letters, soft c/g, etc.

## Authentication Flow

### First Visit (Unauthenticated)
1. User sees auth screen
2. Options:
   - Sign in with Google (OAuth)
   - Continue without signing in (localStorage only)

### Google OAuth Flow
1. Click "Sign in with Google"
2. Redirect to Google authentication
3. Google redirects back with OAuth tokens
4. Supabase processes tokens automatically
5. User authenticated → progress syncs to database

### Authenticated Experience
- Progress saves to Supabase in real-time
- Data syncs across all devices
- LocalStorage used as fallback/cache

### Sign Out
- User data remains in database
- LocalStorage cleared on device
- Can sign back in anytime to restore progress

## Features in Detail

### Text-to-Speech
- Uses browser's Web Speech API
- Prefers British English voice (en-GB)
- Falls back to any English voice if unavailable
- Speech rate: 0.9x (slightly slower for learning)
- Click 🔊 button to hear word

### Progress Tracking
- **Local**: Saves to browser localStorage immediately
- **Cloud**: Syncs to Supabase on every word mark (if authenticated)
- **Merge Strategy**: Database takes precedence when signing in

### Tricky Word Review
Three review modes:
1. **Global Review**: All tricky words across all packs
2. **Sub-Pack Review**: Tricky words within a sub-pack (e.g., "Year 1")
3. **Pack Review**: Tricky words within a single pack

### Parent Dashboard
- View all packs with progress
- See tricky words by pack
- Last reviewed timestamps
- Completion percentages

## Development Workflow

### Daily Development
```bash
# Start dev server
npm run dev

# Run tests in watch mode
npm test

# Type check
npm run type-check
```

### Before Committing
```bash
# Run all checks
npm run type-check
npm run test:run
npm run build

# If all pass, commit and push
git add .
git commit -m "Descriptive message"
git push
```

### GitHub Actions Auto-Deploy
The `.github/workflows/deploy.yml` file handles:
1. Checkout code
2. Setup Node.js
3. Install dependencies with caching
4. Build with environment variables from secrets
5. Deploy to GitHub Pages

**Environment Variables** are stored in GitHub Secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- ES6+ JavaScript
- LocalStorage API
- Web Speech API (for text-to-speech)
- Flexbox and Grid CSS

### Graceful Degradation
- If Web Speech API unavailable, speaker button won't show
- If localStorage unavailable, warns user
- If Supabase unavailable, uses localStorage only

## Troubleshooting

### Common Issues

**Issue**: Changes not showing after deployment
**Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: OAuth redirect fails with 404
**Solution**: Check Supabase Site URL matches deployment URL

**Issue**: Progress not syncing
**Solution**: Check browser console for errors, verify Supabase credentials

**Issue**: Text-to-speech not working
**Solution**: Check browser compatibility, try different browser

**Issue**: Build fails in GitHub Actions
**Solution**: Verify GitHub Secrets are set correctly

### Debugging

Enable detailed logging by checking browser console:
- `[INFO]` - Normal operations
- `[WARN]` - Warnings (non-critical)
- `[ERROR]` - Errors (requires attention)

## Testing Checklist

Before showing to users:
- [ ] All 130 packs load correctly
- [ ] Can mark words as tricky/mastered
- [ ] Progress persists after page reload
- [ ] Text-to-speech works (click speaker button)
- [ ] Google sign-in flow works
- [ ] Progress syncs to Supabase when authenticated
- [ ] Tricky word review shows correct words
- [ ] Parent view displays all progress
- [ ] Works on mobile/tablet
- [ ] Works on different browsers

## Performance

### Bundle Size (Production)
- **Main JS**: ~150KB (gzipped)
- **CSS**: ~15KB (gzipped)
- **Total**: ~165KB + HTML

### Load Times
- **First Paint**: < 1s
- **Interactive**: < 1.5s
- **Full Load**: < 2s

### Optimizations
- Vite code splitting
- Tree shaking
- Minification
- Lazy loading of Supabase (only when configured)

## Security

### Data Protection
- User authentication via Supabase (OAuth 2.0)
- Row Level Security policies in database
- Environment variables for sensitive keys
- HTTPS only (enforced by GitHub Pages)

### Privacy
- No analytics or tracking
- No third-party scripts (except Supabase)
- User data stored only in Supabase (user-controlled)
- Can use app without authentication (local-only mode)

## Future Enhancements

### Planned Features
- [ ] Progress export to PDF/CSV
- [ ] Customizable packs (let users create their own)
- [ ] Multiple child profiles
- [ ] Achievement badges
- [ ] Word shuffle mode
- [ ] Audio recording (record child reading words)
- [ ] Spelling tests
- [ ] Dark mode

### Architecture Improvements
- [ ] Service worker for true offline support
- [ ] Progressive Web App (PWA) with install prompt
- [ ] Better error boundaries
- [ ] Improved loading states

## Contributing

This is a personal educational project. If continuing development:

1. Read this README fully
2. Check `CLAUDE_NOTES.md` for technical details
3. Review `QUICK_START.md` for quick reference
4. Follow the established patterns in codebase
5. Write tests for new features
6. Update documentation when making changes

## License

Personal/Educational use only.

## Contact

For questions or issues with the project, check:
- GitHub Issues: https://github.com/tamborine996/reading-phonics-app/issues
- This README
- CLAUDE_NOTES.md for technical deep-dive

---

**Last Updated**: 2025-01-08
**Version**: 2.0 (TypeScript + Supabase + GitHub Pages)
