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
    setupElitePracticeFeatures();
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

    if (appState.reviewWords.length === 0 && appState.reviewMode) {
      // All tricky words mastered!
      showCompletion();
    } else if (appState.currentWordIndex < words.length - 1) {
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

  // Remove old listeners if they exist
  wordCard.removeEventListener('touchstart', handleTouchStart as any);
  wordCard.removeEventListener('touchend', handleTouchEnd as any);

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

// Make functions available globally for onclick handlers
declare global {
  interface Window {
    startPack: typeof startPack;
    startTrickyReview: typeof startTrickyReview;
    setupTableSorting: typeof setupTableSorting;
  }
}

window.startPack = startPack;
window.startTrickyReview = startTrickyReview;
window.setupTableSorting = setupTableSorting;

// Initialize on load
window.onload = () => init();








