import { useState } from "react"

import * as packageInfo from "../package.json"
import { Game } from "./Game"
import { loadGame, saveGame, SelectSaveFile } from "./save/Save"
import { Config } from "./type"

import "./ambient.d"
import { girlImageList } from "./asset/girlAsset"
import { PreloadImageSet } from "./imageSet/PreloadImageSet"

export interface AppProp {
  baseHeight: number
  baseWidth: number
  config: Config
}

export function App(prop: AppProp) {
  let { baseHeight, baseWidth, config } = prop
  let saveCount = 5
  let size = Math.min(baseHeight * 3, baseWidth * 2)
  let [saveIndex, setSaveIndex] = useState(config.save)
  let save = loadGame(saveIndex)

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
          {saveIndex &&
          Array.from({ length: saveCount + 1 })
            .map((_, k) => k)
            .includes(saveIndex) ? (
            <Game
              save={save}
              resetSaveIndex={() => setSaveIndex(0)}
              saveCount={saveCount}
              saveGame={(gameState) => {
                saveGame(saveIndex, gameState)
              }}
              setSaveIndex={setSaveIndex}
              config={config}
            />
          ) : (
            <SelectSaveFile
              saveCount={saveCount}
              saveIndex={saveIndex}
              setSaveIndex={setSaveIndex}
            />
          )}
        </div>
      </div>
      <PreloadImageSet urlArray={girlImageList.map(({ src }) => src)} />
    </div>
  )
}
