import React from "react"
import { GirlInfo } from "../type"
import { GirlListCard } from "./girlListCard/GirlListCard"

export interface GirlListProp {
  girlArray: GirlInfo[]
  onClick: (name: string) => void
}

export function GirlList(prop: GirlListProp) {
  let { girlArray, onClick } = prop
  return (
    <div className="mx-auto">
      {girlArray.map((girl) => {
        return (
          <GirlListCard
            key={girl.name}
            girl={girl}
            onClick={() => {
              onClick(girl.name)
            }}
          />
        )
      })}
    </div>
  )
}
