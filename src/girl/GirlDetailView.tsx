import React from "react"
import { Button } from "../button/Button"
import { GirlDisplay } from "../girlDisplay/GirlDisplay"
import { GirlInfo } from "../type"
import { capitalize } from "../util"
import { createGirl, MAX_GIRL_STAT } from "./girl"

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
    <div className="grid grid-cols-[80%_20%]">
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
      <div>
        <table className="text-2xl">
          <tbody>
            {Object.keys(MAX_GIRL_STAT).map((key) => (
              <tr key={key}>
                <td>{capitalize(key)}:</td>
                <td>{girl[key as any]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
