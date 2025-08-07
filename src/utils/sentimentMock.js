// src/utils/sentimentMock.js

/**
 * Simple placeholder sentiment logic.
 * Returns 'happy' if text contains the word "love", otherwise 'neutral'.
 * You can replace this with a real API call or more sophisticated analysis later.
 */
export const getSentiment = (text) => {
  if (!text) return 'neutral';
  const lower = text.toLowerCase();
  if (lower.includes('love') || lower.includes('❤️')) {
    return 'happy';
  }
  if (lower.includes('sad') || lower.includes('😢')) {
    return 'sad';
  }
  if (lower.includes('angry') || lower.includes('😡')) {
    return 'angry';
  }
  // Default fallback
  return 'neutral';
};

