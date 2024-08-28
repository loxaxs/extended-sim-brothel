import React from "react"
import { ChangePathAction } from "../Game"
import { tw } from "../lib/tw"
import { Building } from "../type"
import { Button } from "../ui/button/Button"
import { Card } from "../ui/card/Card"
import { Section } from "../ui/section/Section"

export function createBuilding(
  name: string,
  capacity: number,
  price: number,
): Building {
  return {
    name,
    capacity,
    price,
    fame: 0,
    owned: false,
  }
}

export function getBuildingArray() {
  return [
    createBuilding("Old shack far away", 1, 50),
    createBuilding("Small house out of the island", 2, 250),
    createBuilding("House on the island", 3, 1000),
    createBuilding("House on central road", 3, 5000),
    createBuilding("Big house on central road", 5, 15000),
    createBuilding("Palace on central road", 7, 25000),
    createBuilding("Central palace", 10, 45000),
  ]
}

export interface BuyBuildingProp {
  buildingArray: Building[]
  gold: number
  changePath: (action: ChangePathAction) => void
}

export function BuyBuilding(prop: BuyBuildingProp) {
  let { buildingArray, gold, changePath } = prop
  return (
    <div>
      {buildingArray.map((building) => (
        <Card key={building.name} className={tw({ hidden: building.owned })}>
          <Section>
            <div>{building.name}</div>
            <p className="mb-3">
              {building.capacity} rooms
              <span className="float-right">
                <Button
                  disabled={gold < building.price}
                  onClick={() => {
                    changePath({ pathAddition: [`confirm:${building.name}`] })
                  }}
                >
                  Buy for {building.price} gold
                </Button>
              </span>
            </p>
          </Section>
        </Card>
      ))}
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
        Are you sure you want to buy the {prop.building.name} for{" "}
        {prop.building.price} gold?
      </div>
      <Button onClick={() => prop.buy(prop.building.name)}>Yes</Button>
      <Button onClick={prop.cancel} ml3>
        No
      </Button>
    </div>
  )
}
