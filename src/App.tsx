import React, { useState } from "react"

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
  let [saveIndex, setSaveIndex] = useState(0)
  let state = load(saveIndex)

  return (
    <div
      className="m-auto flex flex-col items-center justify-center bg-amber-200"
      style={{ height: size / 3, width: size / 2 }}
    >
      <div style={{ transform: `scale(${size / 1080 / 2})` }}>
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
  )
}
