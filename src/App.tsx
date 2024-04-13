import React from "react"
import { GirlList } from "./girlList/GirlList"
import { Girl } from "./type"

import "./ambient.d"
import { girlImageList } from "./asset/girlAsset"
import { createGirlGroup } from "./girl/girlGroup"

export interface AppProp {
  baseHeight: number
}

export function App(prop: AppProp) {
  let { baseHeight } = prop
  let gold = 0
  let day = 0
  let girls: Girl[] = Object.values(createGirlGroup(girlImageList))
  return (
    <div className="game-frame">
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
  )
}
