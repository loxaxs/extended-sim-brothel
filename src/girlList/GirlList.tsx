import React from "react"
import { Girl } from "../type"
import { GirlListCard } from "./girlListCard/GirlListCard"

export interface GirlListProp {
  girls: Girl[]
}

export function GirlList(prop: GirlListProp) {
  let { girls } = prop
  return (
    <div className="inline-block">
      {girls.map((girl) => {
        return <GirlListCard key={girl.name} girl={girl} />
      })}
    </div>
  )
}
