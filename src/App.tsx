import React from "react"
import { GirlList } from "./girlList/GirlList"
import { Girl } from "./type"

import "./ambient.d"
import { girlImageList } from "./asset/girlAsset"
import { createGirlGroup } from "./girl/girlGroup"
import { createMarket } from "./market/market"

export interface AppProp {
  baseHeight: number
  baseWidth: number
}

export function App(prop: AppProp) {
  let { baseHeight, baseWidth } = prop
  let gold = 0
  let day = 0
  let girlArray: Girl[] = Object.values(createGirlGroup(girlImageList))
  let ownedGirlArray: Girl[] = girlArray.slice(0, 1)
  let wanderingGirlArray: Girl[] = girlArray.slice(1)
  let market = createMarket(wanderingGirlArray)
  let size = Math.min(baseHeight * 16, baseWidth * 9)

  const handleSave = () => {
    console.log("Save!")
  }

  const handleNewDay = () => {
    market.handleNewDay()
  }

  return (
    <div className="game-frame" style={{ height: size / 16, width: size / 9 }}>
      <div
        className="game-content"
        style={{ transform: `scale(${size / 1080 / 9})` }}
      >
        <div className="head-banner">
          Gold: {gold} Day: {day}
        </div>
        <div className="display"></div>
        <GirlList girls={girlArray} />
        <div className="side-menu">
          <ul className="side-menu--ul">
            <li>
              <button onClick={handleSave}>Save</button>
            </li>
            <li>
              <button onClick={handleNewDay}>New Day</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
