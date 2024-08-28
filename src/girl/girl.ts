import { createImageSet } from "../imageSet/imageSet"
import { randomInt } from "../lib/random"
import { Girl, GirlImageSetInfo, GirlInfo } from "../type"

export function createGirl(girlInfo: GirlInfo): Girl {
  return {
    ...girlInfo,
    getCharisma() {
      return this.beauty + this.prominence
    },
    imageSet: createImageSet(girlInfo.imageSet),
  }
}

export const MAX_GIRL_STAT: Omit<GirlInfo, "name" | "imageSet" | "owned"> = {
  beauty: 100,
  character: 100,
  commitment: 100,
  constitution: 100,
  esteem: 100,
  fame: 100,
  health: 100,
  libido: 100,
  prominence: 100,
  sex: 100,
  price: 1000,
}

export function createRandomGirlInfo(
  girlName: string,
  imageSet: GirlImageSetInfo,
): GirlInfo {
  let girlInfo: GirlInfo = Object.fromEntries(
    Object.entries(MAX_GIRL_STAT).map(([key, maxValue]) => [
      key,
      Math.floor(randomInt(maxValue) / 2),
    ]),
  ) as any
  girlInfo.name = girlName
  girlInfo.imageSet = imageSet
  girlInfo.health = 100
  girlInfo.beauty *= 2
  girlInfo.character *= 2
  return girlInfo
}
