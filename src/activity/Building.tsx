import React from "react"
import { gameContext } from "../context/context"
import { Building, GirlInfo } from "../type"
import { Button } from "../ui/button/Button"
import { Card } from "../ui/card/Card"
import { Section } from "../ui/section/Section"
import { otherActivityArray, otherActivityNameMapping } from "./activity"

export function createBuilding(
  name: string,
  capacity: number,
  price: number,
  visibility: number,
): Building {
  return {
    name,
    capacity,
    price,
    visibility,
    fame: 0,
    owned: false,
  }
}

export function getBuildingArray() {
  return [
    createBuilding("Old shack far away", 1, 50, 0),
    createBuilding("Small house out of the island", 2, 250, 10),
    createBuilding("House on the island", 3, 1000, 30),
    createBuilding("House on central road", 3, 5000, 50),
    createBuilding("Big house on central road", 5, 15000, 65),
    createBuilding("Palace on central road", 7, 25000, 80),
    createBuilding("Central palace", 10, 45000, 110),
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

export function BuildingList(prop: BuildingListProp) {
  let { act, buildingArray } = prop
  let { changePath } = React.useContext(gameContext)

  let buildingOccupancyMapping: Record<string, number> = {}
  if (act.kind === "setActivity") {
    act.girlArray.forEach((g) => {
      if (g.activity.kind === "building") {
        let { buildingName } = g.activity
        buildingOccupancyMapping[buildingName] = (buildingOccupancyMapping[buildingName] ?? 0) + 1
      }
    })
  }

  return (
    <div>
      <div className="grid grid-cols-3">
        {buildingArray.map((building) => {
          let { capacity } = building
          if (act.kind === "setActivity") {
            capacity -= buildingOccupancyMapping[building.name] ?? 0
            if (
              act.targetGirl.activity.kind === "building" &&
              act.targetGirl.activity.buildingName === building.name
            ) {
              // mark the room where the target girl is as free to allow reassigning it to her
              capacity += 1
            }
          }
          let s = capacity > 1 ? "s" : ""
          return (
            ((act.kind === "buy" && !building.owned) ||
              (act.kind === "setActivity" && building.owned)) && (
              <Card key={building.name}>
                <Section
                  clickable={act.kind === "setActivity"}
                  disabled={capacity <= 0}
                  onClick={() => {
                    ;(act as BuildingListSetActivityAct).targetGirl.activity = {
                      kind: "building",
                      buildingName: building.name,
                    }
                    changePath({ pathLevelRemovalCount: 1 })
                  }}
                >
                  <div>{building.name}</div>
                  <p className="mb-3">
                    {capacity}
                    {act.kind === "setActivity" && " free"} room{s}
                    {act.kind === "buy" && (
                      <span className="float-right">
                        <Button
                          disabled={act.gold < building.price}
                          onClick={() => {
                            changePath({
                              pathAddition: [`confirm:${building.name}`],
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
                {otherActivityNameMapping[kind]}
              </Section>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export interface BuyBuildingConfirmProp {
  building: Building
  buy: (name: string) => void
  cancel: () => void
}

export function BuyBuildingConfirm(prop: BuyBuildingConfirmProp) {
  return (
    <div>
      <div>
        Are you sure you want to buy the {prop.building.name} for {prop.building.price} gold?
      </div>
      <Button onClick={() => prop.buy(prop.building.name)}>Yes</Button>
      <Button onClick={prop.cancel} ml3>
        No
      </Button>
    </div>
  )
}
