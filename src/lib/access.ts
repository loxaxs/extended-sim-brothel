export function access<TKey extends string, TValue>(mapping: Record<TKey, () => TValue>, key) {
  let f = mapping[key]
  if (!f) {
    throw new Error(`Access key not found in mapping: ${key}`)
  }
  return f()
}
