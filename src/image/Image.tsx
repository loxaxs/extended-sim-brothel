import React, { useState } from "react"

export interface ImageProp
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  expectedHeight?: number
  expectedWidth?: number
}

export function Image(prop: ImageProp) {
  let { expectedHeight, expectedWidth, ...remainingProp } = prop
  let style = { ...(prop.style ?? {}) }
  let [loading, setLoading] = useState(true)
  if (loading) {
    style.height ??= expectedHeight
    style.width ??= expectedWidth
  }
  return (
    <img
      {...remainingProp}
      style={style}
      onLoad={(ev) => {
        setLoading(false)
        prop.onLoad?.(ev)
      }}
    />
  )
}
