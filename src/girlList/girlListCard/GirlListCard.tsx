import React from "react"
import { GirlDisplay } from "../../girlDisplay/GirlDisplay"
import { Girl } from "../../type"

export interface GirlListCardProp {
  girl: Girl
}

export function GirlListCard(prop: GirlListCardProp) {
  let { girl } = prop
  return (
    <div className="girl-list-card">
      <div className="mini-image-container">
        <GirlDisplay
          className="mini-image"
          girl={girl}
          tag="mini"
          maxSize={100}
        />
      </div>{" "}
      {girl.name} {girl.health} {"<3"}
    </div>
  )
}
