import { useT } from "src/i18n/useT"
import { Building, GirlInfo } from "../type"
import { getOtherActivityName } from "./activity"
import { getBuildingName } from "./Building"

export interface ShowActivityProp {
  girl: GirlInfo
}

export function ShowActivity(prop: ShowActivityProp) {
  let { girl } = prop
  let { t } = useT()
  return (
    <div>
      ⌂ 
      {girl.activity.kind === "building"
        ? getBuildingName({ id: girl.activity.buildingId } as Building, t)
        : getOtherActivityName(girl.activity.kind, t)}
    </div>
  )
}
