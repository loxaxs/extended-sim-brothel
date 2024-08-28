import React from "react"
import { tw } from "../../lib/tw"

export interface ButtonProp
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  ml3?: boolean
}

export function Button(prop: ButtonProp) {
  let { ml3, ...remainingProp } = prop
  return (
    <button
      {...remainingProp}
      className={tw(
        "my-1 rounded-lg border border-black p-1",
        {
          "hover:bg-yellow-200": !prop.disabled,
          "border-gray-400 bg-amber-100 text-gray-400": prop.disabled,
          "ml-3": ml3,
        },
        prop.className,
      )}
    />
  )
}
