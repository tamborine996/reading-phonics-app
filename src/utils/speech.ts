/**
 * Text-to-speech utility using Web Speech API
 */

import { logger } from './logger';

class SpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private initialized = false;

  /**
   * Initialize the speech service
   */
  initialize(): void {
    if (!('speechSynthesis' in window)) {
      logger.warn('Speech synthesis not supported in this browser');
      return;
    }

    this.synthesis = window.speechSynthesis;

    // Wait for voices to load
    const loadVoices = () => {
      const voices = this.synthesis!.getVoices();

      // Try to find a British English voice first for proper phonics
      this.voice = voices.find(v => v.lang === 'en-GB') ||
                   voices.find(v => v.lang.startsWith('en-')) ||
                   voices[0] || null;

      if (this.voice) {
        logger.info('Speech service initialized', { voice: this.voice.name, lang: this.voice.lang });
        this.initialized = true;
      }
    };

    // Voices may load asynchronously
    if (this.synthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Check if speech is available
   */
  isAvailable(): boolean {
    return this.initialized && this.synthesis !== null;
  }

  /**
   * Speak a word
   */
  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): void {
    if (!this.isAvailable()) {
      logger.warn('Speech synthesis not available');
      return;
    }

    try {
      // Cancel any ongoing speech
      this.synthesis!.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      if (this.voice) {
        utterance.voice = this.voice;
      }

      // Set options with defaults
      utterance.rate = options?.rate ?? 0.9; // Slightly slower for learning
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      this.synthesis!.speak(utterance);
      logger.info('Speaking word', { text });
    } catch (error) {
      logger.error('Failed to speak word', error);
    }
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

// Export singleton instance
export const speechService = new SpeechService();
