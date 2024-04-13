export function mod(a: number, b: number) {
  return ((a % b) + b) % b
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function randomPick<T>(count: number, array: T[]): T[] {
  if (count >= array.length) {
    return array
  }
  let arrayCopy = [...array]
  return Array.from({ length: count }, () => {
    return arrayCopy.splice(Math.floor(Math.random() * arrayCopy.length), 1)[0]
  })
}
