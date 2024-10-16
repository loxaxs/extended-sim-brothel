import React, { SetStateAction } from "react"
import { useT } from "src/i18n/useT"
import { tw } from "../lib/tw"
import { GameState, SaveExtraData, TFunction } from "../type"
import { Button } from "../ui/button/Button"
import { Card } from "../ui/card/Card"
import { Section } from "../ui/section/Section"

export function loadGame(saveIndex: number, t: TFunction): GameState & SaveExtraData {
  let saveName = `save${saveIndex}`
  let save = JSON.parse(localStorage.getItem(saveName) ?? "{}")
  save.index = saveIndex
  save.title = t(`Save file #{index}`, { index: saveIndex })
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
  saveData?: GameState & SaveExtraData
  setSaveIndex: (value: SetStateAction<number>) => void
}

export function SelectSaveFile(prop: SelectSaveFileProp) {
  let { saveCount, saveData, setSaveIndex } = prop
  let { t } = useT()
  let saveArray = Array.from({ length: saveCount }, (_, k) => loadGame(k + 1, t))
  let emptySaveArray = saveArray.filter((baseSave) => !baseSave.hasData)

  let [_, reload] = React.useReducer((x) => !x, false)
  let [deleteSaveIndex, setDeleteSaveIndex] = React.useState(0)

  if (deleteSaveIndex) {
    let save = saveArray[deleteSaveIndex - 1]

    let handleYes = () => {
      deleteSave(deleteSaveIndex)
      setDeleteSaveIndex(0)
    }

    let girlCount = save.girlArray.filter((g) => g.owned).length

    return (
      <>
        <p>{t("Are you sure you want to delete save file {index}?", { index: deleteSaveIndex })}</p>
        <p>
          {" "}
          {t("Day")}: {save.day} {t("Girls")}: {girlCount} {t("Gold")}: {save.gold}
        </p>
        <Button ml3 onClick={handleYes}>
          {t("Yes")}
        </Button>
        <Button ml3 onClick={() => setDeleteSaveIndex(0)}>
          {t("No")}
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
        let girlCount = baseSave.hasData ? baseSave.girlArray.filter((g) => g.owned).length : 0
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
                    {t("Day")}: {baseSave.day} {t("Girls")}: {girlCount} {t("Gold")}:{" "}
                    {baseSave.gold}
                  </p>
                ) : (
                  ""
                )}
              </span>
              {!isInUse && (
                <span className="inline-block">
                  <Button ml3 onClick={() => setSaveIndex(baseSave.index)}>
                    {baseSave.hasData ? t("Load") : t("Use")}
                  </Button>
                  {baseSave.hasData && (
                    <Button ml3 onClick={() => setDeleteSaveIndex(baseSave.index)}>
                      {t("Delete")}
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
                      {t("Duplicate to save {index}", { index: targetSave.index })}
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
