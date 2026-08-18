export function paddedLen(len: number): number {
  return len + ((4 - (len % 4)) % 4);
}
