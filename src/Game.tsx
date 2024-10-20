import React from "react"
import { BuildingList, BuyBuildingConfirm, getBuildingArray } from "./activity/Building"
import { gameContext } from "./context/context"
import { GirlDetailView } from "./girl/GirlDetailView"
import { getGirlArray } from "./girl/girlGroup"
import { Home } from "./home/Home"
import { useT } from "./i18n/useT"
import { access } from "./lib/access"
import { formatBigNumber } from "./lib/number"
import { randRange } from "./lib/random"
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

  let firstGirl = girlArray.find(({ name }) => name === "Skuld") ?? girlArray[0]
  firstGirl.owned = true
  firstGirl.commitment = 100
  firstGirl.libido = 50 + Math.floor(girlArray[0].libido / 2)
  firstGirl.esteem = Math.round(randRange(40, 60))

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
  if (prop.config.achieve.includes("allGirl")) {
    initialState.girlArray.forEach((g) => (g.owned = true))
  }
  if (prop.config.achieve.includes("allBuilding")) {
    initialState.buildingArray.forEach((g) => (g.owned = true))
  }

  let { t } = useT()
  let [gold, setGold] = React.useState(initialState.gold)
  let [day, setDay] = React.useState(initialState.day)
  let [footerContent, setFooterContent] = React.useState("")
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
    () =>
      createMarketManager(
        girlArray.filter((g) => !g.owned),
        prop.config,
      ),
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
  let buildingById = React.useMemo(() => {
    let mapping: Record<string, Building> = {}
    buildingArray.forEach((building) => {
      mapping[building.id] = building
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
    <gameContext.Provider value={{ changePath, devMode, safeMode, setFooterContent }}>
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
          {t("Gold")}:{" "}
          <ControlledSmartEntry
            className="w-16 text-right"
            formatter={(s) => String(formatBigNumber(Number(s)))}
            setter={(value) => setGold(Number(value))}
            value={String(gold)}
          />
          {` - ${t("Day")}: `}
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
                  buildingById: buildingById,
                  t,
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
                setFooterContent(t("Saved!"))
              }}
              girlArray={girlArray}
            />
          ),
          ".buybuilding": () => (
            <BuildingList buildingArray={buildingArray} act={{ kind: "buy", gold }} />
          ),
          ".girl": () => <GirlDetailView girl={girlByName[getName(0)]} navigation={navigation} />,
          ".girl.setActivity": () => (
            <BuildingList
              buildingArray={buildingArray}
              act={{
                kind: "setActivity",
                girlArray,
                targetGirl: girlByName[getName(1)],
              }}
            />
          ),
          ".market": () => <Market marketManager={marketManager} />,
          ".setActivity": () => (
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
              building={buildingById[getName(1)]}
              buy={(buildingId: string) => {
                let building = buildingById[buildingId]
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
              key={getName(1)}
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
      <div className="h-[100px] w-[600px] border-[1px] border-solid border-black bg-white text-center">
        <div className="my-auto">{footerContent}</div>
      </div>
    </gameContext.Provider>
  )
}
