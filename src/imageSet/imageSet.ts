import { randomExtract } from "../lib/random"
import { GirlImage, GirlImageSetInfo } from "../type"
import { CategorySystem, categorySystem } from "./imageCategorySystem"

interface ImageTagNode {
  parent: string
  imageList: GirlImage[]
}
type ImageTagTree = Record<string, ImageTagNode>

function walkCategorySystem(
  categorySystem: CategorySystem,
  parent: string,
  emtpyTagTree: ImageTagTree,
) {
  Object.entries(categorySystem).forEach(([key, value]) => {
    emtpyTagTree[key] = {
      parent,
      imageList: [],
    }
    walkCategorySystem(value, key, emtpyTagTree)
  })
}

let emptyTagTree: ImageTagTree = {}
walkCategorySystem(categorySystem, "", emptyTagTree)
let emptyTagTreeString = JSON.stringify(emptyTagTree)

function uniqueOrderedInsert<T>(item: T, array: T[], keyFunction: (a: T) => string) {
  if (array.length === 0) {
    array.push(item)
    return
  }
  // Perform a binary search to insert the image URL in order
  let left = 0
  let right = array.length - 1
  let middle = Math.floor((left + right) / 2)
  let stop = 10_000
  while (left < right) {
    if (keyFunction(array[middle]) < keyFunction(item)) {
      left = middle + 1
    } else {
      right = middle
    }
    middle = Math.floor((left + right) / 2)
    if (--stop < 0) {
      throw new Error("Infinite loop detected in binary search")
    }
  }
  // Insert the image in the list, only if it is not already there
  if (keyFunction(array[right]) !== keyFunction(item)) {
    array.splice(right, 0, item)
  }
}

export function createImageSet(imageSetInfo: GirlImageSetInfo) {
  let tagTree: ImageTagTree = JSON.parse(emptyTagTreeString)
  Object.entries(imageSetInfo.tagMapping).forEach(([tag, images]) => {
    if (!tagTree[tag]) {
      throw new Error(`Tag ${JSON.stringify(tag)} not found in the category system`)
    }
    tagTree[tag].imageList = images
    let parent = tag
    let stop = 10_000
    while (parent) {
      images.forEach((image) => {
        uniqueOrderedInsert(image, tagTree[parent].imageList, (a) => a.src)
      })
      parent = tagTree[parent].parent
      if (--stop < 0) {
        throw new Error(`Infinite loop detected in category system with parent "${parent}"`)
      }
    }
  })

  return {
    tagMapping: imageSetInfo.tagMapping,
    getByTag(...tags: string[]): GirlImage {
      return this.getSeveralByTag(1, ...tags)[0]
    },
    getSeveralByTag(count: number, ...tagArray: [string, ...string[]]): GirlImage[] {
      let imageList: GirlImage[] = []
      let imageUrlList: string[] = []
      let tagIndex = 0
      let parent = tagArray[0]
      let filteredImageList: GirlImage[]
      let stop = 10_000
      while (imageList.length < count) {
        if (tagIndex < tagArray.length) {
          // We'll try each of the provided tags to find the number of requested images
          let tag = tagArray[tagIndex]
          filteredImageList = tagTree[tag].imageList.filter(
            ({ src }) => !imageUrlList.includes(src),
          )
          if (filteredImageList.length === 0) {
            tagIndex += 1
            continue
          }
        } else {
          // If we have exhausted all the tags, we will walk up the category hierarchy
          // of the first tag for images
          parent = tagTree[parent].parent
          if (!parent) {
            // If we reach the root of the category system, we'll give up on providing
            // the user with enough images and just return what little images we got
            break
          }
          filteredImageList = tagTree[parent].imageList.filter(
            ({ src }) => !imageUrlList.includes(src),
          )
        }
        // If there are too many images in the pack being added to the list,
        // we'll randomly extract the number of images needed
        if (imageList.length + filteredImageList.length > count) {
          filteredImageList = randomExtract(count - imageList.length, filteredImageList)
        }
        imageList.push(...filteredImageList)
        imageUrlList.push(...filteredImageList.map(({ src }) => src))
        if (--stop < 0) {
          throw new Error("Infinite loop detected while getting images by tag")
        }
      }
      return imageList
    },
  }
}
