/**
 * Authentication service - manages user authentication flow
 */

import type { User, PackProgress, CustomPack } from '@/types';
import { supabaseService } from './supabase.service';
import { storageService } from './storage.service';
import { syncService } from './sync.service';
import { logger } from '@/utils/logger';
import { validateEmail } from '@/utils/validation';

export class AuthService {
  private currentUser: User | null = null;

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Initialize auth state
   */
  async initialize(): Promise<void> {
    try {
      if (!supabaseService.isInitialized()) {
        logger.info('Supabase not initialized, skipping auth initialization');
        return;
      }

      const user = await supabaseService.getCurrentUser();

      if (user) {
        this.currentUser = user;
        logger.info('User authenticated', { email: user.email });

        // Load server data first, then sync local changes
        syncService.setSyncing();
        await this.loadProgressFromDatabase();
        await this.loadCustomPacksFromDatabase();
        await this.syncLocalProgressToDatabase();
        await this.syncLocalCustomPacksToDatabase();
        syncService.setSuccess();

        // Process any queued syncs from when offline
        this.processOfflineQueue();
      } else {
        logger.info('No user session found (user not logged in)');
      }
    } catch (error) {
      // This is expected when no one is logged in - not an error
      logger.info('No active user session');
    }
  }

  /**
   * Sign up new user
   */
  async signUp(email: string, password: string): Promise<User> {
    try {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const user = await supabaseService.signUp(email, password);

      if (!user) {
        throw new Error('Failed to create user');
      }

      this.currentUser = user;
      logger.info('User signed up and authenticated', { email });

      // For new users, sync local data to server
      syncService.setSyncing();
      await this.syncLocalProgressToDatabase();
      await this.syncLocalCustomPacksToDatabase();
      syncService.setSuccess();

      return user;
    } catch (error) {
      logger.error('Sign up failed', error);
      syncService.setError('Sign up failed');
      throw error;
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      const user = await supabaseService.signIn(email, password);

      if (!user) {
        throw new Error('Failed to sign in');
      }

      this.currentUser = user;
      logger.info('User signed in', { email });

      // Load server data first, then sync local changes
      syncService.setSyncing();
      await this.loadProgressFromDatabase();
      await this.loadCustomPacksFromDatabase();
      await this.syncLocalProgressToDatabase();
      await this.syncLocalCustomPacksToDatabase();
      syncService.setSuccess();

      return user;
    } catch (error) {
      logger.error('Sign in failed', error);
      syncService.setError('Sign in failed');
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await supabaseService.signOut();
      this.currentUser = null;
      logger.info('User signed out');
    } catch (error) {
      logger.error('Sign out failed', error);
      throw error;
    }
  }

  /**
   * Sync local progress to database with offline queue support
   */
  async syncLocalProgressToDatabase(): Promise<void> {
    try {
      if (!this.currentUser) {
        logger.warn('No user authenticated, skipping sync');
        return;
      }

      const localProgress = storageService.getUserProgress();

      if (Object.keys(localProgress).length === 0) {
        logger.info('No local progress to sync');
        return;
      }

      if (!navigator.onLine) {
        // Queue for later
        Object.entries(localProgress).forEach(([packId, progress]) => {
          syncService.addToQueue({
            type: 'progress',
            action: 'save',
            data: { packId, progress },
          });
        });
        logger.info('Offline - progress queued for sync');
        return;
      }

      syncService.setSyncing();
      await supabaseService.syncProgress(this.currentUser.id, localProgress);
      syncService.setSuccess();
      logger.info('Local progress synced to database');
    } catch (error) {
      logger.error('Failed to sync local progress', error);
      syncService.setError('Sync failed');

      // Queue failed syncs for retry
      if (this.currentUser) {
        const localProgress = storageService.getUserProgress();
        Object.entries(localProgress).forEach(([packId, progress]) => {
          syncService.addToQueue({
            type: 'progress',
            action: 'save',
            data: { packId, progress },
          });
        });
      }
    }
  }

  /**
   * Sync a single pack's progress (called after marking words)
   */
  async syncPackProgress(packId: number | string, progress: PackProgress): Promise<void> {
    try {
      if (!this.currentUser) {
        return;
      }

      if (!navigator.onLine) {
        syncService.addToQueue({
          type: 'progress',
          action: 'save',
          data: { packId, progress },
        });
        return;
      }

      syncService.setSyncing();

      // Handle both numeric and string pack IDs
      const numericPackId = typeof packId === 'string' ? packId : packId;
      await supabaseService.savePackProgress(
        this.currentUser.id,
        typeof numericPackId === 'string' ? parseInt(numericPackId.replace('C', '')) + 10000 : numericPackId,
        progress
      );

      syncService.setSuccess();
    } catch (error) {
      logger.error('Failed to sync pack progress', error);
      syncService.setError('Sync failed');

      syncService.addToQueue({
        type: 'progress',
        action: 'save',
        data: { packId, progress },
      });
    }
  }

  /**
   * Load progress from database with smart merge
   */
  async loadProgressFromDatabase(): Promise<void> {
    try {
      if (!this.currentUser) {
        logger.warn('No user authenticated, cannot load progress');
        return;
      }

      const databaseProgress = await supabaseService.getUserProgress(this.currentUser.id);
      const localProgress = storageService.getUserProgress();

      // Smart merge: compare timestamps and merge at word level
      const mergedProgress = this.mergeProgressWithTimestamps(localProgress, databaseProgress);

      // Save merged progress locally
      Object.entries(mergedProgress).forEach(([packIdStr, progress]) => {
        storageService.savePackProgress(packIdStr, progress);
      });

      logger.info('Progress loaded and merged from database');
    } catch (error) {
      logger.error('Failed to load progress from database', error);
      throw error;
    }
  }

  /**
   * Smart merge progress using timestamps
   * Merges at the word level, keeping the most recent status for each word
   */
  private mergeProgressWithTimestamps(
    local: Record<string, PackProgress>,
    remote: Record<number, PackProgress>
  ): Record<string, PackProgress> {
    const merged: Record<string, PackProgress> = {};
    const allPackIds = new Set([
      ...Object.keys(local),
      ...Object.keys(remote).map(String),
    ]);

    for (const packId of allPackIds) {
      const localPack = local[packId];
      const remotePack = remote[Number(packId)];

      if (!localPack && remotePack) {
        // Only exists remotely
        merged[packId] = remotePack;
      } else if (localPack && !remotePack) {
        // Only exists locally
        merged[packId] = localPack;
      } else if (localPack && remotePack) {
        // Exists in both - merge at word level
        const localTime = localPack.lastReviewed ? new Date(localPack.lastReviewed).getTime() : 0;
        const remoteTime = remotePack.lastReviewed ? new Date(remotePack.lastReviewed).getTime() : 0;

        // Merge word statuses - keep both, using most recent timestamp for conflicts
        const mergedWords = { ...remotePack.words };
        const mergedStarred = { ...(remotePack.starred || {}) };

        // If local is newer, overlay local word statuses
        if (localTime >= remoteTime) {
          Object.entries(localPack.words).forEach(([word, status]) => {
            mergedWords[word] = status;
          });
          if (localPack.starred) {
            Object.entries(localPack.starred).forEach(([word, status]) => {
              mergedStarred[word] = status;
            });
          }
        }

        // Take the higher completion count
        const completionCount = Math.max(
          localPack.completionCount || 0,
          remotePack.completionCount || 0
        );

        // Take the most recent lastReviewed
        const lastReviewed = localTime > remoteTime
          ? localPack.lastReviewed
          : remotePack.lastReviewed;

        merged[packId] = {
          words: mergedWords,
          starred: Object.keys(mergedStarred).length > 0 ? mergedStarred : undefined,
          completed: localPack.completed || remotePack.completed,
          completionCount,
          lastReviewed,
        };
      }
    }

    return merged;
  }

  // ========== Custom Packs Sync ==========

  /**
   * Sync local custom packs to database
   */
  async syncLocalCustomPacksToDatabase(): Promise<void> {
    try {
      if (!this.currentUser) {
        return;
      }

      const localPacks = storageService.getCustomPacks();

      if (localPacks.length === 0) {
        logger.info('No local custom packs to sync');
        return;
      }

      if (!navigator.onLine) {
        localPacks.forEach(pack => {
          syncService.addToQueue({
            type: 'customPack',
            action: 'save',
            data: { customPack: pack },
          });
        });
        logger.info('Offline - custom packs queued for sync');
        return;
      }

      await supabaseService.syncCustomPacks(this.currentUser.id, localPacks);
      logger.info('Local custom packs synced to database');
    } catch (error) {
      logger.error('Failed to sync custom packs', error);

      // Queue for retry
      const localPacks = storageService.getCustomPacks();
      localPacks.forEach(pack => {
        syncService.addToQueue({
          type: 'customPack',
          action: 'save',
          data: { customPack: pack },
        });
      });
    }
  }

  /**
   * Load custom packs from database
   */
  async loadCustomPacksFromDatabase(): Promise<void> {
    try {
      if (!this.currentUser) {
        return;
      }

      const remotePacks = await supabaseService.getUserCustomPacks(this.currentUser.id);
      const localPacks = storageService.getCustomPacks();

      // Smart merge custom packs
      const mergedPacks = this.mergeCustomPacks(localPacks, remotePacks);

      // Save merged packs locally
      // Clear and replace to handle deletions
      localStorage.setItem('phonics-app-custom-packs', JSON.stringify(mergedPacks));

      logger.info('Custom packs loaded and merged from database');
    } catch (error) {
      logger.error('Failed to load custom packs from database', error);
    }
  }

  /**
   * Merge custom packs - keeps the most recently updated version
   */
  private mergeCustomPacks(local: CustomPack[], remote: CustomPack[]): CustomPack[] {
    const merged = new Map<string, CustomPack>();

    // Add all remote packs first
    remote.forEach(pack => {
      merged.set(pack.id, pack);
    });

    // Overlay local packs if they're newer
    local.forEach(localPack => {
      const remotePack = merged.get(localPack.id);

      if (!remotePack) {
        // Local pack doesn't exist remotely - add it
        merged.set(localPack.id, localPack);
      } else {
        // Compare timestamps
        const localTime = new Date(localPack.updatedAt).getTime();
        const remoteTime = new Date(remotePack.updatedAt).getTime();

        if (localTime > remoteTime) {
          merged.set(localPack.id, localPack);
        }
      }
    });

    return Array.from(merged.values());
  }

  /**
   * Sync a single custom pack (called after create/update)
   */
  async syncCustomPack(pack: CustomPack): Promise<void> {
    try {
      if (!this.currentUser) {
        return;
      }

      if (!navigator.onLine) {
        syncService.addToQueue({
          type: 'customPack',
          action: 'save',
          data: { customPack: pack },
        });
        return;
      }

      syncService.setSyncing();
      await supabaseService.saveCustomPack(this.currentUser.id, pack);
      syncService.setSuccess();
    } catch (error) {
      logger.error('Failed to sync custom pack', error);
      syncService.setError('Sync failed');

      syncService.addToQueue({
        type: 'customPack',
        action: 'save',
        data: { customPack: pack },
      });
    }
  }

  /**
   * Delete a custom pack from database
   */
  async deleteCustomPackFromDatabase(packId: string): Promise<void> {
    try {
      if (!this.currentUser) {
        return;
      }

      if (!navigator.onLine) {
        syncService.addToQueue({
          type: 'customPack',
          action: 'delete',
          data: { customPack: { id: packId } as CustomPack },
        });
        return;
      }

      syncService.setSyncing();
      await supabaseService.deleteCustomPack(this.currentUser.id, packId);
      syncService.setSuccess();
    } catch (error) {
      logger.error('Failed to delete custom pack from database', error);
      syncService.setError('Delete failed');
    }
  }

  /**
   * Process offline sync queue
   */
  private async processOfflineQueue(): Promise<void> {
    const syncProgress = async (packId: number | string, progress: PackProgress) => {
      if (!this.currentUser) return;
      const numId = typeof packId === 'string' ? parseInt(packId.replace('C', '')) + 10000 : packId;
      await supabaseService.savePackProgress(this.currentUser.id, numId, progress);
    };

    const syncCustomPack = async (pack: CustomPack, action: 'save' | 'delete') => {
      if (!this.currentUser) return;
      if (action === 'delete') {
        await supabaseService.deleteCustomPack(this.currentUser.id, pack.id);
      } else {
        await supabaseService.saveCustomPack(this.currentUser.id, pack);
      }
    };

    await syncService.processQueue(syncProgress, syncCustomPack);
  }
}

// Export singleton instance
export const authService = new AuthService();
