import React from "react"
import { tw } from "../../lib/tw"

export interface CardProp
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export function Card(prop: CardProp) {
  return <div {...prop} className={tw("m-2", prop.className)} />
}
