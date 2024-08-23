import { Place } from "../type"

export function createPlace(name: string, capacity: number): Place {
  return {
    name,
    capacity,
    fame: 0,
    owned: false,
  }
}
