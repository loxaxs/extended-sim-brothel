export type ClassNameArg =
  | undefined
  | string
  | string[]
  | Record<string, boolean | undefined>

export function classNames(...argArray: ClassNameArg[]): string {
  const classes: string[] = []
  argArray.forEach((arg) => {
    if (arg === undefined) {
    } else if (typeof arg === "string") {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      classes.push(...arg)
    } else {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key)
        }
      })
    }
  })
  return classes.join(" ")
}
