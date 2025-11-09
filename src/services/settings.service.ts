/**
 * Settings service for managing user preferences
 */

import { logger } from '@/utils/logger';

export interface AppSettings {
  showSyllables: boolean;
  syllableSeparator: '•' | '-' | '·';
}

const SETTINGS_KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  showSyllables: true,
  syllableSeparator: '•',
};

class SettingsService {
  private settings: AppSettings = DEFAULT_SETTINGS;

  /**
   * Initialize settings from localStorage
   */
  initialize(): void {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        logger.info('Settings loaded from localStorage', this.settings);
      } else {
        this.settings = DEFAULT_SETTINGS;
        this.save();
        logger.info('Initialized default settings', this.settings);
      }
    } catch (error) {
      logger.error('Failed to load settings, using defaults', error);
      this.settings = DEFAULT_SETTINGS;
    }
  }

  /**
   * Get current settings
   */
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  /**
   * Get specific setting
   */
  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.settings[key];
  }

  /**
   * Update settings
   */
  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.settings[key] = value;
    this.save();
    logger.info('Setting updated', { key, value });
  }

  /**
   * Update multiple settings at once
   */
  updateSettings(updates: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.save();
    logger.info('Settings updated', updates);
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.settings = DEFAULT_SETTINGS;
    this.save();
    logger.info('Settings reset to defaults');
  }

  /**
   * Save settings to localStorage
   */
  private save(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      logger.error('Failed to save settings', error);
    }
  }
}

export const settingsService = new SettingsService();
