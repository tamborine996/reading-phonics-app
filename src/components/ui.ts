/**
 * UI components and rendering functions
 */

import type { WordPack } from '@/types';
import { storageService } from '@/services/storage.service';
import { extractCleanLabel, getWordPreview, formatDate, groupPacksBySubPack } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { formatWordWithColoredSyllables } from '@/utils/syllables';
import type { AppState } from '../app';
import { setupCustomPackListeners } from '../app';

/**
 * Show a specific screen
 */
export function showScreen(screenName: string): void {
  document.querySelectorAll('.screen').forEach((s) => s.classList.add('hidden'));
  const screen = document.getElementById(screenName);

  if (screen) {
    screen.classList.remove('hidden');
    logger.info(`Showing screen: ${screenName}`);
  } else {
    logger.error(`Screen not found: ${screenName}`);
  }
}

/**
 * Render custom packs section
 */
function renderCustomPacks(): string {
  const customPacks = storageService.getCustomPacks();

  if (customPacks.length === 0) {
    // Show empty state with create button
    return `
      <div class="custom-packs-section">
        <div class="section-header">
          <h3 class="section-title">Custom Packs</h3>
          <button class="btn-create-pack" id="createPackBtn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Create Pack</span>
          </button>
        </div>
        <div class="empty-state">
          <p>No custom packs yet. Create your first pack to practice words from books or homework!</p>
        </div>
      </div>
    `;
  }

  // Show list of custom packs
  let html = `
    <div class="custom-packs-section">
      <div class="section-header">
        <h3 class="section-title">Custom Packs</h3>
        <button class="btn-create-pack" id="createPackBtn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Create Pack</span>
        </button>
      </div>
      <div class="custom-packs-list">
  `;

  customPacks.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    const lastReviewed = progress?.lastReviewed ? formatDate(progress.lastReviewed) : 'Never';
    const completionCount = progress?.completionCount || 0;
    const wordCount = pack.words.length;

    html += `
      <div class="custom-pack-row">
        <div class="custom-pack-main" onclick="startPack('${pack.id}')">
          <div class="custom-pack-number">${pack.id}</div>
          <div class="custom-pack-info">
            <div class="custom-pack-name">${pack.name}</div>
            <div class="custom-pack-meta">
              <span class="custom-pack-words">${wordCount} ${wordCount === 1 ? 'word' : 'words'}</span>
              <span class="custom-pack-separator">•</span>
              <span class="custom-pack-time">${lastReviewed}</span>
              <span class="custom-pack-separator">•</span>
              <span class="custom-pack-count">${completionCount} ${completionCount === 1 ? 'time' : 'times'}</span>
            </div>
          </div>
          <svg class="custom-pack-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <button class="custom-pack-edit-btn" onclick="editPack('${pack.id}', event)" title="Edit pack">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.3 1.7l3 3-8.5 8.5H2.8v-3l8.5-8.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

/**
 * Get recently practiced packs (sorted by most recent)
 */
function getRecentlyPracticedPacks(packs: WordPack[], limit = 5): WordPack[] {
  const packsWithProgress = packs
    .map((pack) => {
      const progress = storageService.getPackProgress(pack.id);
      return {
        pack,
        lastReviewed: progress?.lastReviewed ? new Date(progress.lastReviewed) : null,
      };
    })
    .filter((item) => item.lastReviewed !== null)
    .sort((a, b) => b.lastReviewed!.getTime() - a.lastReviewed!.getTime())
    .slice(0, limit)
    .map((item) => item.pack);

  return packsWithProgress;
}

/**
 * Render recently practiced section
 */
function renderRecentlyPracticed(packs: WordPack[]): string {
  const recentPacks = getRecentlyPracticedPacks(packs, 5);

  if (recentPacks.length === 0) {
    return ''; // Don't show section if no recent packs
  }

  let html = `
    <div class="recently-practiced">
      <h3 class="recently-practiced-title">Recently Practiced</h3>
      <div class="recently-practiced-list">
  `;

  recentPacks.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    const lastReviewed = progress?.lastReviewed ? formatDate(progress.lastReviewed) : 'Never';
    const cleanLabel = extractCleanLabel(pack.category);
    const completionCount = progress?.completionCount || 0;

    html += `
      <div class="recent-pack-row" onclick="startPack(${pack.id})">
        <div class="recent-pack-number">P${pack.id}</div>
        <div class="recent-pack-info">
          <div class="recent-pack-label">${cleanLabel}</div>
          <div class="recent-pack-meta">
            <span class="recent-pack-time">${lastReviewed}</span>
            <span class="recent-pack-separator">•</span>
            <span class="recent-pack-count">${completionCount} ${completionCount === 1 ? 'time' : 'times'}</span>
          </div>
        </div>
        <svg class="recent-pack-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

/**
 * Render sub-pack list with tables
 */
export function renderSubPackList(packs: WordPack[]): void {
  const container = document.getElementById('packList');
  if (!container) {
    logger.error('Pack list container not found');
    return;
  }

  container.innerHTML = '';

  // Add Recently Practiced section first
  const recentSection = renderRecentlyPracticed(packs);
  if (recentSection) {
    container.innerHTML += recentSection;
  }

  // Add Custom Packs section
  const customSection = renderCustomPacks();
  if (customSection) {
    container.innerHTML += customSection;
  }

  // Setup custom pack event listeners after rendering
  setupCustomPackListeners();

  const grouped = groupPacksBySubPack(packs);

  // Global tricky words button
  const globalTrickyCount = countGlobalTrickyWords(packs);
  if (globalTrickyCount > 0) {
    const globalBtn = createTrickyReviewButton(
      `Review All Tricky Words (${globalTrickyCount})`,
      'global',
      'global'
    );
    container.appendChild(globalBtn);
  }

  // Global starred words button (for parent)
  const globalStarredCount = countGlobalStarredWords(packs);
  if (globalStarredCount > 0) {
    const globalStarBtn = createStarredReviewButton(
      `⭐ Review All Starred Words (${globalStarredCount})`,
      'global',
      'global'
    );
    container.appendChild(globalStarBtn);
  }

  // Render each sub-pack
  grouped.forEach((subPackPacks, subPackName) => {
    const subPackDiv = document.createElement('div');
    subPackDiv.className = 'sub-pack';

    const subPackTrickyCount = countSubPackTrickyWords(subPackPacks);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'sub-pack-header';

    const title = document.createElement('h2');
    title.textContent = subPackName;
    headerDiv.appendChild(title);

    if (subPackTrickyCount > 0) {
      const trickyBtn = createTrickyReviewButton(
        `Review Tricky Words (${subPackTrickyCount})`,
        'subpack',
        'subpack',
        subPackName
      );
      headerDiv.appendChild(trickyBtn);
    }

    subPackDiv.appendChild(headerDiv);

    const tableContainer = document.createElement('div');
    tableContainer.className = 'pack-table-container';
    tableContainer.innerHTML = renderPackTable(subPackPacks);

    subPackDiv.appendChild(tableContainer);
    container.appendChild(subPackDiv);
  });

  logger.info('Sub-pack list rendered', { subPackCount: grouped.size });

  // Setup table sorting after tables are rendered
  if (typeof window !== 'undefined' && (window as any).setupTableSorting) {
    (window as any).setupTableSorting();
  }
}

/**
 * Render pack table
 */
function renderPackTable(packs: WordPack[]): string {
  let html = `
    <table class="pack-table">
      <thead>
        <tr>
          <th class="sortable">Pack <span class="sort-icon">⇅</span></th>
          <th class="sortable">Label <span class="sort-icon">⇅</span></th>
          <th class="sortable">Word Preview <span class="sort-icon">⇅</span></th>
          <th class="sortable">Count <span class="sort-icon">⇅</span></th>
          <th class="sortable">Last Reviewed <span class="sort-icon">⇅</span></th>
          <th class="sortable">Completed <span class="sort-icon">⇅</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  packs.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    const totalWords = pack.words.length;

    const completionCount = progress?.completionCount || 0;
    const lastReviewed = progress?.lastReviewed ? formatDate(progress.lastReviewed) : 'Never';

    const trickyCount = progress
      ? pack.words.filter((word) => progress.words[word] === 'tricky').length
      : 0;

    const wordPreview = getWordPreview(pack.words);
    const cleanLabel = extractCleanLabel(pack.category);

    html += `
      <tr data-pack-id="${pack.id}">
        <td class="pack-number" data-label="Pack">P${pack.id}</td>
        <td class="pack-label" data-label="Label">${cleanLabel}</td>
        <td class="word-preview" data-label="Words">${wordPreview}</td>
        <td class="word-count" data-label="Count">${totalWords}</td>
        <td data-label="Last Reviewed">${lastReviewed}</td>
        <td data-label="Completed">
          <div class="completion-cell">
            <span>${completionCount} ${completionCount === 1 ? 'time' : 'times'}</span>
          </div>
        </td>
        <td class="actions-cell" data-label="Actions">
          <button onclick="startPack(${pack.id})" class="action-btn practice">Practice</button>
          ${
            trickyCount > 0
              ? `<button onclick="startTrickyReview('pack', ${pack.id})" class="action-btn review-tricky">Review Tricky (${trickyCount})</button>`
              : ''
          }
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

/**
 * Render practice screen
 */
export function renderPracticeScreen(appState: AppState): void {
  if (!appState.currentPack) {
    logger.error('No current pack to render');
    return;
  }

  // Get word list based on current state (filter, shuffle, review mode)
  let words: string[];
  if (appState.reviewMode) {
    words = appState.reviewWords.map((w) => w.word);
  } else if (appState.shuffledWords.length > 0) {
    words = appState.shuffledWords;
  } else if (appState.filterTrickyOnly) {
    const progress = storageService.getPackProgress(appState.currentPack.id);
    if (progress) {
      words = appState.currentPack.words.filter((word) => progress.words[word] === 'tricky');
    } else {
      words = appState.currentPack.words;
    }
  } else {
    words = appState.currentPack.words;
  }

  const currentWord = words[appState.currentWordIndex];

  // Update pack title
  const packTitle = document.getElementById('packTitle');
  if (packTitle) {
    packTitle.textContent = appState.currentPack.category;
  }

  // Update current word
  const currentWordEl = document.getElementById('currentWord');
  if (currentWordEl) {
    // Use colored syllables if card-level toggle is ON
    const formattedWord = formatWordWithColoredSyllables(
      currentWord,
      appState.showSyllablesForCurrentWord
    );
    currentWordEl.innerHTML = formattedWord;

    // Add visual class based on status (Apple style uses word-apple class)
    const progress = appState.reviewMode
      ? null
      : storageService.getPackProgress(appState.currentPack.id);

    currentWordEl.className = 'word-apple';
    if (progress && progress.words[currentWord]) {
      currentWordEl.classList.add(progress.words[currentWord]);
    }
  }

  // Update syllable toggle button state (now a settings icon)
  updateSyllableToggleButton(appState);

  // Update star button state
  updateStarButton(appState, currentWord);

  // Update word counter
  const wordCounter = document.getElementById('wordCounter');
  if (wordCounter) {
    wordCounter.textContent = `${appState.currentWordIndex + 1} / ${words.length}`;
  }

  // Update visual progress bar
  updatePracticeProgressBar(appState.currentWordIndex + 1, words.length);

  // Auto-speak the word when it first appears (optional)
  // Uncomment the line below if you want automatic speech
  // speechService.speak(currentWord);
}

/**
 * Update practice progress bar
 */
function updatePracticeProgressBar(current: number, total: number): void {
  const progressFill = document.getElementById('practiceProgressFill');
  if (progressFill) {
    const percent = (current / total) * 100;
    progressFill.style.width = `${percent}%`;
  }
}

/**
 * Render completion screen
 */
export function renderCompleteScreen(
  title: string,
  totalWords: number,
  trickyWords: string[],
  packName?: string
): void {
  const titleEl = document.getElementById('completeTitle');
  if (titleEl) {
    titleEl.textContent = title;
  }

  const statsEl = document.getElementById('completeStats');
  if (statsEl) {
    let html = '';

    // Add pack name if provided
    if (packName) {
      html += `<p class="pack-name"><strong>${packName}</strong></p>`;
    }

    html += `
      <p>Total words: ${totalWords}</p>
      <p>Tricky words: ${trickyWords.length}</p>
    `;

    if (trickyWords.length > 0) {
      html += `<p>Keep practicing: ${trickyWords.join(', ')}</p>`;
    } else {
      html += '<p>Great job! All words mastered!</p>';
    }

    statsEl.innerHTML = html;
  }
}

/**
 * Render parent view
 */
export function renderParentView(packs: WordPack[]): void {
  const container = document.getElementById('parentContent');
  if (!container) {
    logger.error('Parent content container not found');
    return;
  }

  let html = '<h2>Progress Overview</h2>';

  const grouped = groupPacksBySubPack(packs);

  grouped.forEach((subPackPacks, subPackName) => {
    html += `<h3>${subPackName}</h3><ul>`;

    subPackPacks.forEach((pack) => {
      const progress = storageService.getPackProgress(pack.id);
      if (!progress) return;

      const trickyWords = pack.words.filter((word) => progress.words[word] === 'tricky');

      if (trickyWords.length > 0) {
        html += `<li><strong>${pack.category}:</strong> ${trickyWords.join(', ')}</li>`;
      }
    });

    html += '</ul>';
  });

  container.innerHTML = html;
  showScreen('parentScreen');

  logger.info('Parent view rendered');
}

/**
 * Helper: Create tricky review button
 */
function createTrickyReviewButton(
  text: string,
  level: 'global' | 'subpack' | 'pack',
  className: string,
  filter?: string | number
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = `tricky-review-btn ${className}`;
  btn.textContent = text;

  if (level === 'global') {
    btn.onclick = () => (window as any).startTrickyReview('global');
  } else if (level === 'subpack' && typeof filter === 'string') {
    btn.onclick = () => (window as any).startTrickyReview('subpack', filter);
  } else if (level === 'pack' && typeof filter === 'number') {
    btn.onclick = () => (window as any).startTrickyReview('pack', filter);
  }

  return btn;
}

/**
 * Helper: Count global tricky words
 * Now uses actual getTrickyWords to ensure count matches
 */
function countGlobalTrickyWords(packs: WordPack[]): number {
  const trickyWords: Array<{ word: string; packId: number | string }> = [];

  packs.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    if (!progress) return;

    pack.words.forEach((word) => {
      if (progress.words[word] === 'tricky') {
        trickyWords.push({ word, packId: pack.id });
      }
    });
  });

  return trickyWords.length;
}

/**
 * Helper: Count sub-pack tricky words
 * Now uses actual collection logic to ensure count matches
 */
function countSubPackTrickyWords(packs: WordPack[]): number {
  const trickyWords: Array<{ word: string; packId: number | string }> = [];

  packs.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    if (!progress) return;

    pack.words.forEach((word) => {
      if (progress.words[word] === 'tricky') {
        trickyWords.push({ word, packId: pack.id });
      }
    });
  });

  return trickyWords.length;
}

/**
 * Update syllable toggle button appearance
 */
function updateSyllableToggleButton(appState: AppState): void {
  const toggleBtn = document.getElementById('syllableToggleBtn');

  if (!toggleBtn) return;

  // Apple style: just change the button color/state
  if (appState.showSyllablesForCurrentWord) {
    toggleBtn.classList.add('active');
    toggleBtn.style.color = 'var(--apple-blue, #007AFF)';
  } else {
    toggleBtn.classList.remove('active');
    toggleBtn.style.color = 'var(--apple-gray, #8E8E93)';
  }
}

/**
 * Update star button appearance based on current word's starred status
 */
function updateStarButton(appState: AppState, currentWord: string): void {
  const starBtn = document.getElementById('starWordBtn');
  if (!starBtn || !appState.currentPack) return;

  let packId = appState.currentPack.id;
  let wordToCheck = currentWord;

  // If in review mode, get the actual pack ID
  if (appState.reviewMode) {
    const reviewWord = appState.reviewWords[appState.currentWordIndex];
    packId = reviewWord.packId;
  }

  const progress = storageService.getPackProgress(packId);
  const isStarred = progress?.starred?.[wordToCheck] === 'starred';

  if (isStarred) {
    starBtn.classList.add('starred');
  } else {
    starBtn.classList.remove('starred');
  }
}

/**
 * Helper: Count global starred words
 */
function countGlobalStarredWords(packs: WordPack[]): number {
  const starredWords: Array<{ word: string; packId: number | string }> = [];

  packs.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    if (!progress || !progress.starred) return;

    pack.words.forEach((word) => {
      if (progress.starred![word] === 'starred') {
        starredWords.push({ word, packId: pack.id });
      }
    });
  });

  return starredWords.length;
}

/**
 * Helper: Create starred review button
 */
function createStarredReviewButton(
  text: string,
  level: 'global' | 'subpack' | 'pack',
  className: string,
  filter?: string | number
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = `tricky-review-btn starred-btn ${className}`;
  btn.textContent = text;

  if (level === 'global') {
    btn.onclick = () => (window as any).startStarredReview('global');
  } else if (level === 'subpack' && typeof filter === 'string') {
    btn.onclick = () => (window as any).startStarredReview('subpack', filter);
  } else if (level === 'pack' && typeof filter === 'number') {
    btn.onclick = () => (window as any).startStarredReview('pack', filter);
  }

  return btn;
}

/**
 * Update Quick Review button visibility and count
 * NOTE: Disabled for Apple-style minimal design
 */
// function updateQuickReviewButton(): void {
//   const quickReviewContainer = document.getElementById('quickReviewContainer');
//   const quickReviewCount = document.getElementById('quickReviewCount');

//   if (!quickReviewContainer || !quickReviewCount) return;

//   // Count total tricky words across all packs
//   let trickyCount = 0;

//   wordPacks.forEach((pack) => {
//     const progress = storageService.getPackProgress(pack.id);
//     if (progress) {
//       trickyCount += Object.values(progress.words).filter(status => status === 'tricky').length;
//     }
//   });

//   if (trickyCount > 0) {
//     const displayCount = Math.min(trickyCount, 3);
//     quickReviewCount.textContent = displayCount.toString();
//     quickReviewContainer.style.display = 'block';
//   } else {
//     quickReviewContainer.style.display = 'none';
//   }
// }
