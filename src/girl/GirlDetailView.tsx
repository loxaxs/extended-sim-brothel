import React, { useRef } from "react"
import { capitalize } from "../lib/text"
import { GirlInfo, SizeArray } from "../type"
import { Button } from "../ui/button/Button"
import { createGirl, MAX_GIRL_STAT } from "./girl"
import { GirlDisplay } from "./GirlDisplay"

export interface GirlDetailViewProp {
  girl: GirlInfo
  marketInfo?: {
    gold: number
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

  let sizeRef = useRef<SizeArray>([])
  let [, rerender] = React.useState(false)

  return (
    <div className="grid grid-cols-[80%_20%]">
      <div>
        <GirlDisplay
          girl={createGirl(girl)}
          maxSize={600}
          tag={tag}
          sizeRef={sizeRef}
          rerender={() => rerender((x) => !x)}
        />
        {mi && (
          <Button
            style={{ width: sizeRef.current[0]?.width || "100%" }}
            onClick={() => mi.buy(girl.name)}
            disabled={girl.price > mi.gold}
          >
            Buy for {girl.price} gold
          </Button>
        )}
      </div>
      <div>
        <table className="text-2xl">
          <tbody>
            {Object.keys(MAX_GIRL_STAT).map((key) =>
              key === "price" ? null : (
                <tr key={key}>
                  <td>{capitalize(key)}:</td>
                  <td className="text-right">{girl[key as any]}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
