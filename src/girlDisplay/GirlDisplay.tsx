import React from "react"
import { Girl } from "../type"

export interface GirlDisplayProp {
  className?: string
  girl: Girl
  maxSize: number
  style?: React.CSSProperties
  tag?: string
  tagList?: string[]
  count?: number
}

export function GirlDisplay(prop: GirlDisplayProp) {
  let { className, girl, maxSize, style, tag, tagList = [], count = 1 } = prop
  let tagArray = tag ? [tag, ...tagList] : tagList
  let imageList = girl.imageSet.getSeveralByTag(count, ...tagArray)
  return (
    <>
      {imageList.map((image) => {
        return (
          <img
            className={className}
            style={{ maxHeight: maxSize, maxWidth: maxSize, ...style }}
            key={image.src}
            src={image.src}
            alt={[image.girlName, ...tagArray].join(" ")}
          />
        )
      })}
    </>
  )
}
