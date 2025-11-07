# Word Practice Web App

## Overview
A simple, child-friendly web app for practicing phonics words. Currently includes the first 4 word packs (100 Year 1 high-frequency words).

## Features

### For Children
- **Large, clear word display** - Easy to read
- **Simple interactions** - Just two big buttons
  - "Got it!" - I know this word
  - "Tricky" - This word is hard
- **Visual progress tracking** - See how many words completed
- **Review mode** - Practice tricky words again
- **Colorful, engaging design** - Purple gradient background, animations

### For Parents
- **Parent Dashboard** - View your child's progress
- **Track difficult words** - See which words need more practice
- **Progress overview** - How many words reviewed/mastered per pack

## How to Use

### Opening the App
1. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari)
2. The app works completely offline - no internet needed!

### Practice Flow
1. **Select a pack** from the home screen
2. **Read the word** displayed
3. Click **"Got it!"** if you know the word, or **"Tricky"** if it's hard
4. The app automatically moves to the next word
5. Navigate back/forward using arrow buttons if needed
6. At the end, see your results and review tricky words

### Parent View
- Click "👨‍👩‍👧 Parent View" on home screen
- See all packs and progress
- View which words are marked as tricky
- All data is saved automatically in the browser

## Files

- `index.html` - Main web app
- `style.css` - Styling and design
- `app.js` - App logic and functionality
- `word_packs.json` - Word data (first 4 packs)

## Technical Details

### Data Storage
- Progress saved in browser's localStorage
- Persists between sessions
- No server or database needed

### Browser Compatibility
- Works on all modern browsers
- Mobile-friendly responsive design
- Touch-friendly for tablets

## Expanding to All Packs

To add all 130 packs, simply:
1. Run the Python script to extract all packs to JSON
2. Replace `word_packs.json` with the full data
3. No code changes needed - app handles any number of packs

## Design Principles Applied

Based on educational app research:
- ✅ Simple, focused interface (one word at a time)
- ✅ Large, tappable buttons for children
- ✅ Visual progress tracking
- ✅ Short session design (8-12 min attention span)
- ✅ Parent involvement features
- ✅ Gamification with visual feedback
- ✅ Clean, uncluttered design
- ✅ Offline functionality
