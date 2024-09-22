import React, { SetStateAction } from "react"
import { tw } from "../lib/tw"
import { GameState, SaveExtraData } from "../type"
import { Button } from "../ui/button/Button"
import { Card } from "../ui/card/Card"
import { Section } from "../ui/section/Section"

export function loadGame(saveIndex: number): GameState & SaveExtraData {
  let saveName = `save${saveIndex}`
  let save = JSON.parse(localStorage.getItem(saveName) ?? "{}")
  save.index = saveIndex
  save.title = `Save file #${saveIndex}`
  save.name = saveName
  save.hasData = save.day !== undefined
  return save
}

export function saveGame(saveIndex: number, data: GameState) {
  let { index, title, name, ...gameData } = data as any
  localStorage.setItem(`save${saveIndex}`, JSON.stringify(gameData))
}

export function deleteSave(saveIndex: number) {
  localStorage.removeItem(`save${saveIndex}`)
}

export interface SelectSaveFileProp {
  saveCount: number
  saveIndex: number
  saveData?: GameState & SaveExtraData
  setSaveIndex: (value: SetStateAction<number>) => void
}

export function SelectSaveFile(prop: SelectSaveFileProp) {
  let { saveCount, saveIndex, saveData, setSaveIndex } = prop
  let saveArray = Array.from({ length: saveCount }, (_, k) => loadGame(k + 1))
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
      <>
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
      </>
    )
  }

  return (
    <>
      {saveArray.map((baseSave) => {
        let isInUse = baseSave.index === saveData?.index
        if (isInUse) {
          baseSave = saveData!
        }
        return (
          <Card key={baseSave.name} className="m-3">
            <Section
              className={tw({
                "bg-amber-100": isInUse,
              })}
            >
              <span className="inline-block">
                <h4 className="text-lg">{baseSave.title}</h4>
                {baseSave.hasData ? (
                  <p>
                    {" "}
                    Day: {baseSave.day} Gold: {baseSave.gold}
                  </p>
                ) : (
                  ""
                )}
              </span>
              {!isInUse && (
                <span className="inline-block">
                  <Button ml3 onClick={() => setSaveIndex(baseSave.index)}>
                    {baseSave.hasData ? "Load" : "Use"}
                  </Button>
                  {baseSave.hasData && (
                    <Button ml3 onClick={() => setDeleteSaveIndex(baseSave.index)}>
                      Delete
                    </Button>
                  )}
                </span>
              )}
              {isInUse && (
                <Button
                  ml3
                  onClick={() => {
                    saveGame(baseSave.index, baseSave)
                    setSaveIndex(0)
                  }}
                >
                  Save and unload
                </Button>
              )}
              <div>
                {baseSave.hasData &&
                  !isInUse &&
                  emptySaveArray.map((targetSave) => (
                    <Button
                      key={targetSave.index}
                      ml3
                      onClick={() => {
                        saveGame(targetSave.index, baseSave)
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
    </>
  )
}
