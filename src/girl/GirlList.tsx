import { useT } from "src/i18n/useT"
import { tw } from "src/lib/tw"
import { GirlInfo } from "../type"
import { GirlListCard } from "./GirlCard"

export interface GirlListProp {
  act: GirlListAct
  girlArray: GirlInfo[]
  onClick: (name: string) => void
}

export type GirlListAct = {
  kind: "home" | "market"
}

export function GirlList(prop: GirlListProp) {
  let { act, girlArray, onClick } = prop
  let { t } = useT()

  return (
    <div className="flex h-[500px] flex-wrap overflow-auto">
      {girlArray.map((girl) => {
        return (
          <div key={girl.name} className="w-1/4">
            <GirlListCard
              className={tw({
                "h-[250px]": act.kind === "home",
                "h-[150px]": act.kind === "market",
              })}
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
      {girlArray.length === 0 && act.kind === "market" && t("The market is empty.")}
    </div>
  )
}
