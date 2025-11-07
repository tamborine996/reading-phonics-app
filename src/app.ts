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

  reset() {
    this.currentPack = null;
    this.currentWordIndex = 0;
    this.reviewMode = false;
    this.reviewWords = [];
    this.currentSession = null;
  }
}

export const appState = new AppState();

/**
 * Initialize application
 */
export async function init(): Promise<void> {
  try {
    logger.info('Initializing application');

    // Initialize Supabase if configured
    const { env, isSupabaseConfigured } = await import('@/env');
    if (isSupabaseConfigured()) {
      const { supabaseService } = await import('@/services/supabase.service');
      supabaseService.initialize(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);
      logger.info('Supabase initialized successfully');
    }

    // Handle OAuth callback if returning from Google
    const isOAuthCallback = await handleOAuthCallback();

    // Initialize auth if Supabase is configured
    await authService.initialize();

    // Set up event listeners
    setupEventListeners();
    initAuthUI();

    // Show appropriate screen (auth or home) - but skip if OAuth just processed
    if (!isOAuthCallback) {
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
function setupEventListeners(): void {
  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.onclick = () => {
      appState.reset();
      showScreen('homeScreen');
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
    };
  }

  // Parent button
  const parentBtn = document.getElementById('parentBtn');
  if (parentBtn) {
    parentBtn.onclick = () => renderParentView(wordPacks);
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
