import React from "react"
import { ShowActivity } from "src/activity/ShowActivity"
import { gameContext } from "../context/context"
import { tw } from "../lib/tw"
import { GirlInfo } from "../type"
import { Button } from "../ui/button/Button"
import { Section } from "../ui/section/Section"
import { createGirl } from "./girl"
import { GirlDisplay } from "./GirlDisplay"

export interface GirlListCardProp {
  act: GirlListCardAct
  className?: string
  girl: GirlInfo
  onClick: () => void
}

export type GirlListCardAct = {
  kind: "home" | "market"
}

export function GirlListCard(prop: GirlListCardProp) {
  let { act, className, girl, onClick } = prop
  let { changePath } = React.useContext(gameContext)
  let cGirl = createGirl(girl)

  return (
    <Section clickable className={tw(className, "m-2 text-center text-sm")} onClick={onClick}>
      <div style={{ height: 100 }}>
        <GirlDisplay className="m-auto" girl={cGirl} tag="mini" maxSize={100} />
      </div>
      <div>
        {girl.name}{" "}
        {act.kind === "home" &&
          `♥ ${girl.health} : ${girl.sessionPrice} x ${cGirl.getMaxiumumCustomerCount()}`}
      </div>
      {act.kind === "home" && (
        <>
          <ShowActivity girl={girl} />
          <div>
            <Button
              ml3
              className="hover:bg-amber-50"
              onClick={(ev) => {
                ev.stopPropagation()
                changePath({ pathAddition: [`setActivity:${girl.name}`] })
              }}
            >
              🏠
            </Button>
          </div>
        </>
      )}
    </Section>
  )
}
