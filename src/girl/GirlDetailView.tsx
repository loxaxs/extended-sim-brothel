import React from "react"
import { GirlDisplay } from "../girlDisplay/GirlDisplay"
import { GirlInfo } from "../type"
import { createGirl } from "./girl"

export interface GirlDetailViewProp {
  girl: GirlInfo
}

export function GirlDetailView(prop: GirlDetailViewProp) {
  let { girl } = prop
  let tag: string
  if (girl.health === 100) {
    tag = "dancing"
  } else if (girl.health > 90) {
    tag = "happy"
  } else if (girl.health > 80) {
    tag = "tired"
  } else {
    tag = "unhealthy"
  }

  return (
    <div>
      <div>
        <GirlDisplay girl={createGirl(girl)} maxSize={720} tag={tag} />
      </div>
    </div>
  )
}
