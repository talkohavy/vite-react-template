const HEX_CHARS = '0123456789abcdef';
const HASH_LENGTH = 40;
const PREFIX_LENGTH = 3;

function seedFromString(seed: string): number {
  let hashValue = 2166136261;

  for (let index = 0; index < seed.length; index++) {
    hashValue ^= seed.charCodeAt(index);
    hashValue = Math.imul(hashValue, 16777619);
  }

  const normalizedSeed = hashValue >>> 0;

  return normalizedSeed;
}

/**
 * Deterministic PRNG (mulberry32). Same seed -> same sequence, so a given
 * example always renders identical hashes across reloads.
 */
function createRandom(seedValue: number): () => number {
  let state = seedValue;

  function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let result = Math.imul(state ^ (state >>> 15), 1 | state);
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
    const normalized = ((result ^ (result >>> 14)) >>> 0) / 4294967296;

    return normalized;
  }

  return next;
}

/**
 * Creates a seeded hash generator. Every hash it produces is guaranteed to have
 * a unique first-3-char prefix (what the circles display), so nodes stay
 * distinguishable within a single graph.
 */
export function createHashGenerator(props: { seed: string }): () => string {
  const { seed } = props;
  const random = createRandom(seedFromString(seed));
  const usedPrefixes = new Set<string>();

  function buildCandidate(): string {
    let candidate = '';

    for (let index = 0; index < HASH_LENGTH; index++) {
      const charIndex = Math.floor(random() * HEX_CHARS.length);
      candidate += HEX_CHARS[charIndex];
    }

    return candidate;
  }

  function next(): string {
    let candidate = buildCandidate();
    let prefix = candidate.slice(0, PREFIX_LENGTH);

    while (usedPrefixes.has(prefix)) {
      candidate = buildCandidate();
      prefix = candidate.slice(0, PREFIX_LENGTH);
    }

    usedPrefixes.add(prefix);

    return candidate;
  }

  return next;
}
