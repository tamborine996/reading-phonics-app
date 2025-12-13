/**
 * Sync service - handles offline queue and sync status
 */

import type { SyncState, PackProgress, CustomPack } from '@/types';
import { logger } from '@/utils/logger';

interface QueuedSync {
  id: string;
  type: 'progress' | 'customPack';
  action: 'save' | 'delete';
  data: {
    packId?: number | string;
    progress?: PackProgress;
    customPack?: CustomPack;
  };
  timestamp: string;
  retryCount: number;
}

export class SyncService {
  private state: SyncState = {
    status: 'idle',
    lastSyncTime: null,
    pendingChanges: 0,
  };
  private queue: QueuedSync[] = [];
  private listeners: ((state: SyncState) => void)[] = [];
  private readonly STORAGE_KEY = 'phonics-app-sync-queue';
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loadQueue();
    this.checkOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  /**
   * Get current sync state
   */
  getState(): SyncState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: SyncState) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Update state and notify listeners
   */
  private setState(updates: Partial<SyncState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
    this.updateStatusIndicator();
  }

  /**
   * Set syncing status
   */
  setSyncing(): void {
    this.setState({ status: 'syncing', errorMessage: undefined });
  }

  /**
   * Set success status
   */
  setSuccess(): void {
    this.setState({
      status: 'success',
      lastSyncTime: new Date().toISOString(),
      errorMessage: undefined,
    });

    // Reset to idle after 2 seconds
    setTimeout(() => {
      if (this.state.status === 'success') {
        this.setState({ status: 'idle' });
      }
    }, 2000);
  }

  /**
   * Set error status
   */
  setError(message: string): void {
    logger.error('Sync error:', message);
    console.error('[SYNC ERROR]', message);
    this.setState({ status: 'error', errorMessage: message });
  }

  /**
   * Add item to sync queue
   */
  addToQueue(item: Omit<QueuedSync, 'id' | 'timestamp' | 'retryCount'>): void {
    const queueItem: QueuedSync = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    this.queue.push(queueItem);
    this.saveQueue();
    this.setState({ pendingChanges: this.queue.length });

    logger.info('Added item to sync queue', { type: item.type, action: item.action });
  }

  /**
   * Remove item from queue
   */
  removeFromQueue(id: string): void {
    this.queue = this.queue.filter(item => item.id !== id);
    this.saveQueue();
    this.setState({ pendingChanges: this.queue.length });
  }

  /**
   * Get all queued items
   */
  getQueue(): QueuedSync[] {
    return [...this.queue];
  }

  /**
   * Process the sync queue
   */
  async processQueue(
    syncProgress: (packId: number | string, progress: PackProgress) => Promise<void>,
    syncCustomPack: (pack: CustomPack, action: 'save' | 'delete') => Promise<void>
  ): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    if (!navigator.onLine) {
      this.setState({ status: 'offline' });
      return;
    }

    this.setSyncing();
    const itemsToProcess = [...this.queue];
    const failedItems: QueuedSync[] = [];

    for (const item of itemsToProcess) {
      try {
        if (item.type === 'progress' && item.data.packId && item.data.progress) {
          await syncProgress(item.data.packId, item.data.progress);
        } else if (item.type === 'customPack' && item.data.customPack) {
          await syncCustomPack(item.data.customPack, item.action);
        }

        this.removeFromQueue(item.id);
        logger.info('Processed queued sync item', { id: item.id });
      } catch (error) {
        logger.error('Failed to process queued sync item', { id: item.id, error });

        item.retryCount++;
        if (item.retryCount < this.MAX_RETRIES) {
          failedItems.push(item);
        } else {
          logger.warn('Max retries reached for sync item, removing from queue', { id: item.id });
          this.removeFromQueue(item.id);
        }
      }
    }

    // Update queue with failed items for retry
    if (failedItems.length > 0) {
      this.queue = failedItems;
      this.saveQueue();
      this.setState({
        status: 'error',
        pendingChanges: failedItems.length,
        errorMessage: `${failedItems.length} item(s) failed to sync. Will retry.`,
      });
      this.scheduleRetry(syncProgress, syncCustomPack);
    } else if (this.queue.length === 0) {
      this.setSuccess();
    }
  }

  /**
   * Schedule a retry for failed items
   */
  private scheduleRetry(
    syncProgress: (packId: number | string, progress: PackProgress) => Promise<void>,
    syncCustomPack: (pack: CustomPack, action: 'save' | 'delete') => Promise<void>
  ): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    this.retryTimeout = setTimeout(() => {
      if (navigator.onLine && this.queue.length > 0) {
        logger.info('Retrying failed sync items');
        this.processQueue(syncProgress, syncCustomPack);
      }
    }, this.RETRY_DELAY);
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logger.error('Failed to save sync queue', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        this.setState({ pendingChanges: this.queue.length });
      }
    } catch (error) {
      logger.error('Failed to load sync queue', error);
      this.queue = [];
    }
  }

  /**
   * Check online status
   */
  private checkOnlineStatus(): void {
    if (!navigator.onLine) {
      this.setState({ status: 'offline' });
    }
  }

  /**
   * Handle coming online
   */
  private handleOnline(): void {
    logger.info('Device came online');
    if (this.state.status === 'offline') {
      this.setState({ status: 'idle' });
    }
  }

  /**
   * Handle going offline
   */
  private handleOffline(): void {
    logger.info('Device went offline');
    this.setState({ status: 'offline' });
  }

  /**
   * Update the visual status indicator
   * Disabled - sync status is handled silently in the background
   */
  private updateStatusIndicator(): void {
    // Sync status indicator disabled - syncing happens silently
    // Remove any existing indicator
    const indicator = document.getElementById('sync-status-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// Export singleton instance
export const syncService = new SyncService();
