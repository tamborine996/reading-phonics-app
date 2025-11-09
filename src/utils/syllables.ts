/**
 * Syllable splitting utility for displaying words with syllable separators
 */

/**
 * Simple syllable splitting based on common phonics patterns
 * This is a heuristic approach suitable for young learners
 */
export function splitIntoSyllables(word: string): string[] {
  if (!word || word.length <= 3) {
    return [word];
  }

  const lower = word.toLowerCase();
  const syllables: string[] = [];
  let current = '';

  // Common vowel patterns
  const vowels = 'aeiouy';
  const isVowel = (char: string) => vowels.includes(char.toLowerCase());

  // Split using simple rules:
  // 1. Between consonant and vowel (except at start)
  // 2. Between double consonants
  // 3. Before consonant-le endings

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const lower_char = lower[i];
    const next = lower[i + 1];
    const nextNext = lower[i + 2];

    current += char;

    // Check for syllable break
    let shouldBreak = false;

    // Rule: consonant-le at end (like "table" -> "ta-ble")
    if (i < word.length - 2 && !isVowel(lower_char) && next === 'l' && nextNext === 'e' && i > 0) {
      shouldBreak = true;
    }
    // Rule: between double consonants (like "rabbit" -> "rab-bit")
    else if (i > 0 && i < word.length - 1 && !isVowel(lower_char) && !isVowel(next) && lower_char === next) {
      shouldBreak = true;
    }
    // Rule: between consonant and vowel after a vowel (like "robot" -> "ro-bot")
    else if (i > 0 && i < word.length - 1 && !isVowel(lower_char) && isVowel(next) && isVowel(lower[i - 1])) {
      shouldBreak = true;
    }
    // Rule: vowel-consonant-consonant-vowel (like "basket" -> "bas-ket")
    else if (i > 0 && i < word.length - 2 &&
             isVowel(lower[i - 1]) &&
             !isVowel(lower_char) &&
             !isVowel(next) &&
             isVowel(nextNext)) {
      shouldBreak = true;
    }

    if (shouldBreak && current.length > 1) {
      syllables.push(current);
      current = '';
    }
  }

  if (current) {
    syllables.push(current);
  }

  // If no syllables were created, return the whole word
  return syllables.length > 0 ? syllables : [word];
}

/**
 * Format word with syllable separators for display
 * @param word The word to format
 * @param separator The separator to use (default: '•')
 * @param enabled Whether syllable display is enabled
 */
export function formatWordWithSyllables(
  word: string,
  separator: string = '•',
  enabled: boolean = true
): string {
  if (!enabled) {
    return word;
  }

  const syllables = splitIntoSyllables(word);

  // Only show separator if word has multiple syllables
  if (syllables.length <= 1) {
    return word;
  }

  return syllables
    .map((syllable, index) => {
      if (index < syllables.length - 1) {
        return `${syllable}<span class="word-syllable-separator">${separator}</span>`;
      }
      return syllable;
    })
    .join('');
}

/**
 * Get syllable count for a word
 */
export function getSyllableCount(word: string): number {
  return splitIntoSyllables(word).length;
}
