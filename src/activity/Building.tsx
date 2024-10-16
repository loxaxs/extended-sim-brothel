import React from "react"
import { useT } from "src/i18n/useT"
import { gameContext } from "../context/context"
import { Building, GirlInfo, TFunction } from "../type"
import { Button } from "../ui/button/Button"
import { Card } from "../ui/card/Card"
import { Section } from "../ui/section/Section"
import { getOtherActivityName, otherActivityArray } from "./activity"

export function createBuilding(
  id: string,
  capacity: number,
  price: number,
  visibility: number,
): Building {
  return {
    id,
    capacity,
    price,
    visibility,
    fame: 0,
    owned: false,
  }
}

export function getBuildingArray() {
  return [
    createBuilding("A", 1, 50, 0),
    createBuilding("B", 2, 250, 10),
    createBuilding("C", 3, 1000, 30),
    createBuilding("D", 3, 5000, 50),
    createBuilding("E", 5, 15000, 65),
    createBuilding("F", 7, 25000, 80),
    createBuilding("G", 10, 45000, 110),
  ]
}

export interface BuildingListProp {
  act: BuildingListAct
  buildingArray: Building[]
}

export type BuildingListAct = BuildingListBuyAct | BuildingListSetActivityAct

export interface BuildingListBuyAct {
  kind: "buy"
  gold: number
}

export interface BuildingListSetActivityAct {
  kind: "setActivity"
  girlArray: GirlInfo[]
  targetGirl: GirlInfo
}

export function getBuildingName(building: Building, t: TFunction): string {
  return {
    A: t("Old shack far away"),
    B: t("Small house out of the island"),
    C: t("House on the island"),
    D: t("House on central road"),
    E: t("Big house on central road"),
    F: t("Palace on central road"),
    G: t("Central palace"),
  }[building.id]!
}

export function BuildingName(prop: { building: Building }): string {
  let { t } = useT()
  return getBuildingName(prop.building, t)
}

export function BuildingList(prop: BuildingListProp) {
  let { act, buildingArray } = prop
  let { changePath } = React.useContext(gameContext)
  let { t } = useT()

  let buildingOccupancyMapping: Record<string, number> = {}
  if (act.kind === "setActivity") {
    act.girlArray.forEach((g) => {
      if (g.activity.kind === "building") {
        let { buildingId } = g.activity
        buildingOccupancyMapping[buildingId] = (buildingOccupancyMapping[buildingId] ?? 0) + 1
      }
    })
  }

  return (
    <div>
      <div className="grid grid-cols-3">
        {buildingArray.map((building) => {
          let { capacity } = building
          if (act.kind === "setActivity") {
            capacity -= buildingOccupancyMapping[building.id] ?? 0
            if (
              act.targetGirl.activity.kind === "building" &&
              act.targetGirl.activity.buildingId === building.id
            ) {
              // mark the room where the target girl is as free to allow reassigning it to her
              capacity += 1
            }
          }
          let s = capacity > 1 ? "s" : ""
          return (
            ((act.kind === "buy" && !building.owned) ||
              (act.kind === "setActivity" && building.owned)) && (
              <Card key={building.id}>
                <Section
                  clickable={act.kind === "setActivity"}
                  disabled={capacity <= 0}
                  onClick={() => {
                    ;(act as BuildingListSetActivityAct).targetGirl.activity = {
                      kind: "building",
                      buildingId: building.id,
                    }
                    changePath({ pathLevelRemovalCount: 1 })
                  }}
                >
                  <div>{getBuildingName(building, t)}</div>
                  <p className="mb-3">
                    {capacity}
                    {act.kind === "setActivity" && " free"} room{s}
                    {act.kind === "buy" && (
                      <span className="float-right">
                        <Button
                          disabled={act.gold < building.price}
                          onClick={() => {
                            changePath({
                              pathAddition: [`confirm:${building.id}`],
                            })
                          }}
                        >
                          Buy for {building.price} gold
                        </Button>
                      </span>
                    )}
                  </p>
                </Section>
              </Card>
            )
          )
        })}
      </div>
      {act.kind === "setActivity" && (
        <div className="grid grid-cols-3">
          {otherActivityArray.map((kind) => (
            <Card key={kind}>
              <Section
                clickable
                onClick={() => {
                  act.targetGirl.activity = { kind }
                  changePath({ pathLevelRemovalCount: 1 })
                }}
              >
                {getOtherActivityName(kind, t)}
              </Section>
            </Card>
          ))}
        </div>
      )}
      {act.kind === "buy" && buildingArray.every((b) => b.owned) && (
        <div>You own all the buildings</div>
      )}
    </div>
  )
}

export interface BuyBuildingConfirmProp {
  building: Building
  buy: (id: string) => void
  cancel: () => void
}

export function BuyBuildingConfirm(prop: BuyBuildingConfirmProp) {
  return (
    <div>
      <div>
        Are you sure you want to buy the <BuildingName building={prop.building} /> for{" "}
        {prop.building.price} gold?
      </div>
      <Button onClick={() => prop.buy(prop.building.id)}>Yes</Button>
      <Button onClick={prop.cancel} ml3>
        No
      </Button>
    </div>
  )
}
