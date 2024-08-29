import React from "react"
import { otherActivityNameMapping } from "src/activity/activity"
import { gameContext } from "../context/context"
import { GirlInfo } from "../type"
import { Button } from "../ui/button/Button"
import { Section } from "../ui/section/Section"
import { createGirl } from "./girl"
import { GirlDisplay } from "./GirlDisplay"

export interface GirlListCardProp {
  girl: GirlInfo
  onClick: () => void
  act: GirlListCardAct
}

export type GirlListCardAct = {
  kind: "home" | "market"
}

export function GirlListCard(prop: GirlListCardProp) {
  let { act, girl, onClick } = prop
  let { changePath } = React.useContext(gameContext)

  return (
    <Section clickable className="m-2 text-center" onClick={onClick}>
      <div style={{ height: 100 }}>
        <GirlDisplay
          className="m-auto"
          girl={createGirl(girl)}
          tag="mini"
          maxSize={100}
        />
      </div>
      <div>
        {girl.name} {act.kind === "home" && `♥ ${girl.health}`}
      </div>
      {act.kind === "home" && (
        <>
          <div>
            {girl.activity.kind === "building"
              ? girl.activity.buildingName
              : otherActivityNameMapping[girl.activity.kind]}
          </div>
          <div>
            <Button
              ml3
              className="hover:bg-amber-50"
              onClick={(ev) => {
                ev.stopPropagation()
                changePath({ pathAddition: [`setactivity:${girl.name}`] })
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
