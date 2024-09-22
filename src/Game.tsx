import React from "react"
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
import { SelectSaveFile } from "./save/Save"
import {
  Building,
  ChangePathAction,
  Config,
  GameState,
  GirlInfo,
  Report,
  SaveExtraData,
} from "./type"
import { Button } from "./ui/button/Button"
import { ControlledSmartEntry } from "./ui/smartEntry/smartEntry"

function newGameState(config: Config): GameState {
  let girlArray = getGirlArray()

  girlArray[0].owned = true
  girlArray[0].commitment = 100
  girlArray[0].libido = 50 + Math.floor(girlArray[0].libido / 2)

  let buildingArray = getBuildingArray()
  buildingArray[0].owned = true

  return {
    gold: Number(config.gold),
    day: 0,
    girlArray,
    buildingArray,
  }
}

export interface GameProp {
  config: Config
  resetSaveIndex: () => void
  save: GameState & SaveExtraData
  saveCount: number
  saveGame: (state: GameState) => void
  setSaveIndex: (indexAction: React.SetStateAction<number>) => void
}

export function Game(prop: GameProp) {
  let { devMode, safeMode } = prop.config
  let initialState = prop.save.hasData ? prop.save : newGameState(prop.config)
  let [gold, setGold] = React.useState(initialState.gold)
  let [day, setDay] = React.useState(initialState.day)
  let [path, changePath] = React.useReducer((path: string[], action: ChangePathAction) => {
    let { pathAddition = [], pathLevelRemovalCount = 0 } = action
    if (pathLevelRemovalCount > 0) {
      path = path.slice(0, -pathLevelRemovalCount)
    }
    let destination = [...path, ...pathAddition]
    console.log("path:", destination)
    return destination
  }, [])
  let [girlArray, setGirlArray] = React.useState(initialState.girlArray)
  let [buildingArray, setBuildingArray] = React.useState(initialState.buildingArray)
  let [report, setReport] = React.useState<Report>((): Report => [])
  let marketManager = React.useMemo(
    () => createMarketManager(girlArray.filter((g) => !g.owned)),
    [],
  )
  let [girlByName, ownedGirlIndexByName, marketGirlIndexByName, ownedGirlArray, marketGirlArray] =
    React.useMemo(() => {
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
  let buildingByName = React.useMemo(() => {
    let mapping: Record<string, Building> = {}
    buildingArray.forEach((building) => {
      mapping[building.name] = building
    })
    return mapping
  }, [buildingArray])

  let getSaveData = () => ({
    gold,
    day,
    girlArray,
    buildingArray,
  })

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

  let staticPath = `.${path.map((p) => p.split(":")[0]).join(".")}`

  return (
    <gameContext.Provider value={{ changePath, devMode, safeMode }}>
      <div>
        {path.length > 0 && staticPath !== ".report" && (
          <>
            <Button onClick={() => changePath({ pathLevelRemovalCount: 1 })}>{"< Back"}</Button>{" "}
          </>
        )}
        {path.length === 0 && (
          <>
            <Button
              onClick={() => {
                changePath({ pathAddition: ["save"] })
              }}
            >
              Save {prop.save.index}
            </Button>
            {" - "}
          </>
        )}
        <span className="text-xl">
          Gold:{" "}
          <ControlledSmartEntry
            className="w-16 text-right"
            formatter={(s) => String(formatBigNumber(Number(s)))}
            setter={(value) => setGold(Number(value))}
            value={String(gold)}
          />
          {" - Day: "}
          {formatBigNumber(day)}
        </span>
      </div>
      {access(
        {
          ".save": () => (
            <SelectSaveFile
              saveCount={prop.saveCount}
              setSaveIndex={prop.setSaveIndex}
              saveData={{ ...prop.save, ...getSaveData() }}
            />
          ),
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
              handleSave={() => {
                prop.saveGame(getSaveData())
              }}
              girlArray={girlArray}
            />
          ),
          ".buybuilding": () => (
            <BuildingList buildingArray={buildingArray} act={{ kind: "buy", gold }} />
          ),
          ".girl": () => (
            <GirlDetailView
              girl={girlByName[getName(0)]}
              navigation={navigation}
              showPriceSelector
            />
          ),
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
        staticPath,
      )}
    </gameContext.Provider>
  )
}
