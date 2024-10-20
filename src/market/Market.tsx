import React from "react"
import { useT } from "src/i18n/useT"
import { gameContext } from "../context/context"
import { GirlList } from "../girl/GirlList"
import { MarketManager } from "./marketManager"

export interface MarketProp {
  marketManager: MarketManager
}

export function Market(prop: MarketProp) {
  let { marketManager } = prop
  let { t } = useT()
  let { changePath } = React.useContext(gameContext)

  return (
    <div className="mx-auto">
      <div className="text-xl">{t("Market")}</div>
      <div className="inline-block">
        <GirlList
          act={{ kind: "market" }}
          girlArray={marketManager.getGirlArray()}
          onClick={(girlName) => {
            changePath({ pathAddition: [`girl:${girlName}`] })
          }}
        />
      </div>
    </div>
  )
}
