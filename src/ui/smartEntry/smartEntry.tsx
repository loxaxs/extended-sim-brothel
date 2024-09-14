import { useContext, useReducer } from "react"
import { gameContext } from "src/context/context"

export interface AutonomousSmartEntry {
  className?: string
  container: Record<string, any>
  formatter?: (value: string) => string
  keyName: string
}

export function AutonomousSmartEntry(prop: AutonomousSmartEntry) {
  let { className, container, formatter, keyName } = prop
  let { devMode } = useContext(gameContext)
  let [, rerender] = useReducer((x) => !x, false)
  if (devMode) {
    return (
      <input
        type="text"
        className={className}
        value={container[keyName]}
        onChange={(ev) => {
          let value = Number(ev.currentTarget.value)
          if (!Number.isNaN(value)) {
            container[keyName] = value
            rerender()
          }
        }}
      ></input>
    )
  } else {
    let value = container[keyName]
    return formatter?.(value) ?? value
  }
}

export interface ControlledSmartEntryProp {
  className?: string
  formatter?: (value: string) => string
  setter: (value: string) => void
  value: string
}

export function ControlledSmartEntry<T>(prop: ControlledSmartEntryProp) {
  let { className, formatter, setter, value } = prop
  let { devMode } = useContext(gameContext)
  if (devMode) {
    return (
      <input
        type="text"
        className={className}
        value={value}
        onChange={(ev) => {
          setter(ev.currentTarget.value)
        }}
      ></input>
    )
  } else {
    return formatter?.(value) ?? value
  }
}
