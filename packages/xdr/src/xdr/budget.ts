/** Resource limits for one reader or writer. */
export interface CodecLimits {
  /** Maximum nested value levels. Default: 128. */
  maxDepth?: number;
  /** Maximum decoded value visits. Default: min(100000, 1024 + 16 * input bytes). */
  maxWork?: number;
}

function limit(value: number, name: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a nonnegative safe integer`);
  }
  return value;
}

/** Shared value-depth accounting for XDR and CXS writers. */
export class EncodeBudget {
  private depth = 0;
  private readonly maxDepth: number;

  /** Create a budget. Encoding uses only maxDepth. */
  constructor(limits: CodecLimits = {}) {
    this.maxDepth = limit(limits.maxDepth ?? 128, "maxDepth");
  }

  /** Enter one value. Aliases must not enter a second time. */
  enter(): void {
    if (this.depth >= this.maxDepth) throw new Error("XDR encode depth limit exceeded");
    this.depth++;
  }

  /** Leave a value in a finally block after a successful enter. */
  leave(): void { this.depth--; }
}

/** Reader-owned depth and work limits, shared by all codecs on that reader. */
export class DecodeBudget {
  private depth = 0;
  private remaining: number;
  private readonly maxDepth: number;

  /** Allow small zero-width values, with at most 100,000 value visits. */
  constructor(inputBytes: number, limits: CodecLimits = {}) {
    this.maxDepth = limit(limits.maxDepth ?? 128, "maxDepth");
    this.remaining = limit(limits.maxWork ?? Math.min(100_000, 1024 + 16 * inputBytes), "maxWork");
  }

  /** Check a collection before allocating it; individual values charge the work. */
  checkCapacity(count: number): void {
    if (!Number.isSafeInteger(count) || count < 0 || count > this.remaining) {
      throw new Error("XDR decode work budget exceeded");
    }
  }

  /** Charge one value and enter its nesting level. */
  enter(): void {
    this.checkCapacity(1);
    if (this.depth >= this.maxDepth) throw new Error("XDR decode depth limit exceeded");
    this.remaining--;
    this.depth++;
  }

  /** Leave a value in a finally block. Work is never refunded. */
  leave(): void { this.depth--; }
}
