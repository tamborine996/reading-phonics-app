/**
 * Supabase service - handles all database operations
 * This will replace localStorage for cross-device sync
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { User, DatabasePackProgress, PackProgress } from '@/types';
import { SUPABASE_CONFIG } from '@/constants/config';
import { logger } from '@/utils/logger';

export class SupabaseService {
  private client: SupabaseClient | null = null;
  private initialized = false;

  /**
   * Initialize Supabase client with credentials
   * Note: In production, these should be environment variables
   */
  initialize(supabaseUrl: string, supabaseKey: string): void {
    try {
      this.client = createClient(supabaseUrl, supabaseKey);
      this.initialized = true;
      logger.info('Supabase client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Supabase client', error);
      throw error;
    }
  }

  /**
   * Check if Supabase is initialized
   */
  isInitialized(): boolean {
    return this.initialized && this.client !== null;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.client) {
      logger.warn('Supabase not initialized');
      return null;
    }

    try {
      const { data, error } = await this.client.auth.getUser();

      if (error) {
        // AuthSessionMissingError is expected when not logged in - not an actual error
        if (error.name === 'AuthSessionMissingError' || error.message.includes('session missing')) {
          logger.info('No user session (not logged in)');
          return null;
        }
        logger.error('Failed to get current user', error);
        return null;
      }

      if (!data.user) {
        return null;
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || data.user.created_at,
      };
    } catch (error) {
      // Session missing is normal when not logged in
      if (error instanceof Error && error.message.includes('session missing')) {
        return null;
      }
      logger.error('Error getting current user', error);
      return null;
    }
  }

  /**
   * Sign up new user
   */
  async signUp(email: string, password: string): Promise<User | null> {
    if (!this.client) throw new Error('Supabase not initialized');

    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
      });

      if (error) {
        logger.error('Sign up failed', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from sign up');
      }

      logger.info('User signed up successfully', { email });

      return {
        id: data.user.id,
        email: data.user.email || '',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || data.user.created_at,
      };
    } catch (error) {
      logger.error('Sign up error', error);
      throw error;
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string): Promise<User | null> {
    if (!this.client) throw new Error('Supabase not initialized');

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Sign in failed', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from sign in');
      }

      logger.info('User signed in successfully', { email });

      return {
        id: data.user.id,
        email: data.user.email || '',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || data.user.created_at,
      };
    } catch (error) {
      logger.error('Sign in error', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (!this.client) throw new Error('Supabase not initialized');

    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        logger.error('Sign out failed', error);
        throw error;
      }

      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Sign out error', error);
      throw error;
    }
  }

  /**
   * Get all pack progress for current user
   */
  async getUserProgress(userId: string): Promise<Record<number, PackProgress>> {
    if (!this.client) throw new Error('Supabase not initialized');

    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLE_NAMES.PACK_PROGRESS)
        .select('*')
        .eq('userId', userId);

      if (error) {
        logger.error('Failed to fetch user progress', error);
        throw error;
      }

      const progress: Record<number, PackProgress> = {};

      data?.forEach((row: DatabasePackProgress) => {
        progress[row.packId] = {
          words: row.words,
          completed: row.completed,
          lastReviewed: row.lastReviewed,
        };
      });

      logger.info('Fetched user progress', { packCount: Object.keys(progress).length });
      return progress;
    } catch (error) {
      logger.error('Error fetching user progress', error);
      throw error;
    }
  }

  /**
   * Save pack progress for user
   */
  async savePackProgress(
    userId: string,
    packId: number,
    progress: PackProgress
  ): Promise<void> {
    if (!this.client) throw new Error('Supabase not initialized');

    try {
      const { error } = await this.client
        .from(SUPABASE_CONFIG.TABLE_NAMES.PACK_PROGRESS)
        .upsert({
          userId,
          packId,
          words: progress.words,
          completed: progress.completed,
          lastReviewed: progress.lastReviewed,
          syncedAt: new Date().toISOString(),
        });

      if (error) {
        logger.error('Failed to save pack progress', error);
        throw error;
      }

      logger.info(`Saved pack progress for pack ${packId}`);
    } catch (error) {
      logger.error('Error saving pack progress', error);
      throw error;
    }
  }

  /**
   * Sync local progress to database
   */
  async syncProgress(
    userId: string,
    localProgress: Record<number, PackProgress>
  ): Promise<void> {
    if (!this.client) throw new Error('Supabase not initialized');

    try {
      const promises = Object.entries(localProgress).map(([packId, progress]) =>
        this.savePackProgress(userId, parseInt(packId), progress)
      );

      await Promise.all(promises);
      logger.info('Successfully synced all progress to database');
    } catch (error) {
      logger.error('Failed to sync progress', error);
      throw error;
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
