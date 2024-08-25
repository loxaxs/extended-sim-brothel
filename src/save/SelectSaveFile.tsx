import React, { SetStateAction } from "react"
import { Button } from "../button/Button"
import { deleteSave, load, save } from "./save"

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
        <Button onClick={handleYes}>Yes</Button>
        <Button onClick={() => setDeleteSaveIndex(0)}>No</Button>
      </div>
    )
  }

  return (
    <div>
      {saveArray.map((baseSave) => {
        return (
          <li
            key={baseSave.name}
            className="m-3 list-none rounded-lg border border-black p-1"
          >
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
              <Button onClick={() => setSaveIndex(baseSave.index)}>
                {baseSave.hasData ? "Load" : "Use"}
              </Button>
              {baseSave.hasData &&
                emptySaveArray.map((targetSave) => (
                  <Button
                    onClick={() => {
                      save(targetSave.index, baseSave)
                      reload()
                    }}
                  >
                    Duplicate to save {targetSave.index}
                  </Button>
                ))}
              {baseSave.hasData && (
                <Button onClick={() => setDeleteSaveIndex(baseSave.index)}>
                  Delete
                </Button>
              )}
            </span>
          </li>
        )
      })}
    </div>
  )
}
