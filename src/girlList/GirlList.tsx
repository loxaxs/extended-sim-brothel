import React from "react"
import { GirlInfo } from "../type"
import { GirlListCard } from "./girlListCard/GirlListCard"

export interface GirlListProp {
  girlArray: GirlInfo[]
}

export function GirlList(prop: GirlListProp) {
  let { girlArray } = prop
  return (
    <div className="inline-block">
      {girlArray.map((girl) => {
        return <GirlListCard key={girl.name} girl={girl} />
      })}
    </div>
  )
}
