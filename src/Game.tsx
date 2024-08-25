import React from "react"
import { getGirlArray } from "./girl/girlGroup"
import { GirlList } from "./girlList/GirlList"
import { createMarket } from "./market/market"
import { GameState } from "./type"

function newGameState(): GameState {
  return {
    gold: 100,
    day: 0,
    girlArray: getGirlArray(),
    placeArray: [],
  }
}

export interface GameProp {
  initialState: GameState
  save: (state: GameState) => void
}

export function Game(prop: GameProp) {
  let { gold, day, girlArray, placeArray } =
    prop.initialState.day !== undefined ? prop.initialState : newGameState()
  let market = createMarket(girlArray.filter((g) => !g.owned))

  const handleSave = () => {
    prop.save({
      gold,
      day,
      girlArray,
      placeArray,
    })
  }

  const handleNewDay = () => {
    market.handleNewDay()
  }

  return (
    <div>
      <div className="text-xl">
        Gold: {gold} Day: {day}
      </div>
      <GirlList girlArray={girlArray} />
      <div className="inline-block rounded-2xl border border-black text-xl">
        <ul className="p-0">
          {[
            { callback: handleSave, text: "Save" },
            { callback: handleNewDay, text: "New Day" },
          ].map(({ callback, text }) => (
            <li key={text} className="m-1 text-center">
              <button
                onClick={callback}
                className="g-amber-200 rounded-xl border border-amber-400 p-1 hover:bg-yellow-200"
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
