import React, { useMemo } from "react"
import { getGirlArray } from "./girl/girlGroup"
import { Home } from "./Home"
import { Market } from "./market/Market"
import { createMarketManager } from "./market/marketManager"
import { GameState, PageName } from "./type"

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

export interface GameProp {
  initialState: GameState
  save: (state: GameState) => void
}

export function Game(prop: GameProp) {
  let initialState =
    prop.initialState.day !== undefined ? prop.initialState : newGameState()
  let [gold, setGold] = React.useState(initialState.gold)
  let [day, setDay] = React.useState(initialState.day)
  let [page, setPage] = React.useState("home" as PageName)
  let [girlArray, setGirlArray] = React.useState(initialState.girlArray)
  let [placeArray, setPlaceArray] = React.useState(initialState.placeArray)
  let marketManager = useMemo(
    () => createMarketManager(girlArray.filter((g) => !g.owned)),
    [],
  )

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
    <div>
      {page !== "home" && (
        <button onClick={() => setPage("home")}>{"< Back"}</button>
      )}
      <div className="text-xl">
        Gold: {gold} Day: {day}
      </div>
      {
        {
          home: (
            <Home
              handleNewDay={handleNewDay}
              handleSave={handleSave}
              setPage={setPage}
              girlArray={girlArray}
            />
          ),
          market: <Market marketManager={marketManager} />,
        }[page]
      }
    </div>
  )
}
