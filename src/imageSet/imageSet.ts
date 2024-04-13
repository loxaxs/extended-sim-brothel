import { GirlImage } from "../type"
import { randomChoice } from "../lib/random"

export function createImageSet(imageSetInfo) {
  return {
    ...imageSetInfo,
    getByTag(...tags: string[]): GirlImage {
      return this.tagMapping[randomChoice(tags)][0]
    },
    getSeveralByTag(count: number, ...tags: string[]): GirlImage[] {
      return this.tagMapping[tags[0]].slice(0, count)
    },
  }
}
