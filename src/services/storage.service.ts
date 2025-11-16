/**
 * Storage service - handles localStorage operations with error handling
 * This provides a clean abstraction that can be replaced with database calls
 */

import type { UserProgress, PackProgress } from '@/types';
import { APP_CONFIG } from '@/constants/config';
import { logger } from '@/utils/logger';
import { validatePackProgress } from '@/utils/validation';

export class StorageService {
  private storageKey = APP_CONFIG.LOCAL_STORAGE_KEY;

  /**
   * Get all user progress from storage
   */
  getUserProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        logger.info('No existing progress found, returning empty object');
        return {};
      }

      const progress = JSON.parse(stored) as UserProgress;
      logger.info('Retrieved user progress from storage', {
        packCount: Object.keys(progress).length,
      });
      return progress;
    } catch (error) {
      logger.error('Failed to retrieve user progress', error);
      return {};
    }
  }

  /**
   * Get progress for a specific pack
   */
  getPackProgress(packId: number): PackProgress | undefined {
    try {
      const allProgress = this.getUserProgress();
      return allProgress[packId];
    } catch (error) {
      logger.error(`Failed to get progress for pack ${packId}`, error);
      return undefined;
    }
  }

  /**
   * Save progress for a specific pack
   */
  savePackProgress(packId: number, progress: PackProgress): boolean {
    try {
      validatePackProgress(progress);

      const allProgress = this.getUserProgress();
      allProgress[packId] = progress;

      localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
      logger.info(`Saved progress for pack ${packId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to save progress for pack ${packId}`, error);
      return false;
    }
  }

  /**
   * Update word status in a pack
   */
  updateWordStatus(
    packId: number,
    word: string,
    status: 'tricky' | 'mastered'
  ): boolean {
    try {
      let progress = this.getPackProgress(packId);

      if (!progress) {
        progress = {
          words: {},
          completed: false,
          lastReviewed: null,
        };
      }

      progress.words[word] = status;
      progress.lastReviewed = new Date().toISOString();

      return this.savePackProgress(packId, progress);
    } catch (error) {
      logger.error(`Failed to update word status for pack ${packId}`, error);
      return false;
    }
  }

  /**
   * Mark pack as completed
   */
  markPackCompleted(packId: number): boolean {
    try {
      const progress = this.getPackProgress(packId);

      if (!progress) {
        logger.warn(`Cannot mark pack ${packId} as completed - no progress found`);
        return false;
      }

      progress.completed = true;
      progress.completionCount = (progress.completionCount || 0) + 1;
      progress.lastReviewed = new Date().toISOString();

      return this.savePackProgress(packId, progress);
    } catch (error) {
      logger.error(`Failed to mark pack ${packId} as completed`, error);
      return false;
    }
  }

  /**
   * Clear all progress (useful for testing)
   */
  clearAllProgress(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      logger.info('Cleared all user progress');
      return true;
    } catch (error) {
      logger.error('Failed to clear progress', error);
      return false;
    }
  }

  /**
   * Export progress as JSON (for backup/migration)
   */
  exportProgress(): string {
    try {
      const progress = this.getUserProgress();
      return JSON.stringify(progress, null, 2);
    } catch (error) {
      logger.error('Failed to export progress', error);
      return '{}';
    }
  }

  /**
   * Import progress from JSON
   */
  importProgress(jsonString: string): boolean {
    try {
      const progress = JSON.parse(jsonString) as UserProgress;

      // Validate each pack's progress
      Object.entries(progress).forEach(([, packProgress]) => {
        validatePackProgress(packProgress);
      });

      localStorage.setItem(this.storageKey, jsonString);
      logger.info('Successfully imported progress', {
        packCount: Object.keys(progress).length,
      });
      return true;
    } catch (error) {
      logger.error('Failed to import progress', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
