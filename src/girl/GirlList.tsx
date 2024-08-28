import React from "react"
import { GirlInfo } from "../type"
import { GirlListCard } from "./GirlListCard"

export interface GirlListProp {
  girlArray: GirlInfo[]
  onClick: (name: string) => void
  act: GirlListAct
}

export type GirlListAct = {
  kind: "home" | "market"
}

export function GirlList(prop: GirlListProp) {
  let { act, girlArray, onClick } = prop

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
            act={act}
          />
        )
      })}
    </div>
  )
}
