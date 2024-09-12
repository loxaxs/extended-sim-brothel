import React, { useRef } from "react"
import { GirlInfo, SizeArray } from "../type"
import { Button } from "../ui/button/Button"
import { createGirl } from "./girl"
import { GirlDisplay } from "./GirlDisplay"
import { GirlStat } from "./GirlStat"
import { SessionPriceSelector } from "./SessionPriceSelector"

export interface GirlDetailViewProp {
  girl: GirlInfo
  marketInfo?: {
    gold: number
    buy: (name: string) => void
  }
  navigation: {
    next: "" | (() => void)
    previous: "" | (() => void)
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
  let [sessionPrice, setSessionPrice] = React.useState(girl.sessionPrice)
  girl.sessionPrice = sessionPrice

  return (
    <div className="grid grid-cols-[75%_25%]">
      <div className="mx-auto">
        <div className="h-[550px]">
          <GirlDisplay
            girl={createGirl(girl)}
            maxSize={550}
            tag={tag}
            sizeRef={sizeRef}
            rerender={() => rerender((x) => !x)}
          />
        </div>
        {mi && (
          <Button
            style={{ width: sizeRef.current[0]?.width || "100%" }}
            onClick={() => mi.buy(girl.name)}
            disabled={girl.acquisitionPrice > mi.gold}
          >
            Buy for {girl.acquisitionPrice} gold
          </Button>
        )}
        <span className="flex justify-between gap-2">
          <NavigationButton onClick={prop.navigation.previous}>{"<"}</NavigationButton>
          <NavigationButton onClick={prop.navigation.next}>{">"}</NavigationButton>
        </span>
      </div>
      <div>
        <GirlStat girl={girl} />
        <SessionPriceSelector sessionPrice={sessionPrice} setSessionPrice={setSessionPrice} />
      </div>
    </div>
  )
}

function NavigationButton({ onClick, children }: { onClick: "" | (() => void); children: string }) {
  return (
    <Button onClick={onClick || undefined} disabled={!onClick} style={{ width: "100%" }}>
      {children}
    </Button>
  )
}
