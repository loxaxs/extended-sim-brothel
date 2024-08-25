import { GameState } from "../type"

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
