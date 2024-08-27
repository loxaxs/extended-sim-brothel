import React, { useMemo } from "react"
import { GirlDetailView } from "./girl/GirlDetailView"
import { getGirlArray } from "./girl/girlGroup"
import { Home } from "./Home"
import { Market } from "./market/Market"
import { createMarketManager } from "./market/marketManager"
import { GameState } from "./type"

function newGameState(): GameState {
  let girlArray = getGirlArray()

  girlArray[0].owned = true

  return {
    gold: 100,
    day: 0,
    girlArray,
    placeArray: [],
  }
}

export interface ChangePathAction {
  pathLevelRemovalCount?: number
  pathAddition?: string[]
}

export interface GameProp {
  initialState: GameState
  save: (state: GameState) => void
}

export function Game(prop: GameProp) {
  let initialState =
    prop.initialState.day !== undefined ? prop.initialState : newGameState()
  let [gold, setGold] = React.useState(initialState.gold)
  let [day, setDay] = React.useState(initialState.day)
  let [path, changePath] = React.useReducer(
    (path: string[], action: ChangePathAction) => {
      let { pathAddition = [], pathLevelRemovalCount = 0 } = action
      if (pathLevelRemovalCount > 0) {
        path = path.slice(0, -pathLevelRemovalCount)
      }
      return [...path, ...pathAddition]
    },
    [],
  )
  let [girlArray, setGirlArray] = React.useState(initialState.girlArray)
  let [placeArray, setPlaceArray] = React.useState(initialState.placeArray)
  let marketManager = useMemo(
    () => createMarketManager(girlArray.filter((g) => !g.owned)),
    [],
  )
  let girlByName = useMemo(() => {
    let mapping = {}
    girlArray.forEach((girl) => {
      mapping[girl.name] = girl
    })
    return mapping
  }, [girlArray])

  const handleSave = () => {
    prop.save({
      gold,
      day,
      girlArray,
      placeArray,
    })
  }

  const handleNewDay = () => {
    marketManager.handleNewDay()
    setDay((d) => d + 1)
  }

  return (
    <div className="w-auto">
      {path.length > 0 && (
        <button onClick={() => changePath({ pathLevelRemovalCount: 1 })}>
          {"< Back"}
        </button>
      )}
      <div className="text-xl">
        Gold: {gold} Day: {day}
      </div>
      {{
        ":": () => (
          <Home
            handleNewDay={handleNewDay}
            handleSave={handleSave}
            changePath={changePath}
            girlArray={girlArray}
          />
        ),
        ":market": () => (
          <Market marketManager={marketManager} changePath={changePath} />
        ),
        ":girl": () => (
          <GirlDetailView girl={girlByName[path[0].split(":")[1]]} />
        ),
        ":market:girl": () => (
          <GirlDetailView
            girl={girlByName[path[1].split(":")[1]]}
            marketInfo={{
              gold: gold,
              price: 10,
              buy: (girlName) => {
                marketManager.handleBuy(girlName)
                girlByName[girlName].owned = true
                setGold((g) => g - 10)
                changePath({ pathLevelRemovalCount: 2 })
              },
            }}
          />
        ),
      }[`:${path.map((p) => p.split(":")[0]).join(":")}`]()}
    </div>
  )
}
