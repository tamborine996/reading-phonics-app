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
  async initialize(supabaseUrl: string, supabaseKey: string): Promise<void> {
    try {
      this.client = createClient(supabaseUrl, supabaseKey);
      this.initialized = true;
      logger.info('Supabase client initialized successfully');

      // Supabase automatically processes OAuth tokens from URL hash
      // Just give it a moment to complete if tokens are present
      if (window.location.hash && window.location.hash.includes('access_token')) {
        logger.info('OAuth tokens detected, waiting for Supabase auto-processing...');
        // Small delay to let Supabase finish its automatic OAuth handling
        await new Promise(resolve => setTimeout(resolve, 500));
        logger.info('OAuth processing time complete');
      }
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
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<void> {
    if (!this.client) throw new Error('Supabase not initialized');

    try {
      // Get the full base URL including any subdirectories (like /reading-phonics-app/)
      const baseUrl = window.location.origin + window.location.pathname;

      const { error } = await this.client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: baseUrl,
        },
      });

      if (error) {
        logger.error('Google sign in failed', error);
        throw error;
      }

      // Redirect will happen automatically
      logger.info('Redirecting to Google for authentication...');
    } catch (error) {
      logger.error('Google sign in error', error);
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
        .eq('user_id', userId);

      if (error) {
        logger.error('Failed to fetch user progress', error);
        throw error;
      }

      const progress: Record<number, PackProgress> = {};

      data?.forEach((row: DatabasePackProgress) => {
        progress[row.pack_id] = {
          words: row.words,
          starred: row.starred || {},
          completed: row.completed,
          completionCount: row.completion_count || 0,
          lastReviewed: row.last_reviewed,
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
          user_id: userId,
          pack_id: packId,
          words: progress.words,
          starred: progress.starred || {},
          completed: progress.completed,
          completion_count: progress.completionCount || 0,
          last_reviewed: progress.lastReviewed,
          synced_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,pack_id'
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
