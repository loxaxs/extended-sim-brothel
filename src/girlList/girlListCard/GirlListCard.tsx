import React from "react"
import { createGirl } from "../../girl/girl"
import { GirlDisplay } from "../../girlDisplay/GirlDisplay"
import { GirlInfo } from "../../type"

export interface GirlListCardProp {
  girl: GirlInfo
  onClick: () => void
}

export function GirlListCard(prop: GirlListCardProp) {
  let { girl, onClick } = prop
  return (
    <div
      className="m-2 rounded-xl border border-amber-400 text-center hover:bg-yellow-200"
      onClick={onClick}
    >
      <div>
        <GirlDisplay
          className="m-auto"
          girl={createGirl(girl)}
          tag="mini"
          maxSize={100}
        />
      </div>{" "}
      {girl.name} ♥ {girl.health}
    </div>
  )
}
