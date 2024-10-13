import React, { useReducer, useRef } from "react"
import { ShowActivity } from "src/activity/ShowActivity"
import { gameContext } from "src/context/context"
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
  let { girl, marketInfo: mi, navigation } = prop
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
  let [, rerender] = useReducer((x) => !x, false)
  let [sessionPrice, setSessionPrice] = React.useState(girl.sessionPrice)
  girl.sessionPrice = sessionPrice
  let { changePath } = React.useContext(gameContext)

  return (
    <div className="grid grid-cols-[75%_25%]">
      <div className="mx-auto">
        <h1 className="text-center text-2xl">{girl.name}</h1>
        <div className="h-[450px]">
          <GirlDisplay
            girl={createGirl(girl)}
            maxSize={450}
            tag={tag}
            sizeRef={sizeRef}
            rerender={rerender}
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
          <NavigationButton onClick={navigation.previous}>{"<"}</NavigationButton>
          <NavigationButton onClick={navigation.next}>{">"}</NavigationButton>
        </span>
      </div>
      <div>
        <GirlStat girl={girl} />
        {!mi && (
          <>
            <SessionPriceSelector sessionPrice={sessionPrice} setSessionPrice={setSessionPrice} />
            <ShowActivity girl={girl} />
            <Button
              className="mx-auto block hover:bg-amber-50"
              onClick={() => {
                changePath({ pathAddition: [`setActivity:${girl.name}`] })
              }}
            >
              🏠 Set activity
            </Button>
          </>
        )}
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
