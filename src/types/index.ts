/**
 * Core type definitions for the Reading Phonics App
 */

export interface WordPack {
  id: number;
  category: string;
  subPack: string;
  words: string[];
  patterns?: string[]; // Phonics patterns (e.g., ['gh-f-sound', 'consonant-blend'])
  description?: string; // Quick description of the pattern
}

export interface WordStatus {
  [word: string]: 'tricky' | 'mastered';
}

export interface PackProgress {
  words: WordStatus;
  starred?: WordStatus; // Words starred by parent for review
  completed: boolean;
  completionCount?: number; // Number of times pack completed
  lastReviewed: string | null; // ISO timestamp
}

export interface UserProgress {
  [packId: string]: PackProgress;
}

export interface SubPackInfo {
  name: string;
  packs: WordPack[];
}

export interface PracticeSession {
  packId: number;
  currentWordIndex: number;
  sessionWords: string[];
  reviewingTricky: boolean;
}

export type TrickyWordLevel = 'global' | 'subpack' | 'pack';

export interface TrickyWordFilter {
  level: TrickyWordLevel;
  subPackName?: string;
  packId?: number;
}

export interface PackStatistics {
  totalWords: number;
  masteredWords: number;
  trickyWords: number;
  completionPercentage: number;
  lastReviewed: string | null;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Database representation (snake_case as stored in Supabase)
export interface DatabasePackProgress {
  user_id: string;
  pack_id: number;
  words: WordStatus;
  starred?: WordStatus;
  completed: boolean;
  completion_count?: number;
  last_reviewed: string | null;
  synced_at: string;
}

export type Screen = 'home' | 'practice' | 'complete' | 'parent';

export interface AppState {
  currentScreen: Screen;
  userProgress: UserProgress;
  currentSession: PracticeSession | null;
  user: User | null;
}

export type SyllableDictionary = Record<string, string[]>;
