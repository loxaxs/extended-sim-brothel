import React, { useMemo } from "react"
import { BuildingList, BuyBuildingConfirm, getBuildingArray } from "./activity/Building"
import { gameContext } from "./context/context"
import { GirlDetailView } from "./girl/GirlDetailView"
import { getGirlArray } from "./girl/girlGroup"
import { Home } from "./home/Home"
import { access } from "./lib/access"
import { formatBigNumber } from "./lib/number"
import { Market } from "./market/Market"
import { createMarketManager } from "./market/marketManager"
import { nextDayReport } from "./nextday/report"
import { ReportDisplay } from "./nextday/ReportDisplay"
import { Building, ChangePathAction, GameState, GirlInfo, Report } from "./type"
import { Button } from "./ui/button/Button"

function newGameState(): GameState {
  let girlArray = getGirlArray()

  girlArray[0].owned = true
  girlArray[0].commitment = 100
  girlArray[0].libido = 50 + girlArray[0].libido / 2

  let buildingArray = getBuildingArray()
  buildingArray[0].owned = true

  let url = new URL(location.href)

  return {
    gold: Number(url.searchParams.get("gold") ?? 250),
    day: 0,
    girlArray,
    buildingArray,
  }
}

export interface GameProp {
  initialState: GameState & { hasData: boolean }
  save: (state: GameState) => void
}

export function Game(prop: GameProp) {
  let initialState = prop.initialState.hasData ? prop.initialState : newGameState()
  let [gold, setGold] = React.useState(initialState.gold)
  let [day, setDay] = React.useState(initialState.day)
  let [path, changePath] = React.useReducer((path: string[], action: ChangePathAction) => {
    let { pathAddition = [], pathLevelRemovalCount = 0 } = action
    if (pathLevelRemovalCount > 0) {
      path = path.slice(0, -pathLevelRemovalCount)
    }
    let destination = [...path, ...pathAddition]
    console.log("destination:", destination)
    return destination
  }, [])
  let [girlArray, setGirlArray] = React.useState(initialState.girlArray)
  let [buildingArray, setBuildingArray] = React.useState(initialState.buildingArray)
  let [report, setReport] = React.useState<Report>((): Report => [])
  let marketManager = useMemo(() => createMarketManager(girlArray.filter((g) => !g.owned)), [])
  let [girlByName, ownedGirlIndexByName, marketGirlIndexByName, ownedGirlArray, marketGirlArray] =
    useMemo(() => {
      let mapping: Record<string, GirlInfo> = {}
      let ownedMapping: Record<string, number> = {}
      let marketMapping: Record<string, number> = {}
      let ownedIndex = 0
      let marketIndex = 0
      let ownedArray: GirlInfo[] = []
      let marketArray: GirlInfo[] = []
      girlArray.forEach((girl) => {
        mapping[girl.name] = girl
        if (girl.owned) {
          ownedArray.push(girl)
          ownedMapping[girl.name] = ownedIndex++
        } else {
          marketArray.push(girl)
          marketMapping[girl.name] = marketIndex++
        }
      })
      return [mapping, ownedMapping, marketMapping, ownedArray, marketArray]
    }, [girlArray])
  let buildingByName = useMemo(() => {
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

  let getName = (pathIndex: number) => {
    return path[pathIndex].split(":")[1]
  }

  let nextGirl = ""
  let previousGirl = ""
  let [lastPathPiece, isMarket] = [...path].reverse()
  let [piece, name] = lastPathPiece?.split(":") ?? []
  if (piece === "girl") {
    let girlIndexByName = isMarket ? marketGirlIndexByName : ownedGirlIndexByName
    let index = girlIndexByName[name]
    let girlList = isMarket ? marketGirlArray : ownedGirlArray
    if (index > 0) {
      previousGirl = girlList[index - 1].name
    }
    if (index < girlList.length - 1) {
      nextGirl = girlList[index + 1].name
    }
  }

  let navigation = {
    next:
      nextGirl &&
      (() => changePath({ pathLevelRemovalCount: 1, pathAddition: [`girl:${nextGirl}`] })),
    previous:
      previousGirl &&
      (() => changePath({ pathLevelRemovalCount: 1, pathAddition: [`girl:${previousGirl}`] })),
  }

  return (
    <gameContext.Provider value={{ changePath }}>
      {path.length > 0 && (
        <Button onClick={() => changePath({ pathLevelRemovalCount: 1 })}>{"< Back"}</Button>
      )}
      <div className="text-xl">
        Gold: {formatBigNumber(gold)} Day: {formatBigNumber(day)}
      </div>
      {access(
        {
          ".": () => (
            <Home
              handleNewDay={() => {
                let report = nextDayReport({
                  girlArray: girlArray.filter((g) => g.owned),
                  buildingByName,
                })
                if (report.length === 0) {
                  console.error("The report is empty")
                  return
                }
                setReport(report)
                changePath({ pathAddition: ["report"] })
                console.log("report:", report)
              }}
              handleSave={handleSave}
              girlArray={girlArray}
            />
          ),
          ".buybuilding": () => (
            <BuildingList buildingArray={buildingArray} act={{ kind: "buy", gold }} />
          ),
          ".girl": () => <GirlDetailView girl={girlByName[getName(0)]} navigation={navigation} />,
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
          ".buybuilding.confirm": () => (
            <BuyBuildingConfirm
              building={buildingByName[getName(1)]}
              buy={(buildingName: string) => {
                let building = buildingByName[buildingName]
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
              navigation={navigation}
              marketInfo={{
                gold: gold,
                buy: (girlName) => {
                  marketManager.handleBuy(girlName)
                  let girl = girlByName[girlName]
                  girl.owned = true
                  setGold((g) => g - girl.acquisitionPrice)
                  setGirlArray([...girlArray.filter((g) => g.name !== girlName), girl])
                  changePath({ pathLevelRemovalCount: 2 })
                },
              }}
            />
          ),
          ".report": () => (
            <ReportDisplay
              key={day}
              report={report}
              girlByName={girlByName}
              setGold={setGold}
              handleExitReport={() => {
                marketManager.handleNewDay()
                setDay((d) => d + 1)
                changePath({ pathLevelRemovalCount: 1 })
              }}
            />
          ),
        },
        `.${path.map((p) => p.split(":")[0]).join(".")}`,
      )}
    </gameContext.Provider>
  )
}
