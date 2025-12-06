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
  reviewWords: Array<{ word: string; packId: number | string; wordIndex: number }> = [];
  currentSession: PracticeSession | null = null;
  showSyllablesForCurrentWord = false;
  lastCompletedPackId?: number | string;
  filterTrickyOnly = false; // Filter to show only tricky words
  shuffledWords: string[] = []; // Store shuffled word order

  reset() {
    this.currentPack = null;
    this.currentWordIndex = 0;
    this.reviewMode = false;
    this.reviewWords = [];
    this.currentSession = null;
    this.showSyllablesForCurrentWord = false;
    this.filterTrickyOnly = false;
    this.shuffledWords = [];
    // Don't reset lastCompletedPackId - we want to keep it for "Do Again"
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

  // Do Again button
  const doAgainBtn = document.getElementById('doAgainBtn');
  if (doAgainBtn) {
    doAgainBtn.onclick = () => {
      const lastPackId = appState.lastCompletedPackId;
      if (lastPackId !== undefined) {
        startPack(lastPackId);
      } else {
        // Fallback to home if no pack ID stored
        appState.reset();
        showScreen('homeScreen');
        renderSubPackList(wordPacks);
      }
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

  // Star word button (for parent review)
  const starWordBtn = document.getElementById('starWordBtn');
  if (starWordBtn) {
    starWordBtn.onclick = () => toggleStarWord();
  }

  // Segmented control for filter
  const allWordsBtn = document.getElementById('allWordsBtn');
  const trickyWordsBtn = document.getElementById('trickyWordsBtn');

  if (allWordsBtn) {
    allWordsBtn.onclick = () => setFilter('all');
  }

  if (trickyWordsBtn) {
    trickyWordsBtn.onclick = () => setFilter('tricky');
  }

  // Shuffle button
  const shuffleBtn = document.getElementById('shuffleBtn');
  if (shuffleBtn) {
    shuffleBtn.onclick = () => shuffleWords();
  }

  // Skip back 2 button
  const skipBack2Btn = document.getElementById('skipBack2Btn');
  if (skipBack2Btn) {
    skipBack2Btn.onclick = () => skipBack2();
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

  // Elite Navigation Features
  setupEliteNavigation();

  logger.info('Event listeners set up successfully');
}

/**
 * Setup table sorting
 */
export function setupTableSorting(): void {
  const tables = document.querySelectorAll('.pack-table');

  tables.forEach((table) => {
    const headers = table.querySelectorAll('th.sortable');
    const tbody = table.querySelector('tbody');

    if (!tbody) return;

    headers.forEach((header, columnIndex) => {
      header.addEventListener('click', () => {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAscending = header.classList.contains('sort-asc');

        // Remove sort classes from all headers
        headers.forEach((h) => h.classList.remove('sort-asc', 'sort-desc'));

        // Toggle sort direction
        if (isAscending) {
          header.classList.add('sort-desc');
        } else {
          header.classList.add('sort-asc');
        }

        // Sort rows
        rows.sort((a, b) => {
          const cellA = a.querySelectorAll('td')[columnIndex];
          const cellB = b.querySelectorAll('td')[columnIndex];

          if (!cellA || !cellB) return 0;

          let valueA = cellA.textContent?.trim() || '';
          let valueB = cellB.textContent?.trim() || '';

          // Try to parse as numbers
          const numA = parseFloat(valueA);
          const numB = parseFloat(valueB);

          if (!isNaN(numA) && !isNaN(numB)) {
            return isAscending ? numB - numA : numA - numB;
          }

          // String comparison
          return isAscending
            ? valueB.localeCompare(valueA)
            : valueA.localeCompare(valueB);
        });

        // Re-append sorted rows
        rows.forEach((row) => tbody.appendChild(row));
      });
    });
  });
}

/**
 * Start practicing a pack
 */
export function startPack(packId: number | string): void {
  try {
    // Find pack in preset packs or custom packs
    let pack = wordPacks.find((p) => p.id === packId);

    if (!pack && typeof packId === 'string') {
      // Look in custom packs
      pack = storageService.getCustomPack(packId);
    }

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
    appState.filterTrickyOnly = false; // Reset filter
    appState.shuffledWords = []; // Reset shuffle

    logger.info(`Starting pack ${packId}`);
    showScreen('practiceScreen');
    renderPracticeScreen(appState);
    setupElitePracticeFeatures();
    updateSegmentedControl();
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
    setupElitePracticeFeatures();
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
): Array<{ word: string; packId: number | string; wordIndex: number }> {
  const trickyWords: Array<{ word: string; packId: number | string; wordIndex: number }> = [];

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
 * Start reviewing starred words (for parent review)
 */
export function startStarredReview(
  level: 'global' | 'subpack' | 'pack',
  filter?: string | number
): void {
  try {
    const starredWords = getStarredWords(level, filter);

    if (starredWords.length === 0) {
      alert('No starred words to review!');
      return;
    }

    appState.reviewMode = true;
    appState.reviewWords = starredWords;
    appState.currentWordIndex = 0;

    // Create a virtual pack for review
    let title = 'All Starred Words';
    if (level === 'subpack' && typeof filter === 'string') {
      title = `${filter} - Starred Words`;
    } else if (level === 'pack' && typeof filter === 'number') {
      const pack = wordPacks.find((p) => p.id === filter);
      title = pack ? `${pack.category} - Starred Words` : 'Starred Words';
    }

    appState.currentPack = {
      id: typeof filter === 'number' ? filter : 0,
      category: title,
      subPack: '',
      words: starredWords.map((w) => w.word),
    };

    logger.info(`Starting starred review: ${level}`, { count: starredWords.length });
    showScreen('practiceScreen');
    renderPracticeScreen(appState);
    setupElitePracticeFeatures();
  } catch (error) {
    logger.error('Failed to start starred review', error);
    alert('Failed to start starred review');
  }
}

/**
 * Get starred words at different levels
 */
function getStarredWords(
  level: 'global' | 'subpack' | 'pack',
  filter?: string | number
): Array<{ word: string; packId: number | string; wordIndex: number }> {
  const starredWords: Array<{ word: string; packId: number | string; wordIndex: number }> = [];

  wordPacks.forEach((pack) => {
    // Filter by level
    if (level === 'subpack' && pack.subPack !== filter) return;
    if (level === 'pack' && pack.id !== filter) return;

    const progress = storageService.getPackProgress(pack.id);
    if (!progress || !progress.starred) return;

    pack.words.forEach((word, idx) => {
      if (progress.starred![word] === 'starred') {
        starredWords.push({
          word,
          packId: pack.id,
          wordIndex: idx,
        });
      }
    });
  });

  return starredWords;
}

/**
 * Get current word list based on filters and shuffle state
 */
function getCurrentWordList(): string[] {
  if (appState.reviewMode) {
    return appState.reviewWords.map((w) => w.word);
  }

  if (!appState.currentPack) return [];

  // If shuffled, use shuffled list
  if (appState.shuffledWords.length > 0) {
    return appState.shuffledWords;
  }

  // If filtering to tricky only
  if (appState.filterTrickyOnly) {
    const progress = storageService.getPackProgress(appState.currentPack.id);
    if (progress) {
      return appState.currentPack.words.filter((word) => progress.words[word] === 'tricky');
    }
  }

  // Default: all words
  return appState.currentPack.words;
}

/**
 * Navigate to next/previous word
 */
function navigateWord(direction: number): void {
  try {
    const words = getCurrentWordList();

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
 * Set filter mode (all or tricky)
 */
function setFilter(mode: 'all' | 'tricky'): void {
  try {
    // Don't allow filtering in review mode
    if (appState.reviewMode) return;

    const shouldFilterTricky = mode === 'tricky';

    // Only update if actually changing
    if (appState.filterTrickyOnly === shouldFilterTricky) return;

    appState.filterTrickyOnly = shouldFilterTricky;
    appState.currentWordIndex = 0; // Reset to first word
    appState.shuffledWords = []; // Clear shuffle when changing filter

    updateSegmentedControl();
    renderPracticeScreen(appState);
    logger.info('Set filter mode', { mode });
  } catch (error) {
    logger.error('Failed to set filter', error);
  }
}

/**
 * Update segmented control appearance and counts
 */
function updateSegmentedControl(): void {
  const allBtn = document.getElementById('allWordsBtn');
  const trickyBtn = document.getElementById('trickyWordsBtn');

  if (!allBtn || !trickyBtn || !appState.currentPack) return;

  // Count total and tricky words
  const totalWords = appState.currentPack.words.length;
  const progress = storageService.getPackProgress(appState.currentPack.id);
  const trickyCount = progress
    ? appState.currentPack.words.filter((word) => progress.words[word] === 'tricky').length
    : 0;

  // Update counts
  const allCount = allBtn.querySelector('.count');
  const trickyCountEl = trickyBtn.querySelector('.count');

  if (allCount) allCount.textContent = totalWords.toString();
  if (trickyCountEl) trickyCountEl.textContent = trickyCount.toString();

  // Update active state
  if (appState.filterTrickyOnly) {
    allBtn.classList.remove('active');
    trickyBtn.classList.add('active');
  } else {
    allBtn.classList.add('active');
    trickyBtn.classList.remove('active');
  }
}

/**
 * Shuffle the current word list
 */
function shuffleWords(): void {
  try {
    if (!appState.currentPack) return;

    // Get the base word list (filtered or all)
    let baseWords: string[];
    if (appState.filterTrickyOnly) {
      const progress = storageService.getPackProgress(appState.currentPack.id);
      if (progress) {
        baseWords = appState.currentPack.words.filter((word) => progress.words[word] === 'tricky');
      } else {
        baseWords = appState.currentPack.words;
      }
    } else {
      baseWords = [...appState.currentPack.words];
    }

    // Fisher-Yates shuffle
    const shuffled = [...baseWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    appState.shuffledWords = shuffled;
    appState.currentWordIndex = 0; // Reset to first word

    renderPracticeScreen(appState);
    logger.info('Words shuffled', { count: shuffled.length });
  } catch (error) {
    logger.error('Failed to shuffle words', error);
  }
}

/**
 * Skip back 2 words with wraparound
 */
function skipBack2(): void {
  try {
    const words = getCurrentWordList();
    const totalWords = words.length;

    if (totalWords === 0) return;

    // Go back 2 with wraparound
    // If at index 1, go to totalWords - 1 (wraps to second-to-last)
    // If at index 0, go to totalWords - 2 (wraps to third-to-last)
    appState.currentWordIndex = (appState.currentWordIndex - 2 + totalWords) % totalWords;

    renderPracticeScreen(appState);
    logger.info('Skipped back 2 words', { newIndex: appState.currentWordIndex });
  } catch (error) {
    logger.error('Failed to skip back 2', error);
  }
}

/**
 * Toggle syllable display for current practice session
 */
function toggleSyllablesForSession(): void {
  try {
    appState.showSyllablesForCurrentWord = !appState.showSyllablesForCurrentWord;

    // Update button visual state
    const syllableToggleBtn = document.getElementById('syllableToggleBtn');
    if (syllableToggleBtn) {
      if (appState.showSyllablesForCurrentWord) {
        syllableToggleBtn.classList.add('syllables-active');
      } else {
        syllableToggleBtn.classList.remove('syllables-active');
      }
    }

    renderPracticeScreen(appState);
    logger.info('Syllable display toggled', { enabled: appState.showSyllablesForCurrentWord });
  } catch (error) {
    logger.error('Failed to toggle syllables', error);
  }
}

/**
 * Toggle star status for current word (for parent review)
 */
function toggleStarWord(): void {
  try {
    if (!appState.currentPack) return;

    const words = getCurrentWordList();
    const currentWord = words[appState.currentWordIndex];
    let packId = appState.currentPack.id;
    let wordToStar = currentWord;

    // If in review mode, get the actual pack ID and word
    if (appState.reviewMode) {
      const reviewWord = appState.reviewWords[appState.currentWordIndex];
      packId = reviewWord.packId;
      const pack = wordPacks.find((p) => p.id === reviewWord.packId);
      if (pack) {
        wordToStar = pack.words[reviewWord.wordIndex];
      }
    }

    // Toggle starred status
    const progress = storageService.getPackProgress(packId);
    const isCurrentlyStarred = progress?.starred?.[wordToStar] === 'starred';

    storageService.updateWordStatus(packId, wordToStar, isCurrentlyStarred ? 'unstarred' : 'starred', true);

    // Update star button visual
    const starBtn = document.getElementById('starWordBtn');
    if (starBtn) {
      if (isCurrentlyStarred) {
        starBtn.classList.remove('starred');
      } else {
        starBtn.classList.add('starred');
      }
    }

    // Sync to Supabase
    authService.syncLocalProgressToDatabase().catch((error) => {
      logger.error('Failed to sync starred word', error);
    });

    logger.info('Word star toggled', { word: wordToStar, starred: !isCurrentlyStarred });
  } catch (error) {
    logger.error('Failed to toggle star', error);
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

      // If word is mastered in review mode, remove it from review list
      if (status === 'mastered') {
        appState.reviewWords.splice(appState.currentWordIndex, 1);

        // Adjust index if we removed the last word or need to stay in bounds
        if (appState.currentWordIndex >= appState.reviewWords.length && appState.reviewWords.length > 0) {
          appState.currentWordIndex = appState.reviewWords.length - 1;
        }
      }
    } else if (appState.currentPack) {
      // Get the word from the current working list (filtered/shuffled/normal)
      const words = getCurrentWordList();
      const word = words[appState.currentWordIndex];
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
    const words = getCurrentWordList();

    if (appState.reviewWords.length === 0 && appState.reviewMode) {
      // All tricky words mastered!
      showCompletion();
    } else if (appState.reviewMode && status === 'mastered') {
      // In review mode, splicing already moved us to the next word
      // Just re-render at current index (don't navigate)
      renderPracticeScreen(appState);
    } else if (appState.currentWordIndex < words.length - 1) {
      navigateWord(1);
    } else {
      showCompletion();
    }

    // Update segmented control to reflect new tricky count
    updateSegmentedControl();
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
    const words = getCurrentWordList();

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
      // Sync completion to cloud
      authService.syncLocalProgressToDatabase();
      // Store the pack ID for "Do Again" functionality
      appState.lastCompletedPackId = appState.currentPack.id;
    }

    showScreen('completeScreen');
    renderCompleteScreen(
      appState.reviewMode ? 'Review Complete!' : 'Pack Complete!',
      words.length,
      trickyWords,
      appState.currentPack?.category
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
function getRecentTrickyWords(limit: number): Array<{ word: string; packId: number | string; wordIndex: number }> {
  const trickyWords: Array<{ word: string; packId: number | string; wordIndex: number; lastReviewed: string }> = [];

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

/**
 * Setup Elite Navigation Features
 */
function setupEliteNavigation(): void {
  const stickyHeader = document.getElementById('stickyHeader');
  const currentSectionName = document.getElementById('currentSectionName');
  const quickJumpBtn = document.getElementById('quickJumpBtn');
  const quickJumpOverlay = document.getElementById('quickJumpOverlay');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const categoryList = document.getElementById('categoryList');
  const backToTopBtn = document.getElementById('backToTopBtn');

  let currentSection = '';
  let ticking = false;

  // Populate category list
  function populateCategoryList(): void {
    if (!categoryList) return;

    const categories = new Map<string, number>();
    const subPackElements = document.querySelectorAll('.sub-pack');

    subPackElements.forEach((el) => {
      const heading = el.querySelector('h2');
      if (heading) {
        const sectionName = heading.textContent || '';
        const packCount = el.querySelectorAll('.pack-table tbody tr').length;
        categories.set(sectionName, packCount);
      }
    });

    categoryList.innerHTML = '';
    categories.forEach((count, name) => {
      const item = document.createElement('div');
      item.className = 'category-item';
      item.innerHTML = `
        <span class="category-name">${name}</span>
        <span class="category-count">${count} pack${count !== 1 ? 's' : ''}</span>
      `;
      item.onclick = () => {
        jumpToSection(name);
        closeQuickJumpMenu();
      };
      categoryList.appendChild(item);
    });
  }

  // Jump to section
  function jumpToSection(sectionName: string): void {
    const subPackElements = document.querySelectorAll('.sub-pack');
    for (const el of Array.from(subPackElements)) {
      const heading = el.querySelector('h2');
      if (heading && heading.textContent === sectionName) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  }

  // Handle scroll
  function handleScroll(): void {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Update sticky header
      if (stickyHeader && currentSectionName) {
        const subPackElements = document.querySelectorAll('.sub-pack');
        let foundSection = '';

        for (const el of Array.from(subPackElements)) {
          const rect = el.getBoundingClientRect();
          const heading = el.querySelector('h2');

          if (rect.top <= 100 && rect.bottom > 100 && heading) {
            foundSection = heading.textContent || '';
            break;
          }
        }

        if (foundSection && foundSection !== currentSection) {
          currentSection = foundSection;
          currentSectionName.textContent = foundSection;
        }

        // Show/hide sticky header based on scroll
        if (scrollY > 300 && foundSection) {
          stickyHeader.classList.add('visible');
          stickyHeader.style.display = 'block';
        } else {
          stickyHeader.classList.remove('visible');
          setTimeout(() => {
            if (!stickyHeader.classList.contains('visible')) {
              stickyHeader.style.display = 'none';
            }
          }, 300);
        }
      }

      // Show/hide back to top button
      if (backToTopBtn) {
        if (scrollY > 500) {
          backToTopBtn.style.display = 'flex';
          setTimeout(() => backToTopBtn.classList.add('visible'), 10);
        } else {
          backToTopBtn.classList.remove('visible');
          setTimeout(() => {
            if (!backToTopBtn.classList.contains('visible')) {
              backToTopBtn.style.display = 'none';
            }
          }, 300);
        }
      }

      ticking = false;
    });

    ticking = true;
  }

  // Open quick jump menu
  function openQuickJumpMenu(): void {
    if (quickJumpOverlay) {
      populateCategoryList();
      quickJumpOverlay.style.display = 'block';
      setTimeout(() => quickJumpOverlay.classList.add('active'), 10);
    }
  }

  // Close quick jump menu
  function closeQuickJumpMenu(): void {
    if (quickJumpOverlay) {
      quickJumpOverlay.classList.remove('active');
      setTimeout(() => {
        if (!quickJumpOverlay.classList.contains('active')) {
          quickJumpOverlay.style.display = 'none';
        }
      }, 400);
    }
  }

  // Back to top
  function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event listeners
  if (quickJumpBtn) {
    quickJumpBtn.onclick = openQuickJumpMenu;
  }

  if (closeMenuBtn) {
    closeMenuBtn.onclick = closeQuickJumpMenu;
  }

  if (quickJumpOverlay) {
    quickJumpOverlay.onclick = (e) => {
      if (e.target === quickJumpOverlay) {
        closeQuickJumpMenu();
      }
    };
  }

  if (backToTopBtn) {
    backToTopBtn.onclick = scrollToTop;
  }

  // Set up scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial population when packs are loaded
  setTimeout(populateCategoryList, 500);

  logger.info('Elite navigation features initialized');
}

// Store event handlers outside the function so we can properly remove them
let currentTouchHandlers: {
  start: ((e: TouchEvent) => void) | null;
  end: ((e: TouchEvent) => void) | null;
} = { start: null, end: null };

/**
 * Setup Elite Practice Screen Features
 */
function setupElitePracticeFeatures(): void {
  const wordCard = document.getElementById('wordCard');
  const swipeHint = document.getElementById('swipeHint');

  if (!wordCard) return;

  // Show swipe hint briefly
  if (swipeHint && !sessionStorage.getItem('swipeHintShown')) {
    swipeHint.style.display = 'block';
    setTimeout(() => {
      swipeHint.style.display = 'none';
    }, 3000);
    sessionStorage.setItem('swipeHintShown', 'true');
  }

  // Remove old listeners if they exist
  if (currentTouchHandlers.start && currentTouchHandlers.end) {
    wordCard.removeEventListener('touchstart', currentTouchHandlers.start as any);
    wordCard.removeEventListener('touchend', currentTouchHandlers.end as any);
  }

  // Tap to speak functionality
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartTime = Date.now();
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchDuration = Date.now() - touchStartTime;
    const touchDistance = Math.abs(touchStartX - touchEndX);

    // If it's a quick tap (not a swipe), speak the word
    if (touchDuration < 300 && touchDistance < 10) {
      const currentWord = document.getElementById('currentWord')?.textContent;
      if (currentWord) {
        import('@/utils/speech').then(({ speechService }) => {
          speechService.speak(currentWord);
          logger.info('Speaking word via tap', { word: currentWord });
        });
      }
    } else {
      // Otherwise handle as swipe
      handleSwipe();
    }
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next word
        navigateWord(1);
      } else {
        // Swipe right - previous word
        navigateWord(-1);
      }
    }
  };

  // Store the new handlers so we can remove them next time
  currentTouchHandlers.start = handleTouchStart;
  currentTouchHandlers.end = handleTouchEnd;

  // Add new listeners
  wordCard.addEventListener('touchstart', handleTouchStart as any, { passive: true });
  wordCard.addEventListener('touchend', handleTouchEnd as any, { passive: true });

  // Also handle click for desktop
  wordCard.onclick = () => {
    const currentWord = document.getElementById('currentWord')?.textContent;
    if (currentWord) {
      import('@/utils/speech').then(({ speechService }) => {
        speechService.speak(currentWord);
        logger.info('Speaking word via click', { word: currentWord });
      });
    }
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle if we're on practice screen
    const practiceScreen = document.getElementById('practiceScreen');
    if (!practiceScreen || practiceScreen.classList.contains('hidden')) return;

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        markWord('mastered');
        break;
      case 't':
      case 'T':
        e.preventDefault();
        markWord('tricky');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        navigateWord(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        navigateWord(1);
        break;
    }
  };

  // Remove old keyboard listener
  document.removeEventListener('keydown', handleKeyDown);

  // Add new keyboard listener
  document.addEventListener('keydown', handleKeyDown);

  logger.info('Elite practice features initialized');
}

// ==================== Custom Pack Functions ====================

let currentEditingPackId: string | null = null;

/**
 * Setup event listeners for custom pack buttons
 * This is called after rendering the custom packs section
 */
export function setupCustomPackListeners(): void {
  const createPackBtn = document.getElementById('createPackBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const customPackModal = document.getElementById('customPackModal');
  const savePackBtn = document.getElementById('savePackBtn');
  const deletePackBtn = document.getElementById('deletePackBtn');
  const packWords = document.getElementById('packWords') as HTMLTextAreaElement;
  const wordCountEl = document.getElementById('wordCount');

  if (createPackBtn) {
    createPackBtn.onclick = () => openCustomPackModal();
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = () => closeCustomPackModal();
  }

  if (cancelModalBtn) {
    cancelModalBtn.onclick = () => closeCustomPackModal();
  }

  if (customPackModal) {
    customPackModal.onclick = (e) => {
      if (e.target === customPackModal) {
        closeCustomPackModal();
      }
    };
  }

  if (savePackBtn) {
    savePackBtn.onclick = () => saveCustomPack();
  }

  if (deletePackBtn) {
    deletePackBtn.onclick = () => deleteCustomPackFromModal();
  }

  if (packWords && wordCountEl) {
    packWords.oninput = () => {
      const words = parseWords(packWords.value);
      const count = words.length;
      wordCountEl.textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
    };
  }
}

/**
 * Parse words from text input (comma or newline separated)
 */
function parseWords(text: string): string[] {
  if (!text.trim()) return [];

  // Split by comma or newline, trim whitespace, filter empty
  const words = text
    .split(/[,\n]/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  return words;
}

/**
 * Open custom pack modal for creating new pack
 */
function openCustomPackModal(packId?: string): void {
  const modal = document.getElementById('customPackModal');
  const modalTitle = document.getElementById('modalTitle');
  const packNameInput = document.getElementById('packName') as HTMLInputElement;
  const packWordsInput = document.getElementById('packWords') as HTMLTextAreaElement;
  const deleteBtn = document.getElementById('deletePackBtn');
  const saveBtn = document.getElementById('savePackBtn');

  if (!modal || !modalTitle || !packNameInput || !packWordsInput || !deleteBtn || !saveBtn) {
    logger.error('Modal elements not found');
    return;
  }

  // Reset form
  packNameInput.value = '';
  packWordsInput.value = '';
  currentEditingPackId = null;

  if (packId) {
    // Edit mode
    const pack = storageService.getCustomPack(packId);
    if (pack) {
      modalTitle.textContent = `Edit ${pack.id}`;
      packNameInput.value = pack.name;
      packWordsInput.value = pack.words.join(', ');
      currentEditingPackId = packId;
      deleteBtn.style.display = 'block';
      saveBtn.textContent = 'Save Changes';
    }
  } else {
    // Create mode
    modalTitle.textContent = 'Create Custom Pack';
    deleteBtn.style.display = 'none';
    saveBtn.textContent = 'Create Pack';
  }

  // Update word count
  const words = parseWords(packWordsInput.value);
  const wordCountEl = document.getElementById('wordCount');
  if (wordCountEl) {
    wordCountEl.textContent = `${words.length} ${words.length === 1 ? 'word' : 'words'}`;
  }

  modal.style.display = 'flex';
  packNameInput.focus();
}

/**
 * Close custom pack modal
 */
function closeCustomPackModal(): void {
  const modal = document.getElementById('customPackModal');
  if (modal) {
    modal.style.display = 'none';
  }
  currentEditingPackId = null;
}

/**
 * Save custom pack (create or update)
 */
function saveCustomPack(): void {
  const packNameInput = document.getElementById('packName') as HTMLInputElement;
  const packWordsInput = document.getElementById('packWords') as HTMLTextAreaElement;

  if (!packNameInput || !packWordsInput) {
    logger.error('Form inputs not found');
    return;
  }

  const words = parseWords(packWordsInput.value);

  if (words.length === 0) {
    alert('Please enter at least one word');
    return;
  }

  const name = packNameInput.value.trim() || `Homework - ${new Date().toLocaleDateString()}`;

  if (currentEditingPackId) {
    // Update existing pack
    const success = storageService.updateCustomPack(currentEditingPackId, name, words);
    if (success) {
      logger.info(`Updated custom pack ${currentEditingPackId}`);
      // Sync to cloud
      const updatedPack = storageService.getCustomPack(currentEditingPackId);
      if (updatedPack) {
        authService.syncCustomPack(updatedPack);
      }
      closeCustomPackModal();
      renderSubPackList(wordPacks); // Refresh home screen
    } else {
      alert('Failed to update pack');
    }
  } else {
    // Create new pack
    const newPack = storageService.createCustomPack(name, words);
    if (newPack) {
      logger.info(`Created new custom pack ${newPack.id}`);
      // Sync to cloud
      authService.syncCustomPack(newPack);
      closeCustomPackModal();
      renderSubPackList(wordPacks); // Refresh home screen
    } else {
      alert('Failed to create pack');
    }
  }
}

/**
 * Delete custom pack from modal
 */
function deleteCustomPackFromModal(): void {
  if (!currentEditingPackId) return;

  const confirmDelete = confirm(
    `Are you sure you want to delete ${currentEditingPackId}? This action cannot be undone.`
  );

  if (confirmDelete) {
    const packIdToDelete = currentEditingPackId;
    const success = storageService.deleteCustomPack(packIdToDelete);
    if (success) {
      logger.info(`Deleted custom pack ${packIdToDelete}`);
      // Sync deletion to cloud
      authService.deleteCustomPackFromDatabase(packIdToDelete);
      closeCustomPackModal();
      renderSubPackList(wordPacks); // Refresh home screen
    } else {
      alert('Failed to delete pack');
    }
  }
}

/**
 * Edit custom pack (called from onclick)
 */
export function editPack(packId: string, event?: Event): void {
  if (event) {
    event.stopPropagation(); // Prevent triggering parent click (startPack)
  }
  openCustomPackModal(packId);
}

// Make functions available globally for onclick handlers
declare global {
  interface Window {
    startPack: typeof startPack;
    startTrickyReview: typeof startTrickyReview;
    startStarredReview: typeof startStarredReview;
    setupTableSorting: typeof setupTableSorting;
    editPack: typeof editPack;
  }
}

window.startPack = startPack;
window.startTrickyReview = startTrickyReview;
window.startStarredReview = startStarredReview;
window.setupTableSorting = setupTableSorting;
window.editPack = editPack;

// Initialize on load
window.onload = () => init();








