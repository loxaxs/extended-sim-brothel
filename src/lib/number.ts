export function formatBigNumber(num: number): string {
  let t = String(num).split("").reverse()
  for (let i = 3; i < t.length; i += 4) {
    t.splice(i, 0, " ")
  }
  return t.reverse().join("")
}
