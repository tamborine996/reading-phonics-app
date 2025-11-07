/**
 * Core type definitions for the Reading Phonics App
 */

export interface WordPack {
  id: number;
  category: string;
  subPack: string;
  words: string[];
}

export interface WordStatus {
  [word: string]: 'tricky' | 'mastered';
}

export interface PackProgress {
  words: WordStatus;
  completed: boolean;
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

export interface DatabasePackProgress extends PackProgress {
  userId: string;
  packId: number;
  syncedAt: string;
}

export type Screen = 'home' | 'practice' | 'complete' | 'parent';

export interface AppState {
  currentScreen: Screen;
  userProgress: UserProgress;
  currentSession: PracticeSession | null;
  user: User | null;
}
