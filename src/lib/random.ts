export function mod(a: number, b: number) {
  return ((a % b) + b) % b
}

export function randomInt(count: number) {
  return Math.floor(Math.random() * count)
}

export function randRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function randomChoice<T>(array: T[]): T {
  return array[randomInt(array.length)]
}

export function randomExtract<T>(count: number, array: T[]): T[] {
  if (count >= array.length) {
    return array
  }
  let arrayCopy = [...array]
  return Array.from({ length: count }, () => {
    return arrayCopy.splice(randomInt(arrayCopy.length), 1)[0]
  })
}
