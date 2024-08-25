import React from "react"
import { GirlList } from "../girlList/GirlList"
import { MarketManager } from "./marketManager"

export interface MarketProp {
  marketManager: MarketManager
}

export function Market(prop: MarketProp) {
  let { marketManager } = prop
  return (
    <div>
      <div className="text-xl">Market</div>
      <GirlList girlArray={marketManager.getGirlArray()} />
    </div>
  )
}
