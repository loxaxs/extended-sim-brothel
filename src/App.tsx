import React from "react"

export interface AppProp {
  baseHeight: number
}

export function App(prop: AppProp) {
  let { baseHeight } = prop
  let gold = 0
  let day = 0
  return (
    <div className="game-frame">
      <div className="head-banner">
        Gold: {gold} Day: {day}
      </div>
      <div className="display">displayContent</div>
      <div className="girl-list"></div>
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
