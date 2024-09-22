import React, { useContext, useMemo } from "react"
import { gameContext } from "src/context/context"
import { isSafeTag } from "src/imageSet/imageSet"
import { Girl, SizeArray } from "../type"

export interface GirlDisplayProp {
  className?: string
  girl: Girl
  maxSize: number
  style?: React.CSSProperties
  tag?: string
  tagList?: string[]
  count?: number
  sizeRef?: React.MutableRefObject<SizeArray>
  rerender?: () => void
}

export function GirlDisplay(prop: GirlDisplayProp) {
  let { className, girl, maxSize, style, tag, tagList = [], count = 1, sizeRef, rerender } = prop
  let { safeMode } = useContext(gameContext)
  let tagArray = useMemo(() => {
    let tags = tag ? [tag, ...tagList] : tagList
    if (safeMode) {
      tags = tags.filter(isSafeTag)
    }
    return tags
  }, [tag, JSON.stringify(tagList)])
  let imageList = useMemo(
    () => girl.imageSet.getSeveralByTag(count, ...tagArray),
    [girl, count, tagArray],
  )
  if (sizeRef) {
    sizeRef.current = imageList.map(() => ({ width: 0, height: 0 }))
  }
  return (
    <>
      {imageList.map((image, k) => {
        return (
          <img
            className={className}
            style={{ maxHeight: maxSize, maxWidth: maxSize, ...style }}
            key={image.src}
            src={image.src}
            alt={[image.girlName, ...tagArray].join(" ")}
            onLoad={(ev) => {
              if (sizeRef) {
                sizeRef.current[k].width = ev.currentTarget.width
                sizeRef.current[k].height = ev.currentTarget.height
                rerender?.()
              }
            }}
            draggable={false} // disables image dragging which is on by default in web browsers
          />
        )
      })}
    </>
  )
}
