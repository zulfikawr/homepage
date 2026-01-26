/**
 * Calculates a score for a string against a query.
 * Higher score means better match.
 * 0 means no match.
 */
export function fuzzyScore(text: string, query: string): number {
  if (!text || !query) return 0;

  const t = text.toLowerCase();
  const q = query.toLowerCase();

  if (t === q) return 10000;
  if (t.startsWith(q)) return 8000;
  if (t.includes(q)) return 6000;

  // Fuzzy match (non-contiguous)
  let score = 0;
  let queryIdx = 0;
  let lastMatchIdx = -1;

  for (let i = 0; i < t.length && queryIdx < q.length; i++) {
    if (t[i] === q[queryIdx]) {
      // Base match points
      score += 100;

      // Bonus for matches that are close together
      if (lastMatchIdx !== -1 && i === lastMatchIdx + 1) {
        score += 150;
      }

      // Bonus for matching at word starts
      if (i === 0 || t[i - 1] === ' ' || t[i - 1] === '-' || t[i - 1] === '_') {
        score += 200;
      }

      // Bonus for camelCase word starts
      if (
        i > 0 &&
        t[i] !== t[i].toLowerCase() &&
        t[i - 1] === t[i - 1].toLowerCase()
      ) {
        score += 150;
      }

      queryIdx++;
      lastMatchIdx = i;
    } else {
      // Penalty for gaps
      score -= 10;
    }
  }

  // Ensure all query characters were found
  if (queryIdx === q.length) {
    return Math.max(1, score);
  }

  return 0;
}

/**
 * Ranks items based on multiple fields.
 */
export function calculateRank(
  title: string,
  secondary: string | undefined | null,
  query: string,
): number {
  const titleScore = fuzzyScore(title, query);
  const secondaryScore = fuzzyScore(secondary || '', query);

  // Heavily weight title matches
  if (titleScore > 0) {
    return titleScore + 10000;
  }

  return secondaryScore;
}
