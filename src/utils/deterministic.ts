// Simple deterministic pseudo-random generator for stable layout values.
export function createRng(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(31, h) + seed.charCodeAt(i);
    h |= 0; // force int32
  }
  return () => {
    // Linear congruential step
    h = Math.imul(1664525, h + 1013904223) >>> 0;
    return (h & 0xfffffff) / 0x10000000;
  };
}
