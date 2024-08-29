import {
  getParaActivityMessage,
  getParaActivityStatChange,
} from "src/activity/activity"
import { Building, GirlInfo, Report } from "src/type"

export interface NextDayReportParam {
  girlArray: GirlInfo[]
  buildingByName: Record<string, Building>
}

export function nextDayReport(param: NextDayReportParam): Report {
  let { girlArray, buildingByName } = param

  let report: Report = []
  girlArray.forEach((girl) => {
    if (girl.activity.kind !== "building") {
      let statChange = getParaActivityStatChange(girl)
      report.push({
        kind: "girl",
        girlName: girl.name,
        statChange,
        message: getParaActivityMessage(girl, statChange),
        imageCount: 0,
        tagList: [],
      })
    } else {
      let building = buildingByName[girl.activity.buildingName]
      // building.visibility
      // building.fame
      // girl.beauty
      // girl.character
      // girl.commitment
      // girl.constitution
      // girl.esteem
      // girl.fame
      // girl.libido
      // girl.prominence
      // girl.sessionPrice
    }
  })

  return []
}

export interface ReportDisplayProp {
  report: Report
}

export function ReportDisplay(prop: ReportDisplayProp) {
  let { report } = prop
}
