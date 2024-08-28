import React from "react"
import { otherActivityNameMapping } from "../building/Building"
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
        {girl.name} ♥ {girl.health}
      </div>
      <div>
        {girl.activity.kind === "building"
          ? girl.activity.building.name
          : otherActivityNameMapping[girl.activity.kind]}
      </div>
      {act.kind === "home" && (
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
      )}
    </Section>
  )
}
