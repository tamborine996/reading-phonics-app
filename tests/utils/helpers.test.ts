/**
 * Tests for helper utilities
 */

import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  extractCleanLabel,
  getWordPreview,
  calculatePackStats,
  formatDate,
  groupPacksBySubPack,
} from '@/utils/helpers';
import type { WordPack, PackProgress } from '@/types';

describe('Helper Functions', () => {
  describe('shuffleArray', () => {
    it('should return array with same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.length).toBe(arr.length);
    });

    it('should contain same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('extractCleanLabel', () => {
    it('should remove pack number prefix', () => {
      const result = extractCleanLabel('P1: SHORT VOWEL A - Pack 1');
      expect(result).toBe('SHORT VOWEL A');
    });

    it('should remove category number', () => {
      const result = extractCleanLabel('1. SHORT VOWEL A - Pack 1');
      expect(result).toBe('SHORT VOWEL A');
    });

    it('should remove pack suffix', () => {
      const result = extractCleanLabel('SHORT VOWEL A - Pack 1');
      expect(result).toBe('SHORT VOWEL A');
    });

    it('should handle complex labels', () => {
      const result = extractCleanLabel('P5: 1. SHORT VOWEL A - Pack 1');
      expect(result).toBe('SHORT VOWEL A');
    });
  });

  describe('getWordPreview', () => {
    it('should return preview of first 4 words', () => {
      const words = ['cat', 'dog', 'bird', 'fish', 'hamster'];
      const result = getWordPreview(words);
      expect(result).toBe('cat, dog, bird, fish...');
    });

    it('should handle arrays shorter than 4', () => {
      const words = ['cat', 'dog'];
      const result = getWordPreview(words);
      expect(result).toBe('cat, dog...');
    });

    it('should handle empty arrays', () => {
      const result = getWordPreview([]);
      expect(result).toBe('No words');
    });

    it('should respect custom count', () => {
      const words = ['cat', 'dog', 'bird', 'fish'];
      const result = getWordPreview(words, 2);
      expect(result).toBe('cat, dog...');
    });
  });

  describe('calculatePackStats', () => {
    const mockPack: WordPack = {
      id: 1,
      category: 'Test Pack',
      subPack: 'Test Sub Pack',
      words: ['cat', 'dog', 'bird', 'fish', 'hamster'],
    };

    it('should return zero stats when no progress', () => {
      const stats = calculatePackStats(mockPack, undefined);
      expect(stats).toEqual({
        totalWords: 5,
        masteredWords: 0,
        trickyWords: 0,
        completionPercentage: 0,
        lastReviewed: null,
      });
    });

    it('should calculate stats correctly', () => {
      const progress: PackProgress = {
        words: {
          cat: 'mastered',
          dog: 'mastered',
          bird: 'tricky',
        },
        completed: false,
        lastReviewed: '2024-01-01T00:00:00.000Z',
      };

      const stats = calculatePackStats(mockPack, progress);
      expect(stats.totalWords).toBe(5);
      expect(stats.masteredWords).toBe(2);
      expect(stats.trickyWords).toBe(1);
      expect(stats.completionPercentage).toBe(40); // 2/5 = 40%
      expect(stats.lastReviewed).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('formatDate', () => {
    it('should return "Never" for null', () => {
      const result = formatDate(null);
      expect(result).toBe('Never');
    });

    it('should format recent dates as relative', () => {
      const now = new Date();
      const result = formatDate(now.toISOString());
      expect(result).toBe('Just now');
    });
  });

  describe('groupPacksBySubPack', () => {
    it('should group packs by subPack', () => {
      const packs: WordPack[] = [
        {
          id: 1,
          category: 'Pack 1',
          subPack: 'Short Vowels',
          words: ['cat'],
        },
        {
          id: 2,
          category: 'Pack 2',
          subPack: 'Short Vowels',
          words: ['dog'],
        },
        {
          id: 3,
          category: 'Pack 3',
          subPack: 'Consonant Blends',
          words: ['flag'],
        },
      ];

      const grouped = groupPacksBySubPack(packs);
      expect(grouped.size).toBe(2);
      expect(grouped.get('Short Vowels')?.length).toBe(2);
      expect(grouped.get('Consonant Blends')?.length).toBe(1);
    });
  });
});
