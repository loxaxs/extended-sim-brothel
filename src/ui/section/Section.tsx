import React from "react"
import { tw } from "../../lib/tw"

export interface SectionProp
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {}

export function Section(prop: SectionProp) {
  return (
    <section
      {...prop}
      className={tw("rounded-2xl border border-black p-1", prop.className)}
    />
  )
}
