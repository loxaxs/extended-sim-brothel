import React, { useMemo } from "react"
import {
  BuildingList,
  BuyBuildingConfirm,
  getBuildingArray,
} from "./building/Building"
import { gameContext } from "./context/context"
import { GirlDetailView } from "./girl/GirlDetailView"
import { getGirlArray } from "./girl/girlGroup"
import { Home } from "./home/Home"
import { access } from "./lib/access"
import { formatBigNumber } from "./lib/number"
import { Market } from "./market/Market"
import { createMarketManager } from "./market/marketManager"
import { Building, ChangePathAction, GameState, GirlInfo } from "./type"
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
    let mapping: Record<string, GirlInfo> = {}
    girlArray.forEach((girl) => {
      mapping[girl.name] = girl
    })
    return mapping
  }, [girlArray])
  let placeByName = useMemo(() => {
    let mapping: Record<string, Building> = {}
    buildingArray.forEach((building) => {
      mapping[building.name] = building
    })
    return mapping
  }, [buildingArray])

  let handleSave = () => {
    prop.save({
      gold,
      day,
      girlArray,
      buildingArray,
    })
  }

  let handleNewDay = () => {
    marketManager.handleNewDay()
    setDay((d) => d + 1)
  }

  let getName = (pathIndex: number) => {
    return path[pathIndex].split(":")[1]
  }

  return (
    <gameContext.Provider value={{ changePath }}>
      <div className="w-[960px]">
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
                girlArray={girlArray}
              />
            ),
            ".buyplace": () => (
              <BuildingList
                buildingArray={buildingArray}
                act={{
                  kind: "buy",
                  gold,
                }}
              />
            ),
            ".girl": () => <GirlDetailView girl={girlByName[getName(0)]} />,
            ".market": () => <Market marketManager={marketManager} />,
            ".setactivity": () => (
              <BuildingList
                buildingArray={buildingArray}
                act={{
                  kind: "setActivity",
                  girlArray,
                  targetGirl: girlByName[getName(0)],
                }}
              />
            ),
            ".buyplace.confirm": () => (
              <BuyBuildingConfirm
                building={placeByName[getName(1)]}
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
                girl={girlByName[getName(1)]}
                marketInfo={{
                  gold: gold,
                  buy: (girlName) => {
                    marketManager.handleBuy(girlName)
                    let girl = girlByName[girlName]
                    girl.owned = true
                    setGold((g) => g - girl.price)
                    setGirlArray([
                      ...girlArray.filter((g) => g.name !== girlName),
                      girl,
                    ])
                    changePath({ pathLevelRemovalCount: 2 })
                  },
                }}
              />
            ),
          },
          `.${path.map((p) => p.split(":")[0]).join(".")}`,
        )}
      </div>
    </gameContext.Provider>
  )
}
