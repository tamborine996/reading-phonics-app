/**
 * Core type definitions for the Reading Phonics App
 */

export interface WordPack {
  id: number | string; // number for preset packs (1, 2, 3...), string for custom ("C1", "C2"...)
  category: string;
  subPack: string;
  words: string[];
  patterns?: string[]; // Phonics patterns (e.g., ['gh-f-sound', 'consonant-blend'])
  description?: string; // Quick description of the pattern
  editable?: boolean; // True for custom packs, undefined/false for preset packs
}

export interface CustomPack extends WordPack {
  id: string; // "C1", "C2", "C3"...
  name: string; // User-friendly name (e.g., "Homework - Week 1")
  editable: true;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface WordStatus {
  [word: string]: 'tricky' | 'mastered' | 'starred';
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
  packId: number | string; // number for preset packs, string for custom packs ("C1", "C2"...)
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

// Database representation for custom packs
export interface DatabaseCustomPack {
  id: string; // UUID from Supabase
  user_id: string;
  local_id: string; // C1, C2, C3...
  name: string;
  words: string[];
  created_at: string;
  updated_at: string;
  synced_at: string;
}

// Sync status for UI feedback
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline';

export interface SyncState {
  status: SyncStatus;
  lastSyncTime: string | null;
  pendingChanges: number;
  errorMessage?: string;
}

export type Screen = 'home' | 'practice' | 'complete' | 'parent';

export interface AppState {
  currentScreen: Screen;
  userProgress: UserProgress;
  currentSession: PracticeSession | null;
  user: User | null;
}

export type SyllableDictionary = Record<string, string[]>;
