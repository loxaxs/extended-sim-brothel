import React, { useMemo } from "react"
import {
  BuyBuilding,
  BuyBuildingConfirm,
  getBuildingArray,
} from "./building/Building"
import { GirlDetailView } from "./girl/GirlDetailView"
import { getGirlArray } from "./girl/girlGroup"
import { Home } from "./home/Home"
import { access } from "./lib/access"
import { formatBigNumber } from "./lib/number"
import { Market } from "./market/Market"
import { createMarketManager } from "./market/marketManager"
import { GameState } from "./type"
import { Button } from "./ui/button/Button"

function newGameState(): GameState {
  let girlArray = getGirlArray()

  girlArray[0].owned = true
  girlArray[0].commitment = 100

  let buildingArray = getBuildingArray()
  buildingArray[0].owned = true

  return {
    gold: 10_000,
    day: 0,
    girlArray,
    buildingArray,
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
      let destination = [...path, ...pathAddition]
      console.log("destination:", destination)
      return destination
    },
    [],
  )
  let [girlArray, setGirlArray] = React.useState(initialState.girlArray)
  let [buildingArray, setBuildingArray] = React.useState(
    initialState.buildingArray,
  )
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
  let placeByName = useMemo(() => {
    let mapping = {}
    buildingArray.forEach((building) => {
      mapping[building.name] = building
    })
    return mapping
  }, [buildingArray])

  const handleSave = () => {
    prop.save({
      gold,
      day,
      girlArray,
      buildingArray,
    })
  }

  const handleNewDay = () => {
    marketManager.handleNewDay()
    setDay((d) => d + 1)
  }

  return (
    <div className="w-auto">
      {path.length > 0 && (
        <Button onClick={() => changePath({ pathLevelRemovalCount: 1 })}>
          {"< Back"}
        </Button>
      )}
      <div className="text-xl">
        Gold: {formatBigNumber(gold)} Day: {formatBigNumber(day)}
      </div>
      {access(
        {
          ".": () => (
            <Home
              handleNewDay={handleNewDay}
              handleSave={handleSave}
              changePath={changePath}
              girlArray={girlArray}
            />
          ),
          ".buyplace": () => (
            <BuyBuilding
              buildingArray={buildingArray}
              gold={gold}
              changePath={changePath}
            />
          ),
          ".girl": () => (
            <GirlDetailView girl={girlByName[path[0].split(":")[1]]} />
          ),
          ".market": () => (
            <Market marketManager={marketManager} changePath={changePath} />
          ),
          ".buyplace.confirm": () => (
            <BuyBuildingConfirm
              building={placeByName[path[1].split(":")[1]]}
              buy={(placeName: string) => {
                let building = placeByName[placeName]
                building.owned = true
                setGold((g) => g - building.price)
                changePath({ pathLevelRemovalCount: 2 })
              }}
              cancel={() => {
                changePath({ pathLevelRemovalCount: 1 })
              }}
            />
          ),
          ".market.girl": () => (
            <GirlDetailView
              girl={girlByName[path[1].split(":")[1]]}
              marketInfo={{
                gold: gold,
                buy: (girlName) => {
                  marketManager.handleBuy(girlName)
                  let girl = girlByName[girlName]
                  girl.owned = true
                  setGold((g) => g - girl.price)
                  changePath({ pathLevelRemovalCount: 2 })
                },
              }}
            />
          ),
        },
        `.${path.map((p) => p.split(":")[0]).join(".")}`,
      )}
    </div>
  )
}
