import React from "react"
import { GirlDisplay } from "../../girlDisplay/GirlDisplay"
import { Girl } from "../../type"

export interface GirlListCardProp {
  girl: Girl
}

export function GirlListCard(prop: GirlListCardProp) {
  let { girl } = prop
  return (
    <div className="m-2 border border-amber-400 rounded-xl text-center hover:bg-yellow-200">
      <div className="m-auto">
        <GirlDisplay
          className="m-auto"
          girl={girl}
          tag="mini"
          maxSize={50}
        />
      </div>{" "}
      {girl.name} {girl.health} {"<3"}
    </div>
  )
}
