export function arrayDeduplication<T>(arr: T[]): T[] {
  const set = new Set<T>(arr);
  return Array.from(set);
}

export function isDef(v: any): boolean {
  return typeof v !== 'undefined' && v !== null;
}
