import React from "react"
import { Place } from "../type"

export function createPlace(name: string, capacity: number): Place {
  return {
    name,
    capacity,
    fame: 0,
    owned: false,
  }
}

export function getPlaceArray() {
  return [
    createPlace("Old shack far away", 1),
    createPlace("Small house out of the island", 2),
    createPlace("House on the island", 3),
    createPlace("House on central road", 3),
    createPlace("Big house on central road", 5),
    createPlace("Palace on central road", 7),
    createPlace("Central palace", 10),
  ]
}

export function Place() {
  return (
    <div>
      <h1>Place</h1>
    </div>
  )
}
