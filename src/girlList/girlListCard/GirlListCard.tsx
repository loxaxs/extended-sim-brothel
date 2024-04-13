import React from "react"
import { Girl } from "../../type"
import { GirlDisplay } from "../../girlDisplay/GirlDisplay"

export interface GirlListCardProp {
  girl: Girl
}

export function GirlListCard(prop: GirlListCardProp) {
  let { girl } = prop
  return (
    <span className="girl-list-card">
      <GirlDisplay girl={girl} tag="mini" /> {girl.name} {girl.health}
    </span>
  )
}
