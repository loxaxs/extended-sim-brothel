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
    <div className="grid grid-cols-[75%_25%]">
      <div className="mx-auto">
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
            disabled={girl.acquisitionPrice > mi.gold}
          >
            Buy for {girl.acquisitionPrice} gold
          </Button>
        )}
      </div>
      <div className="flex">
        <table className="m-auto text-xl">
          <tbody>
            {Object.keys(MAX_GIRL_STAT).map((key) =>
              key === "acquisitionPrice" ? null : (
                <tr key={key}>
                  <td className="px-3 py-1">{capitalize(key)}</td>
                  <td className="border-l-2 border-black px-3 text-right">
                    {girl[key as any]}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
