import { girlImageList } from "../asset/girlAsset"
import { Girl, GirlImage } from "../type"
import { createGirl, createRandomGirlInfo } from "./girl"

export function createGirlGroup(girlImageList: GirlImage[]) {
  let imageTagMappingGroup: Record<string, Record<string, GirlImage[]>> = {}
  let girlGroup: Record<string, Girl> = {}

  girlImageList.forEach((image) => {
    imageTagMappingGroup[image.girlName] ??= {}
    let group = imageTagMappingGroup[image.girlName]
    image.tagList.forEach((tag) => {
      group[tag] ??= []
      group[tag].push(image)
    })
  })

  Object.entries(imageTagMappingGroup).forEach(([girlName, tagMapping]) => {
    girlGroup[girlName] = createGirl(createRandomGirlInfo(girlName, { tagMapping }))
  })

  return girlGroup
}

export function getGirlArray() {
  return Object.values(createGirlGroup(girlImageList))
}
