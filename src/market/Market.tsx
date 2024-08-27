import React from "react"
import { ChangePathAction } from "../Game"
import { GirlList } from "../girlList/GirlList"
import { MarketManager } from "./marketManager"

export interface MarketProp {
  marketManager: MarketManager
  changePath: (action: ChangePathAction) => void
}

export function Market(prop: MarketProp) {
  let { marketManager, changePath } = prop
  return (
    <div className="mx-auto">
      <div className="text-xl">Market</div>
      <div className="inline-block">
        <GirlList
          girlArray={marketManager.getGirlArray()}
          onClick={(girlName) => {
            changePath({ pathAddition: [`girl:${girlName}`] })
          }}
        />
      </div>
    </div>
  )
}
