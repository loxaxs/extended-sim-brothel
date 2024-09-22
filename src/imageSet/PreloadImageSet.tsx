export interface PreloadImageSetProp {
  urlArray: string[]
}

export function PreloadImageSet(prop: PreloadImageSetProp) {
  return (
    <div className="h-0 w-0">
      {prop.urlArray.map((src) => (
        <img key={src} src={src} />
      ))}
    </div>
  )
}
