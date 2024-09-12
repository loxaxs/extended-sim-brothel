import { useState } from "react"

import * as packageInfo from "../package.json"
import "./ambient.d"
import { Game } from "./Game"
import { load, save, SelectSaveFile } from "./save/Save"

export interface AppProp {
  baseHeight: number
  baseWidth: number
}

export function App(prop: AppProp) {
  let { baseHeight, baseWidth } = prop
  let size = Math.min(baseHeight * 3, baseWidth * 2)
  let [saveIndex, setSaveIndex] = useState(+location.hash.slice(1) || 0)
  let state = load(saveIndex)

  return (
    <div
      className="m-auto flex flex-col items-center justify-center bg-amber-200"
      style={{ height: size / 3, width: size / 2 }}
    >
      <div
        style={{
          transform: `scale(${size / 1080 / 2})`,
          width: 960,
          height: 640,
        }}
        className="table"
      >
        <a className="absolute right-0 top-0" href={packageInfo.repository.url}>
          ESB-{packageInfo.version}
        </a>
        <div className="mx-auto table-cell justify-center align-middle">
          {saveIndex ? (
            <Game
              initialState={state}
              save={(gameState) => {
                save(saveIndex, gameState)
              }}
            />
          ) : (
            <SelectSaveFile setSaveIndex={setSaveIndex} />
          )}
        </div>
      </div>
    </div>
  )
}
