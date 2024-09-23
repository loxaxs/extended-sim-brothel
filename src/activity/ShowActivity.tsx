import { GirlInfo } from "../type"
import { otherActivityNameMapping } from "./activity"

export interface ShowActivityProp {
  girl: GirlInfo
}

export function ShowActivity(prop: ShowActivityProp) {
  let { girl } = prop
  return (
    <div>
      ⌂ 
      {girl.activity.kind === "building"
        ? girl.activity.buildingName
        : otherActivityNameMapping[girl.activity.kind]}
    </div>
  )
}
