import React, { useState } from "react"

import "./ambient.d"
import { Game } from "./Game"
import { load, save } from "./save/save"
import { SelectSaveFile } from "./save/SelectSaveFile"

export interface AppProp {
  baseHeight: number
  baseWidth: number
}

export function App(prop: AppProp) {
  let { baseHeight, baseWidth } = prop
  let size = Math.min(baseHeight * 4, baseWidth * 3)
  let [saveIndex, setSaveIndex] = useState(0)
  let state = load(saveIndex)

  return (
    <div
      className="m-auto flex flex-col items-center justify-center bg-amber-200"
      style={{ height: size / 4, width: size / 3 }}
    >
      <div
        style={{ transform: `scale(${size / 1080 / 3})` }}
        className="w-auto"
      >
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
