/**
 * Main application entry point
 */

import { wordPacks } from '@/data/wordPacks';
import { storageService } from '@/services/storage.service';
import { authService } from '@/services/auth.service';
import { logger } from '@/utils/logger';
import type { WordPack, PracticeSession } from '@/types';
import {
  renderSubPackList,
  renderPracticeScreen,
  renderCompleteScreen,
  showScreen,
} from '@/components/ui';
import { renderParentView } from '@/components/ui';
import {
  initAuthUI,
  showInitialScreen,
  handleOAuthCallback,
  updateUserBar,
} from '@/components/auth';

/**
 * Application state
 */
export class AppState {
  currentPack: WordPack | null = null;
  currentWordIndex = 0;
  reviewMode = false;
  reviewWords: Array<{ word: string; packId: number; wordIndex: number }> = [];
  currentSession: PracticeSession | null = null;
  showSyllablesForCurrentWord = false;

  reset() {
    this.currentPack = null;
    this.currentWordIndex = 0;
    this.reviewMode = false;
    this.reviewWords = [];
    this.currentSession = null;
    this.showSyllablesForCurrentWord = false;
  }
}

export const appState = new AppState();

/**
 * Initialize application
 */
export async function init(): Promise<void> {
  try {
    logger.info('Initializing application');

    // Initialize settings
    const { settingsService } = await import('@/services/settings.service');
    settingsService.initialize();
    logger.info('Settings service initialized');

    // Initialize text-to-speech
    const { speechService } = await import('@/utils/speech');
    speechService.initialize();
    logger.info('Speech service initialized');

    // Initialize Supabase if configured
    const { env, isSupabaseConfigured } = await import('@/env');
    if (isSupabaseConfigured()) {
      const { supabaseService } = await import('@/services/supabase.service');
      await supabaseService.initialize(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);
      logger.info('Supabase initialized successfully');
    }

    // Handle OAuth callback if returning from Google
    const isOAuthCallback = await handleOAuthCallback();

    // Initialize auth if Supabase is configured
    await authService.initialize();

    // Set up event listeners
    await setupEventListeners();
    initAuthUI();

    // Show appropriate screen
    if (isOAuthCallback) {
      // After OAuth, show home screen
      showScreen('homeScreen');
    } else {
      // Normal flow - show auth or home based on state
      showInitialScreen();
    }

    // Render home screen content (will be shown if authenticated or skipped)
    renderSubPackList(wordPacks);

    // Update user bar if authenticated
    updateUserBar();

    // Listen for auth skip event
    window.addEventListener('auth-skipped', () => {
      renderSubPackList(wordPacks);
    });

    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application', error);
    alert('Failed to start the application. Please refresh the page.');
  }
}

/**
 * Setup event listeners
 */
async function setupEventListeners(): Promise<void> {
  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.onclick = () => {
      appState.reset();
      showScreen('homeScreen');
      renderSubPackList(wordPacks); // Refresh pack list to show updated tricky counts
    };
  }

  // Navigation buttons
  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) {
    prevBtn.onclick = () => navigateWord(-1);
  }

  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.onclick = () => navigateWord(1);
  }

  // Word marking buttons
  const trickyBtn = document.getElementById('trickyBtn');
  if (trickyBtn) {
    trickyBtn.onclick = () => markWord('tricky');
  }

  const gotItBtn = document.getElementById('gotItBtn');
  if (gotItBtn) {
    gotItBtn.onclick = () => markWord('mastered');
  }

  // Home button
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) {
    homeBtn.onclick = () => {
      appState.reset();
      showScreen('homeScreen');
      renderSubPackList(wordPacks); // Refresh pack list to show updated tricky counts
    };
  }

  // Parent button
  const parentBtn = document.getElementById('parentBtn');
  if (parentBtn) {
    parentBtn.onclick = () => renderParentView(wordPacks);
  }

  // Parent view back button
  const parentBackBtn = document.getElementById('parentBackBtn');
  if (parentBackBtn) {
    parentBackBtn.onclick = () => showScreen('homeScreen');
  }

  // Syllable toggle button (card-level)
  const syllableToggleBtn = document.getElementById('syllableToggleBtn');
  if (syllableToggleBtn) {
    syllableToggleBtn.onclick = () => toggleSyllablesForSession();
  }

  // Word search
  const searchInput = document.getElementById('wordSearch') as HTMLInputElement;
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (searchInput) {
    searchInput.oninput = () => handleSearch(searchInput.value);
  }

  if (searchClearBtn) {
    searchClearBtn.onclick = () => {
      if (searchInput) {
        searchInput.value = '';
        handleSearch('');
      }
    };
  }

  // Pattern filter
  const patternFilterToggle = document.getElementById('patternFilterToggle');
  const patternFilterDropdown = document.getElementById('patternFilterDropdown');
  const clearFilterBtn = document.getElementById('clearFilterBtn');

  if (patternFilterToggle && patternFilterDropdown) {
    patternFilterToggle.onclick = () => {
      const isVisible = patternFilterDropdown.style.display === 'block';
      patternFilterDropdown.style.display = isVisible ? 'none' : 'block';
      patternFilterToggle.classList.toggle('active');
    };
  }

  // Pattern buttons
  document.querySelectorAll('.pattern-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pattern = btn.getAttribute('data-pattern');
      if (pattern) {
        handlePatternFilter(pattern);
        btn.classList.toggle('active');
      }
    });
  });

  if (clearFilterBtn) {
    clearFilterBtn.onclick = () => {
      document.querySelectorAll('.pattern-btn').forEach((btn) => btn.classList.remove('active'));
      renderSubPackList(wordPacks);
      if (patternFilterDropdown) {
        patternFilterDropdown.style.display = 'none';
      }
      if (patternFilterToggle) {
        patternFilterToggle.classList.remove('active');
      }
    };
  }

  // Quick Review button
  const quickReviewBtn = document.getElementById('quickReviewBtn');
  if (quickReviewBtn) {
    quickReviewBtn.onclick = () => startQuickReview();
  }

  logger.info('Event listeners set up successfully');
}

/**
 * Start practicing a pack
 */
export function startPack(packId: number): void {
  try {
    const pack = wordPacks.find((p) => p.id === packId);
    if (!pack) {
      logger.error(`Pack ${packId} not found`);
      alert('Pack not found');
      return;
    }

    appState.currentPack = pack;
    appState.currentWordIndex = 0;
    appState.reviewMode = false;
    appState.reviewWords = [];
    appState.showSyllablesForCurrentWord = false;

    logger.info(`Starting pack ${packId}`);
    showScreen('practiceScreen');
    renderPracticeScreen(appState);
  } catch (error) {
    logger.error(`Failed to start pack ${packId}`, error);
    alert('Failed to start pack');
  }
}

/**
 * Start tricky word review
 */
export function startTrickyReview(
  level: 'global' | 'subpack' | 'pack',
  filter?: string | number
): void {
  try {
    const trickyWords = getTrickyWords(level, filter);

    if (trickyWords.length === 0) {
      alert('No tricky words to review!');
      return;
    }

    appState.reviewMode = true;
    appState.reviewWords = trickyWords;
    appState.currentWordIndex = 0;

    // Create a virtual pack for review
    let title = 'All Tricky Words';
    if (level === 'subpack' && typeof filter === 'string') {
      title = `${filter} - Tricky Words`;
    } else if (level === 'pack' && typeof filter === 'number') {
      const pack = wordPacks.find((p) => p.id === filter);
      title = pack ? `${pack.category} - Tricky Words` : 'Tricky Words';
    }

    appState.currentPack = {
      id: typeof filter === 'number' ? filter : 0,
      category: title,
      subPack: '',
      words: trickyWords.map((w) => w.word),
    };

    logger.info(`Starting tricky review: ${level}`, { count: trickyWords.length });
    showScreen('practiceScreen');
    renderPracticeScreen(appState);
  } catch (error) {
    logger.error('Failed to start tricky review', error);
    alert('Failed to start tricky review');
  }
}

/**
 * Get tricky words at different levels
 */
function getTrickyWords(
  level: 'global' | 'subpack' | 'pack',
  filter?: string | number
): Array<{ word: string; packId: number; wordIndex: number }> {
  const trickyWords: Array<{ word: string; packId: number; wordIndex: number }> = [];

  wordPacks.forEach((pack) => {
    // Filter by level
    if (level === 'subpack' && pack.subPack !== filter) return;
    if (level === 'pack' && pack.id !== filter) return;

    const progress = storageService.getPackProgress(pack.id);
    if (!progress) return;

    pack.words.forEach((word, idx) => {
      if (progress.words[word] === 'tricky') {
        trickyWords.push({
          word,
          packId: pack.id,
          wordIndex: idx,
        });
      }
    });
  });

  return trickyWords;
}

/**
 * Navigate to next/previous word
 */
function navigateWord(direction: number): void {
  try {
    const words = appState.reviewMode
      ? appState.reviewWords.map((w) => w.word)
      : appState.currentPack?.words || [];

    appState.currentWordIndex = Math.max(
      0,
      Math.min(words.length - 1, appState.currentWordIndex + direction)
    );

    renderPracticeScreen(appState);
  } catch (error) {
    logger.error('Failed to navigate word', error);
  }
}

/**
 * Toggle syllable display for current practice session
 */
function toggleSyllablesForSession(): void {
  try {
    appState.showSyllablesForCurrentWord = !appState.showSyllablesForCurrentWord;
    renderPracticeScreen(appState);
    logger.info('Syllable display toggled', { enabled: appState.showSyllablesForCurrentWord });
  } catch (error) {
    logger.error('Failed to toggle syllables', error);
  }
}

/**
 * Mark current word as tricky or mastered
 */
function markWord(status: 'tricky' | 'mastered'): void {
  try {
    if (appState.reviewMode) {
      // Update the original pack's word
      const trickyWord = appState.reviewWords[appState.currentWordIndex];
      const pack = wordPacks.find((p) => p.id === trickyWord.packId);

      if (pack) {
        const word = pack.words[trickyWord.wordIndex];
        storageService.updateWordStatus(trickyWord.packId, word, status);
      }
    } else if (appState.currentPack) {
      const word = appState.currentPack.words[appState.currentWordIndex];
      storageService.updateWordStatus(appState.currentPack.id, word, status);
    }

    // Celebrate if mastered!
    if (status === 'mastered') {
      celebrate();
    }

    // Sync to Supabase if user is authenticated
    authService.syncLocalProgressToDatabase().catch((error) => {
      logger.error('Failed to sync progress after marking word', error);
    });

    // Move to next word or show completion
    const words = appState.reviewMode
      ? appState.reviewWords
      : appState.currentPack?.words || [];

    if (appState.currentWordIndex < words.length - 1) {
      navigateWord(1);
    } else {
      showCompletion();
    }
  } catch (error) {
    logger.error('Failed to mark word', error);
    alert('Failed to save progress');
  }
}

/**
 * Show completion screen
 */
function showCompletion(): void {
  try {
    const words = appState.reviewMode
      ? appState.reviewWords.map((w) => w.word)
      : appState.currentPack?.words || [];

    let trickyWords: string[] = [];

    if (appState.reviewMode) {
      trickyWords = appState.reviewWords
        .filter((tw) => {
          const progress = storageService.getPackProgress(tw.packId);
          const pack = wordPacks.find((p) => p.id === tw.packId);
          if (!progress || !pack) return false;
          const word = pack.words[tw.wordIndex];
          return progress.words[word] === 'tricky';
        })
        .map((w) => w.word);
    } else if (appState.currentPack) {
      const progress = storageService.getPackProgress(appState.currentPack.id);
      if (progress) {
        trickyWords = words.filter((word) => progress.words[word] === 'tricky');
      }

      // Mark pack as completed
      storageService.markPackCompleted(appState.currentPack.id);
    }

    showScreen('completeScreen');
    renderCompleteScreen(
      appState.reviewMode ? 'Review Complete!' : 'Pack Complete!',
      words.length,
      trickyWords
    );

    logger.info('Session completed', {
      totalWords: words.length,
      trickyWords: trickyWords.length,
    });
  } catch (error) {
    logger.error('Failed to show completion', error);
  }
}

/**
 * Handle word/pattern search
 */
function handleSearch(query: string): void {
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchResults = document.getElementById('searchResults');

  if (!searchResults) return;

  // Show/hide clear button
  if (searchClearBtn) {
    searchClearBtn.style.display = query.trim() ? 'flex' : 'none';
  }

  // If empty, hide results
  if (!query.trim()) {
    searchResults.style.display = 'none';
    return;
  }

  // Search for matches
  const results = searchWordPacks(query);

  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="search-results-header">No matches found for "${query}"</div>
      <p style="color: #666;">Try searching for a different word or pattern.</p>
    `;
    searchResults.style.display = 'block';
    return;
  }

  // Render results
  renderSearchResults(results, query);
}

/**
 * Search word packs for matching words or patterns
 */
function searchWordPacks(query: string): Array<{ pack: WordPack; matchingWords: string[] }> {
  const queryLower = query.toLowerCase().trim();
  const results: Array<{ pack: WordPack; matchingWords: string[] }> = [];

  wordPacks.forEach((pack) => {
    const matchingWords = pack.words.filter((word) =>
      word.toLowerCase().includes(queryLower)
    );

    if (matchingWords.length > 0) {
      results.push({ pack, matchingWords });
    }
  });

  // Sort by number of matches (descending)
  return results.sort((a, b) => b.matchingWords.length - a.matchingWords.length);
}

/**
 * Render search results
 */
function renderSearchResults(
  results: Array<{ pack: WordPack; matchingWords: string[] }>,
  query: string
): void {
  const searchResults = document.getElementById('searchResults');
  if (!searchResults) return;

  const totalMatches = results.reduce((sum, r) => sum + r.matchingWords.length, 0);

  let html = `
    <div class="search-results-header">
      Found ${totalMatches} word${totalMatches !== 1 ? 's' : ''} in ${results.length} pack${results.length !== 1 ? 's' : ''}
    </div>
  `;

  results.forEach(({ pack, matchingWords }) => {
    const cleanLabel = extractCleanLabel(pack.category);
    html += `
      <div class="search-result-pack">
        <div class="search-result-title">Pack ${pack.id}: ${cleanLabel}</div>
        <div class="search-result-matches">${matchingWords.length} match${matchingWords.length !== 1 ? 'es' : ''}</div>
        <div class="search-result-words">
          ${matchingWords.map((word) => `<span class="search-result-word">${highlightMatch(word, query)}</span>`).join('')}
        </div>
        <div class="search-result-actions">
          <button onclick="startPack(${pack.id})" class="action-btn practice">Practice This Pack</button>
        </div>
      </div>
    `;
  });

  searchResults.innerHTML = html;
  searchResults.style.display = 'block';
}

/**
 * Highlight matching text in search results
 */
function highlightMatch(word: string, query: string): string {
  const queryLower = query.toLowerCase();
  const wordLower = word.toLowerCase();
  const index = wordLower.indexOf(queryLower);

  if (index === -1) return word;

  const before = word.substring(0, index);
  const match = word.substring(index, index + query.length);
  const after = word.substring(index + query.length);

  return `${before}<span class="match-highlight">${match}</span>${after}`;
}

/**
 * Import helper function
 */
function extractCleanLabel(category: string): string {
  // Extract just the readable part without pack number
  const parts = category.split(':');
  if (parts.length > 1) {
    return parts[1].trim().replace(/^[0-9A-Z]+\.\s*/, '');
  }
  return category;
}

/**
 * Handle pattern filtering
 */
function handlePatternFilter(pattern: string): void {
  const filteredPacks = wordPacks.filter((pack) =>
    pack.patterns?.includes(pattern)
  );

  if (filteredPacks.length > 0) {
    renderSubPackList(filteredPacks);
    logger.info('Pattern filter applied', { pattern, count: filteredPacks.length });
  } else {
    alert(`No packs found with pattern: ${pattern}`);
  }
}

/**
 * Start Quick Review of last 3 tricky words
 */
function startQuickReview(): void {
  const recentTrickyWords = getRecentTrickyWords(3);

  if (recentTrickyWords.length === 0) {
    alert('No recent tricky words to review!');
    return;
  }

  appState.reviewMode = true;
  appState.reviewWords = recentTrickyWords;
  appState.currentWordIndex = 0;
  appState.currentPack = wordPacks.find((p) => p.id === recentTrickyWords[0].packId) || null;

  showScreen('practiceScreen');
  renderPracticeScreen(appState);

  logger.info('Quick Review started', { wordCount: recentTrickyWords.length });
}

/**
 * Get recent tricky words across all packs
 */
function getRecentTrickyWords(limit: number): Array<{ word: string; packId: number; wordIndex: number }> {
  const trickyWords: Array<{ word: string; packId: number; wordIndex: number; lastReviewed: string }> = [];

  wordPacks.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    if (!progress) return;

    pack.words.forEach((word, idx) => {
      if (progress.words[word] === 'tricky') {
        trickyWords.push({
          word,
          packId: pack.id,
          wordIndex: idx,
          lastReviewed: progress.lastReviewed || '',
        });
      }
    });
  });

  // Sort by most recently reviewed
  trickyWords.sort((a, b) => {
    if (!a.lastReviewed) return 1;
    if (!b.lastReviewed) return -1;
    return new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime();
  });

  return trickyWords.slice(0, limit).map(({ word, packId, wordIndex }) => ({ word, packId, wordIndex }));
}

/**
 * Trigger celebration animation
 */
function celebrate(): void {
  const wordEl = document.getElementById('currentWord');
  if (wordEl) {
    wordEl.classList.add('celebrate');
    setTimeout(() => wordEl.classList.remove('celebrate'), 600);
  }

  // Create confetti particles
  for (let i = 0; i < 30; i++) {
    createConfetti();
  }
}

/**
 * Create confetti particle
 */
function createConfetti(): void {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';

  const colors = ['#f5576c', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'];
  confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.left = Math.random() * 100 + 'vw';
  confetti.style.animationDelay = Math.random() * 0.5 + 's';
  confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

  document.body.appendChild(confetti);

  setTimeout(() => confetti.remove(), 4000);
}

// Make functions available globally for onclick handlers
declare global {
  interface Window {
    startPack: typeof startPack;
    startTrickyReview: typeof startTrickyReview;
  }
}

window.startPack = startPack;
window.startTrickyReview = startTrickyReview;

// Initialize on load
window.onload = () => init();








