/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  APP_NAME: 'Word Practice - Phonics Packs',
  VERSION: '2.0.0',
  LOCAL_STORAGE_KEY: 'readingAppProgress',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

export const SUPABASE_CONFIG = {
  TABLE_NAMES: {
    USERS: 'users',
    PACK_PROGRESS: 'pack_progress',
    USER_SESSIONS: 'user_sessions',
  },
} as const;

export const UI_CONFIG = {
  WORDS_PER_PAGE: 30,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
} as const;

export const WORD_STATUS = {
  TRICKY: 'tricky',
  MASTERED: 'mastered',
} as const;
