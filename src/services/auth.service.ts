/**
 * Authentication service - manages user authentication flow
 */

import type { User, PackProgress } from '@/types';
import { supabaseService } from './supabase.service';
import { storageService } from './storage.service';
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

        // Load server progress first, then sync local changes
        await this.loadProgressFromDatabase();
        await this.syncLocalProgressToDatabase();
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

      // For new users, just sync local progress (nothing to load from server yet)
      await this.syncLocalProgressToDatabase();

      return user;
    } catch (error) {
      logger.error('Sign up failed', error);
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

      // Load server progress first, then sync local changes
      await this.loadProgressFromDatabase();
      await this.syncLocalProgressToDatabase();

      return user;
    } catch (error) {
      logger.error('Sign in failed', error);
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
   * Sync local progress to database
   */
  private async syncLocalProgressToDatabase(): Promise<void> {
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

      await supabaseService.syncProgress(this.currentUser.id, localProgress);
      logger.info('Local progress synced to database');
    } catch (error) {
      logger.error('Failed to sync local progress', error);
      // Don't throw - allow app to continue even if sync fails
    }
  }

  /**
   * Load progress from database to local storage
   */
  async loadProgressFromDatabase(): Promise<void> {
    try {
      if (!this.currentUser) {
        logger.warn('No user authenticated, cannot load progress');
        return;
      }

      const databaseProgress = await supabaseService.getUserProgress(this.currentUser.id);

      // Merge with local progress (database takes precedence)
      const localProgress = storageService.getUserProgress();
      const mergedProgress: Record<number, PackProgress> = { ...localProgress, ...databaseProgress };

      // Save merged progress locally
      Object.entries(mergedProgress).forEach(([packIdStr, progress]) => {
        const packId = parseInt(packIdStr);
        storageService.savePackProgress(packId, progress);
      });

      logger.info('Progress loaded from database');
    } catch (error) {
      logger.error('Failed to load progress from database', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
