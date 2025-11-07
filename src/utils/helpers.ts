/**
 * General helper utilities
 */

import type { WordPack, PackStatistics, PackProgress } from '@/types';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Extract clean label from pack category
 */
export function extractCleanLabel(category: string): string {
  return category
    .replace(/^P\d+:\s*/, '') // Remove P1:, P2:, etc.
    .replace(/^\d+[A-D]?\.\s*/, '') // Remove 1., 2A., etc.
    .replace(/\s*-\s*Pack\s*\d+$/i, ''); // Remove "- Pack 1", etc.
}

/**
 * Get word preview string
 */
export function getWordPreview(words: string[], count: number = 4): string {
  if (words.length === 0) return 'No words';
  return words.slice(0, count).join(', ') + '...';
}

/**
 * Calculate pack statistics
 */
export function calculatePackStats(
  pack: WordPack,
  progress: PackProgress | undefined
): PackStatistics {
  const totalWords = pack.words.length;

  if (!progress) {
    return {
      totalWords,
      masteredWords: 0,
      trickyWords: 0,
      completionPercentage: 0,
      lastReviewed: null,
    };
  }

  let masteredWords = 0;
  let trickyWords = 0;

  Object.values(progress.words).forEach((status) => {
    if (status === 'mastered') masteredWords++;
    if (status === 'tricky') trickyWords++;
  });

  const completionPercentage = Math.round((masteredWords / totalWords) * 100);

  return {
    totalWords,
    masteredWords,
    trickyWords,
    completionPercentage,
    lastReviewed: progress.lastReviewed,
  };
}

/**
 * Format date for display
 */
export function formatDate(isoString: string | null): string {
  if (!isoString) return 'Never';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Group packs by sub-pack
 */
export function groupPacksBySubPack(packs: WordPack[]): Map<string, WordPack[]> {
  const grouped = new Map<string, WordPack[]>();

  packs.forEach((pack) => {
    const existing = grouped.get(pack.subPack) || [];
    grouped.set(pack.subPack, [...existing, pack]);
  });

  return grouped;
}
