import React, { SetStateAction } from "react"
import { GameState } from "../type"
import { Button } from "../ui/button/Button"
import { Card } from "../ui/card/Card"
import { Section } from "../ui/section/Section"

export function load(saveIndex: number): GameState & {
  index: number
  title: string
  name: string
  hasData: boolean
} {
  let saveName = `save${saveIndex}`
  let save = JSON.parse(localStorage.getItem(saveName) ?? "{}")
  save.index = saveIndex
  save.title = `Save file ${saveIndex}`
  save.name = saveName
  save.hasData = save.day !== undefined
  return save
}

export function save(saveIndex: number, data: GameState) {
  let { index, title, name, ...gameData } = data as any
  localStorage.setItem(`save${saveIndex}`, JSON.stringify(gameData))
}

export function deleteSave(saveIndex: number) {
  localStorage.removeItem(`save${saveIndex}`)
}

export interface SelectSaveFileProp {
  setSaveIndex: (value: SetStateAction<number>) => void
}

export function SelectSaveFile(prop: SelectSaveFileProp) {
  let { setSaveIndex } = prop
  let saveArray = Array.from({ length: 3 }, (_, k) => load(k + 1))
  let emptySaveArray = saveArray.filter((baseSave) => !baseSave.hasData)

  let [_, reload] = React.useReducer((x) => !x, false)
  let [deleteSaveIndex, setDeleteSaveIndex] = React.useState(0)

  if (deleteSaveIndex) {
    let save = saveArray[deleteSaveIndex - 1]

    let handleYes = () => {
      deleteSave(deleteSaveIndex)
      setDeleteSaveIndex(0)
    }

    return (
      <div>
        <p>Are you sure you want to delete save file {deleteSaveIndex}?</p>
        <p>
          {" "}
          Day: {save.day} Gold: {save.gold}
        </p>
        <Button ml3 onClick={handleYes}>
          Yes
        </Button>
        <Button ml3 onClick={() => setDeleteSaveIndex(0)}>
          No
        </Button>
      </div>
    )
  }

  return (
    <div>
      {saveArray.map((baseSave) => {
        return (
          <Card key={baseSave.name} className="m-3">
            <Section>
              <span className="inline-block">
                <h4>{baseSave.title}</h4>
                {baseSave.hasData ? (
                  <p>
                    {" "}
                    Day: {baseSave.day} Gold: {baseSave.gold}
                  </p>
                ) : (
                  ""
                )}
              </span>
              <span className="inline-block">
                <Button ml3 onClick={() => setSaveIndex(baseSave.index)}>
                  {baseSave.hasData ? "Load" : "Use"}
                </Button>
                {baseSave.hasData && (
                  <Button
                    ml3
                    onClick={() => setDeleteSaveIndex(baseSave.index)}
                  >
                    Delete
                  </Button>
                )}
              </span>
              <div>
                {baseSave.hasData &&
                  emptySaveArray.map((targetSave) => (
                    <Button
                      ml3
                      onClick={() => {
                        save(targetSave.index, baseSave)
                        reload()
                      }}
                    >
                      Duplicate to save {targetSave.index}
                    </Button>
                  ))}
              </div>
            </Section>
          </Card>
        )
      })}
    </div>
  )
}
