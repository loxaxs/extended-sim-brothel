import { ReactNode } from "react"
import { GirlInfo } from "../type"
import { GirlListCard } from "./GirlListCard"

export interface GirlListProp {
  act: GirlListAct
  contentIfEmpty?: ReactNode
  girlArray: GirlInfo[]
  onClick: (name: string) => void
}

export type GirlListAct = {
  kind: "home" | "market"
}

export function GirlList(prop: GirlListProp) {
  let { act, contentIfEmpty, girlArray, onClick } = prop

  return (
    <div className="flex flex-wrap">
      {girlArray.map((girl) => {
        return (
          <div className="w-1/4">
            <GirlListCard
              className="h-[230px]"
              key={girl.name}
              girl={girl}
              onClick={() => {
                onClick(girl.name)
              }}
              act={act}
            />
          </div>
        )
      })}
      {girlArray.length === 0 && contentIfEmpty}
    </div>
  )
}
