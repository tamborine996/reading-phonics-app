/**
 * Validation utilities
 */

import type { WordPack, PackProgress } from '@/types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateWordPack(pack: unknown): pack is WordPack {
  if (!pack || typeof pack !== 'object') {
    throw new ValidationError('Pack must be an object');
  }

  const p = pack as Partial<WordPack>;

  if (typeof p.id !== 'number' || p.id < 0) {
    throw new ValidationError('Pack id must be a non-negative number');
  }

  if (typeof p.category !== 'string' || !p.category.trim()) {
    throw new ValidationError('Pack category must be a non-empty string');
  }

  if (typeof p.subPack !== 'string' || !p.subPack.trim()) {
    throw new ValidationError('Pack subPack must be a non-empty string');
  }

  if (!Array.isArray(p.words) || p.words.length === 0) {
    throw new ValidationError('Pack words must be a non-empty array');
  }

  if (!p.words.every((w) => typeof w === 'string' && w.trim())) {
    throw new ValidationError('All words must be non-empty strings');
  }

  return true;
}

export function validatePackProgress(progress: unknown): progress is PackProgress {
  if (!progress || typeof progress !== 'object') {
    throw new ValidationError('Progress must be an object');
  }

  const p = progress as Partial<PackProgress>;

  if (!p.words || typeof p.words !== 'object') {
    throw new ValidationError('Progress must have a words object');
  }

  if (typeof p.completed !== 'boolean') {
    throw new ValidationError('Progress completed must be a boolean');
  }

  if (p.lastReviewed !== null && typeof p.lastReviewed !== 'string') {
    throw new ValidationError('Progress lastReviewed must be a string or null');
  }

  return true;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
