import React from "react"
import { Button } from "../button/Button"
import { GirlDisplay } from "../girlDisplay/GirlDisplay"
import { GirlInfo } from "../type"
import { createGirl } from "./girl"

export interface GirlDetailViewProp {
  girl: GirlInfo
  marketInfo?: {
    gold: number
    price: number
    buy: (name: string) => void
  }
}

export function GirlDetailView(prop: GirlDetailViewProp) {
  let { girl, marketInfo: mi } = prop
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
        {mi && (
          <Button
            className="ml-0 w-full"
            onClick={() => mi.buy(girl.name)}
            disabled={mi.price > mi.gold}
          >
            Buy for {mi.price} gold
          </Button>
        )}
      </div>
    </div>
  )
}
