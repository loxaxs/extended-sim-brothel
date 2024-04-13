import React from "react"
import { Girl } from "../type"

export interface GirlDisplayProp {
  girl: Girl
  tag?: string
  tagList?: string[]
  count?: number
}

export function GirlDisplay(prop: GirlDisplayProp) {
  let { girl, tag, tagList = [], count = 1 } = prop
  let tagArray = tag ? [tag, ...tagList] : tagList
  let imageList = girl.imageSet.getSeveralByTag(count, ...tagArray)
  return (
    <>
      {imageList.map((image) => {
        return (
          <img
            height={100}
            key={image.src}
            src={image.src}
            alt={[image.girlName, ...tagArray].join(" ")}
          />
        )
      })}
    </>
  )
}
