import React from "react"
import { GirlList } from "./girlList/GirlList"
import { Girl } from "./type"

import "./ambient.d"
import { girlImageList } from "./asset/girlAsset"
import { createGirlGroup } from "./girl/girlGroup"

export interface AppProp {
  baseHeight: number
  baseWidth: number
}

export function App(prop: AppProp) {
  let { baseHeight, baseWidth } = prop
  let gold = 0
  let day = 0
  let girls: Girl[] = Object.values(createGirlGroup(girlImageList))
  let size = Math.min(baseHeight * 16, baseWidth * 9)
  return (
    <div className="game-frame" style={{ height: size / 16, width: size / 9 }}>
      <div
        className="game-content"
        style={{ transform: `scale(${size / 1080 / 9})` }}
      >
        <div className="head-banner">
          Gold: {gold} Day: {day}
        </div>
        <div className="display">{"<girl image(s)>"}</div>
        <GirlList girls={girls} />
        <div className="side-menu">
          <ul className="side-menu--ul">
            <li>
              <button>Save</button>
            </li>
            <li>
              <button>New Day</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
