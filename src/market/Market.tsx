import React from "react"
import { gameContext } from "../context/context"
import { GirlList } from "../girl/GirlList"
import { MarketManager } from "./marketManager"

export interface MarketProp {
  marketManager: MarketManager
}

export function Market(prop: MarketProp) {
  let { marketManager } = prop
  let { changePath } = React.useContext(gameContext)

  return (
    <div className="mx-auto">
      <div className="text-xl">Market</div>
      <div className="inline-block">
        <GirlList
          act={{ kind: "market" }}
          contentIfEmpty={"The market is empty. There are no girls that you don't already own."}
          girlArray={marketManager.getGirlArray()}
          onClick={(girlName) => {
            changePath({ pathAddition: [`girl:${girlName}`] })
          }}
        />
      </div>
    </div>
  )
}
