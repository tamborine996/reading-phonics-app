# Changelog

All notable changes to the Reading Phonics App will be documented in this file.

## [2.1.0] - 2025-11-15

### 🎨 Major Design Overhaul - Apple Quality

#### Added - Practice Screen (Complete Redesign)
- **Apple-style UI** indistinguishable from iOS apps
- **Fixed header/footer** prevents scrolling issues on mobile
- **Ultra-thin progress bar** (2px, iOS blue #007AFF)
- **Tap-to-speak** - tap word card instead of speaker button
- **Swipe gestures** - swipe left/right to navigate words
- **Keyboard shortcuts** - Space/Enter = Got It, T = Tricky, Arrow keys = navigate
- **Settings icon** for syllable toggle (replaced bulky button)
- **100dvh viewport** - fits perfectly on all phones
- **SF Pro Display** font family with antialiasing

#### Changed - Practice Screen
- Reduced from 7+ buttons to just 2 (Need Practice, Got It)
- Removed speaker button (misaligned icon issue)
- Removed prev/next buttons (swipe instead)
- Removed creepy eye emoji 👁️ (clean settings icon)
- Removed syllable toggle button (settings icon in header)
- Changed button text: "Tricky" → "Need Practice"

#### Added - Home Page (Light Polish)
- **SF Pro Display** font with -webkit-font-smoothing
- **Refined letter-spacing** (-1.5px titles, -0.3px subtitles, -0.2px inputs)
- **Apple-style shadows** (soft, layered, subtle)
- **Consistent border-radius** (12-16px across all elements)
- **Enhanced transitions** (cubic-bezier easing)
- **Polished interactions** (smooth lift on hover, scale on press)
- **Backdrop blur** on sticky section headers
- **+280 lines** of Apple polish CSS

#### Fixed
- **Tricky word count bug** - Button showed "(10)" but only 7 words appeared
  - Root cause: `countGlobalTrickyWords` and `getTrickyWords` used different logic
  - Solution: Aligned both functions to use identical iteration
  - File: `src/components/ui.ts`

#### Design System Established
- **Typography**: SF Pro Display, refined weights and spacing
- **Colors**: iOS palette (Blue #007AFF, Orange #FF9500, Green #34C759)
- **Shadows**: Layered, subtle, Apple-quality
- **Transitions**: cubic-bezier(0.4, 0, 0.2, 1) timing
- **Layout**: Fixed header/footer, safe-area-insets

### Technical Details

**Files Modified:**
- `index.html` - Apple-style practice screen structure
- `style.css` - +680 lines (400 practice, 280 polish)
- `src/app.ts` - Tap-to-speak, swipe gestures, keyboard shortcuts
- `src/components/ui.ts` - Apple elements, count bug fix
- `src/types/index.ts` - AppState updates
- `src/utils/syllables.ts` - Syllable formatting
- `.claude/PROJECT_CONTEXT.md` - Session documentation

**Commits:**
- `deb7440` - Redesign practice screen with Apple-level quality
- `4953239` - Apply Apple-quality polish to home page
- `4e96b4c` - Fix tricky word count mismatch bug
- `b121d91` - Update PROJECT_CONTEXT.md

**Deployment:**
- Live at: https://tamborine996.github.io/reading-phonics-app/
- Auto-deployed via GitHub Pages
- All changes verified on mobile

---

## [2.0.0] - Previous Session

### Added
- RLS security enabled on Supabase
- Syllable support with CMU dictionary
- Mobile responsiveness improvements
- Elite navigation features (sticky headers, quick jump menu)

---

## Future Considerations

### Pending Suggestions
1. **Magic E Visibility** - Make Magic E packs more discoverable
   - Currently in "Long Vowels" section (P49-P57)
   - Consider: Quick Jump category, rename section, or dedicated section

2. **Advanced Pattern Quick Access**
   - OUGH patterns (4 different sounds)
   - Soft C/G patterns
   - PH digraph patterns

### Design Principles
- Keep colorful, kid-friendly personality (emojis, purple gradient)
- Maintain Apple-quality polish (typography, shadows, spacing)
- Mobile-first approach (100dvh, fixed header/footer)
- Accessibility (large touch targets, readable text)
