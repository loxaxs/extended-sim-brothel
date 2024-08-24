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
    <div
      className="bg-amber-200 flex flex-col justify-center items-center border-neutral-200 m-auto"
      style={{ height: size / 16, width: size / 9 }}
    >
      <div
        style={{ transform: `scale(${size / 1080 / 9})` }}
      >
        <div className="text-xl">
          Gold: {gold} Day: {day}
        </div>
        <GirlList girls={girlArray} />
        <div className="border border-black rounded-2xl text-xl inline-block">
          <ul className="p-0">
            {[
              { callback: handleSave, text: "Save"},
              { callback: handleNewDay, text: "New Day"}
            ].map(({callback, text}) => (
              <li className="m-1 text-center">
                <button onClick={callback} className="p-1 g-amber-200 border border-amber-400 rounded-xl hover:bg-yellow-200">{text}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
