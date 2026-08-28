let chain: Promise<unknown> = Promise.resolve();

/** Serialize all SQLite work onto one connection (wa-sqlite async is not re-entrant). */
export function withDb<T>(fn: () => Promise<T>): Promise<T> {
  const result = chain.then(fn, fn);
  chain = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}
