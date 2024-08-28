import React from "react"
import { ChangePathAction, GirlInfo } from "../type"
import { GirlListCard } from "./GirlListCard"

export interface GirlListProp {
  girlArray: GirlInfo[]
  onClick: (name: string) => void
  changePath: (action: ChangePathAction) => void
  act: GirlListAct
}

export type GirlListAct = {
  kind: "home" | "market"
}

export function GirlList(prop: GirlListProp) {
  let { act, changePath, girlArray, onClick } = prop
  return (
    <div className="grid grid-cols-4">
      {girlArray.map((girl) => {
        return (
          <GirlListCard
            key={girl.name}
            girl={girl}
            onClick={() => {
              onClick(girl.name)
            }}
            changePath={changePath}
            act={act}
          />
        )
      })}
    </div>
  )
}
