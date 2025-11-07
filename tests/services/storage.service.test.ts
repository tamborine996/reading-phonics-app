/**
 * Tests for storage service
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '@/services/storage.service';
import type { PackProgress } from '@/types';

describe('StorageService', () => {
  beforeEach(() => {
    storageService.clearAllProgress();
  });

  describe('getUserProgress', () => {
    it('should return empty object when no progress exists', () => {
      const progress = storageService.getUserProgress();
      expect(progress).toEqual({});
    });

    it('should return saved progress', () => {
      const mockProgress: PackProgress = {
        words: { word1: 'mastered', word2: 'tricky' },
        completed: false,
        lastReviewed: null,
      };

      storageService.savePackProgress(1, mockProgress);
      const progress = storageService.getUserProgress();

      expect(progress[1]).toEqual(mockProgress);
    });
  });

  describe('savePackProgress', () => {
    it('should save pack progress successfully', () => {
      const mockProgress: PackProgress = {
        words: { test: 'mastered' },
        completed: false,
        lastReviewed: null,
      };

      const result = storageService.savePackProgress(1, mockProgress);
      expect(result).toBe(true);

      const saved = storageService.getPackProgress(1);
      expect(saved).toEqual(mockProgress);
    });

    it('should update existing pack progress', () => {
      const initialProgress: PackProgress = {
        words: { test: 'mastered' },
        completed: false,
        lastReviewed: null,
      };

      storageService.savePackProgress(1, initialProgress);

      const updatedProgress: PackProgress = {
        words: { test: 'tricky', test2: 'mastered' },
        completed: true,
        lastReviewed: '2024-01-01T00:00:00.000Z',
      };

      storageService.savePackProgress(1, updatedProgress);

      const saved = storageService.getPackProgress(1);
      expect(saved).toEqual(updatedProgress);
    });
  });

  describe('updateWordStatus', () => {
    it('should update word status for existing progress', () => {
      const initialProgress: PackProgress = {
        words: {},
        completed: false,
        lastReviewed: null,
      };

      storageService.savePackProgress(1, initialProgress);
      storageService.updateWordStatus(1, 'test', 'mastered');

      const progress = storageService.getPackProgress(1);
      expect(progress?.words['test']).toBe('mastered');
    });

    it('should create new progress if none exists', () => {
      storageService.updateWordStatus(1, 'test', 'tricky');

      const progress = storageService.getPackProgress(1);
      expect(progress?.words['test']).toBe('tricky');
    });

    it('should update lastReviewed timestamp', () => {
      storageService.updateWordStatus(1, 'test', 'mastered');

      const progress = storageService.getPackProgress(1);
      expect(progress?.lastReviewed).toBeTruthy();
    });
  });

  describe('markPackCompleted', () => {
    it('should mark pack as completed', () => {
      const initialProgress: PackProgress = {
        words: { test: 'mastered' },
        completed: false,
        lastReviewed: null,
      };

      storageService.savePackProgress(1, initialProgress);
      storageService.markPackCompleted(1);

      const progress = storageService.getPackProgress(1);
      expect(progress?.completed).toBe(true);
      expect(progress?.lastReviewed).toBeTruthy();
    });

    it('should return false if pack does not exist', () => {
      const result = storageService.markPackCompleted(999);
      expect(result).toBe(false);
    });
  });

  describe('clearAllProgress', () => {
    it('should clear all progress', () => {
      storageService.updateWordStatus(1, 'test', 'mastered');
      storageService.updateWordStatus(2, 'test', 'tricky');

      storageService.clearAllProgress();

      const progress = storageService.getUserProgress();
      expect(progress).toEqual({});
    });
  });

  describe('exportProgress', () => {
    it('should export progress as JSON string', () => {
      storageService.updateWordStatus(1, 'test', 'mastered');

      const exported = storageService.exportProgress();
      const parsed = JSON.parse(exported);

      expect(parsed[1].words.test).toBe('mastered');
    });
  });

  describe('importProgress', () => {
    it('should import progress from JSON string', () => {
      const mockProgress = {
        '1': {
          words: { test: 'mastered' },
          completed: false,
          lastReviewed: null,
        },
      };

      const jsonString = JSON.stringify(mockProgress);
      const result = storageService.importProgress(jsonString);

      expect(result).toBe(true);

      const progress = storageService.getPackProgress(1);
      expect(progress?.words.test).toBe('mastered');
    });

    it('should return false for invalid JSON', () => {
      const result = storageService.importProgress('invalid json');
      expect(result).toBe(false);
    });
  });
});
