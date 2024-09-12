import React from "react"
import { tw } from "../../lib/tw"

export interface SectionProp
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  clickable?: boolean
  disabled?: boolean
}

export function Section(prop: SectionProp) {
  let { clickable, disabled, ...remainingProp } = prop
  return (
    <section
      {...remainingProp}
      onClick={clickable && !disabled ? prop.onClick : undefined}
      className={tw(
        "rounded-2xl border border-black p-2",
        {
          "cursor-pointer hover:bg-yellow-200": clickable && !disabled,
          "border-gray-400 bg-amber-100 text-gray-400": disabled,
        },
        prop.className,
      )}
    />
  )
}
