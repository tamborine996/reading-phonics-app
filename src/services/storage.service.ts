/**
 * Storage service - handles localStorage operations with error handling
 * This provides a clean abstraction that can be replaced with database calls
 */

import type { UserProgress, PackProgress, CustomPack } from '@/types';
import { APP_CONFIG } from '@/constants/config';
import { logger } from '@/utils/logger';
import { validatePackProgress } from '@/utils/validation';

export class StorageService {
  private storageKey = APP_CONFIG.LOCAL_STORAGE_KEY;
  private customPacksKey = 'phonics-app-custom-packs';

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
  getPackProgress(packId: number | string): PackProgress | undefined {
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
  savePackProgress(packId: number | string, progress: PackProgress): boolean {
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
    packId: number | string,
    word: string,
    status: 'tricky' | 'mastered' | 'starred' | 'unstarred',
    isStarred = false
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

      // Handle starred vs regular status
      if (isStarred) {
        if (!progress.starred) {
          progress.starred = {};
        }
        if (status === 'starred') {
          progress.starred[word] = 'starred';
        } else if (status === 'unstarred') {
          delete progress.starred[word];
        }
      } else {
        progress.words[word] = status as 'tricky' | 'mastered';
      }

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
  markPackCompleted(packId: number | string): boolean {
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

  // ========== Custom Packs Methods ==========

  /**
   * Get all custom packs from storage
   */
  getCustomPacks(): CustomPack[] {
    try {
      const stored = localStorage.getItem(this.customPacksKey);
      if (!stored) {
        logger.info('No custom packs found, returning empty array');
        return [];
      }

      const packs = JSON.parse(stored) as CustomPack[];
      logger.info('Retrieved custom packs from storage', {
        count: packs.length,
      });
      return packs;
    } catch (error) {
      logger.error('Failed to retrieve custom packs', error);
      return [];
    }
  }

  /**
   * Get a specific custom pack by ID
   */
  getCustomPack(packId: string): CustomPack | undefined {
    try {
      const packs = this.getCustomPacks();
      return packs.find((pack) => pack.id === packId);
    } catch (error) {
      logger.error(`Failed to get custom pack ${packId}`, error);
      return undefined;
    }
  }

  /**
   * Generate next custom pack ID (C1, C2, C3...)
   */
  private getNextCustomPackId(): string {
    const packs = this.getCustomPacks();
    if (packs.length === 0) {
      return 'C1';
    }

    // Extract numbers from existing IDs and find max
    const numbers = packs
      .map((pack) => parseInt(pack.id.substring(1)))
      .filter((num) => !isNaN(num));

    const maxNumber = Math.max(...numbers);
    return `C${maxNumber + 1}`;
  }

  /**
   * Create a new custom pack
   */
  createCustomPack(name: string, words: string[]): CustomPack | null {
    try {
      const packs = this.getCustomPacks();
      const newId = this.getNextCustomPackId();
      const now = new Date().toISOString();

      const newPack: CustomPack = {
        id: newId,
        name,
        category: 'Custom',
        subPack: 'Custom Packs',
        words,
        editable: true,
        createdAt: now,
        updatedAt: now,
      };

      packs.push(newPack);
      localStorage.setItem(this.customPacksKey, JSON.stringify(packs));
      logger.info(`Created custom pack ${newId}`, { name, wordCount: words.length });

      return newPack;
    } catch (error) {
      logger.error('Failed to create custom pack', error);
      return null;
    }
  }

  /**
   * Update an existing custom pack
   */
  updateCustomPack(packId: string, name: string, words: string[]): boolean {
    try {
      const packs = this.getCustomPacks();
      const packIndex = packs.findIndex((pack) => pack.id === packId);

      if (packIndex === -1) {
        logger.warn(`Cannot update pack ${packId} - not found`);
        return false;
      }

      packs[packIndex] = {
        ...packs[packIndex],
        name,
        words,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.customPacksKey, JSON.stringify(packs));
      logger.info(`Updated custom pack ${packId}`, { name, wordCount: words.length });

      return true;
    } catch (error) {
      logger.error(`Failed to update custom pack ${packId}`, error);
      return false;
    }
  }

  /**
   * Delete a custom pack
   */
  deleteCustomPack(packId: string): boolean {
    try {
      const packs = this.getCustomPacks();
      const filteredPacks = packs.filter((pack) => pack.id !== packId);

      if (filteredPacks.length === packs.length) {
        logger.warn(`Cannot delete pack ${packId} - not found`);
        return false;
      }

      localStorage.setItem(this.customPacksKey, JSON.stringify(filteredPacks));
      logger.info(`Deleted custom pack ${packId}`);

      // Also delete progress for this pack
      const allProgress = this.getUserProgress();
      delete allProgress[packId];
      localStorage.setItem(this.storageKey, JSON.stringify(allProgress));

      return true;
    } catch (error) {
      logger.error(`Failed to delete custom pack ${packId}`, error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
