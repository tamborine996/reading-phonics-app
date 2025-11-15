/**
 * UI components and rendering functions
 */

import type { WordPack } from '@/types';
import { storageService } from '@/services/storage.service';
import { extractCleanLabel, getWordPreview, formatDate, groupPacksBySubPack } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { speechService } from '@/utils/speech';
import { formatWordWithColoredSyllables } from '@/utils/syllables';
import { wordPacks } from '@/data/wordPacks';
import type { AppState } from '../app';

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
 * Render sub-pack list with tables
 */
export function renderSubPackList(packs: WordPack[]): void {
  const container = document.getElementById('packList');
  if (!container) {
    logger.error('Pack list container not found');
    return;
  }

  container.innerHTML = '';

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
          <th class="sortable">Progress <span class="sort-icon">⇅</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  packs.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    const totalWords = pack.words.length;

    const reviewedWords = progress ? Object.keys(progress.words).length : 0;
    const progressPercent = Math.round((reviewedWords / totalWords) * 100);
    const lastReviewed = progress?.lastReviewed ? formatDate(progress.lastReviewed) : 'Never';

    const trickyCount = progress
      ? Object.values(progress.words).filter((status) => status === 'tricky').length
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
        <td data-label="Progress">
          <div class="progress-cell">
            <span>${reviewedWords}/${totalWords} (${progressPercent}%)</span>
            <div class="progress-bar-small">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
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

  const words = appState.reviewMode
    ? appState.reviewWords.map((w) => w.word)
    : appState.currentPack.words;

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

    // Add visual class based on status
    const progress = appState.reviewMode
      ? null
      : storageService.getPackProgress(appState.currentPack.id);

    currentWordEl.className = 'word';
    if (progress && progress.words[currentWord]) {
      currentWordEl.classList.add(progress.words[currentWord]);
    }
  }

  // Update syllable toggle button state
  updateSyllableToggleButton(appState);

  // Update word counter
  const wordCounter = document.getElementById('wordCounter');
  if (wordCounter) {
    wordCounter.textContent = `${appState.currentWordIndex + 1} / ${words.length}`;
  }

  // Update navigation buttons
  const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
  if (prevBtn) {
    prevBtn.disabled = appState.currentWordIndex === 0;
  }

  const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
  if (nextBtn) {
    nextBtn.disabled = appState.currentWordIndex === words.length - 1;
  }

  // Set up speaker button
  const speakerBtn = document.getElementById('speakerBtn');
  if (speakerBtn) {
    speakerBtn.onclick = () => {
      speechService.speak(currentWord);
      logger.info('Speaking word via button click', { word: currentWord });
    };
  }

  // Show Quick Review button if there are tricky words
  updateQuickReviewButton();

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
  trickyWords: string[]
): void {
  const titleEl = document.getElementById('completeTitle');
  if (titleEl) {
    titleEl.textContent = title;
  }

  const statsEl = document.getElementById('completeStats');
  if (statsEl) {
    let html = `
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
 */
function countGlobalTrickyWords(packs: WordPack[]): number {
  let count = 0;
  packs.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    if (progress) {
      count += Object.values(progress.words).filter((status) => status === 'tricky').length;
    }
  });
  return count;
}

/**
 * Helper: Count sub-pack tricky words
 */
function countSubPackTrickyWords(packs: WordPack[]): number {
  let count = 0;
  packs.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    if (progress) {
      count += Object.values(progress.words).filter((status) => status === 'tricky').length;
    }
  });
  return count;
}

/**
 * Update syllable toggle button appearance
 */
function updateSyllableToggleButton(appState: AppState): void {
  const toggleBtn = document.getElementById('syllableToggleBtn');
  const toggleIcon = document.getElementById('syllableToggleIcon');
  const toggleText = document.getElementById('syllableToggleText');

  if (!toggleBtn || !toggleIcon || !toggleText) return;

  if (appState.showSyllablesForCurrentWord) {
    toggleBtn.classList.add('active');
    toggleIcon.textContent = '👁️';
    toggleText.textContent = 'Hide Syllables';
  } else {
    toggleBtn.classList.remove('active');
    toggleIcon.textContent = '💡';
    toggleText.textContent = 'Show Syllables';
  }
}

/**
 * Update Quick Review button visibility and count
 */
function updateQuickReviewButton(): void {
  const quickReviewContainer = document.getElementById('quickReviewContainer');
  const quickReviewCount = document.getElementById('quickReviewCount');

  if (!quickReviewContainer || !quickReviewCount) return;

  // Count total tricky words across all packs
  let trickyCount = 0;

  wordPacks.forEach((pack) => {
    const progress = storageService.getPackProgress(pack.id);
    if (progress) {
      trickyCount += Object.values(progress.words).filter(status => status === 'tricky').length;
    }
  });

  if (trickyCount > 0) {
    const displayCount = Math.min(trickyCount, 3);
    quickReviewCount.textContent = displayCount.toString();
    quickReviewContainer.style.display = 'block';
  } else {
    quickReviewContainer.style.display = 'none';
  }
}
