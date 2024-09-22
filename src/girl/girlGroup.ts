import { girlImageList } from "../asset/girlAsset"
import { GirlImage } from "../type"
import { createRandomGirlInfo } from "./girl"

export function getGirlArray() {
  let imageTagMappingGroup: Record<string, Record<string, GirlImage[]>> = {}

  girlImageList.forEach((image) => {
    imageTagMappingGroup[image.girlName] ??= {}
    let group = imageTagMappingGroup[image.girlName]
    image.tagList.forEach((tag) => {
      group[tag] ??= []
      group[tag].push(image)
    })
  })

  return Object.entries(imageTagMappingGroup).map(([girlName, tagMapping]) =>
    createRandomGirlInfo(girlName, { tagMapping }),
  )
}
