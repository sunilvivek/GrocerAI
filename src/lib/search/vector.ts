/** Serializes a numeric vector to pgvector's `[1.0,2.0]` text format. */
export function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`
}

/** Parses a pgvector text literal back into a numeric array. */
export function vectorToArray(literal: string): number[] {
  return literal
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((value) => Number(value))
}