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
      <div className="mini-image-container">
        <GirlDisplay
          className="mini-image"
          girl={girl}
          tag="mini"
          maxSize={100}
        />
      </div>{" "}
      {girl.name} {girl.health}
    </span>
  )
}
