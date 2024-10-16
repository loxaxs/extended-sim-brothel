import { createImageSet } from "../imageSet/imageSet"
import { randomInt } from "../lib/random"
import { Girl, GirlImageSetInfo, GirlInfo, TFunction } from "../type"

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

export function getMaxGirlStat(
  t: TFunction,
): Record<
  keyof Omit<GirlInfo, "name" | "imageSet" | "owned" | "activity" | "sessionPrice">,
  { max: number; name: string }
> {
  return {
    beauty: { max: 100, name: t("beauty") },
    character: { max: 100, name: t("character") },
    commitment: { max: 100, name: t("commitment") },
    constitution: { max: 100, name: t("constitution") },
    esteem: { max: 100, name: t("esteem") },
    fame: { max: 100, name: t("fame") },
    health: { max: 100, name: t("health") },
    libido: { max: 100, name: t("libido") },
    prominence: { max: 100, name: t("prominence") },
    sex: { max: 100, name: t("sex") },
    acquisitionPrice: { max: 2000, name: t("acquisition price") },
  }
}

export function createRandomGirlInfo(girlName: string, imageSet: GirlImageSetInfo): GirlInfo {
  let girlInfo: GirlInfo = Object.fromEntries(
    Object.entries(getMaxGirlStat(() => "")).map(([key, { max }]) => [
      key,
      Math.floor(randomInt(max) / 2),
    ]),
  ) as any
  girlInfo.name = girlName
  girlInfo.imageSet = imageSet
  girlInfo.health = 100
  girlInfo.beauty *= 2
  girlInfo.character *= 2
  girlInfo.activity = { kind: "rest" }
  girlInfo.owned = false
  girlInfo.sessionPrice = girlInfo.esteem

  return girlInfo
}

export function healthTag(health: number) {
  if (health === 100) {
    return "dancing"
  } else if (health >= 90) {
    return "happy"
  } else if (health >= 80) {
    return "tired"
  } else {
    return "unhealthy"
  }
}
