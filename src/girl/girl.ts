import { createImageSet } from "../imageSet/imageSet"
import { randomInt } from "../lib/random"
import { Girl, GirlImageSetInfo, GirlInfo } from "../type"

export function createGirl(girlInfo: GirlInfo) {
  let girl = {
    ...girlInfo,
    getBargain() {
      return this.esteem / this.sessionPrice
    },
    getCharisma() {
      return this.beauty + this.prominence
    },
    getWillingness() {
      return this.commitment - this.character
    },
    getMaxiumumCustomerCount() {
      let { libido, constitution } = this
      let baseCount: number
      if (libido > 90 && constitution > 80) {
        baseCount = 4
      } else if (libido > 70 && constitution > 50) {
        baseCount = 3
      } else if (libido > 40 && constitution > 30) {
        baseCount = 2
      } else {
        baseCount = 1
      }
      let malus = Math.max(0, Math.ceil((75 - this.health) / 10))
      let count = Math.max(1, baseCount - malus)
      return count
    },
    imageSet: createImageSet(girlInfo.imageSet),
  }

  return girl as Girl
}

export const MAX_GIRL_STAT: Omit<
  GirlInfo,
  "name" | "imageSet" | "owned" | "activity" | "sessionPrice"
> = {
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
  acquisitionPrice: 1000,
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
  girlInfo.activity = { kind: "rest" }
  return girlInfo
}
