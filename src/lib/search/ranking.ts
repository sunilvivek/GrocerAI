/**
 * Deterministic relevance ranking for hybrid search.
 *
 * Keyword and semantic scores are each normalized to 0–1 and then blended
 * with fixed weights. Keeping this logic here makes it trivially testable and
 * keeps the service layer focused on data access.
 */

export type RankingWeights = {
  keyword: number
  semantic: number
}

export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  keyword: 0.4,
  semantic: 0.6,
}

/**
 * Blends keyword and semantic relevance into a single 0–1 score.
 * When only one source is available, its score stands on its own.
 */
export function combineScores(
  keywordScore: number,
  semanticScore: number | null,
  weights: RankingWeights = DEFAULT_RANKING_WEIGHTS,
): number {
  if (semanticScore === null) return keywordScore
  if (keywordScore === 0 && semanticScore === 0) return 0

  return keywordScore * weights.keyword + semanticScore * weights.semantic
}

/** Clamps a score into the 0–1 range. */
export function clampScore(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/**
 * Normalizes a raw keyword relevance count (e.g. number of matched fields)
 * into a 0–1 score. `maxRelevance` is the highest attainable raw score.
 */
export function normalizeKeywordScore(rawScore: number, maxRelevance: number): number {
  if (maxRelevance <= 0) return 0
  return clampScore(rawScore / maxRelevance)
}