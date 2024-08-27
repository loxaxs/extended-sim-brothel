import clsx from "clsx"
import React from "react"

export interface ButtonProp
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export function Button(prop: ButtonProp) {
  return (
    <button
      {...prop}
      className={clsx(
        "my-1 ml-3 rounded-lg border border-black p-1",
        { "border-gray-400 bg-amber-100 text-gray-400": prop.disabled },
        prop.className,
      )}
    />
  )
}
