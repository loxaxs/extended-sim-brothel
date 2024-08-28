import React from "react"
import { GirlInfo } from "../type"
import { createGirl } from "./girl"
import { GirlDisplay } from "./GirlDisplay"

export interface GirlListCardProp {
  girl: GirlInfo
  onClick: () => void
}

export function GirlListCard(prop: GirlListCardProp) {
  let { girl, onClick } = prop
  return (
    <div
      className="m-2 rounded-xl border border-amber-400 p-1 text-center hover:bg-yellow-200"
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
